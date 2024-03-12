/**
 * This code was GENERATED using the solita package.
 * Please DO NOT EDIT THIS FILE, instead rerun solita to update it or write a wrapper to add functionality.
 *
 * See: https://github.com/metaplex-foundation/solita
 */

import * as beet from '@metaplex-foundation/beet'
export type ActivateDeviceArgs = {
  publicKey: number[] /* size: 64 */
  message: Uint8Array
  signature: number[] /* size: 64 */
  recoveryId: number
}

/**
 * @category userTypes
 * @category generated
 */
export const activateDeviceArgsBeet =
  new beet.FixableBeetArgsStruct<ActivateDeviceArgs>(
    [
      ['publicKey', beet.uniformFixedSizeArray(beet.u8, 64)],
      ['message', beet.bytes],
      ['signature', beet.uniformFixedSizeArray(beet.u8, 64)],
      ['recoveryId', beet.u8],
    ],
    'ActivateDeviceArgs',
  )