use crate::error::ErrorCode;
use crate::state::*;
use anchor_lang::prelude::*;

#[derive(AnchorDeserialize, AnchorSerialize, Clone)]
pub struct CreateProductCollectionArgs {
    name: String,
}

#[derive(Accounts)]
#[instruction(args: CreateProductCollectionArgs)]
pub struct CreateProductCollection<'info> {
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
        seeds = [b"global"],
        bump = global.bump_seed,
    )]
    pub global: Account<'info, Global>,
    #[account(
        init,
        payer = payer,
        space = 8 + 4 + args.name.len() + Product::SIZE,
        seeds = [b"product", args.name.as_bytes(), vendor_authority.key().as_ref()],
        bump
    )]
    pub product: Account<'info, Product>,
    pub system_program: Program<'info, System>,
}

impl<'info> CreateProductCollection<'info> {
    pub fn handler(
        ctx: Context<CreateProductCollection>,
        args: CreateProductCollectionArgs,
    ) -> Result<()> {
        let allow_addr = &mut ctx.accounts.global.allow_reg_addr;
        require!(
            allow_addr.contains(ctx.accounts.vendor_authority.key),
            ErrorCode::InvalidVendorKey
        );
        ctx.accounts.product.set_inner(Product {
            name: args.name,
            devices_nums: 0,
            bump_seed: ctx.bumps.product,
        });
        Ok(())
    }
}
