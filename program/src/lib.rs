#![allow(clippy::result_large_err)]

pub mod error;
pub mod processors;
pub mod state;
pub mod utils;
pub use switchboard_solana::prelude::*;
use processors::*;
use state::MembershipModel;

declare_id!("FXZzBYS58sVq9KBnVWjduZVpYtwpRAViMdtE8HvwBqR1");
#[program]
pub mod jaredra {

    use super::*;

    pub fn process_init(
        ctx: Context<InitializeFanout>,
        args: InitializeFanoutArgs,
        model: MembershipModel,
    )-> anchor_lang::Result<()> {
        init(ctx, args, model)
    }
    
    pub fn process_rafflin(
        ctx: Context<Rafflin>,
    )-> anchor_lang::Result<()> {
        rafflin(ctx)
    }
    pub fn process_init_for_mint(
        ctx: Context<InitializeFanoutForMint>,
        bump_seed: u8,
    )-> anchor_lang::Result<()> {
        init_for_mint(ctx, bump_seed)
    }

    pub fn process_add_member_nft(
        ctx: Context<AddMemberWithNFT>,
        args: AddMemberArgs,
    )-> anchor_lang::Result<()> {
        add_member_nft(ctx, args)
    }


    pub fn process_distribute_nft_nft(
        ctx: Context<DistributeNftMemberNft>,
    )-> anchor_lang::Result<()> {
        distribute_nft_for_nft(ctx)
    }

    pub fn process_distribute_nft(
        ctx: Context<DistributeNftMember>,
        distribute_for_mint: bool,
    )-> anchor_lang::Result<()> {
        distribute_for_nft(ctx, distribute_for_mint)
    }
    pub fn process_transfer_shares(ctx: Context<TransferShares>, shares: u64)-> anchor_lang::Result<()> {
        transfer_shares(ctx, shares)
    }
    pub fn process_remove_member(ctx: Context<RemoveMember>)-> anchor_lang::Result<()> {
        remove_member(ctx)
    }
}
