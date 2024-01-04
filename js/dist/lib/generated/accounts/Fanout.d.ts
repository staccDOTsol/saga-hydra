/**
 * This code was GENERATED using the solita package.
 * Please DO NOT EDIT THIS FILE, instead rerun solita to update it or write a wrapper to add functionality.
 *
 * See: https://github.com/metaplex-foundation/solita
 */
/// <reference types="node" />
import * as web3 from '@solana/web3.js';
import * as beet from '@metaplex-foundation/beet';
import * as beetSolana from '@metaplex-foundation/beet-solana';
import { MembershipModel } from '../types/MembershipModel';
/**
 * Arguments used to create {@link Fanout}
 * @category Accounts
 * @category generated
 */
export type FanoutArgs = {
    authority: web3.PublicKey;
    name: string;
    accountKey: web3.PublicKey;
    totalShares: beet.bignum;
    totalMembers: beet.bignum;
    totalInflow: beet.bignum;
    lastSnapshotAmount: beet.bignum;
    bumpSeed: number;
    accountOwnerBumpSeed: number;
    totalAvailableShares: beet.bignum;
    membershipModel: MembershipModel;
    membershipMint: beet.COption<web3.PublicKey>;
    totalStakedShares: beet.COption<beet.bignum>;
    switchboardFunction: web3.PublicKey;
    collectionMint: web3.PublicKey;
    defaultWeight: beet.bignum;
};
export declare const fanoutDiscriminator: number[];
/**
 * Holds the data for the {@link Fanout} Account and provides de/serialization
 * functionality for that data
 *
 * @category Accounts
 * @category generated
 */
export declare class Fanout implements FanoutArgs {
    readonly authority: web3.PublicKey;
    readonly name: string;
    readonly accountKey: web3.PublicKey;
    readonly totalShares: beet.bignum;
    readonly totalMembers: beet.bignum;
    readonly totalInflow: beet.bignum;
    readonly lastSnapshotAmount: beet.bignum;
    readonly bumpSeed: number;
    readonly accountOwnerBumpSeed: number;
    readonly totalAvailableShares: beet.bignum;
    readonly membershipModel: MembershipModel;
    readonly membershipMint: beet.COption<web3.PublicKey>;
    readonly totalStakedShares: beet.COption<beet.bignum>;
    readonly switchboardFunction: web3.PublicKey;
    readonly collectionMint: web3.PublicKey;
    readonly defaultWeight: beet.bignum;
    private constructor();
    /**
     * Creates a {@link Fanout} instance from the provided args.
     */
    static fromArgs(args: FanoutArgs): Fanout;
    /**
     * Deserializes the {@link Fanout} from the data of the provided {@link web3.AccountInfo}.
     * @returns a tuple of the account data and the offset up to which the buffer was read to obtain it.
     */
    static fromAccountInfo(accountInfo: web3.AccountInfo<Buffer>, offset?: number): [Fanout, number];
    /**
     * Retrieves the account info from the provided address and deserializes
     * the {@link Fanout} from its data.
     *
     * @throws Error if no account info is found at the address or if deserialization fails
     */
    static fromAccountAddress(connection: web3.Connection, address: web3.PublicKey, commitmentOrConfig?: web3.Commitment | web3.GetAccountInfoConfig): Promise<Fanout>;
    /**
     * Provides a {@link web3.Connection.getProgramAccounts} config builder,
     * to fetch accounts matching filters that can be specified via that builder.
     *
     * @param programId - the program that owns the accounts we are filtering
     */
    static gpaBuilder(programId?: web3.PublicKey): beetSolana.GpaBuilder<FanoutArgs & {
        accountDiscriminator: number[];
    }>;
    /**
     * Deserializes the {@link Fanout} from the provided data Buffer.
     * @returns a tuple of the account data and the offset up to which the buffer was read to obtain it.
     */
    static deserialize(buf: Buffer, offset?: number): [Fanout, number];
    /**
     * Serializes the {@link Fanout} into a Buffer.
     * @returns a tuple of the created Buffer and the offset up to which the buffer was written to store it.
     */
    serialize(): [Buffer, number];
    /**
     * Returns the byteSize of a {@link Buffer} holding the serialized data of
     * {@link Fanout} for the provided args.
     *
     * @param args need to be provided since the byte size for this account
     * depends on them
     */
    static byteSize(args: FanoutArgs): number;
    /**
     * Fetches the minimum balance needed to exempt an account holding
     * {@link Fanout} data from rent
     *
     * @param args need to be provided since the byte size for this account
     * depends on them
     * @param connection used to retrieve the rent exemption information
     */
    static getMinimumBalanceForRentExemption(args: FanoutArgs, connection: web3.Connection, commitment?: web3.Commitment): Promise<number>;
    /**
     * Returns a readable version of {@link Fanout} properties
     * and can be used to convert to JSON and/or logging
     */
    pretty(): {
        authority: string;
        name: string;
        accountKey: string;
        totalShares: number | {
            toNumber: () => number;
        };
        totalMembers: number | {
            toNumber: () => number;
        };
        totalInflow: number | {
            toNumber: () => number;
        };
        lastSnapshotAmount: number | {
            toNumber: () => number;
        };
        bumpSeed: number;
        accountOwnerBumpSeed: number;
        totalAvailableShares: number | {
            toNumber: () => number;
        };
        membershipModel: string;
        membershipMint: beet.COption<web3.PublicKey>;
        totalStakedShares: beet.COption<beet.bignum>;
        switchboardFunction: string;
        collectionMint: string;
        defaultWeight: number | {
            toNumber: () => number;
        };
    };
}
/**
 * @category Accounts
 * @category generated
 */
export declare const fanoutBeet: beet.FixableBeetStruct<Fanout, FanoutArgs & {
    accountDiscriminator: number[];
}>;
//# sourceMappingURL=Fanout.d.ts.map