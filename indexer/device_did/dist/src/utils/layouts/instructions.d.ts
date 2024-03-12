/// <reference types="node" />
import { EventBase } from '@aleph-indexer/framework';
import * as solita from './solita/index.js';
export declare enum InstructionType {
    InitializeAdmin = "InitializeAdmin",
    InitializeGlobal = "InitializeGlobal",
    CreateVendor = "CreateVendor",
    CreateProductCollection = "CreateProductCollection",
    CreateDeviceAndDid = "CreateDeviceAndDid",
    ActivateDevice = "ActivateDevice"
}
export type RawInstructionBase = {
    parsed: unknown;
    program: string;
    programId: string;
};
export type InitializeAdminAccountsInstruction = {
    payer: string;
    admin: string;
    systemProgram: string;
};
export type InitializeAdminInfo = solita.InitializeAdminInstructionArgs & InitializeAdminAccountsInstruction;
export type RawInitializeAdmin = RawInstructionBase & {
    parsed: {
        info: InitializeAdminInfo;
        type: InstructionType.InitializeAdmin;
    };
};
export type InitializeGlobalAccountsInstruction = {
    payer: string;
    admin: string;
    adminKey: string;
    global: string;
    systemProgram: string;
};
export type InitializeGlobalInfo = solita.InitializeGlobalInstructionArgs & InitializeGlobalAccountsInstruction;
export type RawInitializeGlobal = RawInstructionBase & {
    parsed: {
        info: InitializeGlobalInfo;
        type: InstructionType.InitializeGlobal;
    };
};
export type CreateVendorAccountsInstruction = {
    payer: string;
    global: string;
    adminKey: string;
    vendor: string;
    systemProgram: string;
};
export type CreateVendorInfo = solita.CreateVendorInstructionArgs & CreateVendorAccountsInstruction;
export type RawCreateVendor = RawInstructionBase & {
    parsed: {
        info: CreateVendorInfo;
        type: InstructionType.CreateVendor;
    };
};
export type CreateProductCollectionAccountsInstruction = {
    payer: string;
    vendor: string;
    vendorAuthority: string;
    global: string;
    product: string;
    systemProgram: string;
};
export type CreateProductCollectionInfo = solita.CreateProductCollectionInstructionArgs & CreateProductCollectionAccountsInstruction;
export type RawCreateProductCollection = RawInstructionBase & {
    parsed: {
        info: CreateProductCollectionInfo;
        type: InstructionType.CreateProductCollection;
    };
};
export type CreateDeviceAndDidAccountsInstruction = {
    payer: string;
    vendor: string;
    vendorAuthority: string;
    product: string;
    device: string;
    deviceDid: string;
    treasury: string;
    admin: string;
    global: string;
    systemProgram: string;
};
export type CreateDeviceAndDidInfo = solita.CreateDeviceAndDidInstructionArgs & CreateDeviceAndDidAccountsInstruction;
export type RawCreateDeviceAndDid = RawInstructionBase & {
    parsed: {
        info: CreateDeviceAndDidInfo;
        type: InstructionType.CreateDeviceAndDid;
    };
};
export type ActivateDeviceAccountsInstruction = {
    payer: string;
    device: string;
};
export type ActivateDeviceInfo = solita.ActivateDeviceInstructionArgs & ActivateDeviceAccountsInstruction;
export type RawActivateDevice = RawInstructionBase & {
    parsed: {
        info: ActivateDeviceInfo;
        type: InstructionType.ActivateDevice;
    };
};
export type RawInstructionsInfo = InitializeAdminInfo | InitializeGlobalInfo | CreateVendorInfo | CreateProductCollectionInfo | CreateDeviceAndDidInfo | ActivateDeviceInfo;
export type RawInstruction = RawInitializeAdmin | RawInitializeGlobal | RawCreateVendor | RawCreateProductCollection | RawCreateDeviceAndDid | RawActivateDevice;
export type InitializeAdminEvent = EventBase<InstructionType> & {
    info: InitializeAdminInfo;
    signer: string;
    account: string;
};
export type InitializeGlobalEvent = EventBase<InstructionType> & {
    info: InitializeGlobalInfo;
    signer: string;
    account: string;
};
export type CreateVendorEvent = EventBase<InstructionType> & {
    info: CreateVendorInfo;
    signer: string;
    account: string;
};
export type CreateProductCollectionEvent = EventBase<InstructionType> & {
    info: CreateProductCollectionInfo;
    signer: string;
    account: string;
};
export type CreateDeviceAndDidEvent = EventBase<InstructionType> & {
    info: CreateDeviceAndDidInfo;
    signer: string;
    account: string;
};
export type ActivateDeviceEvent = EventBase<InstructionType> & {
    info: ActivateDeviceInfo;
    signer: string;
    account: string;
};
export type DeviceDidEvent = InitializeAdminEvent | InitializeGlobalEvent | CreateVendorEvent | CreateProductCollectionEvent | CreateDeviceAndDidEvent | ActivateDeviceEvent;
export declare function getInstructionType(data: Buffer): InstructionType | undefined;
export declare const IX_METHOD_CODE: Map<string, InstructionType | undefined>;
export declare const IX_DATA_LAYOUT: Partial<Record<InstructionType, any>>;
export declare const IX_ACCOUNTS_LAYOUT: Partial<Record<InstructionType, any>>;
//# sourceMappingURL=instructions.d.ts.map