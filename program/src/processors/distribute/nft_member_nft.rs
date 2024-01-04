use crate::error::HydraError;
use crate::state::{Fanout, FanoutMembershipVoucher, MembershipModel, FanoutMembershipMintVoucher};

use crate::utils::logic::calculation::update_fanout_for_add;
use crate::utils::logic::distribution::{distribute_mint, distribute_native};
use crate::state::FANOUT_MEMBERSHIP_VOUCHER_SIZE;
use crate::utils::validation::*;

use anchor_lang::prelude::*;
use anchor_lang::solana_program::program::invoke;
use anchor_spl::token::{Mint, Token, TokenAccount};
use mpl_token_metadata::accounts::Metadata;
use switchboard_solana::{FunctionAccountData, FunctionRequestAccountData};

#[derive(Accounts)]
pub struct DistributeNftMemberNft<'info> {
    
    #[account(mut)]
    /// CHECK: Checked in program
    pub member: UncheckedAccount<'info>,
    #[
    account(
    mut,
    constraint = membership_mint_token_account.mint == membership_key.key(),
    )]
    pub membership_mint_token_account: Account<'info, TokenAccount>,
    pub membership_key: Account<'info, Mint>,
    #[account(
        mut,
        seeds = [b"jareout-membership", fanout.key().as_ref(), membership_key.key().as_ref()],
        bump
    )]
    pub membership_voucher: Box<Account<'info, FanoutMembershipVoucher>>,
    #[account(
    mut,
    seeds = [b"jareout-config", fanout.name.as_bytes()],
    bump = fanout.bump_seed,
    )]
    pub fanout: Account<'info, Fanout>,
    #[account(mut)]
    /// CHECK: Could be a native or Token Account
    pub holding_account: UncheckedAccount<'info>,
    #[account(mut)]
    /// CHECK: Optional Account
    pub fanout_for_mint: UncheckedAccount<'info>,
    #[account(mut)]
    /// CHECK: Optional Account
    pub fanout_for_mint_membership_voucher: Account<'info, FanoutMembershipMintVoucher>,
    pub fanout_mint: Account<'info, Mint>,
    #[account(mut)]
    /// CHECK: Optional Account
    pub fanout_mint_member_token_account: UncheckedAccount<'info>,
    pub system_program: Program<'info, System>,
    pub rent: Sysvar<'info, Rent>,
    pub token_program: Program<'info, Token>,

    #[account(
        constraint = switchboard_function.load()?.validate_request(
            &switchboard_request,
            &enclave_signer.to_account_info()
        )?
    )]
    pub switchboard_function: AccountLoader<'info, FunctionAccountData>,
    // #[account(
    //     mut,
    //     constraint = switchboard_request.validate_signer(
    //         &switchboard_function.to_account_info(),
    //         &enclave_signer.to_account_info()
    //     )?
    // )]
    #[account(mut)]
    pub switchboard_request: Box<Account<'info, FunctionRequestAccountData>>,
    pub enclave_signer: Signer<'info>,
}

pub fn distribute_nft_for_nft(
    ctx: Context<DistributeNftMemberNft>,
) -> Result<()> {
    let fanout = &mut ctx.accounts.fanout;
    let fanout_info = fanout.to_account_info();
    let membership_voucher = &mut ctx.accounts.membership_voucher;
    let member = &mut ctx.accounts.member;
    let membership_mint_token_account = &ctx.accounts.membership_mint_token_account;
    let membership_key = &ctx.accounts.membership_key;
    assert_owned_by(&fanout_info, &crate::ID)?;
    if membership_voucher.bump_seed == 0 {
        let mint = membership_key;
        assert_membership_model(fanout, MembershipModel::NFT)?;
        fanout
        .total_available_shares
        .checked_add(fanout.default_weight)
        .ok_or(HydraError::BadArtithmetic)?;
        update_fanout_for_add(fanout, fanout.default_weight)?;
        membership_voucher.membership_key = mint.key();
        membership_voucher.shares = fanout.default_weight;
        membership_voucher.bump_seed = ctx.bumps.membership_voucher;
        membership_voucher.fanout = fanout.key();
        membership_voucher.stake_time = Clock::get()?.unix_timestamp;
    }
    assert_owned_by(&member.to_account_info(), &System::id())?;
    assert_membership_model(fanout, MembershipModel::NFT)?;
    //assert_shares_distributed(fanout)?;
    assert_holding(
        &member.to_account_info(),
        membership_mint_token_account,
        &membership_key.to_account_info(),
    )?;
        distribute_mint(
            ctx.accounts.fanout_mint.to_owned(),
            &mut ctx.accounts.fanout_for_mint,
            &mut ctx.accounts.fanout_for_mint_membership_voucher,
            &mut ctx.accounts.fanout_mint_member_token_account,
            &mut ctx.accounts.holding_account,
            &mut ctx.accounts.fanout,
            &mut ctx.accounts.membership_voucher,
            ctx.accounts.rent.to_owned(),
            ctx.accounts.system_program.to_owned(),
            ctx.accounts.token_program.to_owned(),
            ctx.accounts.member.to_account_info(),
            ctx.accounts.member.to_owned(),
            &ctx.accounts.membership_key.key(),
        )?;
    Ok(())
}
