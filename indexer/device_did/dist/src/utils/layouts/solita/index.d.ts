/// <reference types="node" />
import { AccountMeta, PublicKey } from '@solana/web3.js';
export * from './accounts/index.js';
export * from './instructions/index.js';
export * from './types/index.js';
import { Admin, AdminArgs, Global, GlobalArgs, Vendor, VendorArgs, Product, ProductArgs, Device, DeviceArgs, Did, DidArgs } from './accounts/index.js';
import { ActivateDeviceArgs, CreateDeviceAndDidArgs, CreateProductCollectionArgs, CreateVendorArgs, InitializeAdminArgs, InitializeGlobalArgs, DeviceState } from './types/index.js';
export type InitializeAdminInstruction = {
    programId: PublicKey;
    keys: AccountMeta[];
    data: Buffer;
};
export declare const InitializeAdminAccounts: string[];
export type InitializeGlobalInstruction = {
    programId: PublicKey;
    keys: AccountMeta[];
    data: Buffer;
};
export declare const InitializeGlobalAccounts: string[];
export type CreateVendorInstruction = {
    programId: PublicKey;
    keys: AccountMeta[];
    data: Buffer;
};
export declare const CreateVendorAccounts: string[];
export type CreateProductCollectionInstruction = {
    programId: PublicKey;
    keys: AccountMeta[];
    data: Buffer;
};
export declare const CreateProductCollectionAccounts: string[];
export type CreateDeviceAndDidInstruction = {
    programId: PublicKey;
    keys: AccountMeta[];
    data: Buffer;
};
export declare const CreateDeviceAndDidAccounts: string[];
export type ActivateDeviceInstruction = {
    programId: PublicKey;
    keys: AccountMeta[];
    data: Buffer;
};
export declare const ActivateDeviceAccounts: string[];
export type ParsedInstructions = InitializeAdminInstruction | InitializeGlobalInstruction | CreateVendorInstruction | CreateProductCollectionInstruction | CreateDeviceAndDidInstruction | ActivateDeviceInstruction;
export type ParsedAccounts = Admin | Global | Vendor | Product | Device | Did;
export type ParsedAccountsData = AdminArgs | GlobalArgs | VendorArgs | ProductArgs | DeviceArgs | DidArgs;
export type ParsedTypes = DeviceState | ActivateDeviceArgs | CreateDeviceAndDidArgs | CreateProductCollectionArgs | CreateVendorArgs | InitializeAdminArgs | InitializeGlobalArgs;
//# sourceMappingURL=index.d.ts.map