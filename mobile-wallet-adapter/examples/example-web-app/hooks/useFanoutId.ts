import { FanoutClient } from '../hydra-sdk/src'
import { firstParam } from '../common/utils'
import { useDataHook } from './useDataHook'
import { PublicKey } from '@solana/web3.js'

export const useFanoutId = () => {
  return {data: new PublicKey("2xtQ8P5LDavTWab6AS4qeDo5osZETYtFioKPVTVTy5Ff")}
}
