import { adminDiscriminator, adminBeet, globalDiscriminator, globalBeet, vendorDiscriminator, vendorBeet, productDiscriminator, productBeet, deviceDiscriminator, deviceBeet, didDiscriminator, didBeet, } from './solita/index.js';
export var AccountType;
(function (AccountType) {
    AccountType["Admin"] = "Admin";
    AccountType["Global"] = "Global";
    AccountType["Vendor"] = "Vendor";
    AccountType["Product"] = "Product";
    AccountType["Device"] = "Device";
    AccountType["Did"] = "Did";
})(AccountType || (AccountType = {}));
export const ACCOUNT_DISCRIMINATOR = {
    [AccountType.Admin]: Buffer.from(adminDiscriminator),
    [AccountType.Global]: Buffer.from(globalDiscriminator),
    [AccountType.Vendor]: Buffer.from(vendorDiscriminator),
    [AccountType.Product]: Buffer.from(productDiscriminator),
    [AccountType.Device]: Buffer.from(deviceDiscriminator),
    [AccountType.Did]: Buffer.from(didDiscriminator),
};
export const ACCOUNTS_DATA_LAYOUT = {
    [AccountType.Admin]: adminBeet,
    [AccountType.Global]: globalBeet,
    [AccountType.Vendor]: vendorBeet,
    [AccountType.Product]: productBeet,
    [AccountType.Device]: deviceBeet,
    [AccountType.Did]: didBeet,
};
