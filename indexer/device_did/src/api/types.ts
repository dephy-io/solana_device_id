import { GraphQLBoolean, GraphQLInt } from 'graphql'
import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLEnumType,
  GraphQLNonNull,
  GraphQLList,
  GraphQLInterfaceType,
  GraphQLUnionType,
} from 'graphql'
import { GraphQLBigNumber, GraphQLLong, GraphQLJSON } from '@aleph-indexer/core'
import { InstructionType } from '../utils/layouts/index.js'

// ------------------- TYPES ---------------------------

export const DeviceState = new GraphQLEnumType({
  name: 'DeviceState',
  values: {
    Frozen: { value: 'Frozen' },
    Active: { value: 'Active' },
    Lock: { value: 'Lock' },
  },
})
export const ActivateDeviceArgs = new GraphQLObjectType({
  name: 'ActivateDeviceArgs',
  fields: {
    publicKey: { type: new GraphQLNonNull(GraphQLString) },
    message: { type: new GraphQLNonNull(GraphQLString) },
    signature: { type: new GraphQLNonNull(GraphQLString) },
    recoveryId: { type: new GraphQLNonNull(GraphQLInt) },
  },
})
export const CreateDeviceAndDidArgs = new GraphQLObjectType({
  name: 'CreateDeviceAndDidArgs',
  fields: {
    name: { type: new GraphQLNonNull(GraphQLString) },
    serialNum: { type: new GraphQLNonNull(GraphQLString) },
    mintAt: { type: new GraphQLNonNull(GraphQLBigNumber) },
  },
})
export const CreateProductCollectionArgs = new GraphQLObjectType({
  name: 'CreateProductCollectionArgs',
  fields: {
    name: { type: new GraphQLNonNull(GraphQLString) },
  },
})
export const CreateVendorArgs = new GraphQLObjectType({
  name: 'CreateVendorArgs',
  fields: {
    name: { type: new GraphQLNonNull(GraphQLString) },
    authority: { type: new GraphQLNonNull(GraphQLString) },
  },
})
export const InitializeAdminArgs = new GraphQLObjectType({
  name: 'InitializeAdminArgs',
  fields: {
    admin: { type: new GraphQLNonNull(GraphQLString) },
    authority: { type: new GraphQLNonNull(GraphQLString) },
    treasury: { type: new GraphQLNonNull(GraphQLString) },
  },
})
export const InitializeGlobalArgs = new GraphQLObjectType({
  name: 'InitializeGlobalArgs',
  fields: {
    regFee: { type: new GraphQLNonNull(GraphQLBigNumber) },
  },
})

// ------------------- STATS ---------------------------

export const AccessTimeStats = new GraphQLObjectType({
  name: 'AccessTimeStats',
  fields: {
    accesses: { type: new GraphQLNonNull(GraphQLInt) },
    accessesByProgramId: { type: new GraphQLNonNull(GraphQLJSON) },
    startTimestamp: { type: new GraphQLNonNull(GraphQLLong) },
    endTimestamp: { type: new GraphQLNonNull(GraphQLLong) },
  },
})

export const TotalAccounts = new GraphQLObjectType({
  name: 'TotalAccounts',
  fields: {
    Admin: { type: new GraphQLNonNull(GraphQLInt) },
    Global: { type: new GraphQLNonNull(GraphQLInt) },
    Vendor: { type: new GraphQLNonNull(GraphQLInt) },
    Product: { type: new GraphQLNonNull(GraphQLInt) },
    Device: { type: new GraphQLNonNull(GraphQLInt) },
    Did: { type: new GraphQLNonNull(GraphQLInt) },
  },
})

export const GlobalDeviceDidStats = new GraphQLObjectType({
  name: 'GlobalDeviceDidStats',
  fields: {
    totalAccounts: { type: new GraphQLNonNull(TotalAccounts) },
    totalAccesses: { type: new GraphQLNonNull(GraphQLInt) },
    totalAccessesByProgramId: { type: new GraphQLNonNull(GraphQLJSON) },
    startTimestamp: { type: new GraphQLNonNull(GraphQLLong) },
    endTimestamp: { type: new GraphQLNonNull(GraphQLLong) },
  },
})

