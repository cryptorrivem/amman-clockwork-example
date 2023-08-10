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
 * Arguments used to create {@link Unstake}
 * @category Accounts
 * @category generated
 */
export type UnstakeArgs = {
  amount: beet.bignum
  authority: web3.PublicKey
  delegation: web3.PublicKey
  id: beet.bignum
  worker: web3.PublicKey
}

export const unstakeDiscriminator = [154, 148, 131, 67, 52, 244, 244, 19]
/**
 * Holds the data for the {@link Unstake} Account and provides de/serialization
 * functionality for that data
 *
 * @category Accounts
 * @category generated
 */
export class Unstake implements UnstakeArgs {
  private constructor(
    readonly amount: beet.bignum,
    readonly authority: web3.PublicKey,
    readonly delegation: web3.PublicKey,
    readonly id: beet.bignum,
    readonly worker: web3.PublicKey
  ) {}

  /**
   * Creates a {@link Unstake} instance from the provided args.
   */
  static fromArgs(args: UnstakeArgs) {
    return new Unstake(
      args.amount,
      args.authority,
      args.delegation,
      args.id,
      args.worker
    )
  }

  /**
   * Deserializes the {@link Unstake} from the data of the provided {@link web3.AccountInfo}.
   * @returns a tuple of the account data and the offset up to which the buffer was read to obtain it.
   */
  static fromAccountInfo(
    accountInfo: web3.AccountInfo<Buffer>,
    offset = 0
  ): [Unstake, number] {
    return Unstake.deserialize(accountInfo.data, offset)
  }

  /**
   * Retrieves the account info from the provided address and deserializes
   * the {@link Unstake} from its data.
   *
   * @throws Error if no account info is found at the address or if deserialization fails
   */
  static async fromAccountAddress(
    connection: web3.Connection,
    address: web3.PublicKey,
    commitmentOrConfig?: web3.Commitment | web3.GetAccountInfoConfig
  ): Promise<Unstake> {
    const accountInfo = await connection.getAccountInfo(
      address,
      commitmentOrConfig
    )
    if (accountInfo == null) {
      throw new Error(`Unable to find Unstake account at ${address}`)
    }
    return Unstake.fromAccountInfo(accountInfo, 0)[0]
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
    return beetSolana.GpaBuilder.fromStruct(programId, unstakeBeet)
  }

  /**
   * Deserializes the {@link Unstake} from the provided data Buffer.
   * @returns a tuple of the account data and the offset up to which the buffer was read to obtain it.
   */
  static deserialize(buf: Buffer, offset = 0): [Unstake, number] {
    return unstakeBeet.deserialize(buf, offset)
  }

  /**
   * Serializes the {@link Unstake} into a Buffer.
   * @returns a tuple of the created Buffer and the offset up to which the buffer was written to store it.
   */
  serialize(): [Buffer, number] {
    return unstakeBeet.serialize({
      accountDiscriminator: unstakeDiscriminator,
      ...this,
    })
  }

  /**
   * Returns the byteSize of a {@link Buffer} holding the serialized data of
   * {@link Unstake}
   */
  static get byteSize() {
    return unstakeBeet.byteSize
  }

  /**
   * Fetches the minimum balance needed to exempt an account holding
   * {@link Unstake} data from rent
   *
   * @param connection used to retrieve the rent exemption information
   */
  static async getMinimumBalanceForRentExemption(
    connection: web3.Connection,
    commitment?: web3.Commitment
  ): Promise<number> {
    return connection.getMinimumBalanceForRentExemption(
      Unstake.byteSize,
      commitment
    )
  }

  /**
   * Determines if the provided {@link Buffer} has the correct byte size to
   * hold {@link Unstake} data.
   */
  static hasCorrectByteSize(buf: Buffer, offset = 0) {
    return buf.byteLength - offset === Unstake.byteSize
  }

  /**
   * Returns a readable version of {@link Unstake} properties
   * and can be used to convert to JSON and/or logging
   */
  pretty() {
    return {
      amount: (() => {
        const x = <{ toNumber: () => number }>this.amount
        if (typeof x.toNumber === 'function') {
          try {
            return x.toNumber()
          } catch (_) {
            return x
          }
        }
        return x
      })(),
      authority: this.authority.toBase58(),
      delegation: this.delegation.toBase58(),
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
      worker: this.worker.toBase58(),
    }
  }
}

/**
 * @category Accounts
 * @category generated
 */
export const unstakeBeet = new beet.BeetStruct<
  Unstake,
  UnstakeArgs & {
    accountDiscriminator: number[] /* size: 8 */
  }
>(
  [
    ['accountDiscriminator', beet.uniformFixedSizeArray(beet.u8, 8)],
    ['amount', beet.u64],
    ['authority', beetSolana.publicKey],
    ['delegation', beetSolana.publicKey],
    ['id', beet.u64],
    ['worker', beetSolana.publicKey],
  ],
  Unstake.fromArgs,
  'Unstake'
)
