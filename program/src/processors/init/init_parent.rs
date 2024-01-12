use crate::{
    error::HydraError,
    state::{Fanout, MembershipModel},
};
use anchor_lang::prelude::*;
use anchor_spl::token::{Mint, Token};
use mpl_token_metadata::accounts::Metadata;
use switchboard_solana::FunctionAccountData;

#[derive(AnchorSerialize, AnchorDeserialize, Clone, Default)]
pub struct InitializeFanoutArgs {
    pub bump_seed: u8,
    pub native_account_bump_seed: u8,
    pub name: String,
    pub total_shares: u64,
    pub default_weight: Option<u64>,
}

#[derive(Accounts)]
#[instruction(args: InitializeFanoutArgs)]
pub struct InitializeFanout<'info> {
    #[account(mut)]
    pub authority: Signer<'info>,
    #[account(
    init,
    space = 300,
    seeds = [b"jareout-config", args.name.as_bytes()],
    bump,
    payer = authority
    )]
    pub fanout: Account<'info, Fanout>,
    #[account(
    init,
    space = 1,
    seeds = [b"jareout-native-account", fanout.key().as_ref()],
    bump,
    payer = authority
    )
    ]
    /// CHECK: Native Account
    pub holding_account: UncheckedAccount<'info>,
    pub system_program: Program<'info, System>,
    #[account(mut)]
    pub membership_mint: Account<'info, Mint>,
    pub rent: Sysvar<'info, Rent>,
    pub token_program: Program<'info, Token>,
    // SWITCHBOARD ACCOUNTS
    #[account(
        constraint =
            // Ensure custom requests are allowed
            switchboard_function.load()?.requests_disabled == 0
    )]
    pub switchboard_function: AccountLoader<'info, FunctionAccountData>,

    pub collection_mint: Account<'info, Mint>,
    /// CHECK: Metadata Account
    pub collection_metadata: AccountInfo<'info>,

}
pub fn init(
    ctx: Context<InitializeFanout>,
    args: InitializeFanoutArgs,
    model: MembershipModel,
)-> anchor_lang::Result<()> {
    let membership_mint = &ctx.accounts.membership_mint;
    let fanout = &mut ctx.accounts.fanout;
    fanout.authority = ctx.accounts.authority.to_account_info().key();
    fanout.account_key = ctx.accounts.holding_account.to_account_info().key();
    fanout.name = args.name;
    fanout.total_shares = args.total_shares;
    fanout.total_available_shares = args.total_shares;
    fanout.total_inflow = 0;
    fanout.last_snapshot_amount = fanout.total_inflow;
    fanout.bump_seed = args.bump_seed;
    fanout.membership_model = model;
    fanout.switchboard_function = ctx.accounts.switchboard_function.to_account_info().key();
    fanout.membership_mint = if membership_mint.key() == spl_token::native_mint::id() {
        None
    } else {
        Some(membership_mint.key())
    };
            fanout.membership_mint = None;
            fanout.total_staked_shares = None;
            let metadata = ctx.accounts.collection_metadata.to_account_info();
            let metadata: Metadata = Metadata::from_bytes(&metadata.try_borrow_data()?)?;
            if metadata.mint != ctx.accounts.collection_mint.to_account_info().key() {
                return Err(HydraError::InvalidMetadata.into());
            }
            fanout.collection_mint = ctx.accounts.collection_mint.to_account_info().key();  
            fanout.default_weight = args.default_weight.unwrap();         
     

    Ok(())
}
