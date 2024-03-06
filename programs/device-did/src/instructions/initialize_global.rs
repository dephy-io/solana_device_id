use crate::error::ErrorCode;
use crate::state::*;
use anchor_lang::prelude::*;

#[derive(AnchorDeserialize, AnchorSerialize, Clone)]
pub struct InitializeGlobalArgs {
    pub reg_fee: u64,
}

#[derive(Accounts)]
pub struct InitializeGlobal<'info> {
    #[account(mut)]
    pub payer: Signer<'info>,
    #[account(
        seeds = [b"admin"],
        bump = admin.bump_seed
    )]
    pub admin: Account<'info, Admin>,
    #[account(constraint = admin.admin == admin_key.key() @ ErrorCode::InvalidAdmin)]
    pub admin_key: Signer<'info>,
    #[account(
        init,
        payer = payer,
        space = 8 + Global::SIZE,
        seeds = [b"global"],
        bump,
    )]
    pub global: Account<'info, Global>,
    pub system_program: Program<'info, System>,
}

impl<'info> InitializeGlobal<'info> {
    pub fn handler(ctx: Context<InitializeGlobal>, args: InitializeGlobalArgs) -> Result<()> {
        ctx.accounts.global.set_inner(Global {
            reg_fee: args.reg_fee,
            authority: ctx.accounts.admin_key.key(),
            bump_seed: ctx.bumps.global,
            allow_reg_addr: Vec::new(),
        });
        Ok(())
    }
}
