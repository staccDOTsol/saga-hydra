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
 * @category ProcessDistributeNftNft
 * @category generated
 */
export const processDistributeNftNftStruct = new beet.BeetArgsStruct<{
  instructionDiscriminator: number[] /* size: 8 */;
}>(
  [['instructionDiscriminator', beet.uniformFixedSizeArray(beet.u8, 8)]],
  'ProcessDistributeNftNftInstructionArgs',
);
/**
 * Accounts required by the _processDistributeNftNft_ instruction
 *
 * @property [_writable_] member
 * @property [_writable_] membershipMintTokenAccount
 * @property [] membershipKey
 * @property [_writable_] membershipVoucher
 * @property [_writable_] fanout
 * @property [_writable_] holdingAccount
 * @property [_writable_] fanoutForMint
 * @property [_writable_] fanoutForMintMembershipVoucher
 * @property [] fanoutMint
 * @property [_writable_] fanoutMintMemberTokenAccount
 * @property [] switchboardFunction
 * @property [_writable_] switchboardRequest
 * @property [**signer**] enclaveSigner
 * @category Instructions
 * @category ProcessDistributeNftNft
 * @category generated
 */
export type ProcessDistributeNftNftInstructionAccounts = {
  member: web3.PublicKey;
  membershipMintTokenAccount: web3.PublicKey;
  membershipKey: web3.PublicKey;
  membershipVoucher: web3.PublicKey;
  fanout: web3.PublicKey;
  holdingAccount: web3.PublicKey;
  fanoutForMint: web3.PublicKey;
  fanoutForMintMembershipVoucher: web3.PublicKey;
  fanoutMint: web3.PublicKey;
  fanoutMintMemberTokenAccount: web3.PublicKey;
  systemProgram?: web3.PublicKey;
  rent?: web3.PublicKey;
  tokenProgram?: web3.PublicKey;
  switchboardFunction: web3.PublicKey;
  switchboardRequest: web3.PublicKey;
  enclaveSigner: web3.PublicKey;
  anchorRemainingAccounts?: web3.AccountMeta[];
};

export const processDistributeNftNftInstructionDiscriminator = [
  248, 220, 135, 93, 134, 247, 193, 218,
];

/**
 * Creates a _ProcessDistributeNftNft_ instruction.
 *
 * @param accounts that will be accessed while the instruction is processed
 * @category Instructions
 * @category ProcessDistributeNftNft
 * @category generated
 */
export function createProcessDistributeNftNftInstruction(
  accounts: ProcessDistributeNftNftInstructionAccounts,
  programId = new web3.PublicKey('ANSsi8dnmwyjQaGNC4PhRMU8WfBgKcvKzC9bPMBiJAPf'),
) {
  const [data] = processDistributeNftNftStruct.serialize({
    instructionDiscriminator: processDistributeNftNftInstructionDiscriminator,
  });
  const keys: web3.AccountMeta[] = [
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
    {
      pubkey: accounts.fanoutForMintMembershipVoucher,
      isWritable: true,
      isSigner: false,
    },
    {
      pubkey: accounts.fanoutMint,
      isWritable: false,
      isSigner: false,
    },
    {
      pubkey: accounts.fanoutMintMemberTokenAccount,
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
    {
      pubkey: accounts.switchboardFunction,
      isWritable: false,
      isSigner: false,
    },
    {
      pubkey: accounts.switchboardRequest,
      isWritable: true,
      isSigner: false,
    },
    {
      pubkey: accounts.enclaveSigner,
      isWritable: false,
      isSigner: true,
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