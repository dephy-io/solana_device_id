use crate::state::*;
use anchor_lang::prelude::*;

#[derive(AnchorDeserialize, AnchorSerialize, Clone)]
pub struct ActivateDeviceArgs {
    pub user: Pubkey,
    pub message: String,
}

// 拿到设备激活码
// 密码学验证
// owner 的钱包的签名激活码
// 1. 用户拿到设备的激活码
// 2. 用户签名激活码，激活码基于时间戳，712 定义了结构体
// 3. ecc rocover
#[derive(Accounts)]
pub struct ActivateDevice<'info> {
    #[account(mut)]
    pub payer: Signer<'info>,
    #[account(
        mut, 
        constraint = vendor_authority.key() == device.holder.key(),
        signer,
    )]
    pub device: Account<'info, Device>,
    /// CHECK: The vendor authority account used to check device account.
    /// CHECK: The default holder of device is vendor authority.
    pub vendor_authority: UncheckedAccount<'info>,
    /// CHECK: New holder of the device. Proxy is vendor authority. Not proxy is new user address.
    pub new_holder: UncheckedAccount<'info>,
}

impl <'info> ActivateDevice<'info> {
    pub fn handler(ctx: Context<ActivateDevice>) -> Result<()> {
        // Proxy: do nothing. Proxy: change holder field of the device.
        if ctx.accounts.new_holder.key() != ctx.accounts.vendor_authority.key() {
            ctx.accounts.device.holder = ctx.accounts.new_holder.key();
        }

        // 600 s 内

        // Change the status of device
        ctx.accounts.device.device_state = DeviceState::Active;
        Ok(())
    }
}