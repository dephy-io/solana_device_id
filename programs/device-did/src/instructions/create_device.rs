use crate::state::*;
use anchor_lang::prelude::*;

// 加解密，验证时间

#[derive(Accounts)]
pub struct CreateDevice<'info> {
    #[account(mut)]
    pub payer: Signer<'info>,
    #[account(
        seeds = [b"vendor", vendor_authority.key().as_ref()],
        bump = vendor.bump_seed,
        constraint = vendor.authority == vendor_authority.key(),
    )]
    pub vendor: Account<'info, Vendor>,
    pub vendor_authority: Signer<'info>,
    #[account(
        seeds = [b"product", product.name.as_bytes(), vendor_authority.key().as_ref()],
        bump = product.bump_seed,
    )]
    pub product: Account<'info, Product>,
    #[account(
        init,
        payer = payer,
        space = 8 + Device::SIZE,
        signer,
    )]
    pub device: Account<'info, Device>,
    pub system_program: Program<'info, System>,
}

impl<'info> CreateDevice<'info> {
    pub fn handler(ctx: Context<CreateDevice>) -> Result<()> {
        // let time = Clock::get();
        ctx.accounts.device.set_inner(Device {
            holder: ctx.accounts.vendor_authority.key(),
            device_state: DeviceState::Frozen,
            device_did_address: None,
        });
        ctx.accounts.product.devices_nums.checked_add(1).unwrap();
        Ok(())
    }
}
