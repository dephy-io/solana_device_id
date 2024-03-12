import * as solita from './solita/index.js';
export var InstructionType;
(function (InstructionType) {
    InstructionType["InitializeAdmin"] = "InitializeAdmin";
    InstructionType["InitializeGlobal"] = "InitializeGlobal";
    InstructionType["CreateVendor"] = "CreateVendor";
    InstructionType["CreateProductCollection"] = "CreateProductCollection";
    InstructionType["CreateDeviceAndDid"] = "CreateDeviceAndDid";
    InstructionType["ActivateDevice"] = "ActivateDevice";
})(InstructionType || (InstructionType = {}));
/*----------------------------------------------------------------------*/
export function getInstructionType(data) {
    const discriminator = data.slice(0, 8);
    return IX_METHOD_CODE.get(discriminator.toString('ascii'));
}
export const IX_METHOD_CODE = new Map([
    [
        Buffer.from(solita.initializeAdminInstructionDiscriminator).toString('ascii'),
        InstructionType.InitializeAdmin,
    ],
    [
        Buffer.from(solita.initializeGlobalInstructionDiscriminator).toString('ascii'),
        InstructionType.InitializeGlobal,
    ],
    [
        Buffer.from(solita.createVendorInstructionDiscriminator).toString('ascii'),
        InstructionType.CreateVendor,
    ],
    [
        Buffer.from(solita.createProductCollectionInstructionDiscriminator).toString('ascii'),
        InstructionType.CreateProductCollection,
    ],
    [
        Buffer.from(solita.createDeviceAndDidInstructionDiscriminator).toString('ascii'),
        InstructionType.CreateDeviceAndDid,
    ],
    [
        Buffer.from(solita.activateDeviceInstructionDiscriminator).toString('ascii'),
        InstructionType.ActivateDevice,
    ],
]);
export const IX_DATA_LAYOUT = {
    [InstructionType.InitializeAdmin]: solita.initializeAdminStruct,
    [InstructionType.InitializeGlobal]: solita.initializeGlobalStruct,
    [InstructionType.CreateVendor]: solita.createVendorStruct,
    [InstructionType.CreateProductCollection]: solita.createProductCollectionStruct,
    [InstructionType.CreateDeviceAndDid]: solita.createDeviceAndDidStruct,
    [InstructionType.ActivateDevice]: solita.activateDeviceStruct,
};
export const IX_ACCOUNTS_LAYOUT = {
    [InstructionType.InitializeAdmin]: solita.InitializeAdminAccounts,
    [InstructionType.InitializeGlobal]: solita.InitializeGlobalAccounts,
    [InstructionType.CreateVendor]: solita.CreateVendorAccounts,
    [InstructionType.CreateProductCollection]: solita.CreateProductCollectionAccounts,
    [InstructionType.CreateDeviceAndDid]: solita.CreateDeviceAndDidAccounts,
    [InstructionType.ActivateDevice]: solita.ActivateDeviceAccounts,
};
