import { EventBase } from '@aleph-indexer/framework'
import * as solita from './solita/index.js'

export enum InstructionType {
  InitializeAdmin = 'InitializeAdmin',
  InitializeGlobal = 'InitializeGlobal',
  CreateVendor = 'CreateVendor',
  CreateProductCollection = 'CreateProductCollection',
  CreateDeviceAndDid = 'CreateDeviceAndDid',
  ActivateDevice = 'ActivateDevice',
}

export type RawInstructionBase = {
  parsed: unknown
  program: string
  programId: string
}

/*-----------------------* CUSTOM RAW INSTRUCTION TYPES *-----------------------*/

export type InitializeAdminAccountsInstruction = {
  payer: string
  admin: string
  systemProgram: string
}

export type InitializeAdminInfo = solita.InitializeAdminInstructionArgs &
  InitializeAdminAccountsInstruction

export type RawInitializeAdmin = RawInstructionBase & {
  parsed: {
    info: InitializeAdminInfo
    type: InstructionType.InitializeAdmin
  }
}

export type InitializeGlobalAccountsInstruction = {
  payer: string
  admin: string
  adminKey: string
  global: string
  systemProgram: string
}

export type InitializeGlobalInfo = solita.InitializeGlobalInstructionArgs &
  InitializeGlobalAccountsInstruction

export type RawInitializeGlobal = RawInstructionBase & {
  parsed: {
    info: InitializeGlobalInfo
    type: InstructionType.InitializeGlobal
  }
}

export type CreateVendorAccountsInstruction = {
  payer: string
  global: string
  adminKey: string
  vendor: string
  systemProgram: string
}

export type CreateVendorInfo = solita.CreateVendorInstructionArgs &
  CreateVendorAccountsInstruction

export type RawCreateVendor = RawInstructionBase & {
  parsed: {
    info: CreateVendorInfo
    type: InstructionType.CreateVendor
  }
}

export type CreateProductCollectionAccountsInstruction = {
  payer: string
  vendor: string
  vendorAuthority: string
  global: string
  product: string
  systemProgram: string
}

export type CreateProductCollectionInfo =
  solita.CreateProductCollectionInstructionArgs &
    CreateProductCollectionAccountsInstruction

export type RawCreateProductCollection = RawInstructionBase & {
  parsed: {
    info: CreateProductCollectionInfo
    type: InstructionType.CreateProductCollection
  }
}

export type CreateDeviceAndDidAccountsInstruction = {
  payer: string
  vendor: string
  vendorAuthority: string
  product: string
  device: string
  deviceDid: string
  treasury: string
  admin: string
  global: string
  systemProgram: string
}

export type CreateDeviceAndDidInfo = solita.CreateDeviceAndDidInstructionArgs &
  CreateDeviceAndDidAccountsInstruction

export type RawCreateDeviceAndDid = RawInstructionBase & {
  parsed: {
    info: CreateDeviceAndDidInfo
    type: InstructionType.CreateDeviceAndDid
  }
}

export type ActivateDeviceAccountsInstruction = {
  payer: string
  device: string
}

export type ActivateDeviceInfo = solita.ActivateDeviceInstructionArgs &
  ActivateDeviceAccountsInstruction

export type RawActivateDevice = RawInstructionBase & {
  parsed: {
    info: ActivateDeviceInfo
    type: InstructionType.ActivateDevice
  }
}

export type RawInstructionsInfo =
  | InitializeAdminInfo
  | InitializeGlobalInfo
  | CreateVendorInfo
  | CreateProductCollectionInfo
  | CreateDeviceAndDidInfo
  | ActivateDeviceInfo

export type RawInstruction =
  | RawInitializeAdmin
  | RawInitializeGlobal
  | RawCreateVendor
  | RawCreateProductCollection
  | RawCreateDeviceAndDid
  | RawActivateDevice

export type InitializeAdminEvent = EventBase<InstructionType> & {
  info: InitializeAdminInfo
  signer: string
  account: string
}

export type InitializeGlobalEvent = EventBase<InstructionType> & {
  info: InitializeGlobalInfo
  signer: string
  account: string
}

export type CreateVendorEvent = EventBase<InstructionType> & {
  info: CreateVendorInfo
  signer: string
  account: string
}

export type CreateProductCollectionEvent = EventBase<InstructionType> & {
  info: CreateProductCollectionInfo
  signer: string
  account: string
}

export type CreateDeviceAndDidEvent = EventBase<InstructionType> & {
  info: CreateDeviceAndDidInfo
  signer: string
  account: string
}

export type ActivateDeviceEvent = EventBase<InstructionType> & {
  info: ActivateDeviceInfo
  signer: string
  account: string
}

export type DeviceDidEvent =
  | InitializeAdminEvent
  | InitializeGlobalEvent
  | CreateVendorEvent
  | CreateProductCollectionEvent
  | CreateDeviceAndDidEvent
  | ActivateDeviceEvent
/*----------------------------------------------------------------------*/

export function getInstructionType(data: Buffer): InstructionType | undefined {
  const discriminator = data.slice(0, 8)
  return IX_METHOD_CODE.get(discriminator.toString('ascii'))
}

export const IX_METHOD_CODE: Map<string, InstructionType | undefined> = new Map<
  string,
  InstructionType | undefined
>([
  [
    Buffer.from(solita.initializeAdminInstructionDiscriminator).toString(
      'ascii',
    ),
    InstructionType.InitializeAdmin,
  ],
  [
    Buffer.from(solita.initializeGlobalInstructionDiscriminator).toString(
      'ascii',
    ),
    InstructionType.InitializeGlobal,
  ],
  [
    Buffer.from(solita.createVendorInstructionDiscriminator).toString('ascii'),
    InstructionType.CreateVendor,
  ],
  [
    Buffer.from(
      solita.createProductCollectionInstructionDiscriminator,
    ).toString('ascii'),
    InstructionType.CreateProductCollection,
  ],
  [
    Buffer.from(solita.createDeviceAndDidInstructionDiscriminator).toString(
      'ascii',
    ),
    InstructionType.CreateDeviceAndDid,
  ],
  [
    Buffer.from(solita.activateDeviceInstructionDiscriminator).toString(
      'ascii',
    ),
    InstructionType.ActivateDevice,
  ],
])
export const IX_DATA_LAYOUT: Partial<Record<InstructionType, any>> = {
  [InstructionType.InitializeAdmin]: solita.initializeAdminStruct,
  [InstructionType.InitializeGlobal]: solita.initializeGlobalStruct,
  [InstructionType.CreateVendor]: solita.createVendorStruct,
  [InstructionType.CreateProductCollection]:
    solita.createProductCollectionStruct,
  [InstructionType.CreateDeviceAndDid]: solita.createDeviceAndDidStruct,
  [InstructionType.ActivateDevice]: solita.activateDeviceStruct,
}

export const IX_ACCOUNTS_LAYOUT: Partial<Record<InstructionType, any>> = {
  [InstructionType.InitializeAdmin]: solita.InitializeAdminAccounts,
  [InstructionType.InitializeGlobal]: solita.InitializeGlobalAccounts,
  [InstructionType.CreateVendor]: solita.CreateVendorAccounts,
  [InstructionType.CreateProductCollection]:
    solita.CreateProductCollectionAccounts,
  [InstructionType.CreateDeviceAndDid]: solita.CreateDeviceAndDidAccounts,
  [InstructionType.ActivateDevice]: solita.ActivateDeviceAccounts,
}
