/// <reference types="node" />
export declare enum AccountType {
    Admin = "Admin",
    Global = "Global",
    Vendor = "Vendor",
    Product = "Product",
    Device = "Device",
    Did = "Did"
}
export declare const ACCOUNT_DISCRIMINATOR: Record<AccountType, Buffer>;
export declare const ACCOUNTS_DATA_LAYOUT: Record<AccountType, any>;
//# sourceMappingURL=accounts.d.ts.map