"use strict";
/**
 * This code was GENERATED using the solita package.
 * Please DO NOT EDIT THIS FILE, instead rerun solita to update it or write a wrapper to add functionality.
 *
 * See: https://github.com/metaplex-foundation/solita
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createProcessUnstakeInstruction = exports.processUnstakeInstructionDiscriminator = exports.processUnstakeStruct = void 0;
const splToken = __importStar(require("@solana/spl-token"));
const beet = __importStar(require("@metaplex-foundation/beet"));
const web3 = __importStar(require("@solana/web3.js"));
/**
 * @category Instructions
 * @category ProcessUnstake
 * @category generated
 */
exports.processUnstakeStruct = new beet.BeetArgsStruct([['instructionDiscriminator', beet.uniformFixedSizeArray(beet.u8, 8)]], 'ProcessUnstakeInstructionArgs');
exports.processUnstakeInstructionDiscriminator = [217, 160, 136, 174, 149, 62, 79, 133];
/**
 * Creates a _ProcessUnstake_ instruction.
 *
 * @param accounts that will be accessed while the instruction is processed
 * @category Instructions
 * @category ProcessUnstake
 * @category generated
 */
function createProcessUnstakeInstruction(accounts, programId = new web3.PublicKey('FXZzBYS58sVq9KBnVWjduZVpYtwpRAViMdtE8HvwBqR1')) {
    var _a, _b;
    const [data] = exports.processUnstakeStruct.serialize({
        instructionDiscriminator: exports.processUnstakeInstructionDiscriminator,
    });
    const keys = [
        {
            pubkey: accounts.member,
            isWritable: true,
            isSigner: true,
        },
        {
            pubkey: accounts.fanout,
            isWritable: true,
            isSigner: false,
        },
        {
            pubkey: accounts.membershipVoucher,
            isWritable: true,
            isSigner: false,
        },
        {
            pubkey: accounts.membershipMint,
            isWritable: true,
            isSigner: false,
        },
        {
            pubkey: accounts.membershipMintTokenAccount,
            isWritable: true,
            isSigner: false,
        },
        {
            pubkey: accounts.memberStakeAccount,
            isWritable: true,
            isSigner: false,
        },
        {
            pubkey: (_a = accounts.systemProgram) !== null && _a !== void 0 ? _a : web3.SystemProgram.programId,
            isWritable: false,
            isSigner: false,
        },
        {
            pubkey: (_b = accounts.tokenProgram) !== null && _b !== void 0 ? _b : splToken.TOKEN_PROGRAM_ID,
            isWritable: false,
            isSigner: false,
        },
        {
            pubkey: accounts.instructions,
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
exports.createProcessUnstakeInstruction = createProcessUnstakeInstruction;
//# sourceMappingURL=processUnstake.js.map