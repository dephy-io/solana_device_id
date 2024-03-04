use anchor_lang::prelude::*;
use solana_program::instruction::Instruction;
use solana_program::sysvar::instructions::{load_instruction_at_checked, ID as IX_ID};

pub mod tools;

declare_id!("1234WPYMnkT2bx5MB3uLmixeDuaCHDpd3mXNhZGimKWg");

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
    // 设备的签名不需要
    pub fn create_device(ctx: Context<CreateDevice>) -> Result<()> {
        create_device::CreateDevice::handler(ctx)
    }

    // 只要传设备的公钥即可
    // 当为一个设备 mint 一个 did 的时候，需要向指定账户转账一定金额的 SOL（在 global 中有配置数量）
    pub fn mint_device_did(ctx: Context<MintDeviceDid>, args: MintDeviceDidArgs) -> Result<()> {
        mint_device_did::MintDeviceDid::handler(ctx, args)
    }
    // Vendor: End

    // User: Start
    // 只需要有设备的签名就可以
    pub fn activate_device(ctx: Context<ActivateDevice>) -> Result<()> {
        activate_device::ActivateDevice::handler(ctx)
    }
    // User: End

    pub fn verify_secp(
        ctx: Context<Verify>,
        eth_address: [u8; 20],
        msg: Vec<u8>,
        sig: [u8; 64],
        recovery_id: u8,
    ) -> Result<()> {
        // Get what should be the Secp256k1Program instruction
        let ix: Instruction = load_instruction_at_checked(0, &ctx.accounts.ix_sysvar)?;

        // Check that ix is what we expect to have been sent
        tools::verify_secp256k1_ix(&ix, &eth_address, &msg, &sig, recovery_id)?;

        // Do other stuff

        Ok(())
    }

}

/// Context accounts
#[derive(Accounts)]
pub struct Verify<'info> {
    pub sender: Signer<'info>,

    /// CHECK: The address check is needed because otherwise
    /// the supplied Sysvar could be anything else.
    /// The Instruction Sysvar has not been implemented
    /// in the Anchor framework yet, so this is the safe approach.
    #[account(address = IX_ID)]
    pub ix_sysvar: AccountInfo<'info>,
}