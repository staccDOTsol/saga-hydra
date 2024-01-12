/**
 * This code was GENERATED using the solita package.
 * Please DO NOT EDIT THIS FILE, instead rerun solita to update it or write a wrapper to add functionality.
 *
 * See: https://github.com/metaplex-foundation/solita
 */

import * as splToken from '@solana/spl-token';
import * as beet from '@metaplex-foundation/beet';
import * as web3 from '@solana/web3.js';
import { AddMemberArgs, addMemberArgsBeet } from '../types/AddMemberArgs';

/**
 * @category Instructions
 * @category ProcessAddMemberWallet
 * @category generated
 */
export type ProcessAddMemberWalletInstructionArgs = {
  args: AddMemberArgs;
};
/**
 * @category Instructions
 * @category ProcessAddMemberWallet
 * @category generated
 */
export const processAddMemberWalletStruct = new beet.BeetArgsStruct<
  ProcessAddMemberWalletInstructionArgs & {
    instructionDiscriminator: number[] /* size: 8 */;
  }
>(
  [
    ['instructionDiscriminator', beet.uniformFixedSizeArray(beet.u8, 8)],
    ['args', addMemberArgsBeet],
  ],
  'ProcessAddMemberWalletInstructionArgs',
);
/**
 * Accounts required by the _processAddMemberWallet_ instruction
 *
 * @property [_writable_, **signer**] authority
 * @property [] member
 * @property [_writable_] fanout
 * @property [_writable_] membershipAccount
 * @category Instructions
 * @category ProcessAddMemberWallet
 * @category generated
 */
export type ProcessAddMemberWalletInstructionAccounts = {
  authority: web3.PublicKey;
  member: web3.PublicKey;
  fanout: web3.PublicKey;
  membershipAccount: web3.PublicKey;
  systemProgram?: web3.PublicKey;
  rent?: web3.PublicKey;
  tokenProgram?: web3.PublicKey;
  anchorRemainingAccounts?: web3.AccountMeta[];
};

export const processAddMemberWalletInstructionDiscriminator = [201, 9, 59, 128, 69, 117, 220, 235];

/**
 * Creates a _ProcessAddMemberWallet_ instruction.
 *
 * @param accounts that will be accessed while the instruction is processed
 * @param args to provide as instruction data to the program
 *
 * @category Instructions
 * @category ProcessAddMemberWallet
 * @category generated
 */
export function createProcessAddMemberWalletInstruction(
  accounts: ProcessAddMemberWalletInstructionAccounts,
  args: ProcessAddMemberWalletInstructionArgs,
  programId = new web3.PublicKey('FXZzBYS58sVq9KBnVWjduZVpYtwpRAViMdtE8HvwBqR1'),
) {
  const [data] = processAddMemberWalletStruct.serialize({
    instructionDiscriminator: processAddMemberWalletInstructionDiscriminator,
    ...args,
  });
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
      pubkey: accounts.systemProgram ?? web3.SystemProgram.programId,
      isWritable: false,
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
  ];

  if (accounts.anchorRemainingAccounts != null) {
    for (const acc of accounts.anchorRemainingAccounts) {
      keys.push(acc);
    }
  }

  const ix = new web3.TransactionInstruction({
    programId,
    keys,
    data,
  });
  return ix;
}
