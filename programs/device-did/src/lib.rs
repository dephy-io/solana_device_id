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

    // Administrator: Start
    pub fn initialize_admin(
        ctx: Context<InitializeAdmin>,
        args: InitializeAdminArgs,
    ) -> Result<()> {
        initialize_admin::InitializeAdmin::handler(ctx, args)
    }

    pub fn initialize_global(
        ctx: Context<InitializeGlobal>,
        args: InitializeGlobalArgs,
    ) -> Result<()> {
        initialize_global::InitializeGlobal::handler(ctx, args)
    }
    // Administrator: End

    // Vendor: Start
    pub fn create_vendor(_ctx: Context<CreateVendor>) -> Result<()> {
        Ok(())
    }

    pub fn create_product_collection(_ctx: Context<CreateProductCollection>) -> Result<()> {
        Ok(())
    }

    // 只要传设备的公钥即可
    pub fn mint_device_did(_ctx: Context<MintDeviceDid>) -> Result<()> {
        Ok(())
    }

    pub fn activate_device(_ctx: Context<ActivateDevice>) -> Result<()> {
        Ok(())
    }
    // Vendor: End

    // Device: Start
    // vendor 只能拿到设备的公钥
    // 设备有生成钱包的功能
    // 设备老化，质检
    // 由 device 申请，user profile
    pub fn create_device(_ctx: Context<CreateDevice>) -> Result<()> {
        Ok(())
    }
    // Device: End
}
