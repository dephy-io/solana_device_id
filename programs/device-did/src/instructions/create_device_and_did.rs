use crate::error::ErrorCode;
use crate::state::*;
use anchor_lang::{
    prelude::*,
    system_program::{transfer, Transfer},
};

#[derive(AnchorDeserialize, AnchorSerialize, Clone)]
pub struct CreateDeviceAndDidArgs {
    pub name: String,
    pub serial_num: String,
    pub mint_at: u64,
}

#[derive(Accounts)]
#[instruction(args: CreateDeviceAndDidArgs)]
pub struct CreateDeviceAndDid<'info> {
    #[account(mut)]
    pub payer: Signer<'info>,

    #[account(
        seeds = [b"vendor", vendor_authority.key().as_ref()],
        bump = vendor.bump_seed,
        constraint = vendor.authority == vendor_authority.key() @ ErrorCode::InvalidVendorKey,
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
    )]
    pub device: Account<'info, Device>,

    #[account(
        init,
        payer = payer,
        space = 8 + 4 + args.name.len() + 4 + args.serial_num.len() + Did::SIZE,
        seeds = [b"did", device.key().as_ref()],
        bump,
    )]
    pub device_did: Account<'info, Did>,

    /// CHECK: The account accept the service fee from vendor.
    #[account(mut)]
    pub treasury: UncheckedAccount<'info>,
    #[account(
        seeds = [b"admin"],
        bump = admin.bump_seed,
        constraint = admin.treasury == treasury.key() @ ErrorCode::InvalidTreasury,
    )]
    pub admin: Account<'info, Admin>,
    #[account(seeds = [b"global"], bump = global.bump_seed)]
    pub global: Account<'info, Global>,

    pub system_program: Program<'info, System>,
}

impl<'info> CreateDeviceAndDid<'info> {
    pub fn handler(ctx: Context<CreateDeviceAndDid>, args: CreateDeviceAndDidArgs) -> Result<()> {
        // Charge for service
        let transfer_ctx = CpiContext::new(
            ctx.accounts.system_program.to_account_info(),
            Transfer {
                from: ctx.accounts.payer.to_account_info(),
                to: ctx.accounts.treasury.to_account_info(),
            },
        );
        transfer(transfer_ctx, ctx.accounts.global.reg_fee)?;

        // Update the information of Did
        ctx.accounts.device_did.set_inner(Did {
            name: args.name,
            serial_num: args.serial_num,
            mint_at: args.mint_at,
            owner: ctx.accounts.device.key(),
            bump_seed: ctx.bumps.device_did,
        });

        ctx.accounts.device.set_inner(Device {
            holder: [0; 64],
            device_state: DeviceState::Frozen,
            device_did_address: Some(ctx.accounts.device_did.key()), // Let the Did point to specific device
        });
        ctx.accounts.product.devices_nums.checked_add(1).unwrap();

        Ok(())
    }
}
