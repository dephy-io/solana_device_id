export * from './Admin.js'
export * from './Device.js'
export * from './Did.js'
export * from './Global.js'
export * from './Product.js'
export * from './Vendor.js'

import { Admin } from './Admin.js'
import { Global } from './Global.js'
import { Vendor } from './Vendor.js'
import { Product } from './Product.js'
import { Device } from './Device.js'
import { Did } from './Did.js'

export const accountProviders = { Admin, Global, Vendor, Product, Device, Did }
