use crate::state::{Fanout, FanoutMembershipVoucher, MembershipModel};

use crate::utils::logic::transfer::transfer_from_mint_holding;
use crate::utils::validation::*;

use anchor_lang::prelude::*;
use anchor_spl::token::{Mint, Token, TokenAccount};
use switchboard_solana::{FunctionAccountData, FunctionRequestAccountData};

#[derive(Accounts)]
pub struct DistributeNftMember<'info> {
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
    mut,
    seeds = [b"jareout-membership", fanout.key().as_ref(), membership_key.key().as_ref()],
    constraint = membership_voucher.membership_key == membership_key.key(),
    bump = membership_voucher.bump_seed,
    )]
    pub membership_voucher: Box<Account<'info, FanoutMembershipVoucher>>,
    #[account(
    mut,
    constraint = fanout.switchboard_function == switchboard_function.key(),
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
    ctx: Context<DistributeNftMember>,
) -> Result<()> {
    let fanout = &mut ctx.accounts.fanout;
    let fanout_info = fanout.to_account_info();
    let membership_voucher = &mut ctx.accounts.membership_voucher;
    let membership_voucher_info = membership_voucher.to_account_info();
    let member = &mut ctx.accounts.member;
    let membership_mint_token_account = &ctx.accounts.membership_mint_token_account;
    let membership_key = &ctx.accounts.membership_key;
    assert_owned_by(&fanout_info, &crate::ID)?;
    assert_owned_by(&membership_voucher_info, &crate::ID)?;
    assert_owned_by(&member.to_account_info(), &System::id())?;
    assert_membership_model(fanout, MembershipModel::NFT)?;
    //assert_shares_distributed(fanout)?;
    assert_holding(
        &member.to_account_info(),
        membership_mint_token_account,
        &membership_key.to_account_info(),
    )?;

    let fanout_mint_member_token_account_info: AccountInfo<'_> = ctx.accounts.fanout_mint_member_token_account.to_account_info();

    transfer_from_mint_holding(
        fanout,
        fanout.to_account_info(),
        ctx.accounts.token_program.to_account_info(),
        ctx.accounts.holding_account.to_account_info(),
        fanout_mint_member_token_account_info,
        1,
    )?;
    Ok(())
}
