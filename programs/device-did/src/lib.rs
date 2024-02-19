use anchor_lang::prelude::*;

declare_id!("CSg5Pxq7eA7F3bGhXdzv6YBBqrrecLNmoKR4jkkpTHzZ");

pub mod constants;
pub mod error;
pub mod instructions;
pub mod state;
pub mod utils;

pub use instructions::*;

#[program]
pub mod device_did {
    use super::*;

    pub fn initialize_admin(_ctx: Context<InitializeAdmin>) -> Result<()> {
        Ok(())
    }

    pub fn initialize_global(_ctx: Context<InitializeGlobal>) -> Result<()> {
        Ok(())
    }

    pub fn create_vendor(_ctx: Context<CreateVendor>) -> Result<()> {
        Ok(())
    }

    pub fn create_product_collection(_ctx: Context<CreateProductCollection>) -> Result<()> {
        Ok(())
    }

    pub fn create_device(_ctx: Context<CreateDevice>) -> Result<()> {
        Ok(())
    }

    pub fn mint_device_did(_ctx: Context<MintDeviceDid>) -> Result<()> {
        Ok(())
    }

    pub fn activate_device(_ctx: Context<ActivateDevice>) -> Result<()> {
        Ok(())
    }
}
