import { FanoutClient } from '../hydra-sdk/src'
import { firstParam } from '../common/utils'
import { useDataHook } from './useDataHook'
import { PublicKey } from '@solana/web3.js'

export const useFanoutId = () => {
  return {data: new PublicKey("ErdDj2hJr89oDMqqLQjpxs9ZEvFwSiU1D98b3sE8xzSy")}
}
