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
exports.fanoutBeet = exports.Fanout = exports.fanoutDiscriminator = void 0;
const web3 = __importStar(require("@solana/web3.js"));
const beet = __importStar(require("@metaplex-foundation/beet"));
const beetSolana = __importStar(require("@metaplex-foundation/beet-solana"));
const MembershipModel_1 = require("../types/MembershipModel");
exports.fanoutDiscriminator = [164, 101, 210, 92, 222, 14, 75, 156];
/**
 * Holds the data for the {@link Fanout} Account and provides de/serialization
 * functionality for that data
 *
 * @category Accounts
 * @category generated
 */
class Fanout {
    constructor(authority, name, accountKey, totalShares, totalMembers, totalInflow, lastSnapshotAmount, bumpSeed, accountOwnerBumpSeed, totalAvailableShares, membershipModel, membershipMint, totalStakedShares, switchboardFunction, collectionMint, defaultWeight) {
        this.authority = authority;
        this.name = name;
        this.accountKey = accountKey;
        this.totalShares = totalShares;
        this.totalMembers = totalMembers;
        this.totalInflow = totalInflow;
        this.lastSnapshotAmount = lastSnapshotAmount;
        this.bumpSeed = bumpSeed;
        this.accountOwnerBumpSeed = accountOwnerBumpSeed;
        this.totalAvailableShares = totalAvailableShares;
        this.membershipModel = membershipModel;
        this.membershipMint = membershipMint;
        this.totalStakedShares = totalStakedShares;
        this.switchboardFunction = switchboardFunction;
        this.collectionMint = collectionMint;
        this.defaultWeight = defaultWeight;
    }
    /**
     * Creates a {@link Fanout} instance from the provided args.
     */
    static fromArgs(args) {
        return new Fanout(args.authority, args.name, args.accountKey, args.totalShares, args.totalMembers, args.totalInflow, args.lastSnapshotAmount, args.bumpSeed, args.accountOwnerBumpSeed, args.totalAvailableShares, args.membershipModel, args.membershipMint, args.totalStakedShares, args.switchboardFunction, args.collectionMint, args.defaultWeight);
    }
    /**
     * Deserializes the {@link Fanout} from the data of the provided {@link web3.AccountInfo}.
     * @returns a tuple of the account data and the offset up to which the buffer was read to obtain it.
     */
    static fromAccountInfo(accountInfo, offset = 0) {
        return Fanout.deserialize(accountInfo.data, offset);
    }
    /**
     * Retrieves the account info from the provided address and deserializes
     * the {@link Fanout} from its data.
     *
     * @throws Error if no account info is found at the address or if deserialization fails
     */
    static fromAccountAddress(connection, address, commitmentOrConfig) {
        return __awaiter(this, void 0, void 0, function* () {
            const accountInfo = yield connection.getAccountInfo(address, commitmentOrConfig);
            if (accountInfo == null) {
                throw new Error(`Unable to find Fanout account at ${address}`);
            }
            return Fanout.fromAccountInfo(accountInfo, 0)[0];
        });
    }
    /**
     * Provides a {@link web3.Connection.getProgramAccounts} config builder,
     * to fetch accounts matching filters that can be specified via that builder.
     *
     * @param programId - the program that owns the accounts we are filtering
     */
    static gpaBuilder(programId = new web3.PublicKey('ANSsi8dnmwyjQaGNC4PhRMU8WfBgKcvKzC9bPMBiJAPf')) {
        return beetSolana.GpaBuilder.fromStruct(programId, exports.fanoutBeet);
    }
    /**
     * Deserializes the {@link Fanout} from the provided data Buffer.
     * @returns a tuple of the account data and the offset up to which the buffer was read to obtain it.
     */
    static deserialize(buf, offset = 0) {
        return exports.fanoutBeet.deserialize(buf, offset);
    }
    /**
     * Serializes the {@link Fanout} into a Buffer.
     * @returns a tuple of the created Buffer and the offset up to which the buffer was written to store it.
     */
    serialize() {
        return exports.fanoutBeet.serialize(Object.assign({ accountDiscriminator: exports.fanoutDiscriminator }, this));
    }
    /**
     * Returns the byteSize of a {@link Buffer} holding the serialized data of
     * {@link Fanout} for the provided args.
     *
     * @param args need to be provided since the byte size for this account
     * depends on them
     */
    static byteSize(args) {
        const instance = Fanout.fromArgs(args);
        return exports.fanoutBeet.toFixedFromValue(Object.assign({ accountDiscriminator: exports.fanoutDiscriminator }, instance)).byteSize;
    }
    /**
     * Fetches the minimum balance needed to exempt an account holding
     * {@link Fanout} data from rent
     *
     * @param args need to be provided since the byte size for this account
     * depends on them
     * @param connection used to retrieve the rent exemption information
     */
    static getMinimumBalanceForRentExemption(args, connection, commitment) {
        return __awaiter(this, void 0, void 0, function* () {
            return connection.getMinimumBalanceForRentExemption(Fanout.byteSize(args), commitment);
        });
    }
    /**
     * Returns a readable version of {@link Fanout} properties
     * and can be used to convert to JSON and/or logging
     */
    pretty() {
        return {
            authority: this.authority.toBase58(),
            name: this.name,
            accountKey: this.accountKey.toBase58(),
            totalShares: (() => {
                const x = this.totalShares;
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
            totalMembers: (() => {
                const x = this.totalMembers;
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
            lastSnapshotAmount: (() => {
                const x = this.lastSnapshotAmount;
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
            accountOwnerBumpSeed: this.accountOwnerBumpSeed,
            totalAvailableShares: (() => {
                const x = this.totalAvailableShares;
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
            membershipModel: 'MembershipModel.' + MembershipModel_1.MembershipModel[this.membershipModel],
            membershipMint: this.membershipMint,
            totalStakedShares: this.totalStakedShares,
            switchboardFunction: this.switchboardFunction.toBase58(),
            collectionMint: this.collectionMint.toBase58(),
            defaultWeight: (() => {
                const x = this.defaultWeight;
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
exports.Fanout = Fanout;
/**
 * @category Accounts
 * @category generated
 */
exports.fanoutBeet = new beet.FixableBeetStruct([
    ['accountDiscriminator', beet.uniformFixedSizeArray(beet.u8, 8)],
    ['authority', beetSolana.publicKey],
    ['name', beet.utf8String],
    ['accountKey', beetSolana.publicKey],
    ['totalShares', beet.u64],
    ['totalMembers', beet.u64],
    ['totalInflow', beet.u64],
    ['lastSnapshotAmount', beet.u64],
    ['bumpSeed', beet.u8],
    ['accountOwnerBumpSeed', beet.u8],
    ['totalAvailableShares', beet.u64],
    ['membershipModel', MembershipModel_1.membershipModelBeet],
    ['membershipMint', beet.coption(beetSolana.publicKey)],
    ['totalStakedShares', beet.coption(beet.u64)],
    ['switchboardFunction', beetSolana.publicKey],
    ['collectionMint', beetSolana.publicKey],
    ['defaultWeight', beet.u64],
], Fanout.fromArgs, 'Fanout');
//# sourceMappingURL=Fanout.js.map