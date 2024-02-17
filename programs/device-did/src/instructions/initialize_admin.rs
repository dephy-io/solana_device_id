use anchor_lang::prelude::*;

#[derive(Accounts)]
pub struct InitializeAdmin<'info> {
    pub system_program: Program<'info, System>,
}
