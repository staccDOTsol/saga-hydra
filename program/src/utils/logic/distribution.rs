use crate::{
    state::{Fanout, FanoutMembershipVoucher, FANOUT_ACCOUNT_SIZE, HOLDING_ACCOUNT_SIZE},
    utils::{
        logic::{
            calculation::*,
            transfer::{transfer_from_mint_holding, transfer_native},
        },
        parse_fanout_mint,
        validation::*,
        *,
    },
};
use anchor_lang::prelude::*;
use anchor_spl::token::{Mint, Token};

pub fn distribute_native<'info>(
    holding_account: &mut UncheckedAccount<'info>,
    fanout: &mut Account<'info, Fanout>,
    membership_voucher: &mut Account<'info, FanoutMembershipVoucher>,
    member: UncheckedAccount<'info>,
    rent: Sysvar<'info, anchor_lang::prelude::Rent>,
)-> anchor_lang::Result<()> {
    let total_shares = fanout.total_shares as u64;
    if holding_account.key() != fanout.account_key {
        return Err(HydraError::InvalidHoldingAccount.into());
    }

    let fanout_snapshot = fanout.to_account_info().lamports();
    let fanout_snapshot_less_min = current_lamports(&rent, FANOUT_ACCOUNT_SIZE, fanout_snapshot)?;
    msg!("Fanout Snapshot: {}", fanout_snapshot);
    let fanout_transfer = transfer_native(
        fanout.to_account_info(),
        holding_account.to_account_info(),
        fanout_snapshot,
        fanout_snapshot_less_min,
    );  
    msg!("Fanout Transfer: {:?}", fanout_transfer);
    if fanout_transfer.is_err() {
        println!("Fanout Transfer Error {:?}", fanout_transfer.err());
        return Err(HydraError::BadArtithmetic.into());
    }

    let current_snapshot = holding_account.lamports();
    msg!("Current Snapshot: {}", current_snapshot);
    let current_snapshot_less_min =
        current_lamports(&rent, HOLDING_ACCOUNT_SIZE, current_snapshot)?;
        msg!("Current Snapshot Less Min: {}", current_snapshot_less_min);
    update_inflow(fanout, current_snapshot_less_min)?;
    msg!("Update Inflow");
    let inflow_diff = calculate_inflow_change(fanout.total_inflow, membership_voucher.last_inflow)?;
    msg!("Inflow Diff: {}", inflow_diff);
    let shares = membership_voucher.shares as u64;
    msg!("Shares: {}", shares);
    let dif_dist = calculate_dist_amount(shares, inflow_diff, total_shares)?;
    msg ! ( "Dif Dist: {}", dif_dist ) ;
    update_snapshot(fanout, membership_voucher, dif_dist)?;
    membership_voucher.total_inflow = membership_voucher
        .total_inflow
        .checked_add(dif_dist)
        .ok_or(HydraError::NumericalOverflow)?;
    msg!("Membership Voucher Total Inflow: {}", membership_voucher.total_inflow);
    transfer_native(
        holding_account.to_account_info(),
        member.to_account_info(),
        current_snapshot,
        dif_dist,
    )
}

pub fn distribute_mint<'info>(
    fanout_mint: UncheckedAccount<'info>,
    fanout_for_mint: &mut UncheckedAccount<'info>,
    fanout_for_mint_membership_voucher: &mut Account<'info, FanoutMembershipMintVoucher>,
    fanout_mint_member_token_account: &mut UncheckedAccount<'info>,
    holding_account: &mut UncheckedAccount<'info>,
    fanout: &mut Account<'info, Fanout>,
    membership_voucher: &mut Account<'info, FanoutMembershipVoucher>,
    rent: Sysvar<'info, anchor_lang::prelude::Rent>,
    system_program: Program<'info, System>,
    token_program: Program<'info, Token>,
    payer: AccountInfo<'info>,
    member: UncheckedAccount<'info>,
    membership_key: &Pubkey,
)-> anchor_lang::Result<()> {
    msg!("Distribute For Mint");
    if membership_voucher.stake_time == 0 {
        membership_voucher.stake_time = Clock::get()?.unix_timestamp;
    }

    let mint = &fanout_mint;
    let fanout_for_mint_membership_voucher_unchecked = fanout_for_mint_membership_voucher;
    let fanout_mint_member_token_account_info = fanout_mint_member_token_account.to_account_info();
    let fanout_for_mint = fanout_for_mint;
    let total_shares = fanout.total_shares as u64;
    msg!("Distribute For Mint 2");
    assert_ata(
        &holding_account.to_account_info(),
        &fanout.key(),
        &fanout_mint.key(),
        Some(HydraError::HoldingAccountMustBeAnATA.into()),
    )?;
    msg!("Distribute For Mint 3");
    let fanout_for_mint_object =
        &mut parse_fanout_mint(fanout_for_mint, &fanout.key(), &mint.key())?;
    msg!("Distribute For Mint 4");
    if holding_account.key() != fanout_for_mint_object.token_account {
        return Err(HydraError::InvalidHoldingAccount.into());
    }
    if fanout_for_mint_object.mint != mint.to_account_info().key() {
        return Err(HydraError::MintDoesNotMatch.into());
    }
    msg!("Distribute For Mint 5");
    let holding_account_ata = parse_token_account(holding_account, &fanout.key())?;
    
    parse_token_account(&fanout_mint_member_token_account_info, &member.key())?;
    msg ! ( "Distribute For Mint 6" ) ;
    let current_snapshot = holding_account_ata.amount;
    update_inflow_for_mint(fanout, fanout_for_mint_object, current_snapshot)?;
    let inflow_diff = calculate_inflow_change(
        fanout_for_mint_object.total_inflow,
        fanout_for_mint_membership_voucher_unchecked.last_inflow,
    )?;
    msg!("Distribute For Mint 7");
    let shares = membership_voucher.shares as u64;
    let dif_dist = calculate_dist_amount(shares, inflow_diff, total_shares)?;
    update_snapshot_for_mint(
        fanout_for_mint_object,
        fanout_for_mint_membership_voucher_unchecked,
        dif_dist,
    )?;
    msg ! ( "Distribute For Mint 8" ) ;
    transfer_from_mint_holding(
        fanout,
        fanout.to_account_info(),
        token_program.to_account_info(),
        holding_account.to_account_info(),
        fanout_mint_member_token_account_info,
        dif_dist,
    )
}
