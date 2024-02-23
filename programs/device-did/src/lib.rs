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

    // vendor 只能拿到设备的公钥
    // 设备有生成钱包的功能
    // 设备老化，质检
    // 由 device 申请，user profile
    pub fn create_device(_ctx: Context<CreateDevice>) -> Result<()> {
        Ok(())
    }

    // 只要传设备的公钥即可
    pub fn mint_device_did(_ctx: Context<MintDeviceDid>) -> Result<()> {
        Ok(())
    }

    pub fn activate_device(_ctx: Context<ActivateDevice>) -> Result<()> {
        Ok(())
    }
}
