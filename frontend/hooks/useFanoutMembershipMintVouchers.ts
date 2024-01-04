import { tryPublicKey } from './../common/utils'
import { useFanoutId } from '../hooks/useFanoutId'
import * as hydra from '../hydra-sdk/src'
import { BorshAccountsCoder, utils } from '@coral-xyz/anchor'
import { PublicKey } from '@solana/web3.js'

import { useDataHook } from './useDataHook'
import { FanoutMembershipMintVoucher } from '../hydra-sdk/src'
import { useConnection } from '@solana/wallet-adapter-react'

const HYDRA_PROGRAM_ID = new PublicKey(
  'ANSsi8dnmwyjQaGNC4PhRMU8WfBgKcvKzC9bPMBiJAPf'
)

export const useFanoutMembershipMintVouchers = (
  fanoutMintId?: string | null
) => {
  const { connection } = useConnection()
  const { data: fanoutId } = useFanoutId()
  return useDataHook<any[]>(
    async () => {
      if (!fanoutId || !fanoutMintId || !tryPublicKey(fanoutMintId)) return
      const programAccounts = await connection.getProgramAccounts(
        HYDRA_PROGRAM_ID,
        {
          filters: [
            {
              memcmp: {
                offset: 0,
                bytes: utils.bytes.bs58.encode(
                  BorshAccountsCoder.accountDiscriminator(
                    'fanoutMembershipMintVoucher'
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
            {
              memcmp: {
                offset: 40,
                bytes: tryPublicKey(fanoutMintId)!.toBase58(),
              },
            },
          ],
        }
      )

      return programAccounts.map((account) => {
        return {
          pubkey: account.pubkey,
          parsed: hydra.FanoutMembershipMintVoucher.fromAccountInfo(
            account.account
          )[0],
        }
      })
    },
    [fanoutId?.toString(), fanoutMintId],
    { name: 'useFanoutMembershipMintVouchers' }
  )
}
