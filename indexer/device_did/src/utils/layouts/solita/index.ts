import { AccountMeta, PublicKey } from '@solana/web3.js'
export * from './accounts/index.js'
export * from './instructions/index.js'
export * from './types/index.js'

import {
  Admin,
  AdminArgs,
  Global,
  GlobalArgs,
  Vendor,
  VendorArgs,
  Product,
  ProductArgs,
  Device,
  DeviceArgs,
  Did,
  DidArgs,
} from './accounts/index.js'

import {
  ActivateDeviceArgs,
  CreateDeviceAndDidArgs,
  CreateProductCollectionArgs,
  CreateVendorArgs,
  InitializeAdminArgs,
  InitializeGlobalArgs,
  DeviceState,
} from './types/index.js'

export type InitializeAdminInstruction = {
  programId: PublicKey
  keys: AccountMeta[]
  data: Buffer
}

export const InitializeAdminAccounts = ['payer', 'admin', 'systemProgram']

export type InitializeGlobalInstruction = {
  programId: PublicKey
  keys: AccountMeta[]
  data: Buffer
}

export const InitializeGlobalAccounts = [
  'payer',
  'admin',
  'adminKey',
  'global',
  'systemProgram',
]

export type CreateVendorInstruction = {
  programId: PublicKey
  keys: AccountMeta[]
  data: Buffer
}

export const CreateVendorAccounts = [
  'payer',
  'global',
  'adminKey',
  'vendor',
  'systemProgram',
]

export type CreateProductCollectionInstruction = {
  programId: PublicKey
  keys: AccountMeta[]
  data: Buffer
}

export const CreateProductCollectionAccounts = [
  'payer',
  'vendor',
  'vendorAuthority',
  'global',
  'product',
  'systemProgram',
]

export type CreateDeviceAndDidInstruction = {
  programId: PublicKey
  keys: AccountMeta[]
  data: Buffer
}

export const CreateDeviceAndDidAccounts = [
  'payer',
  'vendor',
  'vendorAuthority',
  'product',
  'device',
  'deviceDid',
  'treasury',
  'admin',
  'global',
  'systemProgram',
]

export type ActivateDeviceInstruction = {
  programId: PublicKey
  keys: AccountMeta[]
  data: Buffer
}

export const ActivateDeviceAccounts = ['payer', 'device']

export type ParsedInstructions =
  | InitializeAdminInstruction
  | InitializeGlobalInstruction
  | CreateVendorInstruction
  | CreateProductCollectionInstruction
  | CreateDeviceAndDidInstruction
  | ActivateDeviceInstruction
export type ParsedAccounts = Admin | Global | Vendor | Product | Device | Did

export type ParsedAccountsData =
  | AdminArgs
  | GlobalArgs
  | VendorArgs
  | ProductArgs
  | DeviceArgs
  | DidArgs

export type ParsedTypes =
  | DeviceState
  | ActivateDeviceArgs
  | CreateDeviceAndDidArgs
  | CreateProductCollectionArgs
  | CreateVendorArgs
  | InitializeAdminArgs
  | InitializeGlobalArgs
