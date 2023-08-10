use super::UnstakeAccounts;
use crate::error::ErrorCode;
use crate::instructions::utils::unlock_and_revoke;
use anchor_lang::prelude::*;
use clockwork_sdk::cpi::ThreadDelete;

pub fn unstake(ctx: Context<UnstakeAccounts>) -> Result<()> {
    let user_staked_mint = &mut ctx.accounts.user_staked_mint;

    if user_staked_mint.user != ctx.accounts.owner.key() {
        return Err(ErrorCode::NotOwnerOfMint.into());
    }

    if !user_staked_mint.expired {
        return Err(ErrorCode::NotExpired.into());
    }

    unlock_and_revoke(&ctx)?;

    cleanup(&ctx)?;

    Ok(())
}

fn cleanup(ctx: &Context<UnstakeAccounts>) -> Result<()> {
    if !ctx.accounts.thread.data_is_empty() {
        let bump = *ctx.bumps.get("thread_authority").unwrap();
        clockwork_sdk::cpi::thread_delete(CpiContext::new_with_signer(
            ctx.accounts.thread_program.to_account_info(),
            ThreadDelete {
                authority: ctx.accounts.thread_authority.to_account_info(),
                close_to: ctx.accounts.owner.to_account_info(),
                thread: ctx.accounts.thread.to_account_info(),
            },
            &[&[ctx.accounts.mint.key().as_ref(), &[bump]]],
        ))?;
    }

    Ok(())
}