export const DeviceDidStats = new GraphQLObjectType({
  name: 'DeviceDidStats',
  fields: {
    last1h: { type: AccessTimeStats },
    last24h: { type: AccessTimeStats },
    last7d: { type: AccessTimeStats },
    total: { type: AccessTimeStats },
  },
})

// ------------------- ACCOUNTS ---------------------------

export const AccountsEnum = new GraphQLEnumType({
  name: 'AccountsEnum',
  values: {
    Admin: { value: 'Admin' },
    Global: { value: 'Global' },
    Vendor: { value: 'Vendor' },
    Product: { value: 'Product' },
    Device: { value: 'Device' },
    Did: { value: 'Did' },
  },
})
export const Admin = new GraphQLObjectType({
  name: 'Admin',
  fields: {
    admin: { type: new GraphQLNonNull(GraphQLString) },
    authority: { type: new GraphQLNonNull(GraphQLString) },
    treasury: { type: new GraphQLNonNull(GraphQLString) },
    bumpSeed: { type: new GraphQLNonNull(GraphQLInt) },
  },
})
export const Global = new GraphQLObjectType({
  name: 'Global',
  fields: {
    regFee: { type: new GraphQLNonNull(GraphQLBigNumber) },
    authority: { type: new GraphQLNonNull(GraphQLString) },
    bumpSeed: { type: new GraphQLNonNull(GraphQLInt) },
    allowRegAddr: { type: new GraphQLNonNull(GraphQLString) },
  },
})
export const Vendor = new GraphQLObjectType({
  name: 'Vendor',
  fields: {
    name: { type: new GraphQLNonNull(GraphQLString) },
    authority: { type: new GraphQLNonNull(GraphQLString) },
    bumpSeed: { type: new GraphQLNonNull(GraphQLInt) },
  },
})
export const Product = new GraphQLObjectType({
  name: 'Product',
  fields: {
    name: { type: new GraphQLNonNull(GraphQLString) },
    devicesNums: { type: new GraphQLNonNull(GraphQLInt) },
    bumpSeed: { type: new GraphQLNonNull(GraphQLInt) },
  },
})
export const Device = new GraphQLObjectType({
  name: 'Device',
  fields: {
    holder: { type: new GraphQLNonNull(GraphQLString) },
    deviceState: { type: new GraphQLNonNull(DeviceState) },
    deviceDidAddress: { type: new GraphQLNonNull(GraphQLString) },
  },
})
export const Did = new GraphQLObjectType({
  name: 'Did',
  fields: {
    name: { type: new GraphQLNonNull(GraphQLString) },
    serialNum: { type: new GraphQLNonNull(GraphQLString) },
    mintAt: { type: new GraphQLNonNull(GraphQLBigNumber) },
    owner: { type: new GraphQLNonNull(GraphQLString) },
    bumpSeed: { type: new GraphQLNonNull(GraphQLInt) },
  },
})

export const ParsedAccountsData = new GraphQLUnionType({
  name: 'ParsedAccountsData',
  types: [Admin, Global, Vendor, Product, Device, Did],
  resolveType: (obj) => {
    // here is selected a unique property of each account to discriminate between types
    if (obj.treasury) {
      return 'Admin'
    }
    if (obj.allowRegAddr) {
      return 'Global'
    }
    if (obj.authority) {
      return 'Vendor'
    }
    if (obj.devicesNums) {
      return 'Product'
    }
    if (obj.deviceDidAddress) {
      return 'Device'
    }
    if (obj.serialNum) {
      return 'Did'
    }
  },
})

const commonAccountInfoFields = {
  name: { type: new GraphQLNonNull(GraphQLString) },
  programId: { type: new GraphQLNonNull(GraphQLString) },
  address: { type: new GraphQLNonNull(GraphQLString) },
  type: { type: new GraphQLNonNull(AccountsEnum) },
}

