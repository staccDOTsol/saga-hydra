// @ts-nocheck
import { useFanoutId } from '../hooks/useFanoutId'
import * as hydra from '../hydra-sdk/src'
import { BorshAccountsCoder, utils } from '@coral-xyz/anchor'
import { PublicKey } from '@solana/web3.js'

import { useDataHook } from './useDataHook'
import { useConnection } from '@solana/wallet-adapter-react'

const HYDRA_PROGRAM_ID = new PublicKey(
  'FXZzBYS58sVq9KBnVWjduZVpYtwpRAViMdtE8HvwBqR1'
)

export const useFanoutMembershipVouchers = () => {
  const { connection } = useConnection()
  const { data: fanoutId } = useFanoutId()
  return useDataHook<any[]>(
    async () => {
      if (!fanoutId) return
      const programAccounts = await connection.getProgramAccounts(
        HYDRA_PROGRAM_ID,
        {
          filters: [
            {
              memcmp: {
                offset: 0,
                bytes: utils.bytes.bs58.encode(
                  BorshAccountsCoder.accountDiscriminator(
                    'fanoutMembershipVoucher'
                  )
                ),
              },
            },
            {
              memcmp: {
                offset: 8,
                bytes: fanoutId.toBase58(),
              },
            },
          ],
        }
      )
      return programAccounts
        .map((account) => {
          return {
            pubkey: account.pubkey,
            parsed: hydra.FanoutMembershipVoucher.fromAccountInfo(
              account.account
            )[0],
          }
        })
        .sort((a, b) =>
          parseInt(a.parsed.shares.toString()) ===
          parseInt(b.parsed.shares.toString())
            ? a.parsed.membershipKey
                .toString()
                .localeCompare(b.parsed.membershipKey.toString())
            : parseInt(b.parsed.shares.toString()) -
              parseInt(a.parsed.shares.toString())
        )
    },
    [fanoutId?.toString()],
    { name: 'useFanoutMembershipVoucher' }
  )
}
