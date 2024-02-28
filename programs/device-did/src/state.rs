use anchor_lang::prelude::*;

// In the future, this account can transfer to DAO
#[account]
pub struct Admin {
    pub admin: Pubkey, // Administrator who can change global setting, accept vendor into our infrastructure.
    pub authority: Pubkey, // Authority to change Admin account, top super account.
    pub treasury: Pubkey, // Gather service fees from vendors
    pub bump_seed: u8,
}

impl Admin {
    pub const SIZE: usize = 32 + 32 + 32 + 1;
}

#[account]
pub struct Global {
    pub reg_fee: u64, // When vendor mint a did, we charge a service fee in lamports (SOL).
    pub authority: Pubkey, // The authority to allow vendor to enter our service.
    pub bump_seed: u8,
    pub allow_reg_addr: Vec<Pubkey>, // Conntains vendors who have entered our service.
}

impl Global {
    // In the begining, there is no pubkey in the allow_reg_addr field, but empty vector need 4 bytes.
    // Reserve 3 vendor pubblic key
    pub const SIZE: usize = 8 + 32 + 1 + 4 + (32 * 3);
}

#[account]
pub struct Vendor {
    pub name: String,      // The name of the vendor.
    pub authority: Pubkey, // The authority from vendor, and it accepts to create its collection, device and did.
    pub bump_seed: u8,
}

impl Vendor {
    // Vendor.name isn't included in SIZE.
    pub const SIZE: usize = 32 + 1;
}

#[account]
pub struct Product {
    pub name: String,      // The name of the product collection.
    pub devices_nums: u32, // The number of devices in the collection. Select u32 to contain enough devices.
    pub bump_seed: u8,
}

impl Product {
    pub const SIZE: usize = 4 + 1;
}

#[account]
pub struct Device {
    // The address who hold and have the ownership of the device.
    // The default holder is vendor address.
    // When the device is activated, the holder field will change to the user address.
    pub holder: Pubkey,
    pub device_state: DeviceState, // The state of the device, default is Frozen.
    pub device_did_address: Option<Pubkey>, // Specific did for the divice, default is None.
}

impl Device {
    // DeviceState use 1 bytes
    pub const SIZE: usize = 32 + 1 + 1 + 32 + 1;
}

#[account]
pub struct Did {
    pub name: String,       // Specific name of the device.
    pub serial_num: String, // The unique identity of the device.
    pub mint_at: u32,       // Timestamp when the did has been minted. It is input by the vendor.
    pub owner: Pubkey,      // The device who has ownership of the did.
    pub bump_seed: u8,
}

impl Did {
    pub const SIZE: usize = 8 + 32 + 1;
}

#[derive(Clone, AnchorDeserialize, AnchorSerialize)]
pub enum DeviceState {
    /// The initial state of the device.
    Frozen = 0,
    /// The device has been actived.
    Active = 1,
    /// The device has been locked when something wrong with the device.
    Lock = 2,
}
