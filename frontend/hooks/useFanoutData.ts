import { useFanoutId } from '../hooks/useFanoutId'

import { useDataHook } from './useDataHook'
import { Fanout, FanoutClient } from '../hydra-sdk/src'
import { useConnection } from '@solana/wallet-adapter-react'
import { asWallet } from '../common/Wallets'
import { LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js'

export type FanoutData = {
  fanoutId: PublicKey
  fanout: Fanout
  nativeAccount: PublicKey
  balance: number
}

export const useFanoutData = (wallet: any) => {
  const { connection } = useConnection()
  const { data: fanoutId } = useFanoutId()
  
  const fanoutSdk = new FanoutClient(connection, (wallet!))

  return useDataHook<FanoutData>(
    async () => {
      if (!fanoutId) return
      const [nativeAccount] = await FanoutClient.nativeAccount(fanoutId)
      const fanout = await fanoutSdk.fetch<Fanout>(fanoutId, Fanout)
      const [fanoutBalance, nativeBalance] = await Promise.all([
        connection.getBalance(fanoutId),
        connection.getBalance(nativeAccount),
      ])
      const balance = (fanoutBalance + nativeBalance) / LAMPORTS_PER_SOL
      return { fanoutId, fanout, nativeAccount, balance }
    },
    [fanoutId?.toString()],
    { name: 'useFanoutData' }
  )
}
