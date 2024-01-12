/**
 * This code was GENERATED using the solita package.
 * Please DO NOT EDIT THIS FILE, instead rerun solita to update it or write a wrapper to add functionality.
 *
 * See: https://github.com/metaplex-foundation/solita
 */
import * as beet from '@metaplex-foundation/beet';
import * as web3 from '@solana/web3.js';
/**
 * @category Instructions
 * @category ProcessDistributeToken
 * @category generated
 */
export type ProcessDistributeTokenInstructionArgs = {
    distributeForMint: boolean;
};
/**
 * @category Instructions
 * @category ProcessDistributeToken
 * @category generated
 */
export declare const processDistributeTokenStruct: beet.BeetArgsStruct<ProcessDistributeTokenInstructionArgs & {
    instructionDiscriminator: number[];
}>;
/**
 * Accounts required by the _processDistributeToken_ instruction
 *
 * @property [**signer**] payer
 * @property [_writable_] member
 * @property [_writable_] membershipVoucher
 * @property [_writable_] fanout
 * @property [_writable_] holdingAccount
 * @property [_writable_] fanoutForMint
 * @property [_writable_] fanoutForMintMembershipVoucher
 * @property [] fanoutMint
 * @property [_writable_] fanoutMintMemberTokenAccount
 * @property [_writable_] membershipMint
 * @property [_writable_] memberStakeAccount
 * @category Instructions
 * @category ProcessDistributeToken
 * @category generated
 */
export type ProcessDistributeTokenInstructionAccounts = {
    payer: web3.PublicKey;
    member: web3.PublicKey;
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
    membershipMint: web3.PublicKey;
    memberStakeAccount: web3.PublicKey;
    anchorRemainingAccounts?: web3.AccountMeta[];
};
export declare const processDistributeTokenInstructionDiscriminator: number[];
/**
 * Creates a _ProcessDistributeToken_ instruction.
 *
 * @param accounts that will be accessed while the instruction is processed
 * @param args to provide as instruction data to the program
 *
 * @category Instructions
 * @category ProcessDistributeToken
 * @category generated
 */
export declare function createProcessDistributeTokenInstruction(accounts: ProcessDistributeTokenInstructionAccounts, args: ProcessDistributeTokenInstructionArgs, programId?: web3.PublicKey): web3.TransactionInstruction;
//# sourceMappingURL=processDistributeToken.d.ts.map