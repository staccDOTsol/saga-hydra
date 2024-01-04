pub mod logic;
pub mod validation;

use crate::{
    error::HydraError,
    state::{FanoutMembershipMintVoucher, FanoutMint, FANOUT_MINT_MEMBERSHIP_VOUCHER_SIZE},
    utils::validation::{assert_derivation, assert_owned_by},
};
use anchor_lang::{
    prelude::*,
    solana_program::{program::invoke_signed, system_instruction},
};
use anchor_spl::token::TokenAccount;
use std::convert::TryInto;

pub fn create_or_allocate_account_raw<'a>(
    program_id: Pubkey,
    new_account_info: &AccountInfo<'a>,
    rent_sysvar_info: &AccountInfo<'a>,
    system_program_info: &AccountInfo<'a>,
    payer_info: &AccountInfo<'a>,
    size: usize,
    signer_seeds: &[&[u8]],
    new_acct_seeds: &[&[u8]],
) -> Result<()> {
    let rent = &Rent::from_account_info(rent_sysvar_info)?;
    let required_lamports = rent
        .minimum_balance(size)
        .max(1)
        .saturating_sub(new_account_info.lamports());
    if required_lamports > 0 {
        let as_arr = [signer_seeds];

        let seeds: &[&[&[u8]]] = if !signer_seeds.is_empty() {
            &as_arr
        } else {
            &[]
        };

        invoke_signed(
            &system_instruction::transfer(payer_info.key, new_account_info.key, required_lamports),
            &[
                payer_info.clone(),
                new_account_info.clone(),
                system_program_info.clone(),
            ],
            seeds,
        )?;
    }
    let accounts = &[new_account_info.clone(), system_program_info.clone()];
    invoke_signed(
        &system_instruction::allocate(new_account_info.key, size.try_into().unwrap()),
        accounts,
        &[new_acct_seeds],
    )?;
    invoke_signed(
        &system_instruction::assign(new_account_info.key, &program_id),
        accounts,
        &[new_acct_seeds],
    )?;
    Ok(())
}

pub fn parse_fanout_mint(
    fanout_for_mint: &mut UncheckedAccount,
    fanout: &Pubkey,
    fanout_mint: &Pubkey,
) -> Result<FanoutMint> {
    let account_info = fanout_for_mint.to_account_info();
    println!("fanout_for_mint: {:?}", fanout_for_mint);
    let fanout_mint_bump = assert_derivation(
        &crate::ID,
        &account_info,
        &[b"jareout-config", fanout.as_ref(), fanout_mint.as_ref()],
        Some(HydraError::InvalidFanoutForMint.into()),
    )?;
    println !("fanout_mint_bump: {:?}", fanout_mint_bump);
    let mut fanout_mint_data: &[u8] = &fanout_for_mint.try_borrow_mut_data()?;
    println!("fanout_mint_data: {:?}", fanout_mint_data);
    let fanout_for_mint_object: FanoutMint = FanoutMint::try_deserialize(&mut fanout_mint_data)?;
    if fanout_mint_bump != fanout_for_mint_object.bump_seed {
        msg!("Invalid Fanout For Mint");
        return Err(HydraError::InvalidFanoutForMint.into());
    }
    Ok(fanout_for_mint_object)
}

pub fn parse_token_account(account: &AccountInfo, owner: &Pubkey) -> Result<TokenAccount> {
    let ref_data = account.try_borrow_data()?;
    let mut account_data: &[u8] = &ref_data;
    let account_object = TokenAccount::try_deserialize(&mut account_data)?;
    if &account_object.owner != owner {
        msg!("Token Account has wrong owner");
        return Err(HydraError::IncorrectOwner.into());
    }
    Ok(account_object)
}

