use crate::error::ErrorCode;
use crate::state::*;
use crate::utils::secp256k1_recover_verify;
use anchor_lang::prelude::*;
use anchor_lang::solana_program::sysvar::clock;

#[derive(AnchorDeserialize, AnchorSerialize, Clone)]
pub struct ActivateDeviceArgs {
    pub public_key: [u8; 64],
    pub message: Vec<u8>,
    pub signature: [u8; 64],
    pub recovery_id: u8,
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
    #[account(mut)]
    pub device: Account<'info, Device>,
}

impl<'info> ActivateDevice<'info> {
    pub fn handler(ctx: Context<ActivateDevice>, args: ActivateDeviceArgs) -> Result<()> {
        // Verify secp256k1 signature
        secp256k1_recover_verify(
            &args.public_key,
            &args.message,
            &args.signature,
            &args.recovery_id,
        )?;

        // the message need to be within half an hour, which 1800s
        let clock_time = clock::Clock::get()?.unix_timestamp;
        let bytes_message: &[u8] = &args.message;
        let message_time = i64::from_be_bytes(bytes_message.try_into().unwrap());
        require!(
            clock_time - message_time <= 1800,
            ErrorCode::InvalidValidationTime
        );

        // update device owner
        ctx.accounts.device.holder = args.public_key;

        // Change the status of device
        ctx.accounts.device.device_state = DeviceState::Active;
        Ok(())
    }
}
