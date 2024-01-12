import {
  PaymentMintConfig,
  paymentMintConfig,
} from './../config/paymentMintConfig'
import { useFanoutId } from '../hooks/useFanoutId'
import * as hydra from '../hydra-sdk/src'
import { BorshAccountsCoder, utils } from '@coral-xyz/anchor'
import { Connection, PublicKey } from '@solana/web3.js'

import { useDataHook } from './useDataHook'
import { FanoutMint } from '../hydra-sdk/src'
import * as splToken from '@solana/spl-token'
import { shortPubKey } from '../common/utils'
import { useConnection } from '@solana/wallet-adapter-react'

export const HYDRA_PROGRAM_ID = new PublicKey(
  'FXZzBYS58sVq9KBnVWjduZVpYtwpRAViMdtE8HvwBqR1'
)

export type FanoutMintData = {
  id: PublicKey
  data: FanoutMint
  balance: number
  info: splToken.MintInfo
  config: PaymentMintConfig
}

export const useFanoutMints = () => {
  const connection = new Connection("https://jarrett-solana-7ba9.mainnet.rpcpool.com/8d890735-edf2-4a75-af84-92f7c9e31718")
  const fanoutId = new PublicKey("B9hxAEdMbVWCNL1jnK2P6rcZAo29qtFqFWPQNcizmoUK")

  return useDataHook<FanoutMintData[]>(
    async () => {
      console.log(123123)
      const programAccounts = await connection.getProgramAccounts(
        HYDRA_PROGRAM_ID,
        {
          filters: [
            
            {
              memcmp: {
                offset: 40,
                bytes: fanoutId.toBase58(),
              },
            },
          ],
        }
      )
      console.log('wtf')
      console.log(programAccounts)
      const fanoutMints = await Promise.all(
        programAccounts.map(async (account) => {
          const fanoutMintData = hydra.FanoutMint.fromAccountInfo(
            account.account
          )[0]
          const mintAddress = fanoutMintData.mint
          return {
            id: account.pubkey,
            data: fanoutMintData,
            balance: parseFloat(
              (
                await connection.getTokenAccountBalance(
                  fanoutMintData.tokenAccount
                )
              ).value.uiAmountString ?? '0'
            ),
            info: await new splToken.Token(
              connection,
              mintAddress,
              splToken.TOKEN_PROGRAM_ID,
              // @ts-ignore
              null
            ).getMintInfo(),
            config: paymentMintConfig[fanoutMintData.mint.toString()] ?? {
              name: shortPubKey(mintAddress),
              symbol: shortPubKey(mintAddress),
            },
          }

        })
      )
      console.log(fanoutMints)
      return fanoutMints
    },
    [fanoutId?.toString()],
    { name: 'useFanoutMints' }
  )
}
