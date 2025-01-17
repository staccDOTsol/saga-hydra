/**
 * This code was GENERATED using the solita package.
 * Please DO NOT EDIT THIS FILE, instead rerun solita to update it or write a wrapper to add functionality.
 *
 * See: https://github.com/metaplex-foundation/solita
 */

import * as beet from '@metaplex-foundation/beet'
import * as web3 from '@solana/web3.js'

/**
 * @category Instructions
 * @category ProcessRemoveMember
 * @category generated
 */
export const processRemoveMemberStruct = new beet.BeetArgsStruct<{
  instructionDiscriminator: number[] /* size: 8 */
}>(
  [['instructionDiscriminator', beet.uniformFixedSizeArray(beet.u8, 8)]],
  'ProcessRemoveMemberInstructionArgs'
)
/**
 * Accounts required by the _processRemoveMember_ instruction
 *
 * @property [_writable_, **signer**] authority
 * @property [] member
 * @property [_writable_] fanout
 * @property [_writable_] membershipAccount
 * @property [_writable_] destination
 * @category Instructions
 * @category ProcessRemoveMember
 * @category generated
 */
export type ProcessRemoveMemberInstructionAccounts = {
  authority: web3.PublicKey
  member: web3.PublicKey
  fanout: web3.PublicKey
  membershipAccount: web3.PublicKey
  destination: web3.PublicKey
  anchorRemainingAccounts?: web3.AccountMeta[]
}

export const processRemoveMemberInstructionDiscriminator = [
  9, 45, 36, 163, 245, 40, 150, 85,
]

/**
 * Creates a _ProcessRemoveMember_ instruction.
 *
 * @param accounts that will be accessed while the instruction is processed
 * @category Instructions
 * @category ProcessRemoveMember
 * @category generated
 */
export function createProcessRemoveMemberInstruction(
  accounts: ProcessRemoveMemberInstructionAccounts,
  programId = new web3.PublicKey('FXZzBYS58sVq9KBnVWjduZVpYtwpRAViMdtE8HvwBqR1')
) {
  const [data] = processRemoveMemberStruct.serialize({
    instructionDiscriminator: processRemoveMemberInstructionDiscriminator,
  })
  const keys: web3.AccountMeta[] = [
    {
      pubkey: accounts.authority,
      isWritable: true,
      isSigner: true,
    },
    {
      pubkey: accounts.member,
      isWritable: false,
      isSigner: false,
    },
    {
      pubkey: accounts.fanout,
      isWritable: true,
      isSigner: false,
    },
    {
      pubkey: accounts.membershipAccount,
      isWritable: true,
      isSigner: false,
    },
    {
      pubkey: accounts.destination,
      isWritable: true,
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
