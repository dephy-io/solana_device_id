/**
 * This code was GENERATED using the solita package.
 * Please DO NOT EDIT THIS FILE, instead rerun solita to update it or write a wrapper to add functionality.
 *
 * See: https://github.com/metaplex-foundation/solita
 */

import * as beet from '@metaplex-foundation/beet'
import * as web3 from '@solana/web3.js'
import {
  CreateDeviceAndDidArgs,
  createDeviceAndDidArgsBeet,
} from '../types/CreateDeviceAndDidArgs.js'

import { PROGRAM_ID } from '../../constants.js'

/**
 * @category Instructions
 * @category CreateDeviceAndDid
 * @category generated
 */
export type CreateDeviceAndDidInstructionArgs = {
  args: CreateDeviceAndDidArgs
}
/**
 * @category Instructions
 * @category CreateDeviceAndDid
 * @category generated
 */
export const createDeviceAndDidStruct = new beet.FixableBeetArgsStruct<
  CreateDeviceAndDidInstructionArgs & {
    instructionDiscriminator: number[] /* size: 8 */
  }
>(
  [
    ['instructionDiscriminator', beet.uniformFixedSizeArray(beet.u8, 8)],
    ['args', createDeviceAndDidArgsBeet],
  ],
  'CreateDeviceAndDidInstructionArgs',
)
/**
 * Accounts required by the _createDeviceAndDid_ instruction
 *
 * @property [_writable_, **signer**] payer
 * @property [] vendor
 * @property [**signer**] vendorAuthority
 * @property [] product
 * @property [_writable_, **signer**] device
 * @property [_writable_] deviceDid
 * @property [_writable_] treasury
 * @property [] admin
 * @property [] global
 * @category Instructions
 * @category CreateDeviceAndDid
 * @category generated
 */
export type CreateDeviceAndDidInstructionAccounts = {
  payer: web3.PublicKey
  vendor: web3.PublicKey
  vendorAuthority: web3.PublicKey
  product: web3.PublicKey
  device: web3.PublicKey
  deviceDid: web3.PublicKey
  treasury: web3.PublicKey
  admin: web3.PublicKey
  global: web3.PublicKey
  systemProgram?: web3.PublicKey
  anchorRemainingAccounts?: web3.AccountMeta[]
}

export const createDeviceAndDidInstructionDiscriminator = [
  166, 196, 84, 41, 230, 215, 161, 169,
]

/**
 * Creates a _CreateDeviceAndDid_ instruction.
 *
 * @param accounts that will be accessed while the instruction is processed
 * @param args to provide as instruction data to the program
 *
 * @category Instructions
 * @category CreateDeviceAndDid
 * @category generated
 */


export function createCreateDeviceAndDidInstruction(
  accounts: CreateDeviceAndDidInstructionAccounts,
  args: CreateDeviceAndDidInstructionArgs,
  programId = new web3.PublicKey(
    PROGRAM_ID,
  ),
) {
  const [data] = createDeviceAndDidStruct.serialize({
    instructionDiscriminator: createDeviceAndDidInstructionDiscriminator,
    ...args,
  })
  const keys: web3.AccountMeta[] = [
    {
      pubkey: accounts.payer,
      isWritable: true,
      isSigner: true,
    },
    {
      pubkey: accounts.vendor,
      isWritable: false,
      isSigner: false,
    },
    {
      pubkey: accounts.vendorAuthority,
      isWritable: false,
      isSigner: true,
    },
    {
      pubkey: accounts.product,
      isWritable: false,
      isSigner: false,
    },
    {
      pubkey: accounts.device,
      isWritable: true,
      isSigner: true,
    },
    {
      pubkey: accounts.deviceDid,
      isWritable: true,
      isSigner: false,
    },
    {
      pubkey: accounts.treasury,
      isWritable: true,
      isSigner: false,
    },
    {
      pubkey: accounts.admin,
      isWritable: false,
      isSigner: false,
    },
    {
      pubkey: accounts.global,
      isWritable: false,
      isSigner: false,
    },
    {
      pubkey: accounts.systemProgram ?? web3.SystemProgram.programId,
      isWritable: false,
      isSigner: false,
    },
  ]

  if (accounts.anchorRemainingAccounts != null) {
    for (const acc of accounts.anchorRemainingAccounts) {
      keys.push(acc)
    }
  }

  const ix = new web3.TransactionInstruction({
    programId,
    keys,
    data,
  })
  return ix
}
