import { FanoutClient } from '../hydra-sdk/src'
import { firstParam } from '../common/utils'
import { useDataHook } from './useDataHook'
import { PublicKey } from '@solana/web3.js'

export const useFanoutId = () => {
  return {data: new PublicKey("B9hxAEdMbVWCNL1jnK2P6rcZAo29qtFqFWPQNcizmoUK")}
}
