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
    pub fn create_vendor(ctx: Context<CreateVendor>, args: CreateVendorArgs) -> Result<()> {
        create_vendor::CreateVendor::handler(ctx, args)
    }

    pub fn create_product_collection(
        ctx: Context<CreateProductCollection>,
        args: CreateProductCollectionArgs,
    ) -> Result<()> {
        create_product_collection::CreateProductCollection::handler(ctx, args)
    }

    // vendor 只能拿到设备的公钥
    // 设备有生成钱包的功能
    // 设备老化，质检
    // 由 device 申请，user profile
    // create_device 的过程：
    // 1. 设备通过某种随机事件产生了私钥，vendor 无法知晓设备的私钥
    // 2. 创建设备信息是通过合约指令 create_device 写入到设备公钥对应地址的 data 中
    // 3. 设备根据这个指令打包好一个交易，并附上自己签名
    // 4. 将交易传递给 vendor，确认后需要附上 vendor 的签名，才能最终创建这个设备的信息
    pub fn create_device(ctx: Context<CreateDevice>) -> Result<()> {
        create_device::CreateDevice::handler(ctx)
    }

    // 只要传设备的公钥即可
    pub fn mint_device_did(_ctx: Context<MintDeviceDid>) -> Result<()> {
        Ok(())
    }
    // Vendor: End

    // User: Start
    // 只需要有设备的签名就可以
    pub fn activate_device(_ctx: Context<ActivateDevice>) -> Result<()> {
        Ok(())
    }
    // User: End
}
