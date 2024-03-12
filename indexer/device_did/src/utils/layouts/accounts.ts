import {
  adminDiscriminator,
  adminBeet,
  globalDiscriminator,
  globalBeet,
  vendorDiscriminator,
  vendorBeet,
  productDiscriminator,
  productBeet,
  deviceDiscriminator,
  deviceBeet,
  didDiscriminator,
  didBeet,
} from './solita/index.js'

export enum AccountType {
  Admin = 'Admin',
  Global = 'Global',
  Vendor = 'Vendor',
  Product = 'Product',
  Device = 'Device',
  Did = 'Did',
}

export const ACCOUNT_DISCRIMINATOR: Record<AccountType, Buffer> = {
  [AccountType.Admin]: Buffer.from(adminDiscriminator),
  [AccountType.Global]: Buffer.from(globalDiscriminator),
  [AccountType.Vendor]: Buffer.from(vendorDiscriminator),
  [AccountType.Product]: Buffer.from(productDiscriminator),
  [AccountType.Device]: Buffer.from(deviceDiscriminator),
  [AccountType.Did]: Buffer.from(didDiscriminator),
}

export const ACCOUNTS_DATA_LAYOUT: Record<AccountType, any> = {
  [AccountType.Admin]: adminBeet,
  [AccountType.Global]: globalBeet,
  [AccountType.Vendor]: vendorBeet,
  [AccountType.Product]: productBeet,
  [AccountType.Device]: deviceBeet,
  [AccountType.Did]: didBeet,
}
