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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fanoutMembershipVoucherBeet = exports.FanoutMembershipVoucher = exports.fanoutMembershipVoucherDiscriminator = void 0;
const web3 = __importStar(require("@solana/web3.js"));
const beet = __importStar(require("@metaplex-foundation/beet"));
const beetSolana = __importStar(require("@metaplex-foundation/beet-solana"));
exports.fanoutMembershipVoucherDiscriminator = [
    185, 62, 74, 60, 105, 158, 178, 125,
];
/**
 * Holds the data for the {@link FanoutMembershipVoucher} Account and provides de/serialization
 * functionality for that data
 *
 * @category Accounts
 * @category generated
 */
class FanoutMembershipVoucher {
    constructor(fanout, totalInflow, lastInflow, bumpSeed, membershipKey, shares, stakeTime) {
        this.fanout = fanout;
        this.totalInflow = totalInflow;
        this.lastInflow = lastInflow;
        this.bumpSeed = bumpSeed;
        this.membershipKey = membershipKey;
        this.shares = shares;
        this.stakeTime = stakeTime;
    }
    /**
     * Creates a {@link FanoutMembershipVoucher} instance from the provided args.
     */
    static fromArgs(args) {
        return new FanoutMembershipVoucher(args.fanout, args.totalInflow, args.lastInflow, args.bumpSeed, args.membershipKey, args.shares, args.stakeTime);
    }
    /**
     * Deserializes the {@link FanoutMembershipVoucher} from the data of the provided {@link web3.AccountInfo}.
     * @returns a tuple of the account data and the offset up to which the buffer was read to obtain it.
     */
    static fromAccountInfo(accountInfo, offset = 0) {
        return FanoutMembershipVoucher.deserialize(accountInfo.data, offset);
    }
    /**
     * Retrieves the account info from the provided address and deserializes
     * the {@link FanoutMembershipVoucher} from its data.
     *
     * @throws Error if no account info is found at the address or if deserialization fails
     */
    static fromAccountAddress(connection, address, commitmentOrConfig) {
        return __awaiter(this, void 0, void 0, function* () {
            const accountInfo = yield connection.getAccountInfo(address, commitmentOrConfig);
            if (accountInfo == null) {
                throw new Error(`Unable to find FanoutMembershipVoucher account at ${address}`);
            }
            return FanoutMembershipVoucher.fromAccountInfo(accountInfo, 0)[0];
        });
    }
    /**
     * Provides a {@link web3.Connection.getProgramAccounts} config builder,
     * to fetch accounts matching filters that can be specified via that builder.
     *
     * @param programId - the program that owns the accounts we are filtering
     */
    static gpaBuilder(programId = new web3.PublicKey('FXZzBYS58sVq9KBnVWjduZVpYtwpRAViMdtE8HvwBqR1')) {
        return beetSolana.GpaBuilder.fromStruct(programId, exports.fanoutMembershipVoucherBeet);
    }
    /**
     * Deserializes the {@link FanoutMembershipVoucher} from the provided data Buffer.
     * @returns a tuple of the account data and the offset up to which the buffer was read to obtain it.
     */
    static deserialize(buf, offset = 0) {
        return exports.fanoutMembershipVoucherBeet.deserialize(buf, offset);
    }
    /**
     * Serializes the {@link FanoutMembershipVoucher} into a Buffer.
     * @returns a tuple of the created Buffer and the offset up to which the buffer was written to store it.
     */
    serialize() {
        return exports.fanoutMembershipVoucherBeet.serialize(Object.assign({ accountDiscriminator: exports.fanoutMembershipVoucherDiscriminator }, this));
    }
    /**
     * Returns the byteSize of a {@link Buffer} holding the serialized data of
     * {@link FanoutMembershipVoucher}
     */
    static get byteSize() {
        return exports.fanoutMembershipVoucherBeet.byteSize;
    }
    /**
     * Fetches the minimum balance needed to exempt an account holding
     * {@link FanoutMembershipVoucher} data from rent
     *
     * @param connection used to retrieve the rent exemption information
     */
    static getMinimumBalanceForRentExemption(connection, commitment) {
        return __awaiter(this, void 0, void 0, function* () {
            return connection.getMinimumBalanceForRentExemption(FanoutMembershipVoucher.byteSize, commitment);
        });
    }
    /**
     * Determines if the provided {@link Buffer} has the correct byte size to
     * hold {@link FanoutMembershipVoucher} data.
     */
    static hasCorrectByteSize(buf, offset = 0) {
        return buf.byteLength - offset === FanoutMembershipVoucher.byteSize;
    }
    /**
     * Returns a readable version of {@link FanoutMembershipVoucher} properties
     * and can be used to convert to JSON and/or logging
     */
    pretty() {
        return {
            fanout: this.fanout.toBase58(),
            totalInflow: (() => {
                const x = this.totalInflow;
                if (typeof x.toNumber === 'function') {
                    try {
                        return x.toNumber();
                    }
                    catch (_) {
                        return x;
                    }
                }
                return x;
            })(),
            lastInflow: (() => {
                const x = this.lastInflow;
                if (typeof x.toNumber === 'function') {
                    try {
                        return x.toNumber();
                    }
                    catch (_) {
                        return x;
                    }
                }
                return x;
            })(),
            bumpSeed: this.bumpSeed,
            membershipKey: this.membershipKey.toBase58(),
            shares: (() => {
                const x = this.shares;
                if (typeof x.toNumber === 'function') {
                    try {
                        return x.toNumber();
                    }
                    catch (_) {
                        return x;
                    }
                }
                return x;
            })(),
            stakeTime: (() => {
                const x = this.stakeTime;
                if (typeof x.toNumber === 'function') {
                    try {
                        return x.toNumber();
                    }
                    catch (_) {
                        return x;
                    }
                }
                return x;
            })(),
        };
    }
}
exports.FanoutMembershipVoucher = FanoutMembershipVoucher;
/**
 * @category Accounts
 * @category generated
 */
exports.fanoutMembershipVoucherBeet = new beet.BeetStruct([
    ['accountDiscriminator', beet.uniformFixedSizeArray(beet.u8, 8)],
    ['fanout', beetSolana.publicKey],
    ['totalInflow', beet.u64],
    ['lastInflow', beet.u64],
    ['bumpSeed', beet.u8],
    ['membershipKey', beetSolana.publicKey],
    ['shares', beet.u64],
    ['stakeTime', beet.i64],
], FanoutMembershipVoucher.fromArgs, 'FanoutMembershipVoucher');
//# sourceMappingURL=FanoutMembershipVoucher.js.map