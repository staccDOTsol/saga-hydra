/**
 * This code was GENERATED using the solita package.
 * Please DO NOT EDIT THIS FILE, instead rerun solita to update it or write a wrapper to add functionality.
 *
 * See: https://github.com/metaplex-foundation/solita
 */

import * as splToken from '@solana/spl-token'
import * as beet from '@metaplex-foundation/beet'
import * as web3 from '@solana/web3.js'
import {
  InitializeFanoutArgs,
  initializeFanoutArgsBeet,
} from '../types/InitializeFanoutArgs'
import { MembershipModel, membershipModelBeet } from '../types/MembershipModel'

/**
 * @category Instructions
 * @category ProcessInit
 * @category generated
 */
export type ProcessInitInstructionArgs = {
  args: InitializeFanoutArgs
  model: MembershipModel
}
/**
 * @category Instructions
 * @category ProcessInit
 * @category generated
 */
export const processInitStruct = new beet.FixableBeetArgsStruct<
  ProcessInitInstructionArgs & {
    instructionDiscriminator: number[] /* size: 8 */
  }
>(
  [
    ['instructionDiscriminator', beet.uniformFixedSizeArray(beet.u8, 8)],
    ['args', initializeFanoutArgsBeet],
    ['model', membershipModelBeet],
  ],
  'ProcessInitInstructionArgs'
)
/**
 * Accounts required by the _processInit_ instruction
 *
 * @property [_writable_, **signer**] authority
 * @property [_writable_] fanout
 * @property [_writable_] holdingAccount
 * @property [_writable_] membershipMint
 * @property [] switchboardFunction
 * @property [] collectionMint
 * @property [] collectionMetadata
 * @category Instructions
 * @category ProcessInit
 * @category generated
 */
export type ProcessInitInstructionAccounts = {
  authority: web3.PublicKey
  fanout: web3.PublicKey
  holdingAccount: web3.PublicKey
  systemProgram?: web3.PublicKey
  membershipMint: web3.PublicKey
  rent?: web3.PublicKey
  tokenProgram?: web3.PublicKey
  switchboardFunction: web3.PublicKey
  collectionMint: web3.PublicKey
  collectionMetadata: web3.PublicKey
  anchorRemainingAccounts?: web3.AccountMeta[]
}

export const processInitInstructionDiscriminator = [
  172, 5, 165, 143, 86, 159, 50, 237,
]

/**
 * Creates a _ProcessInit_ instruction.
 *
 * @param accounts that will be accessed while the instruction is processed
 * @param args to provide as instruction data to the program
 *
 * @category Instructions
 * @category ProcessInit
 * @category generated
 */
export function createProcessInitInstruction(
  accounts: ProcessInitInstructionAccounts,
  args: ProcessInitInstructionArgs,
  programId = new web3.PublicKey('FXZzBYS58sVq9KBnVWjduZVpYtwpRAViMdtE8HvwBqR1')
) {
  const [data] = processInitStruct.serialize({
    instructionDiscriminator: processInitInstructionDiscriminator,
    ...args,
  })
  const keys: web3.AccountMeta[] = [
    {
      pubkey: accounts.authority,
      isWritable: true,
      isSigner: true,
    },
    {
      pubkey: accounts.fanout,
      isWritable: true,
      isSigner: false,
    },
    {
      pubkey: accounts.holdingAccount,
      isWritable: true,
      isSigner: false,
    },
    {
      pubkey: accounts.systemProgram ?? web3.SystemProgram.programId,
      isWritable: false,
      isSigner: false,
    },
    {
      pubkey: accounts.membershipMint,
      isWritable: true,
      isSigner: false,
    },
    {
      pubkey: accounts.rent ?? web3.SYSVAR_RENT_PUBKEY,
      isWritable: false,
      isSigner: false,
    },
    {
      pubkey: accounts.tokenProgram ?? splToken.TOKEN_PROGRAM_ID,
      isWritable: false,
      isSigner: false,
    },
    {
      pubkey: accounts.switchboardFunction,
      isWritable: false,
      isSigner: false,
    },
    {
      pubkey: accounts.collectionMint,
      isWritable: false,
      isSigner: false,
    },
    {
      pubkey: accounts.collectionMetadata,
      isWritable: false,
      isSigner: false,
    },
  ]

  if (accounts.anchorRemainingAccounts != null) {
    for (const acc of accounts.anchorRemainingAccounts) {
      keys.push(acc)
    }
  }

  const ix = new web3.TransactionInstruction({
    programId,
    keys,
    data,
  })
  return ix
}
