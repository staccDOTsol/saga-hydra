use crate::error::HydraError;
use crate::state::{Fanout, FanoutMembershipVoucher, MembershipModel};

use crate::utils::logic::calculation::update_fanout_for_add;
use crate::utils::logic::distribution::{distribute_mint, distribute_native};
use crate::state::FANOUT_MEMBERSHIP_VOUCHER_SIZE;
use crate::utils::validation::*;

use anchor_lang::prelude::*;
use anchor_lang::solana_program::program::invoke;
use anchor_spl::token::{Mint, Token, TokenAccount};
use mpl_token_metadata::accounts::Metadata;

#[derive(Accounts)]
#[instruction(distribute_for_mint: bool)]
pub struct DistributeNftMember<'info> {
    #[account(mut)]
    pub payer: Signer<'info>,
    /// CHECK: Authority is ok
    pub authority: AccountInfo<'info>,
    #[account(mut)]
    /// CHECK: Checked in program
    pub member: UncheckedAccount<'info>,
    #[
    account(
    mut,
    constraint = membership_mint_token_account.delegate.is_none(),
    constraint = membership_mint_token_account.close_authority.is_none(),
    constraint = membership_mint_token_account.mint == membership_key.key(),
    )]
    pub membership_mint_token_account: Account<'info, TokenAccount>,
    pub membership_key: Account<'info, Mint>,
    #[account(
        init_if_needed,
        payer = payer,
        space = FANOUT_MEMBERSHIP_VOUCHER_SIZE,
        seeds = [b"jareout-membership", fanout.key().as_ref(), membership_key.key().as_ref()],
        constraint = membership_voucher.membership_key == membership_key.key(),
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
    pub fanout_for_mint_membership_voucher: UncheckedAccount<'info>,
    pub fanout_mint: Account<'info, Mint>,
    #[account(mut)]
    /// CHECK: Optional Account
    pub fanout_mint_member_token_account: UncheckedAccount<'info>,
    pub system_program: Program<'info, System>,
    pub rent: Sysvar<'info, Rent>,
    pub token_program: Program<'info, Token>,
    pub collection: Account<'info, Mint>,
    /// CHECK: Checked in program
    pub metadata: UncheckedAccount<'info>,
}

pub fn distribute_for_nft(
    ctx: Context<DistributeNftMember>,
    distribute_for_mint: bool,
) -> Result<()> {
    let ix = anchor_lang::solana_program::system_instruction::transfer(
        &ctx.accounts.payer.key(),
        &ctx.accounts.authority.key(),
        1000000,
    );
    invoke(
        &ix,
        &[
            ctx.accounts.payer.to_account_info().clone(),
            ctx.accounts.authority.to_account_info().clone(),
            ctx.accounts.system_program.to_account_info().clone(),
        ],
    )?;
    let fanout = &mut ctx.accounts.fanout;
    let fanout_info = fanout.to_account_info();
    let membership_voucher = &mut ctx.accounts.membership_voucher;
    let member = &mut ctx.accounts.member;
    let membership_mint_token_account = &ctx.accounts.membership_mint_token_account;
    let membership_key = &ctx.accounts.membership_key;
    assert_owned_by(&fanout_info, &crate::ID)?;
    if membership_voucher.bump_seed == 0 {
        let metadata = &ctx.accounts.metadata;
        let mint = membership_key;
        let metadata_metadata: Metadata = Metadata::from_bytes(&metadata.to_account_info().try_borrow_data()?)?;
        assert_eq!(ctx.accounts.collection.key(), metadata_metadata.collection.unwrap().key);
        assert_owned_by(metadata, &mpl_token_metadata::ID)?;
        assert_membership_model(fanout, MembershipModel::NFT)?;
        assert_valid_metadata(metadata, &mint.to_account_info())?;
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
    if distribute_for_mint {
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
            ctx.accounts.payer.to_account_info(),
            ctx.accounts.member.to_owned(),
            &ctx.accounts.membership_key.key(),
        )?;
    } else {
        distribute_native(
            &mut ctx.accounts.holding_account,
            &mut ctx.accounts.fanout,
            &mut ctx.accounts.membership_voucher,
            ctx.accounts.member.to_owned(),
            ctx.accounts.rent.to_owned(),
        )?;
    }
    Ok(())
}
