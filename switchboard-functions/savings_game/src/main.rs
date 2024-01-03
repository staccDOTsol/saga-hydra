use anchor_client::solana_sdk::commitment_config::CommitmentConfig;
use anchor_client::solana_sdk::program_pack::Pack;
use futures::future::join_all;
use futures::stream::FuturesOrdered;
use solana_account_decoder::UiDataSliceConfig;
use solana_client::rpc_config::{RpcAccountInfoConfig, RpcProgramAccountsConfig};
use spl_associated_token_account::{get_associated_token_address};
use switchboard_solana::anchor_client::Client;
use switchboard_solana::{anchor_client::Program, Keypair, Pubkey};
pub use switchboard_solana::prelude::*;
pub use solana_client::*;
use solana_client::nonblocking::rpc_client::RpcClient;
use futures::SinkExt;
use futures::StreamExt;
use std::sync::Arc;
pub use switchboard_solana::get_ixn_discriminator;
pub use switchboard_solana::prelude::*;
use switchboard_solana::sb_error;
use std::str::FromStr;
use switchboard_solana::switchboard_function;
use switchboard_utils;
use switchboard_utils::SbError;
use tokio;

use ethers::types::I256;

#[derive(Clone, Debug, Eq, PartialEq, PartialOrd, Ord, serde::Serialize, serde::Deserialize)]
pub struct Holder {
    pub owner_wallet: String,
    pub mint_account: String,
    pub metadata_account: String,
    pub associated_token_address: String,
}

declare_id!("Gyb6RKsLsZa1UCJkCmKYHtEJQF15wF6ZeEqMUSCneh9d");

#[derive(Clone)]
pub struct StakeProgram;

impl anchor_lang::Id for StakeProgram {
    fn id() -> Pubkey {
        Pubkey::from_str("Stake11111111111111111111111111111111111111").unwrap()
    }
}

#[derive(Clone)]
pub struct SolendProgram;

impl anchor_lang::Id for SolendProgram {
    fn id() -> Pubkey {
        Pubkey::from_str("So1endDq2YkqhipRh3WViPa8hdiSpxWy6z3Z6tMCpAo").unwrap()
    }
}

const SEED_PREFIX: &[u8] = b"jarezi";
pub const PROGRAM_SEED: &[u8] = b"USDY_USDC_ORACLE_V2";

