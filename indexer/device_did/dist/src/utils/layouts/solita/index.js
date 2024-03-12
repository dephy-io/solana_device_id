export * from './accounts/index.js';
export * from './instructions/index.js';
export * from './types/index.js';
export const InitializeAdminAccounts = ['payer', 'admin', 'systemProgram'];
export const InitializeGlobalAccounts = [
    'payer',
    'admin',
    'adminKey',
    'global',
    'systemProgram',
];
export const CreateVendorAccounts = [
    'payer',
    'global',
    'adminKey',
    'vendor',
    'systemProgram',
];
export const CreateProductCollectionAccounts = [
    'payer',
    'vendor',
    'vendorAuthority',
    'global',
    'product',
    'systemProgram',
];
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
];
export const ActivateDeviceAccounts = ['payer', 'device'];
