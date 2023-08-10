use super::StakeAccounts;
use crate::instructions::utils::delegate_and_lock;
use crate::state::UserStakedMint;
use crate::ID;
use anchor_lang::prelude::*;
use anchor_lang::InstructionData;
use clockwork_sdk::cpi::{thread_create, ThreadCreate};
use clockwork_sdk::state::Trigger;
use solana_program::instruction::Instruction;

pub fn stake(ctx: Context<StakeAccounts>, lock_time: i64) -> Result<()> {
    let start_time = Clock::get().unwrap().unix_timestamp;
    let user_staked_mint = &mut ctx.accounts.user_staked_mint;
    let thread_id = UserStakedMint::get_thread_id(user_staked_mint.key());

    user_staked_mint.set_inner(UserStakedMint {
        user: ctx.accounts.owner.key(),
        start_time,
        lock_time,
        expired: false,
    });

    delegate_and_lock(&ctx)?;

    schedule_expire(&ctx, start_time + lock_time as i64, thread_id)?;

    Ok(())
}

fn schedule_expire(ctx: &Context<StakeAccounts>, unix_ts: i64, thread_id: Vec<u8>) -> Result<()> {
    let expire_ix = Instruction {
        program_id: ID,
        accounts: crate::accounts::ExpireAccounts {
            user_staked_mint: ctx.accounts.user_staked_mint.key(),
            mint: ctx.accounts.mint.key(),
        }
        .to_account_metas(None),
        data: crate::instruction::Expire {}.data(),
    };

    let trigger = Trigger::Timestamp { unix_ts };

    let bump = *ctx.bumps.get("thread_authority").unwrap();
    thread_create(
        CpiContext::new_with_signer(
            ctx.accounts.thread_program.to_account_info(),
            ThreadCreate {
                payer: ctx.accounts.owner.to_account_info(),
                system_program: ctx.accounts.system_program.to_account_info(),
                thread: ctx.accounts.thread.to_account_info(),
                authority: ctx.accounts.thread_authority.to_account_info(),
            },
            &[&[ctx.accounts.mint.key().as_ref(), &[bump]]],
        ),
        10000,
        thread_id,
        vec![expire_ix.into()],
        trigger,
    )?;

    Ok(())
}
