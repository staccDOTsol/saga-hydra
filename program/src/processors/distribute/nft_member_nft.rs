use crate::error::HydraError;
use crate::state::{Fanout, FanoutMembershipVoucher, MembershipModel, FanoutMembershipMintVoucher};
use crate::utils::logic::calculation::update_fanout_for_add;
use crate::utils::logic::transfer::transfer_from_mint_holding;
use crate::state::{FANOUT_MINT_MEMBERSHIP_VOUCHER_SIZE, FANOUT_MEMBERSHIP_VOUCHER_SIZE};
use crate::utils::validation::*;

use switchboard_solana::prelude::*;
use anchor_lang::solana_program::program::invoke;
use anchor_spl::token::{Mint, Token, TokenAccount};
use mpl_token_metadata::accounts::Metadata;


#[derive(Accounts)]
pub struct DistributeNftMemberNft<'info> {
    #[account(
    mut,
    seeds = [b"jareout-config", fanout.name.as_bytes()],
    bump = fanout.bump_seed,
    )]
    pub fanout: Account<'info, Fanout>,
    pub system_program: Program<'info, System>,
    pub token_program: Program<'info, Token>,
    pub rent: Sysvar<'info, Rent>,
    ///CHCEK: Optional Account
    #[account(mut)]
    /// CHECK: Optional Account
    pub holding_account: UncheckedAccount<'info>,

    pub switchboard_function: AccountLoader<'info, FunctionAccountData>,
     #[account(
         mut,
     //   constraint = switchboard_request.validate_signer(
     //        &switchboard_function,
      //       &enclave_signer
         //)?
     )]
    pub switchboard_request: Box<Account<'info, FunctionRequestAccountData>>,
    pub enclave_signer: Signer<'info>,
    #[account(
        mut)]
    /// CHECK: Optional Account
    pub fanout_mint_member_token_account: UncheckedAccount<'info>,
}

pub fn distribute_nft_for_nft(
    ctx: Context<DistributeNftMemberNft>,
) -> anchor_lang::Result<()> {
   
    let fanout = &mut ctx.accounts.fanout;
    let holding_account = &mut ctx.accounts.holding_account;
    
    // create token account fanout_mint_member_token_account
    
    // if we created fanout_for_mint_membership_voucher, initialize it 
    /*
    
        fanout_for_mint_membership_voucher.fanout = *fanout;
        fanout_for_mint_membership_voucher.fanout_mint = *fanout_mint;
        fanout_for_mint_membership_voucher.last_inflow = total_inflow;
        fanout_for_mint_membership_voucher.stake_time = stake_time; */
        transfer_from_mint_holding(
            fanout,
            fanout.to_account_info(),
            fanout.to_account_info(),
            holding_account.to_account_info(),
            ctx.accounts.fanout_mint_member_token_account.to_account_info(),
            1,
        )?;
    Ok(())
}
