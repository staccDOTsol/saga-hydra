/**
 * This code was GENERATED using the solita package.
 * Please DO NOT EDIT THIS FILE, instead rerun solita to update it or write a wrapper to add functionality.
 *
 * See: https://github.com/metaplex-foundation/solita
 */

import * as web3 from '@solana/web3.js';
import * as beet from '@metaplex-foundation/beet';
import * as beetSolana from '@metaplex-foundation/beet-solana';

/**
 * Arguments used to create {@link FanoutMint}
 * @category Accounts
 * @category generated
 */
export type FanoutMintArgs = {
  mint: web3.PublicKey;
  fanout: web3.PublicKey;
  tokenAccount: web3.PublicKey;
  totalInflow: beet.bignum;
  lastSnapshotAmount: beet.bignum;
  bumpSeed: number;
};

export const fanoutMintDiscriminator = [50, 164, 42, 108, 90, 201, 250, 216];
/**
 * Holds the data for the {@link FanoutMint} Account and provides de/serialization
 * functionality for that data
 *
 * @category Accounts
 * @category generated
 */
export class FanoutMint implements FanoutMintArgs {
  private constructor(
    readonly mint: web3.PublicKey,
    readonly fanout: web3.PublicKey,
    readonly tokenAccount: web3.PublicKey,
    readonly totalInflow: beet.bignum,
    readonly lastSnapshotAmount: beet.bignum,
    readonly bumpSeed: number,
  ) {}

  /**
   * Creates a {@link FanoutMint} instance from the provided args.
   */
  static fromArgs(args: FanoutMintArgs) {
    return new FanoutMint(
      args.mint,
      args.fanout,
      args.tokenAccount,
      args.totalInflow,
      args.lastSnapshotAmount,
      args.bumpSeed,
    );
  }

  /**
   * Deserializes the {@link FanoutMint} from the data of the provided {@link web3.AccountInfo}.
   * @returns a tuple of the account data and the offset up to which the buffer was read to obtain it.
   */
  static fromAccountInfo(accountInfo: web3.AccountInfo<Buffer>, offset = 0): [FanoutMint, number] {
    return FanoutMint.deserialize(accountInfo.data, offset);
  }

  /**
   * Retrieves the account info from the provided address and deserializes
   * the {@link FanoutMint} from its data.
   *
   * @throws Error if no account info is found at the address or if deserialization fails
   */
  static async fromAccountAddress(
    connection: web3.Connection,
    address: web3.PublicKey,
    commitmentOrConfig?: web3.Commitment | web3.GetAccountInfoConfig,
  ): Promise<FanoutMint> {
    const accountInfo = await connection.getAccountInfo(address, commitmentOrConfig);
    if (accountInfo == null) {
      throw new Error(`Unable to find FanoutMint account at ${address}`);
    }
    return FanoutMint.fromAccountInfo(accountInfo, 0)[0];
  }

  /**
   * Provides a {@link web3.Connection.getProgramAccounts} config builder,
   * to fetch accounts matching filters that can be specified via that builder.
   *
   * @param programId - the program that owns the accounts we are filtering
   */
  static gpaBuilder(
    programId: web3.PublicKey = new web3.PublicKey('ANSsi8dnmwyjQaGNC4PhRMU8WfBgKcvKzC9bPMBiJAPf'),
  ) {
    return beetSolana.GpaBuilder.fromStruct(programId, fanoutMintBeet);
  }

  /**
   * Deserializes the {@link FanoutMint} from the provided data Buffer.
   * @returns a tuple of the account data and the offset up to which the buffer was read to obtain it.
   */
  static deserialize(buf: Buffer, offset = 0): [FanoutMint, number] {
    return fanoutMintBeet.deserialize(buf, offset);
  }

  /**
   * Serializes the {@link FanoutMint} into a Buffer.
   * @returns a tuple of the created Buffer and the offset up to which the buffer was written to store it.
   */
  serialize(): [Buffer, number] {
    return fanoutMintBeet.serialize({
      accountDiscriminator: fanoutMintDiscriminator,
      ...this,
    });
  }

  /**
   * Returns the byteSize of a {@link Buffer} holding the serialized data of
   * {@link FanoutMint}
   */
  static get byteSize() {
    return fanoutMintBeet.byteSize;
  }

  /**
   * Fetches the minimum balance needed to exempt an account holding
   * {@link FanoutMint} data from rent
   *
   * @param connection used to retrieve the rent exemption information
   */
  static async getMinimumBalanceForRentExemption(
    connection: web3.Connection,
    commitment?: web3.Commitment,
  ): Promise<number> {
    return connection.getMinimumBalanceForRentExemption(FanoutMint.byteSize, commitment);
  }

  /**
   * Determines if the provided {@link Buffer} has the correct byte size to
   * hold {@link FanoutMint} data.
   */
  static hasCorrectByteSize(buf: Buffer, offset = 0) {
    return buf.byteLength - offset === FanoutMint.byteSize;
  }

  /**
   * Returns a readable version of {@link FanoutMint} properties
   * and can be used to convert to JSON and/or logging
   */
  pretty() {
    return {
      mint: this.mint.toBase58(),
      fanout: this.fanout.toBase58(),
      tokenAccount: this.tokenAccount.toBase58(),
      totalInflow: (() => {
        const x = <{ toNumber: () => number }>this.totalInflow;
        if (typeof x.toNumber === 'function') {
          try {
            return x.toNumber();
          } catch (_) {
            return x;
          }
        }
        return x;
      })(),
      lastSnapshotAmount: (() => {
        const x = <{ toNumber: () => number }>this.lastSnapshotAmount;
        if (typeof x.toNumber === 'function') {
          try {
            return x.toNumber();
          } catch (_) {
            return x;
          }
        }
        return x;
      })(),
      bumpSeed: this.bumpSeed,
    };
  }
}

/**
 * @category Accounts
 * @category generated
 */
export const fanoutMintBeet = new beet.BeetStruct<
  FanoutMint,
  FanoutMintArgs & {
    accountDiscriminator: number[] /* size: 8 */;
  }
>(
  [
    ['accountDiscriminator', beet.uniformFixedSizeArray(beet.u8, 8)],
    ['mint', beetSolana.publicKey],
    ['fanout', beetSolana.publicKey],
    ['tokenAccount', beetSolana.publicKey],
    ['totalInflow', beet.u64],
    ['lastSnapshotAmount', beet.u64],
    ['bumpSeed', beet.u8],
  ],
  FanoutMint.fromArgs,
  'FanoutMint',
);
