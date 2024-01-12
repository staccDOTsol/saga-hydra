/// <reference types="node" />
import { AnchorProvider } from "@coral-xyz/anchor";
import { AccountInfo, Connection, Finality, PublicKey, RpcResponseAndContext, SignatureResult, Signer, Transaction, TransactionInstruction, TransactionSignature } from "@solana/web3.js";
import { MembershipModel } from "./generated/types";
export * from "./generated/types";
export * from "./generated/accounts";
export * from "./generated/errors";
interface InitializeFanoutArgs {
    name: string;
    membershipModel: MembershipModel;
    totalShares: number;
    defaultWeight: number;
    collectionMetadata: PublicKey;
    mint?: PublicKey;
}
interface InitializeFanoutForMintArgs {
    fanout: PublicKey;
    mint: PublicKey;
    mintTokenAccount?: PublicKey;
}
interface AddMemberArgs {
    shares: number;
    fanout: PublicKey;
    fanoutNativeAccount?: PublicKey;
    membershipKey: PublicKey;
}
interface StakeMemberArgs {
    shares: number;
    fanout: PublicKey;
    fanoutAuthority?: PublicKey;
    membershipMint?: PublicKey;
    membershipMintTokenAccount?: PublicKey;
    fanoutNativeAccount?: PublicKey;
    member: PublicKey;
    payer: PublicKey;
}
interface UnstakeMemberArgs {
    fanout: PublicKey;
    membershipMint?: PublicKey;
    membershipMintTokenAccount?: PublicKey;
    fanoutNativeAccount?: PublicKey;
    member: PublicKey;
    payer: PublicKey;
}
interface DistributeMemberArgs {
    distributeForMint: boolean;
    member: PublicKey;
    membershipKey?: PublicKey;
    fanout: PublicKey;
    fanoutMint?: PublicKey;
    metadata: PublicKey;
    payer: PublicKey;
}
interface DistributeTokenMemberArgs {
    distributeForMint: boolean;
    member: PublicKey;
    membershipMint: PublicKey;
    fanout: PublicKey;
    fanoutMint?: PublicKey;
    membershipMintTokenAccount?: PublicKey;
    payer: PublicKey;
}
interface TransferSharesArgs {
    fanout: PublicKey;
    fromMember: PublicKey;
    toMember: PublicKey;
    shares: number;
}
export interface TransactionResult {
    RpcResponseAndContext: RpcResponseAndContext<SignatureResult>;
    TransactionSignature: TransactionSignature;
}
export interface Wallet {
    signTransaction(tx: Transaction): Promise<Transaction>;
    signAllTransactions(txs: Transaction[]): Promise<Transaction[]>;
    publicKey: PublicKey;
}
export declare class FanoutClient {
    connection: Connection;
    wallet: any;
    provider: AnchorProvider;
    static ID: PublicKey;
    static init(connection: Connection, wallet: any): Promise<FanoutClient>;
    constructor(connection: Connection, wallet: any);
    fetch<T>(key: PublicKey, type: any): Promise<T>;
    getAccountInfo(key: PublicKey): Promise<AccountInfo<Buffer>>;
    getMembers({ fanout }: {
        fanout: PublicKey;
    }): Promise<PublicKey[]>;
    executeBig<Output>(command: Promise<any>, payer?: PublicKey, finality?: Finality): Promise<Output>;
    sendInstructions(instructions: TransactionInstruction[], signers: Signer[], payer?: PublicKey): Promise<TransactionResult>;
    private throwingSend;
    static fanoutKey(name: String, programId?: PublicKey): Promise<[PublicKey, number]>;
    static fanoutForMintKey(fanout: PublicKey, mint: PublicKey, programId?: PublicKey): Promise<[PublicKey, number]>;
    static membershipVoucher(fanout: PublicKey, membershipKey: PublicKey, programId?: PublicKey): Promise<[PublicKey, number]>;
    static mintMembershipVoucher(fanoutForMintConfig: PublicKey, membershipKey: PublicKey, fanoutMint: PublicKey, programId?: PublicKey): Promise<[PublicKey, number]>;
    static freezeAuthority(mint: PublicKey, programId?: PublicKey): Promise<[PublicKey, number]>;
    static nativeAccount(fanoutAccountKey: PublicKey, programId?: PublicKey): Promise<[PublicKey, number]>;
    initializeFanoutInstructions(opts: InitializeFanoutArgs): Promise<any>;
    initializeFanoutForMintInstructions(opts: InitializeFanoutForMintArgs): Promise<any>;
    addMemberWalletInstructions(opts: AddMemberArgs): Promise<any>;
    addMemberNftInstructions(opts: AddMemberArgs): Promise<any>;
    unstakeTokenMemberInstructions(opts: UnstakeMemberArgs): Promise<any>;
    stakeForTokenMemberInstructions(opts: StakeMemberArgs): Promise<any>;
    stakeTokenMemberInstructions(opts: StakeMemberArgs): Promise<any>;
    distributeTokenMemberInstructions(opts: DistributeTokenMemberArgs): Promise<any>;
    distributeNftMemberInstructions(opts: DistributeMemberArgs): Promise<any>;
    distributeWalletMemberInstructions(opts: DistributeMemberArgs): Promise<any>;
    transferSharesInstructions(opts: TransferSharesArgs): Promise<any>;
    initializeFanout(opts: InitializeFanoutArgs): Promise<{
        fanout: PublicKey;
        nativeAccount: PublicKey;
    }>;
    initializeFanoutForMint(opts: InitializeFanoutForMintArgs): Promise<{
        fanoutForMint: PublicKey;
        tokenAccount: PublicKey;
    }>;
    addMemberNft(opts: AddMemberArgs): Promise<{
        membershipAccount: PublicKey;
    }>;
    addMemberWallet(opts: AddMemberArgs): Promise<{
        membershipAccount: PublicKey;
    }>;
    stakeTokenMember(opts: StakeMemberArgs): Promise<any>;
    stakeForTokenMember(opts: StakeMemberArgs): Promise<any>;
    transferShares(opts: TransferSharesArgs): Promise<any>;
    unstakeTokenMember(opts: UnstakeMemberArgs): Promise<any>;
    distributeNft(opts: DistributeMemberArgs): Promise<{
        membershipVoucher: PublicKey;
        fanoutForMintMembershipVoucher?: PublicKey;
        holdingAccount: PublicKey;
    }>;
    distributeWallet(opts: DistributeMemberArgs): Promise<{
        membershipVoucher: PublicKey;
        fanoutForMintMembershipVoucher?: PublicKey;
        holdingAccount: PublicKey;
    }>;
    distributeToken(opts: DistributeTokenMemberArgs): Promise<{
        membershipVoucher: PublicKey;
        fanoutForMintMembershipVoucher?: PublicKey;
        holdingAccount: PublicKey;
    }>;
}
//# sourceMappingURL=index.d.ts.map