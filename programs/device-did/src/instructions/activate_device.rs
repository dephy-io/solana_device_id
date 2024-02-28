use crate::state::*;
use anchor_lang::prelude::*;

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
        // Proxy: do notthing. Proxy: change holder field of the device.
        if ctx.accounts.new_holder.key() != ctx.accounts.vendor_authority.key() {
            ctx.accounts.device.holder = ctx.accounts.new_holder.key();
        }

        // Change the status of device
        ctx.accounts.device.device_state = DeviceState::Active;
        Ok(())
    }
}