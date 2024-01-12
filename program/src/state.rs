use anchor_lang::prelude::*;
use std::default::Default;

pub const HOLDING_ACCOUNT_SIZE: usize = 1;

#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq, Eq, Copy, Debug)]
pub enum MembershipModel {
    Wallet = 0,
    Token = 1,
    NFT = 2,
}

impl Default for MembershipModel {
    fn default() -> Self {
        MembershipModel::NFT
    }
}

pub const FANOUT_ACCOUNT_SIZE: usize = 300+32+8;
#[account]
#[derive(Default, Debug)]
pub struct Fanout {
    pub authority: Pubkey,                 //32
    pub name: String,                      //50
    pub account_key: Pubkey,               //32
    pub total_shares: u64,                 //8
    pub total_members: u64,                //8
    pub total_inflow: u64,                 //8
    pub last_snapshot_amount: u64,         //8
    pub bump_seed: u8,                     //1
    pub account_owner_bump_seed: u8,       //1
    pub total_available_shares: u64,       //8
    pub membership_model: MembershipModel, //1
    pub membership_mint: Option<Pubkey>,   //32
    pub total_staked_shares: Option<u64>,  //4
    /// Switchboard Function pubkey.
    pub switchboard_function: Pubkey, // 32
    pub collection_mint: Pubkey,      // 32
    pub default_weight: u64,          // 8
    // total size = 300
}

#[account]
#[derive(Default, Debug)]
pub struct FanoutMint {
    pub mint: Pubkey,              //32
    pub fanout: Pubkey,            //32
    pub token_account: Pubkey,     //32
    pub total_inflow: u64,         //8
    pub last_snapshot_amount: u64, //8
    pub bump_seed: u8,             //1
                                   // +50 padding
                                   // = 97
}

pub const FANOUT_MEMBERSHIP_VOUCHER_SIZE: usize = 32 + 8 + 8 + 1 + 32 + 8 + 8 + 8; // = 97
#[account]
#[derive(Default, Debug)]
pub struct FanoutMembershipVoucher {
    pub fanout: Pubkey, // 32 
    pub total_inflow: u64, // +8
    pub last_inflow: u64,// +8
    pub bump_seed: u8, // +1
    pub membership_key: Pubkey, // + 32
    pub shares: u64, // +8
    pub stake_time: i64, // +8
}

pub const FANOUT_MINT_MEMBERSHIP_VOUCHER_SIZE: usize = 32 + 32 + 8 + 1 + 8 + 64;
#[account]
#[derive(Default, Debug)]
pub struct FanoutMembershipMintVoucher {
    pub fanout: Pubkey,
    pub fanout_mint: Pubkey,
    pub last_inflow: u64,
    pub bump_seed: u8,
    pub stake_time: i64,
}
