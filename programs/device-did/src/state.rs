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
    pub name: String,
    pub bump_seed: u8,
}

#[account]
pub struct Device {
    pub holder: String,
    pub device_state: DeviceState,
    pub device_did_address: Pubkey,
    pub bump_seed: u8,
}

// The DID subject is stored in cNFT structure.
pub struct Did {
    pub name: String,
    pub mint_at: u32,
    pub serial_num: String,
    pub owner: Pubkey,
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
