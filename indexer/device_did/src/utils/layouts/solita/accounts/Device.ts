/**
 * This code was GENERATED using the solita package.
 * Please DO NOT EDIT THIS FILE, instead rerun solita to update it or write a wrapper to add functionality.
 *
 * See: https://github.com/metaplex-foundation/solita
 */

import * as web3 from '@solana/web3.js'
import * as beet from '@metaplex-foundation/beet'
import * as beetSolana from '@metaplex-foundation/beet-solana'
import { DeviceState, deviceStateBeet } from '../types/DeviceState.js'
import { PROGRAM_ID } from '../../constants.js'

/**
 * Arguments used to create {@link Device}
 * @category Accounts
 * @category generated
 */
export type DeviceArgs = {
  holder: number[] /* size: 64 */
  deviceState: DeviceState
  deviceDidAddress: beet.COption<web3.PublicKey>
}

export const deviceDiscriminator = [153, 248, 23, 39, 83, 45, 68, 128]
/**
 * Holds the data for the {@link Device} Account and provides de/serialization
 * functionality for that data
 *
 * @category Accounts
 * @category generated
 */
export class Device implements DeviceArgs {
  private constructor(
    readonly holder: number[] /* size: 64 */,
    readonly deviceState: DeviceState,
    readonly deviceDidAddress: beet.COption<web3.PublicKey>,
  ) {}

  /**
   * Creates a {@link Device} instance from the provided args.
   */
  static fromArgs(args: DeviceArgs) {
    return new Device(args.holder, args.deviceState, args.deviceDidAddress)
  }

  /**
   * Deserializes the {@link Device} from the data of the provided {@link web3.AccountInfo}.
   * @returns a tuple of the account data and the offset up to which the buffer was read to obtain it.
   */
  static fromAccountInfo(
    accountInfo: web3.AccountInfo<Buffer>,
    offset = 0,
  ): [Device, number] {
    return Device.deserialize(accountInfo.data, offset)
  }

  /**
   * Retrieves the account info from the provided address and deserializes
   * the {@link Device} from its data.
   *
   * @throws Error if no account info is found at the address or if deserialization fails
   */
  static async fromAccountAddress(
    connection: web3.Connection,
    address: web3.PublicKey,
    commitmentOrConfig?: web3.Commitment | web3.GetAccountInfoConfig,
  ): Promise<Device> {
    const accountInfo = await connection.getAccountInfo(
      address,
      commitmentOrConfig,
    )
    if (accountInfo == null) {
      throw new Error(`Unable to find Device account at ${address}`)
    }
    return Device.fromAccountInfo(accountInfo, 0)[0]
  }

  /**
   * Provides a {@link web3.Connection.getProgramAccounts} config builder,
   * to fetch accounts matching filters that can be specified via that builder.
   *
   * @param programId - the program that owns the accounts we are filtering
   */
  static gpaBuilder(
    programId: web3.PublicKey = new web3.PublicKey(
      PROGRAM_ID,
    ),
  ) {
    return beetSolana.GpaBuilder.fromStruct(programId, deviceBeet)
  }

  /**
   * Deserializes the {@link Device} from the provided data Buffer.
   * @returns a tuple of the account data and the offset up to which the buffer was read to obtain it.
   */
  static deserialize(buf: Buffer, offset = 0): [Device, number] {
    return deviceBeet.deserialize(buf, offset)
  }

  /**
   * Serializes the {@link Device} into a Buffer.
   * @returns a tuple of the created Buffer and the offset up to which the buffer was written to store it.
   */
  serialize(): [Buffer, number] {
    return deviceBeet.serialize({
      accountDiscriminator: deviceDiscriminator,
      ...this,
    })
  }

  /**
   * Returns the byteSize of a {@link Buffer} holding the serialized data of
   * {@link Device} for the provided args.
   *
   * @param args need to be provided since the byte size for this account
   * depends on them
   */
  static byteSize(args: DeviceArgs) {
    const instance = Device.fromArgs(args)
    return deviceBeet.toFixedFromValue({
      accountDiscriminator: deviceDiscriminator,
      ...instance,
    }).byteSize
  }

  /**
   * Fetches the minimum balance needed to exempt an account holding
   * {@link Device} data from rent
   *
   * @param args need to be provided since the byte size for this account
   * depends on them
   * @param connection used to retrieve the rent exemption information
   */
  static async getMinimumBalanceForRentExemption(
    args: DeviceArgs,
    connection: web3.Connection,
    commitment?: web3.Commitment,
  ): Promise<number> {
    return connection.getMinimumBalanceForRentExemption(
      Device.byteSize(args),
      commitment,
    )
  }

  /**
   * Returns a readable version of {@link Device} properties
   * and can be used to convert to JSON and/or logging
   */
  pretty() {
    return {
      holder: this.holder,
      deviceState: 'DeviceState.' + DeviceState[this.deviceState],
      deviceDidAddress: this.deviceDidAddress,
    }
  }
}

/**
 * @category Accounts
 * @category generated
 */
export const deviceBeet = new beet.FixableBeetStruct<
  Device,
  DeviceArgs & {
    accountDiscriminator: number[] /* size: 8 */
  }
>(
  [
    ['accountDiscriminator', beet.uniformFixedSizeArray(beet.u8, 8)],
    ['holder', beet.uniformFixedSizeArray(beet.u8, 64)],
    ['deviceState', deviceStateBeet],
    ['deviceDidAddress', beet.coption(beetSolana.publicKey)],
  ],
  Device.fromArgs,
  'Device',
)
