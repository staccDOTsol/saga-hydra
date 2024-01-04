/**
 * This code was GENERATED using the solita package.
 * Please DO NOT EDIT THIS FILE, instead rerun solita to update it or write a wrapper to add functionality.
 *
 * See: https://github.com/metaplex-foundation/solita
 */

import * as splToken from '@solana/spl-token';
import * as beet from '@metaplex-foundation/beet';
import * as web3 from '@solana/web3.js';

/**
 * @category Instructions
 * @category ProcessDistributeNft
 * @category generated
 */
export type ProcessDistributeNftInstructionArgs = {
  distributeForMint: boolean;
};
/**
 * @category Instructions
 * @category ProcessDistributeNft
 * @category generated
 */
export const processDistributeNftStruct = new beet.BeetArgsStruct<
  ProcessDistributeNftInstructionArgs & {
    instructionDiscriminator: number[] /* size: 8 */;
  }
>(
  [
    ['instructionDiscriminator', beet.uniformFixedSizeArray(beet.u8, 8)],
    ['distributeForMint', beet.bool],
  ],
  'ProcessDistributeNftInstructionArgs',
);
/**
 * Accounts required by the _processDistributeNft_ instruction
 *
 * @property [_writable_, **signer**] payer
 * @property [_writable_] authority
 * @property [_writable_] member
 * @property [_writable_] membershipMintTokenAccount
 * @property [] membershipKey
 * @property [_writable_] membershipVoucher
 * @property [_writable_] fanout
 * @property [_writable_] holdingAccount
 * @property [_writable_] fanoutForMint
 * @property [_writable_] fanoutForMintMembershipVoucher (optional)
 * @property [] fanoutMint
 * @property [_writable_] fanoutMintMemberTokenAccount
 * @property [] collection
 * @property [] metadata
 * @category Instructions
 * @category ProcessDistributeNft
 * @category generated
 */
export type ProcessDistributeNftInstructionAccounts = {
  payer: web3.PublicKey;
  authority: web3.PublicKey;
  member: web3.PublicKey;
  membershipMintTokenAccount: web3.PublicKey;
  membershipKey: web3.PublicKey;
  membershipVoucher: web3.PublicKey;
  fanout: web3.PublicKey;
  holdingAccount: web3.PublicKey;
  fanoutForMint: web3.PublicKey;
  fanoutForMintMembershipVoucher?: web3.PublicKey;
  fanoutMint: web3.PublicKey;
  fanoutMintMemberTokenAccount: web3.PublicKey;
  systemProgram?: web3.PublicKey;
  rent?: web3.PublicKey;
  tokenProgram?: web3.PublicKey;
  collection: web3.PublicKey;
  metadata: web3.PublicKey;
  anchorRemainingAccounts?: web3.AccountMeta[];
};

export const processDistributeNftInstructionDiscriminator = [108, 240, 68, 81, 144, 83, 58, 153];

/**
 * Creates a _ProcessDistributeNft_ instruction.
 *
 * Optional accounts that are not provided will be omitted from the accounts
 * array passed with the instruction.
 * An optional account that is set cannot follow an optional account that is unset.
 * Otherwise an Error is raised.
 *
 * @param accounts that will be accessed while the instruction is processed
 * @param args to provide as instruction data to the program
 *
 * @category Instructions
 * @category ProcessDistributeNft
 * @category generated
 */
export function createProcessDistributeNftInstruction(
  accounts: ProcessDistributeNftInstructionAccounts,
  args: ProcessDistributeNftInstructionArgs,
  programId = new web3.PublicKey('ANSsi8dnmwyjQaGNC4PhRMU8WfBgKcvKzC9bPMBiJAPf'),
) {
  const [data] = processDistributeNftStruct.serialize({
    instructionDiscriminator: processDistributeNftInstructionDiscriminator,
    ...args,
  });
  const keys: web3.AccountMeta[] = [
    {
      pubkey: accounts.payer,
      isWritable: true,
      isSigner: true,
    },
    {
      pubkey: accounts.authority,
      isWritable: true,
      isSigner: false,
    },
    {
      pubkey: accounts.member,
      isWritable: true,
      isSigner: false,
    },
    {
      pubkey: accounts.membershipMintTokenAccount,
      isWritable: true,
      isSigner: false,
    },
    {
      pubkey: accounts.membershipKey,
      isWritable: false,
      isSigner: false,
    },
    {
      pubkey: accounts.membershipVoucher,
      isWritable: true,
      isSigner: false,
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
      pubkey: accounts.fanoutForMint,
      isWritable: true,
      isSigner: false,
    },
  ];

  if (accounts.fanoutForMintMembershipVoucher != null) {
    keys.push({
      pubkey: accounts.fanoutForMintMembershipVoucher,
      isWritable: true,
      isSigner: false,
    });
  }
  keys.push({
    pubkey: accounts.fanoutMint,
    isWritable: false,
    isSigner: false,
  });
  keys.push({
    pubkey: accounts.fanoutMintMemberTokenAccount,
    isWritable: true,
    isSigner: false,
  });
  keys.push({
    pubkey: accounts.systemProgram ?? web3.SystemProgram.programId,
    isWritable: false,
    isSigner: false,
  });
  keys.push({
    pubkey: accounts.rent ?? web3.SYSVAR_RENT_PUBKEY,
    isWritable: false,
    isSigner: false,
  });
  keys.push({
    pubkey: accounts.tokenProgram ?? splToken.TOKEN_PROGRAM_ID,
    isWritable: false,
    isSigner: false,
  });
  keys.push({
    pubkey: accounts.collection,
    isWritable: false,
    isSigner: false,
  });
  keys.push({
    pubkey: accounts.metadata,
    isWritable: false,
    isSigner: false,
  });

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
