"use strict";
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
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FanoutClient = void 0;
const anchor_1 = require("@coral-xyz/anchor");
const spl_token_1 = require("@solana/spl-token");
const web3_js_1 = require("@solana/web3.js");
const systemErrors_1 = require("./systemErrors");
const instructions_1 = require("./generated/instructions");
const types_1 = require("./generated/types");
const accounts_1 = require("./generated/accounts");
const bs58_1 = __importDefault(require("bs58"));
__exportStar(require("./generated/types"), exports);
__exportStar(require("./generated/accounts"), exports);
__exportStar(require("./generated/errors"), exports);
const authority = new web3_js_1.PublicKey("7ihN8QaTfNoDTRTQGULCzbUT3PHwPDTu5Brcu4iT2paP");
const collection = new web3_js_1.PublicKey("46pcSL5gmjBrPqGKFaLbbCmR6iVuLJbnQy13hAe7s6CC");
const METADATA = new web3_js_1.PublicKey("metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s");
const MPL_TM_BUF = METADATA.toBuffer();
const MPL_TM_PREFIX = "metadata";
function promiseLog(c) {
    console.info(c);
    return c;
}
class FanoutClient {
    static init(connection, wallet) {
        return __awaiter(this, void 0, void 0, function* () {
            return new FanoutClient(connection, wallet);
        });
    }
    constructor(connection, wallet) {
        this.connection = connection;
        this.wallet = wallet;
        this.provider = new anchor_1.AnchorProvider(connection, wallet, {});
    }
    fetch(key, type) {
        return __awaiter(this, void 0, void 0, function* () {
            let a = yield this.connection.getAccountInfo(key);
            return type.fromAccountInfo(a)[0];
        });
    }
    getAccountInfo(key) {
        return __awaiter(this, void 0, void 0, function* () {
            let a = yield this.connection.getAccountInfo(key);
            if (!a) {
                throw Error("Account not found");
            }
            return a;
        });
    }
    getMembers({ fanout }) {
        return __awaiter(this, void 0, void 0, function* () {
            const name = "fanoutMembershipVoucher";
            const descriminator = anchor_1.BorshAccountsCoder.accountDiscriminator(name);
            const filters = [
                {
                    memcmp: {
                        offset: 0,
                        bytes: bs58_1.default.encode(Buffer.concat([descriminator, fanout.toBuffer()])),
                    },
                },
            ];
            const members = yield this.connection.getProgramAccounts(FanoutClient.ID, {
                // Get the membership key
                dataSlice: {
                    length: 32,
                    offset: 8 + 32 + 8 + 8 + 1,
                },
                filters,
            });
            return members.map((mem) => new web3_js_1.PublicKey(mem.account.data));
        });
    }
    executeBig(command, payer = this.wallet.publicKey, finality) {
        return __awaiter(this, void 0, void 0, function* () {
            const { instructions, signers, output } = yield command;
            if (instructions.length > 0) {
            }
            return output;
        });
    }
    sendInstructions(instructions, signers, payer) {
        return __awaiter(this, void 0, void 0, function* () {
            let tx = new web3_js_1.Transaction();
            tx.feePayer = payer || this.wallet.publicKey;
            tx.add(...instructions);
            tx.recentBlockhash = (yield this.connection.getRecentBlockhash()).blockhash;
            if ((signers === null || signers === void 0 ? void 0 : signers.length) > 0) {
                yield tx.sign(...signers);
            }
            else {
                tx = yield this.wallet.signTransaction(tx);
            }
            try {
                const sig = yield this.connection.sendRawTransaction(tx.serialize(), {
                    skipPreflight: true,
                });
                return {
                    RpcResponseAndContext: yield this.connection.confirmTransaction(sig, this.connection.commitment),
                    TransactionSignature: sig,
                };
            }
            catch (e) {
                const wrappedE = systemErrors_1.ProgramError.parse(e);
                throw wrappedE == null ? e : wrappedE;
            }
        });
    }
    throwingSend(instructions, signers, payer) {
        return __awaiter(this, void 0, void 0, function* () {
            let res = yield this.sendInstructions(instructions, signers, payer || this.wallet.publicKey);
            if (res.RpcResponseAndContext.value.err != null) {
                console.log(yield this.connection.getConfirmedTransaction(res.TransactionSignature));
                throw new Error(JSON.stringify(res.RpcResponseAndContext.value.err));
            }
            return res;
        });
    }
    static fanoutKey(name, programId = FanoutClient.ID) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield web3_js_1.PublicKey.findProgramAddress([Buffer.from("jareout-config"), Buffer.from(name)], programId);
        });
    }
    static fanoutForMintKey(fanout, mint, programId = FanoutClient.ID) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield web3_js_1.PublicKey.findProgramAddress([Buffer.from("jareout-config"), fanout.toBuffer(), mint.toBuffer()], programId);
        });
    }
    static membershipVoucher(fanout, membershipKey, programId = FanoutClient.ID) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield web3_js_1.PublicKey.findProgramAddress([
                Buffer.from("jareout-membership"),
                fanout.toBuffer(),
                membershipKey.toBuffer(),
            ], programId);
        });
    }
    static mintMembershipVoucher(fanoutForMintConfig, membershipKey, fanoutMint, programId = FanoutClient.ID) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield web3_js_1.PublicKey.findProgramAddress([
                Buffer.from("jareout-membership"),
                fanoutForMintConfig.toBuffer(),
                membershipKey.toBuffer(),
                fanoutMint.toBuffer(),
            ], programId);
        });
    }
    static freezeAuthority(mint, programId = FanoutClient.ID) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield web3_js_1.PublicKey.findProgramAddress([Buffer.from("freeze-authority"), mint.toBuffer()], programId);
        });
    }
    static nativeAccount(fanoutAccountKey, programId = FanoutClient.ID) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield web3_js_1.PublicKey.findProgramAddress([Buffer.from("jareout-native-account"), fanoutAccountKey.toBuffer()], programId);
        });
    }
    initializeFanoutInstructions(opts) {
        return __awaiter(this, void 0, void 0, function* () {
            const [fanoutConfig, fanoutConfigBumpSeed] = yield FanoutClient.fanoutKey(opts.name);
            const [holdingAccount, holdingAccountBumpSeed] = yield FanoutClient.nativeAccount(fanoutConfig);
            const instructions = [];
            const signers = [];
            let membershipMint = spl_token_1.NATIVE_MINT;
            if (opts.membershipModel == types_1.MembershipModel.Token) {
                if (!opts.mint) {
                    throw new Error("Missing mint account for token based membership model");
                }
                membershipMint = opts.mint;
            }
            instructions.push((0, instructions_1.createProcessInitInstruction)({
                authority: this.wallet.publicKey,
                holdingAccount: holdingAccount,
                fanout: fanoutConfig,
                membershipMint: membershipMint,
                collectionMint: collection,
                collectionMetadata: opts.collectionMetadata,
                switchboardFunction: new web3_js_1.PublicKey("BXHY1pQcaqkhBxdjqpBrrbtirXaCuRJdXLSdqnYtDgsw"),
            }, {
                args: {
                    bumpSeed: fanoutConfigBumpSeed,
                    nativeAccountBumpSeed: holdingAccountBumpSeed,
                    totalShares: opts.totalShares,
                    name: opts.name,
                    defaultWeight: opts.defaultWeight,
                },
                model: opts.membershipModel,
            }));
            return {
                output: {
                    fanout: fanoutConfig,
                    nativeAccount: holdingAccount,
                },
                instructions,
                signers,
            };
        });
    }
    initializeFanoutForMintInstructions(opts) {
        return __awaiter(this, void 0, void 0, function* () {
            const [fanoutMintConfig, fanoutConfigBumpSeed] = yield FanoutClient.fanoutForMintKey(opts.fanout, opts.mint);
            const instructions = [];
            const signers = [];
            let tokenAccountForMint = opts.mintTokenAccount ||
                (yield spl_token_1.Token.getAssociatedTokenAddress(spl_token_1.ASSOCIATED_TOKEN_PROGRAM_ID, spl_token_1.TOKEN_PROGRAM_ID, opts.mint, opts.fanout, true));
            if (!opts.mintTokenAccount) {
                instructions.push(spl_token_1.Token.createAssociatedTokenAccountInstruction(spl_token_1.ASSOCIATED_TOKEN_PROGRAM_ID, spl_token_1.TOKEN_PROGRAM_ID, opts.mint, tokenAccountForMint, opts.fanout, this.wallet.publicKey));
            }
            instructions.push((0, instructions_1.createProcessInitForMintInstruction)({
                authority,
                mintHoldingAccount: tokenAccountForMint,
                fanout: opts.fanout,
                mint: opts.mint,
                fanoutForMint: fanoutMintConfig,
                signer: this.wallet.publicKey,
            }, {
                bumpSeed: fanoutConfigBumpSeed,
            }));
            return {
                output: {
                    tokenAccount: tokenAccountForMint,
                    fanoutForMint: fanoutMintConfig,
                },
                instructions,
                signers,
            };
        });
    }
    addMemberWalletInstructions(opts) {
        return __awaiter(this, void 0, void 0, function* () {
            const [membershipAccount, voucherBumpSeed] = yield FanoutClient.membershipVoucher(opts.fanout, opts.membershipKey);
            const instructions = [];
            const signers = [];
            instructions.push((0, instructions_1.createProcessAddMemberWalletInstruction)({
                authority: this.wallet.publicKey,
                fanout: opts.fanout,
                membershipAccount,
                member: opts.membershipKey,
            }, {
                args: {
                    shares: opts.shares,
                },
            }));
            return {
                output: {
                    membershipAccount,
                },
                instructions,
                signers,
            };
        });
    }
    addMemberNftInstructions(opts) {
        return __awaiter(this, void 0, void 0, function* () {
            const [membershipAccount, _vb] = yield FanoutClient.membershipVoucher(opts.fanout, opts.membershipKey);
            const instructions = [];
            const signers = [];
            const [metadata, _md] = yield web3_js_1.PublicKey.findProgramAddress([Buffer.from(MPL_TM_PREFIX), MPL_TM_BUF, opts.membershipKey.toBuffer()], METADATA);
            instructions.push((0, instructions_1.createProcessAddMemberNftInstruction)({
                authority: this.wallet.publicKey,
                fanout: opts.fanout,
                membershipAccount,
                mint: opts.membershipKey,
                metadata,
            }, {
                args: {
                    shares: opts.shares,
                },
            }));
            return {
                output: {
                    membershipAccount,
                },
                instructions,
                signers,
            };
        });
    }
    unstakeTokenMemberInstructions(opts) {
        return __awaiter(this, void 0, void 0, function* () {
            const instructions = [];
            const signers = [];
            let mint = opts.membershipMint;
            if (!mint) {
                let data = yield this.fetch(opts.fanout, accounts_1.Fanout);
                mint = data.membershipMint;
            }
            const [voucher, _vbump] = yield FanoutClient.membershipVoucher(opts.fanout, opts.member);
            const stakeAccount = yield spl_token_1.Token.getAssociatedTokenAddress(spl_token_1.ASSOCIATED_TOKEN_PROGRAM_ID, spl_token_1.TOKEN_PROGRAM_ID, mint, voucher, true);
            const membershipMintTokenAccount = opts.membershipMintTokenAccount ||
                (yield spl_token_1.Token.getAssociatedTokenAddress(spl_token_1.ASSOCIATED_TOKEN_PROGRAM_ID, spl_token_1.TOKEN_PROGRAM_ID, mint, opts.member, true));
            instructions.push((0, instructions_1.createProcessUnstakeInstruction)({
                instructions: web3_js_1.SYSVAR_INSTRUCTIONS_PUBKEY,
                fanout: opts.fanout,
                member: opts.member,
                memberStakeAccount: stakeAccount,
                membershipVoucher: voucher,
                membershipMint: mint,
                membershipMintTokenAccount: membershipMintTokenAccount,
            }));
            return {
                output: {
                    membershipVoucher: voucher,
                    membershipMintTokenAccount,
                    stakeAccount,
                },
                instructions,
                signers,
            };
        });
    }
    stakeForTokenMemberInstructions(opts) {
        return __awaiter(this, void 0, void 0, function* () {
            const instructions = [];
            const signers = [];
            let mint = opts.membershipMint;
            let auth = opts.fanoutAuthority;
            if (!mint || !auth) {
                let data = yield this.fetch(opts.fanout, accounts_1.Fanout);
                mint = data.membershipMint;
                auth = data.authority;
            }
            const [voucher, _vbump] = yield FanoutClient.membershipVoucher(opts.fanout, opts.member);
            const stakeAccount = yield spl_token_1.Token.getAssociatedTokenAddress(spl_token_1.ASSOCIATED_TOKEN_PROGRAM_ID, spl_token_1.TOKEN_PROGRAM_ID, mint, voucher, true);
            const membershipMintTokenAccount = opts.membershipMintTokenAccount ||
                (yield spl_token_1.Token.getAssociatedTokenAddress(spl_token_1.ASSOCIATED_TOKEN_PROGRAM_ID, spl_token_1.TOKEN_PROGRAM_ID, mint, auth, true));
            try {
                yield this.connection.getTokenAccountBalance(stakeAccount);
            }
            catch (e) {
                instructions.push(yield spl_token_1.Token.createAssociatedTokenAccountInstruction(spl_token_1.ASSOCIATED_TOKEN_PROGRAM_ID, spl_token_1.TOKEN_PROGRAM_ID, mint, stakeAccount, voucher, opts.payer));
            }
            try {
                yield this.connection.getTokenAccountBalance(membershipMintTokenAccount);
            }
            catch (e) {
                throw new Error("Membership mint token account for authority must be initialized");
            }
            instructions.push((0, instructions_1.createProcessSetForTokenMemberStakeInstruction)({
                fanout: opts.fanout,
                authority: auth,
                member: opts.member,
                memberStakeAccount: stakeAccount,
                membershipVoucher: voucher,
                membershipMint: mint,
                membershipMintTokenAccount: membershipMintTokenAccount,
            }, {
                shares: opts.shares,
            }));
            return {
                output: {
                    membershipVoucher: voucher,
                    membershipMintTokenAccount,
                    stakeAccount,
                },
                instructions,
                signers,
            };
        });
    }
    stakeTokenMemberInstructions(opts) {
        return __awaiter(this, void 0, void 0, function* () {
            const instructions = [];
            const signers = [];
            let mint = opts.membershipMint;
            if (!mint) {
                let data = yield this.fetch(opts.fanout, accounts_1.Fanout);
                mint = data.membershipMint;
            }
            const [voucher, _vbump] = yield FanoutClient.membershipVoucher(opts.fanout, opts.member);
            const stakeAccount = yield spl_token_1.Token.getAssociatedTokenAddress(spl_token_1.ASSOCIATED_TOKEN_PROGRAM_ID, spl_token_1.TOKEN_PROGRAM_ID, mint, voucher, true);
            const membershipMintTokenAccount = opts.membershipMintTokenAccount ||
                (yield spl_token_1.Token.getAssociatedTokenAddress(spl_token_1.ASSOCIATED_TOKEN_PROGRAM_ID, spl_token_1.TOKEN_PROGRAM_ID, mint, opts.member, true));
            try {
                yield this.connection.getTokenAccountBalance(stakeAccount);
            }
            catch (e) {
                instructions.push(yield spl_token_1.Token.createAssociatedTokenAccountInstruction(spl_token_1.ASSOCIATED_TOKEN_PROGRAM_ID, spl_token_1.TOKEN_PROGRAM_ID, mint, stakeAccount, voucher, opts.payer));
            }
            try {
                yield this.connection.getTokenAccountBalance(membershipMintTokenAccount);
            }
            catch (e) {
                throw new Error("Membership mint token account for member must be initialized");
            }
            instructions.push((0, instructions_1.createProcessSetTokenMemberStakeInstruction)({
                fanout: opts.fanout,
                member: opts.member,
                memberStakeAccount: stakeAccount,
                membershipVoucher: voucher,
                membershipMint: mint,
                membershipMintTokenAccount: membershipMintTokenAccount,
            }, {
                shares: opts.shares,
            }));
            return {
                output: {
                    membershipVoucher: voucher,
                    membershipMintTokenAccount,
                    stakeAccount,
                },
                instructions,
                signers,
            };
        });
    }
    distributeTokenMemberInstructions(opts) {
        return __awaiter(this, void 0, void 0, function* () {
            const instructions = [];
            const signers = [];
            let fanoutMint = opts.fanoutMint || spl_token_1.NATIVE_MINT;
            let holdingAccount;
            let [fanoutForMint, fanoutForMintBump] = yield FanoutClient.fanoutForMintKey(opts.fanout, fanoutMint);
            let fanoutMintMemberTokenAccount = yield spl_token_1.Token.getAssociatedTokenAddress(spl_token_1.ASSOCIATED_TOKEN_PROGRAM_ID, spl_token_1.TOKEN_PROGRAM_ID, fanoutMint, opts.member, true);
            let [fanoutForMintMembershipVoucher, fanoutForMintMembershipVoucherBumpSeed,] = yield FanoutClient.mintMembershipVoucher(fanoutForMint, opts.member, fanoutMint);
            if (opts.distributeForMint) {
                holdingAccount = yield spl_token_1.Token.getAssociatedTokenAddress(spl_token_1.ASSOCIATED_TOKEN_PROGRAM_ID, spl_token_1.TOKEN_PROGRAM_ID, fanoutMint, opts.fanout, true);
                try {
                    yield this.connection.getTokenAccountBalance(fanoutMintMemberTokenAccount);
                }
                catch (e) {
                    instructions.push(spl_token_1.Token.createAssociatedTokenAccountInstruction(spl_token_1.ASSOCIATED_TOKEN_PROGRAM_ID, spl_token_1.TOKEN_PROGRAM_ID, fanoutMint, fanoutMintMemberTokenAccount, opts.member, opts.payer));
                }
            }
            else {
                const [nativeAccount, _nativeAccountBump] = yield FanoutClient.nativeAccount(opts.fanout);
                holdingAccount = nativeAccount;
            }
            const [membershipVoucher, membershipVoucherBump] = yield FanoutClient.membershipVoucher(opts.fanout, opts.member);
            const stakeAccount = yield spl_token_1.Token.getAssociatedTokenAddress(spl_token_1.ASSOCIATED_TOKEN_PROGRAM_ID, spl_token_1.TOKEN_PROGRAM_ID, opts.membershipMint, membershipVoucher, true);
            const membershipMintTokenAccount = opts.membershipMintTokenAccount ||
                (yield spl_token_1.Token.getAssociatedTokenAddress(spl_token_1.ASSOCIATED_TOKEN_PROGRAM_ID, spl_token_1.TOKEN_PROGRAM_ID, opts.membershipMint, opts.member, true));
            try {
                yield this.connection.getTokenAccountBalance(stakeAccount);
            }
            catch (e) {
                instructions.push(yield spl_token_1.Token.createAssociatedTokenAccountInstruction(spl_token_1.ASSOCIATED_TOKEN_PROGRAM_ID, spl_token_1.TOKEN_PROGRAM_ID, opts.membershipMint, stakeAccount, membershipVoucher, opts.payer));
            }
            instructions.push((0, instructions_1.createProcessDistributeTokenInstruction)({
                memberStakeAccount: stakeAccount,
                membershipMint: opts.membershipMint,
                fanoutForMint: fanoutForMint,
                fanoutMint: fanoutMint,
                membershipVoucher: membershipVoucher,
                fanoutForMintMembershipVoucher,
                holdingAccount,
                fanoutMintMemberTokenAccount,
                payer: opts.payer,
                member: opts.member,
                fanout: opts.fanout,
            }, {
                distributeForMint: opts.distributeForMint,
            }));
            return {
                output: {
                    membershipVoucher,
                    fanoutForMintMembershipVoucher,
                    holdingAccount,
                },
                instructions,
                signers,
            };
        });
    }
    distributeNftMemberInstructions(opts) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!opts.membershipKey) {
                throw new Error("No membership key");
            }
            const instructions = [];
            const signers = [];
            let fanoutMint = opts.fanoutMint || spl_token_1.NATIVE_MINT;
            let holdingAccount;
            let [fanoutForMint, fanoutForMintBump] = yield FanoutClient.fanoutForMintKey(opts.fanout, fanoutMint);
            console.log('fanoutForMint', fanoutForMint.toBase58());
            let [fanoutForMintMembershipVoucher, fanoutForMintMembershipVoucherBumpSeed,] = yield FanoutClient.mintMembershipVoucher(fanoutForMint, opts.membershipKey, fanoutMint);
            if (!opts.distributeForMint) {
                // @ts-ignore
                fanoutForMintMembershipVoucher = null;
            }
            let fanoutMintMemberTokenAccount = yield spl_token_1.Token.getAssociatedTokenAddress(spl_token_1.ASSOCIATED_TOKEN_PROGRAM_ID, spl_token_1.TOKEN_PROGRAM_ID, fanoutMint, opts.member, true);
            if (opts.distributeForMint) {
                holdingAccount = yield spl_token_1.Token.getAssociatedTokenAddress(spl_token_1.ASSOCIATED_TOKEN_PROGRAM_ID, spl_token_1.TOKEN_PROGRAM_ID, fanoutMint, opts.fanout, true);
                try {
                    yield this.connection.getTokenAccountBalance(fanoutMintMemberTokenAccount);
                }
                catch (e) {
                    instructions.push(spl_token_1.Token.createAssociatedTokenAccountInstruction(spl_token_1.ASSOCIATED_TOKEN_PROGRAM_ID, spl_token_1.TOKEN_PROGRAM_ID, fanoutMint, fanoutMintMemberTokenAccount, opts.member, opts.payer));
                }
            }
            else {
                const [nativeAccount, _nativeAccountBump] = yield FanoutClient.nativeAccount(opts.fanout);
                holdingAccount = nativeAccount;
            }
            const membershipKeyTokenAccount = yield spl_token_1.Token.getAssociatedTokenAddress(spl_token_1.ASSOCIATED_TOKEN_PROGRAM_ID, spl_token_1.TOKEN_PROGRAM_ID, opts.membershipKey, opts.member, true);
            const [membershipVoucher, membershipVoucherBump] = yield FanoutClient.membershipVoucher(opts.fanout, opts.membershipKey);
            instructions.push((0, instructions_1.createProcessDistributeNftInstruction)({
                fanoutForMint: fanoutForMint,
                fanoutMint: fanoutMint,
                membershipKey: opts.membershipKey,
                membershipVoucher: membershipVoucher,
                fanoutForMintMembershipVoucher,
                holdingAccount,
                membershipMintTokenAccount: membershipKeyTokenAccount,
                fanoutMintMemberTokenAccount,
                payer: opts.payer,
                member: opts.member,
                fanout: opts.fanout,
                authority,
                collection,
                metadata: opts.metadata
            }, {
                distributeForMint: opts.distributeForMint,
            }));
            return {
                output: {
                    membershipVoucher,
                    fanoutForMintMembershipVoucher,
                    holdingAccount,
                },
                instructions,
                signers,
            };
        });
    }
    distributeWalletMemberInstructions(opts) {
        return __awaiter(this, void 0, void 0, function* () {
            const instructions = [];
            const signers = [];
            let fanoutMint = opts.fanoutMint || spl_token_1.NATIVE_MINT;
            let holdingAccount;
            let [fanoutForMint, fanoutForMintBump] = yield FanoutClient.fanoutForMintKey(opts.fanout, fanoutMint);
            let [fanoutForMintMembershipVoucher, fanoutForMintMembershipVoucherBumpSeed,] = yield FanoutClient.mintMembershipVoucher(fanoutForMint, opts.member, fanoutMint);
            let fanoutMintMemberTokenAccount = yield spl_token_1.Token.getAssociatedTokenAddress(spl_token_1.ASSOCIATED_TOKEN_PROGRAM_ID, spl_token_1.TOKEN_PROGRAM_ID, fanoutMint, opts.member, true);
            if (opts.distributeForMint) {
                holdingAccount = yield spl_token_1.Token.getAssociatedTokenAddress(spl_token_1.ASSOCIATED_TOKEN_PROGRAM_ID, spl_token_1.TOKEN_PROGRAM_ID, fanoutMint, opts.fanout, true);
                try {
                    yield this.connection.getTokenAccountBalance(fanoutMintMemberTokenAccount);
                }
                catch (e) {
                    instructions.push(spl_token_1.Token.createAssociatedTokenAccountInstruction(spl_token_1.ASSOCIATED_TOKEN_PROGRAM_ID, spl_token_1.TOKEN_PROGRAM_ID, fanoutMint, fanoutMintMemberTokenAccount, opts.member, opts.payer));
                }
            }
            else {
                const [nativeAccount, _nativeAccountBump] = yield FanoutClient.nativeAccount(opts.fanout);
                holdingAccount = nativeAccount;
            }
            const [membershipVoucher, membershipVoucherBump] = yield FanoutClient.membershipVoucher(opts.fanout, opts.member);
            instructions.push((0, instructions_1.createProcessDistributeWalletInstruction)({
                fanoutForMint: fanoutForMint,
                fanoutMint: fanoutMint,
                membershipVoucher: membershipVoucher,
                fanoutForMintMembershipVoucher,
                holdingAccount,
                fanoutMintMemberTokenAccount,
                payer: opts.payer,
                member: opts.member,
                fanout: opts.fanout,
            }, {
                distributeForMint: opts.distributeForMint,
            }));
            return {
                output: {
                    membershipVoucher,
                    fanoutForMintMembershipVoucher,
                    holdingAccount,
                },
                instructions,
                signers,
            };
        });
    }
    transferSharesInstructions(opts) {
        return __awaiter(this, void 0, void 0, function* () {
            const instructions = [];
            const signers = [];
            let [fromMembershipAccount, f_mvb] = yield FanoutClient.membershipVoucher(opts.fanout, opts.fromMember);
            let [toMembershipAccount, tmvb] = yield FanoutClient.membershipVoucher(opts.fanout, opts.toMember);
            instructions.push((0, instructions_1.createProcessTransferSharesInstruction)({
                fromMember: opts.fromMember,
                toMember: opts.toMember,
                authority: this.wallet.publicKey,
                fanout: opts.fanout,
                fromMembershipAccount,
                toMembershipAccount,
            }, {
                shares: opts.shares,
            }));
            return {
                output: {},
                instructions,
                signers,
            };
        });
    }
    initializeFanout(opts) {
        return __awaiter(this, void 0, void 0, function* () {
            const { instructions, signers, output } = yield this.initializeFanoutInstructions(opts);
            console.log(instructions);
            console.log(signers);
            console.log(output);
            yield this.throwingSend(instructions, signers, this.wallet.publicKey);
            return output;
        });
    }
    initializeFanoutForMint(opts) {
        return __awaiter(this, void 0, void 0, function* () {
            const { instructions, signers, output } = yield this.initializeFanoutForMintInstructions(opts);
            yield this.throwingSend(instructions, signers, this.wallet.publicKey);
            return output;
        });
    }
    addMemberNft(opts) {
        return __awaiter(this, void 0, void 0, function* () {
            const { instructions, signers, output } = yield this.addMemberNftInstructions(opts);
            yield this.throwingSend(instructions, signers, this.wallet.publicKey);
            return output;
        });
    }
    addMemberWallet(opts) {
        return __awaiter(this, void 0, void 0, function* () {
            const { instructions, signers, output } = yield this.addMemberWalletInstructions(opts);
            yield this.throwingSend(instructions, signers, this.wallet.publicKey);
            return output;
        });
    }
    stakeTokenMember(opts) {
        return __awaiter(this, void 0, void 0, function* () {
            const { instructions, signers, output } = yield this.stakeTokenMemberInstructions(opts);
            yield this.throwingSend(instructions, signers, this.wallet.publicKey);
            return output;
        });
    }
    stakeForTokenMember(opts) {
        return __awaiter(this, void 0, void 0, function* () {
            const { instructions, signers, output } = yield this.stakeForTokenMemberInstructions(opts);
            yield this.throwingSend(instructions, signers, this.wallet.publicKey);
            return output;
        });
    }
    transferShares(opts) {
        return __awaiter(this, void 0, void 0, function* () {
            let data = yield this.fetch(opts.fanout, accounts_1.Fanout);
            const { instructions: transfer_ix, signers: transfer_signers, output, } = yield this.transferSharesInstructions(opts);
            if (data.membershipModel != types_1.MembershipModel.Wallet &&
                data.membershipModel != types_1.MembershipModel.NFT) {
                throw Error("Transfer is only supported in NFT and Wallet fanouts");
            }
            yield this.throwingSend([...transfer_ix], [...transfer_signers], this.wallet.publicKey);
            return output;
        });
    }
    unstakeTokenMember(opts) {
        return __awaiter(this, void 0, void 0, function* () {
            let { fanout, member, membershipMint, payer } = opts;
            if (!membershipMint) {
                let data = yield this.fetch(opts.fanout, accounts_1.Fanout);
                membershipMint = data.membershipMint;
            }
            const { instructions: unstake_ix, signers: unstake_signers, output, } = yield this.unstakeTokenMemberInstructions(opts);
            const { instructions: dist_ix, signers: dist_signers } = yield this.distributeTokenMemberInstructions({
                distributeForMint: false,
                fanout,
                member,
                membershipMint,
                payer,
            });
            yield this.throwingSend([...dist_ix, ...unstake_ix], [...unstake_signers, ...dist_signers], this.wallet.publicKey);
            return output;
        });
    }
    distributeNft(opts) {
        return __awaiter(this, void 0, void 0, function* () {
            const { instructions, signers, output } = yield this.distributeNftMemberInstructions(opts);
            yield this.throwingSend(instructions, signers, this.wallet.publicKey);
            return output;
        });
    }
    distributeWallet(opts) {
        return __awaiter(this, void 0, void 0, function* () {
            const { instructions, signers, output } = yield this.distributeWalletMemberInstructions(opts);
            yield this.throwingSend(instructions, signers, this.wallet.publicKey);
            return output;
        });
    }
    distributeToken(opts) {
        return __awaiter(this, void 0, void 0, function* () {
            const { instructions, signers, output } = yield this.distributeTokenMemberInstructions(opts);
            yield this.throwingSend(instructions, signers, this.wallet.publicKey);
            return output;
        });
    }
}
exports.FanoutClient = FanoutClient;
FanoutClient.ID = new web3_js_1.PublicKey("FXZzBYS58sVq9KBnVWjduZVpYtwpRAViMdtE8HvwBqR1");
//# sourceMappingURL=index.js.map