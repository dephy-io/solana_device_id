use crate::state::*;
use anchor_lang::prelude::*;

#[derive(AnchorDeserialize, AnchorSerialize, Clone)]
pub struct CreateVendorArgs {
    pub name: String,
    pub authority: Pubkey,
}

#[derive(Accounts)]
#[instruction(args: CreateVendorArgs)]
pub struct CreateVendor<'info> {
    #[account(mut)]
    pub payer: Signer<'info>,
    #[account(
        mut,
        seeds = [b"global"],
        bump = global.bump_seed,
        constraint = global.authority == admin_key.key()
    )]
    pub global: Account<'info, Global>,
    pub admin_key: Signer<'info>,
    #[account(
        init,
        payer = payer,
        space = 8 + 4 + args.name.len() + Vendor::SIZE,
        seeds = [b"vendor", args.authority.key().as_ref()],
        bump,
    )]
    pub vendor: Account<'info, Vendor>,
    pub system_program: Program<'info, System>,
}

impl<'info> CreateVendor<'info> {
    pub fn handler(ctx: Context<CreateVendor>, args: CreateVendorArgs) -> Result<()> {
        ctx.accounts.vendor.set_inner(Vendor {
            name: args.name,
            authority: args.authority,
            bump_seed: ctx.bumps.vendor,
        });
        let global = &mut ctx.accounts.global;
        global.allow_reg_addr.push(args.authority);
        Ok(())
    }
}
