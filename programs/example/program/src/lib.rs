use anchor_lang::prelude::*;
use instructions::*;

pub mod error;
pub mod instructions;
pub mod state;

declare_id!("DSg74Tu4w2urxxmw7gdTz4GZUE4DCy2C7RrPr3mRgmuB");

#[program]
pub mod example {
    use super::*;

    pub fn stake(ctx: Context<StakeAccounts>, lock_time: i64) -> Result<()> {
        instructions::stake(ctx, lock_time)
    }

    pub fn expire(ctx: Context<ExpireAccounts>) -> Result<()> {
        instructions::expire(ctx)
    }

    pub fn unstake(ctx: Context<UnstakeAccounts>) -> Result<()> {
        instructions::unstake(ctx)
    }
}
