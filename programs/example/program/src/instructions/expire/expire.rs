use super::ExpireAccounts;
use crate::error::ErrorCode;
use anchor_lang::prelude::*;

pub fn expire(ctx: Context<ExpireAccounts>) -> Result<()> {
    let now = Clock::get().unwrap().unix_timestamp;
    let user_staked_mint = &mut ctx.accounts.user_staked_mint;

    if now < user_staked_mint.start_time + user_staked_mint.lock_time {
        return Err(ErrorCode::LockTimeNotOver.into());
    }

    user_staked_mint.expired = true;

    Ok(())
}
