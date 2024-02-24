use crate::state::*;
use anchor_lang::prelude::*;

#[derive(AnchorDeserialize, AnchorSerialize, Clone)]
pub struct InitializeAdminArgs {
    pub admin: Pubkey,
    pub authority: Pubkey,
    pub treasury: Pubkey,
}

#[derive(Accounts)]
pub struct InitializeAdmin<'info> {
    #[account(mut)]
    pub payer: Signer<'info>,
    #[account(
        init,
        payer = payer,
        space = 8 + Admin::SIZE,
        seeds = [b"admin"],
        bump,
    )]
    pub admin: Account<'info, Admin>,
    pub system_program: Program<'info, System>,
}

impl<'info> InitializeAdmin<'info> {
    pub fn handler(ctx: Context<InitializeAdmin>, args: InitializeAdminArgs) -> Result<()> {
        ctx.accounts.admin.set_inner(Admin {
            admin: args.admin,
            authority: args.authority,
            treasury: args.treasury,
            bump_seed: ctx.bumps.admin,
        });
        Ok(())
    }
}
