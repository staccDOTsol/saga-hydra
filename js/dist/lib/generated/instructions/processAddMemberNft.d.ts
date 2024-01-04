/**
 * This code was GENERATED using the solita package.
 * Please DO NOT EDIT THIS FILE, instead rerun solita to update it or write a wrapper to add functionality.
 *
 * See: https://github.com/metaplex-foundation/solita
 */
import * as beet from '@metaplex-foundation/beet';
import * as web3 from '@solana/web3.js';
import { AddMemberArgs } from '../types/AddMemberArgs';
/**
 * @category Instructions
 * @category ProcessAddMemberNft
 * @category generated
 */
export type ProcessAddMemberNftInstructionArgs = {
    args: AddMemberArgs;
};
/**
 * @category Instructions
 * @category ProcessAddMemberNft
 * @category generated
 */
export declare const processAddMemberNftStruct: beet.BeetArgsStruct<ProcessAddMemberNftInstructionArgs & {
    instructionDiscriminator: number[];
}>;
/**
 * Accounts required by the _processAddMemberNft_ instruction
 *
 * @property [_writable_, **signer**] authority
 * @property [_writable_] fanout
 * @property [_writable_] membershipAccount
 * @property [] mint
 * @property [] metadata
 * @category Instructions
 * @category ProcessAddMemberNft
 * @category generated
 */
export type ProcessAddMemberNftInstructionAccounts = {
    authority: web3.PublicKey;
    fanout: web3.PublicKey;
    membershipAccount: web3.PublicKey;
    mint: web3.PublicKey;
    metadata: web3.PublicKey;
    systemProgram?: web3.PublicKey;
    rent?: web3.PublicKey;
    tokenProgram?: web3.PublicKey;
    anchorRemainingAccounts?: web3.AccountMeta[];
};
export declare const processAddMemberNftInstructionDiscriminator: number[];
/**
 * Creates a _ProcessAddMemberNft_ instruction.
 *
 * @param accounts that will be accessed while the instruction is processed
 * @param args to provide as instruction data to the program
 *
 * @category Instructions
 * @category ProcessAddMemberNft
 * @category generated
 */
export declare function createProcessAddMemberNftInstruction(accounts: ProcessAddMemberNftInstructionAccounts, args: ProcessAddMemberNftInstructionArgs, programId?: web3.PublicKey): web3.TransactionInstruction;
//# sourceMappingURL=processAddMemberNft.d.ts.map