const Account = new GraphQLInterfaceType({
  name: 'Account',
  fields: {
    ...commonAccountInfoFields,
  },
})

export const DeviceDidAccountsInfo = new GraphQLObjectType({
  name: 'DeviceDidAccountsInfo',
  interfaces: [Account],
  fields: {
    ...commonAccountInfoFields,
    data: { type: new GraphQLNonNull(ParsedAccountsData) },
  },
})

export const AccountsInfo = new GraphQLList(DeviceDidAccountsInfo)

// ------------------- EVENTS --------------------------

export const DeviceDidEvent = new GraphQLEnumType({
  name: 'DeviceDidEvent',
  values: {
    InitializeAdmin: { value: 'InitializeAdmin' },
    InitializeGlobal: { value: 'InitializeGlobal' },
    CreateVendor: { value: 'CreateVendor' },
    CreateProductCollection: { value: 'CreateProductCollection' },
    CreateDeviceAndDid: { value: 'CreateDeviceAndDid' },
    ActivateDevice: { value: 'ActivateDevice' },
  },
})

const commonEventFields = {
  id: { type: new GraphQLNonNull(GraphQLString) },
  timestamp: { type: GraphQLLong },
  type: { type: new GraphQLNonNull(DeviceDidEvent) },
  account: { type: new GraphQLNonNull(GraphQLString) },
  signer: { type: new GraphQLNonNull(GraphQLString) },
}

const Event = new GraphQLInterfaceType({
  name: 'Event',
  fields: {
    ...commonEventFields,
  },
})

/*-----------------------* CUSTOM EVENTS TYPES *-----------------------*/

export const InitializeAdminInfo = new GraphQLObjectType({
  name: 'InitializeAdminInfo',
  fields: {
    payer: { type: new GraphQLNonNull(GraphQLString) },
    admin: { type: new GraphQLNonNull(GraphQLString) },
    systemProgram: { type: new GraphQLNonNull(GraphQLString) },
    args: { type: new GraphQLNonNull(InitializeAdminArgs) },
  },
})

export const InitializeAdminEvent = new GraphQLObjectType({
  name: 'InitializeAdminEvent',
  interfaces: [Event],
  isTypeOf: (item) => item.type === InstructionType.InitializeAdmin,
  fields: {
    ...commonEventFields,
    info: { type: new GraphQLNonNull(InitializeAdminInfo) },
  },
})

/*----------------------------------------------------------------------*/

export const InitializeGlobalInfo = new GraphQLObjectType({
  name: 'InitializeGlobalInfo',
  fields: {
    payer: { type: new GraphQLNonNull(GraphQLString) },
    admin: { type: new GraphQLNonNull(GraphQLString) },
    adminKey: { type: new GraphQLNonNull(GraphQLString) },
    global: { type: new GraphQLNonNull(GraphQLString) },
    systemProgram: { type: new GraphQLNonNull(GraphQLString) },
    args: { type: new GraphQLNonNull(InitializeGlobalArgs) },
  },
})

export const InitializeGlobalEvent = new GraphQLObjectType({
  name: 'InitializeGlobalEvent',
  interfaces: [Event],
  isTypeOf: (item) => item.type === InstructionType.InitializeGlobal,
  fields: {
    ...commonEventFields,
    info: { type: new GraphQLNonNull(InitializeGlobalInfo) },
  },
})

/*----------------------------------------------------------------------*/

export const CreateVendorInfo = new GraphQLObjectType({
  name: 'CreateVendorInfo',
  fields: {
    payer: { type: new GraphQLNonNull(GraphQLString) },
    global: { type: new GraphQLNonNull(GraphQLString) },
    adminKey: { type: new GraphQLNonNull(GraphQLString) },
    vendor: { type: new GraphQLNonNull(GraphQLString) },
    systemProgram: { type: new GraphQLNonNull(GraphQLString) },
    args: { type: new GraphQLNonNull(CreateVendorArgs) },
  },
})

