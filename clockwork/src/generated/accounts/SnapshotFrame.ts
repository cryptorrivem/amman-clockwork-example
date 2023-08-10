/**
 * This code was GENERATED using the solita package.
 * Please DO NOT EDIT THIS FILE, instead rerun solita to update it or write a wrapper to add functionality.
 *
 * See: https://github.com/metaplex-foundation/solita
 */

import * as beet from '@metaplex-foundation/beet'
import * as web3 from '@solana/web3.js'
import * as beetSolana from '@metaplex-foundation/beet-solana'

/**
 * Arguments used to create {@link SnapshotFrame}
 * @category Accounts
 * @category generated
 */
export type SnapshotFrameArgs = {
  id: beet.bignum
  snapshot: web3.PublicKey
  stakeAmount: beet.bignum
  stakeOffset: beet.bignum
  totalEntries: beet.bignum
  worker: web3.PublicKey
}

export const snapshotFrameDiscriminator = [121, 170, 251, 41, 117, 218, 116, 76]
/**
 * Holds the data for the {@link SnapshotFrame} Account and provides de/serialization
 * functionality for that data
 *
 * @category Accounts
 * @category generated
 */
export class SnapshotFrame implements SnapshotFrameArgs {
  private constructor(
    readonly id: beet.bignum,
    readonly snapshot: web3.PublicKey,
    readonly stakeAmount: beet.bignum,
    readonly stakeOffset: beet.bignum,
    readonly totalEntries: beet.bignum,
    readonly worker: web3.PublicKey
  ) {}

  /**
   * Creates a {@link SnapshotFrame} instance from the provided args.
   */
  static fromArgs(args: SnapshotFrameArgs) {
    return new SnapshotFrame(
      args.id,
      args.snapshot,
      args.stakeAmount,
      args.stakeOffset,
      args.totalEntries,
      args.worker
    )
  }

  /**
   * Deserializes the {@link SnapshotFrame} from the data of the provided {@link web3.AccountInfo}.
   * @returns a tuple of the account data and the offset up to which the buffer was read to obtain it.
   */
  static fromAccountInfo(
    accountInfo: web3.AccountInfo<Buffer>,
    offset = 0
  ): [SnapshotFrame, number] {
    return SnapshotFrame.deserialize(accountInfo.data, offset)
  }

  /**
   * Retrieves the account info from the provided address and deserializes
   * the {@link SnapshotFrame} from its data.
   *
   * @throws Error if no account info is found at the address or if deserialization fails
   */
  static async fromAccountAddress(
    connection: web3.Connection,
    address: web3.PublicKey,
    commitmentOrConfig?: web3.Commitment | web3.GetAccountInfoConfig
  ): Promise<SnapshotFrame> {
    const accountInfo = await connection.getAccountInfo(
      address,
      commitmentOrConfig
    )
    if (accountInfo == null) {
      throw new Error(`Unable to find SnapshotFrame account at ${address}`)
    }
    return SnapshotFrame.fromAccountInfo(accountInfo, 0)[0]
  }

  /**
   * Provides a {@link web3.Connection.getProgramAccounts} config builder,
   * to fetch accounts matching filters that can be specified via that builder.
   *
   * @param programId - the program that owns the accounts we are filtering
   */
  static gpaBuilder(
    programId: web3.PublicKey = new web3.PublicKey(
      'F8dKseqmBoAkHx3c58Lmb9TgJv5qeTf3BbtZZSEzYvUa'
    )
  ) {
    return beetSolana.GpaBuilder.fromStruct(programId, snapshotFrameBeet)
  }

  /**
   * Deserializes the {@link SnapshotFrame} from the provided data Buffer.
   * @returns a tuple of the account data and the offset up to which the buffer was read to obtain it.
   */
  static deserialize(buf: Buffer, offset = 0): [SnapshotFrame, number] {
    return snapshotFrameBeet.deserialize(buf, offset)
  }

  /**
   * Serializes the {@link SnapshotFrame} into a Buffer.
   * @returns a tuple of the created Buffer and the offset up to which the buffer was written to store it.
   */
  serialize(): [Buffer, number] {
    return snapshotFrameBeet.serialize({
      accountDiscriminator: snapshotFrameDiscriminator,
      ...this,
    })
  }

  /**
   * Returns the byteSize of a {@link Buffer} holding the serialized data of
   * {@link SnapshotFrame}
   */
  static get byteSize() {
    return snapshotFrameBeet.byteSize
  }

  /**
   * Fetches the minimum balance needed to exempt an account holding
   * {@link SnapshotFrame} data from rent
   *
   * @param connection used to retrieve the rent exemption information
   */
  static async getMinimumBalanceForRentExemption(
    connection: web3.Connection,
    commitment?: web3.Commitment
  ): Promise<number> {
    return connection.getMinimumBalanceForRentExemption(
      SnapshotFrame.byteSize,
      commitment
    )
  }

  /**
   * Determines if the provided {@link Buffer} has the correct byte size to
   * hold {@link SnapshotFrame} data.
   */
  static hasCorrectByteSize(buf: Buffer, offset = 0) {
    return buf.byteLength - offset === SnapshotFrame.byteSize
  }

  /**
   * Returns a readable version of {@link SnapshotFrame} properties
   * and can be used to convert to JSON and/or logging
   */
  pretty() {
    return {
      id: (() => {
        const x = <{ toNumber: () => number }>this.id
        if (typeof x.toNumber === 'function') {
          try {
            return x.toNumber()
          } catch (_) {
            return x
          }
        }
        return x
      })(),
      snapshot: this.snapshot.toBase58(),
      stakeAmount: (() => {
        const x = <{ toNumber: () => number }>this.stakeAmount
        if (typeof x.toNumber === 'function') {
          try {
            return x.toNumber()
          } catch (_) {
            return x
          }
        }
        return x
      })(),
      stakeOffset: (() => {
        const x = <{ toNumber: () => number }>this.stakeOffset
        if (typeof x.toNumber === 'function') {
          try {
            return x.toNumber()
          } catch (_) {
            return x
          }
        }
        return x
      })(),
      totalEntries: (() => {
        const x = <{ toNumber: () => number }>this.totalEntries
        if (typeof x.toNumber === 'function') {
          try {
            return x.toNumber()
          } catch (_) {
            return x
          }
        }
        return x
      })(),
      worker: this.worker.toBase58(),
    }
  }
}

/**
 * @category Accounts
 * @category generated
 */
export const snapshotFrameBeet = new beet.BeetStruct<
  SnapshotFrame,
  SnapshotFrameArgs & {
    accountDiscriminator: number[] /* size: 8 */
  }
>(
  [
    ['accountDiscriminator', beet.uniformFixedSizeArray(beet.u8, 8)],
    ['id', beet.u64],
    ['snapshot', beetSolana.publicKey],
    ['stakeAmount', beet.u64],
    ['stakeOffset', beet.u64],
    ['totalEntries', beet.u64],
    ['worker', beetSolana.publicKey],
  ],
  SnapshotFrame.fromArgs,
  'SnapshotFrame'
)
