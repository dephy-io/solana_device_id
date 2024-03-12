/**
 * This code was GENERATED using the solita package.
 * Please DO NOT EDIT THIS FILE, instead rerun solita to update it or write a wrapper to add functionality.
 *
 * See: https://github.com/metaplex-foundation/solita
 */

import * as web3 from '@solana/web3.js'
import * as beet from '@metaplex-foundation/beet'
import * as beetSolana from '@metaplex-foundation/beet-solana'

/**
 * Arguments used to create {@link Vendor}
 * @category Accounts
 * @category generated
 */
export type VendorArgs = {
  name: string
  authority: web3.PublicKey
  bumpSeed: number
}

export const vendorDiscriminator = [87, 248, 121, 239, 24, 112, 197, 200]
/**
 * Holds the data for the {@link Vendor} Account and provides de/serialization
 * functionality for that data
 *
 * @category Accounts
 * @category generated
 */
export class Vendor implements VendorArgs {
  private constructor(
    readonly name: string,
    readonly authority: web3.PublicKey,
    readonly bumpSeed: number,
  ) {}

  /**
   * Creates a {@link Vendor} instance from the provided args.
   */
  static fromArgs(args: VendorArgs) {
    return new Vendor(args.name, args.authority, args.bumpSeed)
  }

  /**
   * Deserializes the {@link Vendor} from the data of the provided {@link web3.AccountInfo}.
   * @returns a tuple of the account data and the offset up to which the buffer was read to obtain it.
   */
  static fromAccountInfo(
    accountInfo: web3.AccountInfo<Buffer>,
    offset = 0,
  ): [Vendor, number] {
    return Vendor.deserialize(accountInfo.data, offset)
  }

  /**
   * Retrieves the account info from the provided address and deserializes
   * the {@link Vendor} from its data.
   *
   * @throws Error if no account info is found at the address or if deserialization fails
   */
  static async fromAccountAddress(
    connection: web3.Connection,
    address: web3.PublicKey,
    commitmentOrConfig?: web3.Commitment | web3.GetAccountInfoConfig,
  ): Promise<Vendor> {
    const accountInfo = await connection.getAccountInfo(
      address,
      commitmentOrConfig,
    )
    if (accountInfo == null) {
      throw new Error(`Unable to find Vendor account at ${address}`)
    }
    return Vendor.fromAccountInfo(accountInfo, 0)[0]
  }

  /**
   * Provides a {@link web3.Connection.getProgramAccounts} config builder,
   * to fetch accounts matching filters that can be specified via that builder.
   *
   * @param programId - the program that owns the accounts we are filtering
   */
  static gpaBuilder(
    programId: web3.PublicKey = new web3.PublicKey(
      '1234WPYMnkT2bx5MB3uLmixeDuaCHDpd3mXNhZGimKWg',
    ),
  ) {
    return beetSolana.GpaBuilder.fromStruct(programId, vendorBeet)
  }

  /**
   * Deserializes the {@link Vendor} from the provided data Buffer.
   * @returns a tuple of the account data and the offset up to which the buffer was read to obtain it.
   */
  static deserialize(buf: Buffer, offset = 0): [Vendor, number] {
    return vendorBeet.deserialize(buf, offset)
  }

  /**
   * Serializes the {@link Vendor} into a Buffer.
   * @returns a tuple of the created Buffer and the offset up to which the buffer was written to store it.
   */
  serialize(): [Buffer, number] {
    return vendorBeet.serialize({
      accountDiscriminator: vendorDiscriminator,
      ...this,
    })
  }

  /**
   * Returns the byteSize of a {@link Buffer} holding the serialized data of
   * {@link Vendor} for the provided args.
   *
   * @param args need to be provided since the byte size for this account
   * depends on them
   */
  static byteSize(args: VendorArgs) {
    const instance = Vendor.fromArgs(args)
    return vendorBeet.toFixedFromValue({
      accountDiscriminator: vendorDiscriminator,
      ...instance,
    }).byteSize
  }

  /**
   * Fetches the minimum balance needed to exempt an account holding
   * {@link Vendor} data from rent
   *
   * @param args need to be provided since the byte size for this account
   * depends on them
   * @param connection used to retrieve the rent exemption information
   */
  static async getMinimumBalanceForRentExemption(
    args: VendorArgs,
    connection: web3.Connection,
    commitment?: web3.Commitment,
  ): Promise<number> {
    return connection.getMinimumBalanceForRentExemption(
      Vendor.byteSize(args),
      commitment,
    )
  }

  /**
   * Returns a readable version of {@link Vendor} properties
   * and can be used to convert to JSON and/or logging
   */
  pretty() {
    return {
      name: this.name,
      authority: this.authority.toBase58(),
      bumpSeed: this.bumpSeed,
    }
  }
}

/**
 * @category Accounts
 * @category generated
 */
export const vendorBeet = new beet.FixableBeetStruct<
  Vendor,
  VendorArgs & {
    accountDiscriminator: number[] /* size: 8 */
  }
>(
  [
    ['accountDiscriminator', beet.uniformFixedSizeArray(beet.u8, 8)],
    ['name', beet.utf8String],
    ['authority', beetSolana.publicKey],
    ['bumpSeed', beet.u8],
  ],
  Vendor.fromArgs,
  'Vendor',
)
