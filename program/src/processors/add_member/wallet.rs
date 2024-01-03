use super::arg::AddMemberArgs;
use crate::{
    state::{Fanout, FanoutMembershipVoucher, FANOUT_MEMBERSHIP_VOUCHER_SIZE},
    utils::{
        logic::calculation::*,
        validation::{assert_membership_model, assert_owned_by},
    },
    MembershipModel,
};
use anchor_lang::prelude::*;
use anchor_spl::token::Token;

#[derive(Accounts)]
#[instruction(args: AddMemberArgs)]
pub struct AddMemberWallet<'info> {
    #[account(mut)]
    pub authority: Signer<'info>,
    /// CHECK: Checked in program
    pub member: UncheckedAccount<'info>,
    #[account(
    mut,
    seeds = [b"jareout-config", fanout.name.as_bytes()],
    has_one = authority,
    bump = fanout.bump_seed,
    )]
    pub fanout: Account<'info, Fanout>,
    #[account(
    init,
    space = FANOUT_MEMBERSHIP_VOUCHER_SIZE,
    seeds = [b"jareout-membership", fanout.key().as_ref(), member.key().as_ref()],
    bump,
    payer = authority
    )]
    pub membership_account: Account<'info, FanoutMembershipVoucher>,
    pub system_program: Program<'info, System>,
    pub rent: Sysvar<'info, Rent>,
    pub token_program: Program<'info, Token>,
}

pub fn add_member_wallet(ctx: Context<AddMemberWallet>, args: AddMemberArgs) -> Result<()> {
    let fanout = &mut ctx.accounts.fanout;
    let member = &ctx.accounts.member;
    let membership_account = &mut ctx.accounts.membership_account;
    update_fanout_for_add(fanout, args.shares)?;
    assert_membership_model(fanout, MembershipModel::Wallet)?;
    assert_owned_by(&fanout.to_account_info(), &crate::ID)?;
    //assert_owned_by_one(&member.to_account_info(), vec![&System::id(), &crate::id(), Pubkey::from_str("ANSsi8dnmwyjQaGNC4PhRMU8WfBgKcvKzC9bPMBiJAPf").unwrap()])?;
    membership_account.membership_key = member.key();
    membership_account.shares = args.shares;
    membership_account.bump_seed = ctx.bumps.membership_account;
    membership_account.fanout = fanout.key();
    membership_account.stake_time = Clock::get()?.unix_timestamp;

    Ok(())
}