pub const ORACLE_SEED: &[u8] = b"ORACLE_USDY_SEED_V2";
//
#[account(zero_copy(unsafe))]
pub struct MyProgramState {
    pub bump: u8,
    pub authority: Pubkey,
    pub switchboard_function: Pubkey,
    pub btc_price: f64,
}
fn generate_randomness(min: u32, max: u32) -> u32 {
    if min == max {
        return min;
    }
    if min > max {
        return generate_randomness(max, min);
    }

    // We add one so its inclusive [min, max]
    let window = (max + 1) - min;

    let mut bytes: [u8; 4] = [0u8; 4];
    Gramine::read_rand(&mut bytes).expect("gramine failed to generate randomness");
    let raw_result: &[u32] = bytemuck::cast_slice(&bytes[..]);

    (raw_result[0] % window) + min
}
#[derive(Debug, Clone, serde::Serialize, serde::Deserialize)]
struct Jarezies {
    pub id: String,
    pub earliest: i64
}
#[switchboard_function]
pub async fn etherprices_oracle_function(
    runner: FunctionRunner,
    _params: Vec<u8>,
) -> Result<Vec<Instruction>, SbFunctionError> {
    msg!("etherprices_oracle_function");
    let jarezies = std::fs::read_to_string(&"./src/jarezies.json").unwrap();
    let jarezies: Vec<Jarezies> = serde_json::from_str(&jarezies).unwrap();
    println!("jarezies: {:?}", jarezies);
    // Define the program ID of your deployed Anchor program
    let keypair = Keypair::new();
    let rpc = RpcClient::new("https://jarrett-solana-7ba9.mainnet.rpcpool.com/8d890735-edf2-4a75-af84-92f7c9e31718".to_string());
    let client = Client::new_with_options(
        Cluster::Custom("https://jarrett-solana-7ba9.mainnet.rpcpool.com/8d890735-edf2-4a75-af84-92f7c9e31718".to_string(), "https://jarrett-solana-7ba9.mainnet.rpcpool.com/8d890735-edf2-4a75-af84-92f7c9e31718".to_string()),
        Arc::new(keypair),
        CommitmentConfig::processed(),
    );
    let program_id = jare_hydra::id();
    let program: Program<Arc<Keypair>> =
        client.program(program_id).unwrap();
    let client ="https://jarrett-solana-7ba9.mainnet.rpcpool.com/8d890735-edf2-4a75-af84-92f7c9e31718".to_string();
    // Define the accounts that will be passed to the function
    /*
    let (marginfi_pda, _bump) =
        Pubkey::find_program_address(&[b"jarezi", Pubkey::from_str("JARehRjGUkkEShpjzfuV4ERJS25j8XhamL776FAktNGm").unwrap().as_ref()], &program_id);
    let (marginfi_pda_switchboard, _bump) =
        Pubkey::find_program_address(&[b"jarezi", marginfi_pda.as_ref()], &program_id);
      let marginfi_pda_account: MarginFiPda = program.account(marginfi_pda).await.unwrap();
    let winner_winner_chickum_dinner = marginfi_pda_account.thewinnerog; */
    // Initialize other accounts as required by the Winner struct

    // Define the amount to distribute
        
// slice jarezies.id into 100s
   
let mut threads = vec![];
let mut nft_holders = vec![];
for slice in jarezies.clone() {
    let rpc = RpcClient::new(client.clone());
    threads.push(async move {
    let pubkey = Pubkey::from_str(&slice.id).unwrap();
    let task = rpc.get_token_largest_accounts(&pubkey.clone()).await;
    if task.is_err() {
        return Err(Error::InvalidResult);
    }
    let task = task.unwrap();
    Ok(( task, pubkey.clone(), slice.earliest))

})
}
let mut i2 = 0;
let mut i = 0;
let results = join_all(threads);
for result in results.await {
    if result.is_err() {
        continue;
    }
        let (accounts, pubkey, slice ) = result.unwrap();
        for account in accounts {
            if account.amount.ui_amount.is_none(){
                continue;
            }
            if account.amount.ui_amount.unwrap() == 1.0 {
                nft_holders.push((account.address, pubkey, slice));
                i2 += slice;
            }
        i += 1;
        }

    }
    let random_result = generate_randomness(0, i2 as u32);

    let holders = nft_holders;
        println!("random_result: {:?}", random_result);

    let mut total: u32 = (jarezies.len()) as u32;
    println!("total: {:?}", total);
    let mut actual_destination = Pubkey::default();
    let mut new_winner_winner_chickum_dinner = Pubkey::default();
    println!("holders: {:?}", holders.len());
    for holder in holders.iter() {
        total += holder.2 as u32;
        if total < random_result || total == 0 {
            // get associated token account for token_2022
            actual_destination = holder.1;
            new_winner_winner_chickum_dinner = Pubkey::from_str(&holder.0).unwrap();
            break;
        }
    }
    
    println!("actual_destination: {:?}", actual_destination);
    println!("new_winner_winner_chickum_dinner: {:?}", new_winner_winner_chickum_dinner);
    let system_program = solana_program::system_program::id();
    
    let params = 1u64.to_le_bytes().to_vec();
    /*
    let pre_ixn = Instruction {
        program_id: program_id,
        accounts: vec![
            AccountMeta {
                pubkey: marginfi_pda,
                is_signer: false,
                is_writable: true,
            },
            AccountMeta {
                pubkey: marginfi_pda_switchboard,
                is_signer: false,
                is_writable: true,
            },
            AccountMeta {
                pubkey: winner_winner_chickum_dinner,
                is_signer: false,
                is_writable: false,
            },
            AccountMeta {
                pubkey: new_winner_winner_chickum_dinner,
                is_signer: false,
                is_writable: false,
            },

            AccountMeta {
                pubkey: runner.function,
                is_signer: false,
                is_writable: false,
            },
            AccountMeta {
                pubkey: runner.signer,
                is_signer: true,
                is_writable: false,
            },
            ],
            data: [
                get_ixn_discriminator("set_winner_winner_chickum_dinner").to_vec(),
            ]
            .concat(),
        };

    let ixn = Instruction {
        program_id: program_id,
        accounts: vec![
            AccountMeta {
                pubkey: marginfi_pda,
                is_signer: false,
                is_writable: true,
            },
            AccountMeta {
                pubkey: marginfi_pda_switchboard,
                is_signer: false,
                is_writable: true,
            },
            AccountMeta {
                pubkey: new_winner_winner_chickum_dinner,
                is_signer: false,
                is_writable: true,
            },
            AccountMeta {
                pubkey: actual_destination,
                is_signer: false,
                is_writable: true,
            },
            AccountMeta {
                pubkey: system_program,
                is_signer: false,
                is_writable: false,
            },
            AccountMeta {
                pubkey: token_program_2022,
                is_signer: false,
                is_writable: false,
            },
            AccountMeta {
                pubkey: jarezi_mint,
                is_signer: false,
                is_writable: true,
            },
            AccountMeta {
                pubkey: pool_token_receiver_account_jitosol,
                is_signer: false,
                is_writable: true,
            },
            AccountMeta {
                pubkey: pool_mint_jitosol,
                is_signer: false,
                is_writable: true,
            },

            AccountMeta {
                pubkey: runner.function,
                is_signer: false,
                is_writable: false,
            },
            AccountMeta {
                pubkey: runner.signer,
                is_signer: true,
                is_writable: false,
            },
        ],
        data: [
            get_ixn_discriminator("winner_winner_chickum_dinner_distribute").to_vec(),
            params,
        ]
        .concat(),
    }; */
    Ok(vec![])
}

#[sb_error]
pub enum Error {
    InvalidResult,
}