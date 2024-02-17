use anchor_lang::prelude::*;

#[account]
pub struct Admin {
    pub admin: Pubkey,

    pub bump_seed: u8,
}

impl Admin {
    pub const MAX_SIZE: usize = 0;
}

#[account]
pub struct Global {
    pub reg_fee: u64,
    pub allow_reg_addr: Vec<Pubkey>,
    pub authority: Pubkey,

    pub bump_seed: u8,
}

#[account]
pub struct Vendor {
    pub name: String,
    pub authority: Pubkey,

    pub bump_seed: u8,
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
    pub seriers_num: String,
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