export const CreateVendorEvent = new GraphQLObjectType({
  name: 'CreateVendorEvent',
  interfaces: [Event],
  isTypeOf: (item) => item.type === InstructionType.CreateVendor,
  fields: {
    ...commonEventFields,
    info: { type: new GraphQLNonNull(CreateVendorInfo) },
  },
})

/*----------------------------------------------------------------------*/

export const CreateProductCollectionInfo = new GraphQLObjectType({
  name: 'CreateProductCollectionInfo',
  fields: {
    payer: { type: new GraphQLNonNull(GraphQLString) },
    vendor: { type: new GraphQLNonNull(GraphQLString) },
    vendorAuthority: { type: new GraphQLNonNull(GraphQLString) },
    global: { type: new GraphQLNonNull(GraphQLString) },
    product: { type: new GraphQLNonNull(GraphQLString) },
    systemProgram: { type: new GraphQLNonNull(GraphQLString) },
    args: { type: new GraphQLNonNull(CreateProductCollectionArgs) },
  },
})

export const CreateProductCollectionEvent = new GraphQLObjectType({
  name: 'CreateProductCollectionEvent',
  interfaces: [Event],
  isTypeOf: (item) => item.type === InstructionType.CreateProductCollection,
  fields: {
    ...commonEventFields,
    info: { type: new GraphQLNonNull(CreateProductCollectionInfo) },
  },
})

/*----------------------------------------------------------------------*/

export const CreateDeviceAndDidInfo = new GraphQLObjectType({
  name: 'CreateDeviceAndDidInfo',
  fields: {
    payer: { type: new GraphQLNonNull(GraphQLString) },
    vendor: { type: new GraphQLNonNull(GraphQLString) },
    vendorAuthority: { type: new GraphQLNonNull(GraphQLString) },
    product: { type: new GraphQLNonNull(GraphQLString) },
    device: { type: new GraphQLNonNull(GraphQLString) },
    deviceDid: { type: new GraphQLNonNull(GraphQLString) },
    treasury: { type: new GraphQLNonNull(GraphQLString) },
    admin: { type: new GraphQLNonNull(GraphQLString) },
    global: { type: new GraphQLNonNull(GraphQLString) },
    systemProgram: { type: new GraphQLNonNull(GraphQLString) },
    args: { type: new GraphQLNonNull(CreateDeviceAndDidArgs) },
  },
})

export const CreateDeviceAndDidEvent = new GraphQLObjectType({
  name: 'CreateDeviceAndDidEvent',
  interfaces: [Event],
  isTypeOf: (item) => item.type === InstructionType.CreateDeviceAndDid,
  fields: {
    ...commonEventFields,
    info: { type: new GraphQLNonNull(CreateDeviceAndDidInfo) },
  },
})

/*----------------------------------------------------------------------*/

export const ActivateDeviceInfo = new GraphQLObjectType({
  name: 'ActivateDeviceInfo',
  fields: {
    payer: { type: new GraphQLNonNull(GraphQLString) },
    device: { type: new GraphQLNonNull(GraphQLString) },
    args: { type: new GraphQLNonNull(ActivateDeviceArgs) },
  },
})

export const ActivateDeviceEvent = new GraphQLObjectType({
  name: 'ActivateDeviceEvent',
  interfaces: [Event],
  isTypeOf: (item) => item.type === InstructionType.ActivateDevice,
  fields: {
    ...commonEventFields,
    info: { type: new GraphQLNonNull(ActivateDeviceInfo) },
  },
})

/*----------------------------------------------------------------------*/

export const Events = new GraphQLList(Event)

export const types = [
  InitializeAdminEvent,
  InitializeGlobalEvent,
  CreateVendorEvent,
  CreateProductCollectionEvent,
  CreateDeviceAndDidEvent,
  ActivateDeviceEvent,
]
