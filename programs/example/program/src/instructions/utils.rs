use super::stake::StakeAccounts;
use super::unstake::UnstakeAccounts;
use crate::state::UserStakedMint;
use anchor_lang::prelude::*;
use anchor_lang::solana_program::{entrypoint::ProgramResult, program::invoke_signed};
use mpl_token_metadata::instruction::{
    builders::{DelegateBuilder, LockBuilder, RevokeBuilder, UnlockBuilder},
    DelegateArgs, InstructionBuilder, LockArgs, RevokeArgs, UnlockArgs,
};

pub fn delegate_and_lock(ctx: &Context<StakeAccounts>) -> ProgramResult {
    let mint_key = ctx.accounts.mint.key();
    let signer_seeds = &[
        UserStakedMint::TAG,
        mint_key.as_ref(),
        &[*ctx.bumps.get("user_staked_mint").unwrap()],
    ];
    let signer = &[&signer_seeds[..]];

    delegate(&ctx, signer)?;

    lock(&ctx, signer)
}

pub fn unlock_and_revoke(ctx: &Context<UnstakeAccounts>) -> ProgramResult {
    let mint_key = ctx.accounts.mint.key();
    let signer_seeds = &[
        UserStakedMint::TAG,
        mint_key.as_ref(),
        &[*ctx.bumps.get("user_staked_mint").unwrap()],
    ];
    let signer = &[&signer_seeds[..]];

    unlock(&ctx, signer)?;

    revoke(&ctx, signer)
}

fn delegate(ctx: &Context<StakeAccounts>, signer: &[&[&[u8]]]) -> ProgramResult {
    let delegate_ix = DelegateBuilder::new()
        .delegate(ctx.accounts.user_staked_mint.key())
        .metadata(ctx.accounts.metadata.key())
        .master_edition(ctx.accounts.edition.key())
        .token_record(ctx.accounts.token_record.key())
        .mint(ctx.accounts.mint.key())
        .token(ctx.accounts.token.key())
        .authority(ctx.accounts.owner.key())
        .payer(ctx.accounts.owner.key())
        .system_program(ctx.accounts.system_program.key())
        .sysvar_instructions(ctx.accounts.sysvar_instruction.key())
        .spl_token_program(ctx.accounts.token_program.key())
        .authorization_rules_program(ctx.accounts.mpl_token_auth_rules_program.key())
        .authorization_rules(ctx.accounts.authorization_rules.key())
        .build(DelegateArgs::StakingV1 {
            amount: 1,
            authorization_data: None,
        })
        .unwrap()
        .instruction();

    invoke_signed(
        &delegate_ix,
        &[
            ctx.accounts.user_staked_mint.to_account_info(),
            ctx.accounts.metadata.to_account_info(),
            ctx.accounts.edition.to_account_info(),
            ctx.accounts.token_record.to_account_info(),
            ctx.accounts.mint.to_account_info(),
            ctx.accounts.token.to_account_info(),
            ctx.accounts.owner.to_account_info(),
            ctx.accounts.owner.to_account_info(),
            ctx.accounts.system_program.to_account_info(),
            ctx.accounts.sysvar_instruction.to_account_info(),
            ctx.accounts.token_program.to_account_info(),
            ctx.accounts.mpl_token_auth_rules_program.to_account_info(),
            ctx.accounts.authorization_rules.to_account_info(),
        ],
        signer,
    )
}

fn revoke(ctx: &Context<UnstakeAccounts>, signer: &[&[&[u8]]]) -> ProgramResult {
    let revoke_ix = RevokeBuilder::new()
        .delegate(ctx.accounts.user_staked_mint.key())
        .metadata(ctx.accounts.metadata.key())
        .master_edition(ctx.accounts.edition.key())
        .token_record(ctx.accounts.token_record.key())
        .mint(ctx.accounts.mint.key())
        .token(ctx.accounts.token.key())
        .authority(ctx.accounts.owner.key())
        .payer(ctx.accounts.owner.key())
        .system_program(ctx.accounts.system_program.key())
        .sysvar_instructions(ctx.accounts.sysvar_instruction.key())
        .spl_token_program(ctx.accounts.token_program.key())
        .authorization_rules_program(ctx.accounts.mpl_token_auth_rules_program.key())
        .authorization_rules(ctx.accounts.authorization_rules.key())
        .build(RevokeArgs::StakingV1)
        .unwrap()
        .instruction();

    invoke_signed(
        &revoke_ix,
        &[
            ctx.accounts.user_staked_mint.to_account_info(),
            ctx.accounts.metadata.to_account_info(),
            ctx.accounts.edition.to_account_info(),
            ctx.accounts.token_record.to_account_info(),
            ctx.accounts.mint.to_account_info(),
            ctx.accounts.token.to_account_info(),
            ctx.accounts.user_staked_mint.to_account_info(),
            ctx.accounts.owner.to_account_info(),
            ctx.accounts.system_program.to_account_info(),
            ctx.accounts.sysvar_instruction.to_account_info(),
            ctx.accounts.token_program.to_account_info(),
            ctx.accounts.mpl_token_auth_rules_program.to_account_info(),
            ctx.accounts.authorization_rules.to_account_info(),
        ],
        signer,
    )
}

fn lock(ctx: &Context<StakeAccounts>, signer: &[&[&[u8]]]) -> ProgramResult {
    let lock_ix = LockBuilder::new()
        .authority(ctx.accounts.user_staked_mint.key())
        .token_owner(ctx.accounts.owner.key())
        .token(ctx.accounts.token.key())
        .mint(ctx.accounts.mint.key())
        .metadata(ctx.accounts.metadata.key())
        .edition(ctx.accounts.edition.key())
        .token_record(ctx.accounts.token_record.key())
        .payer(ctx.accounts.owner.key())
        .system_program(ctx.accounts.system_program.key())
        .sysvar_instructions(ctx.accounts.sysvar_instruction.key())
        .spl_token_program(ctx.accounts.token_program.key())
        .authorization_rules_program(ctx.accounts.mpl_token_auth_rules_program.key())
        .authorization_rules(ctx.accounts.authorization_rules.key())
        .build(LockArgs::V1 {
            authorization_data: None,
        })
        .unwrap()
        .instruction();

    invoke_signed(
        &lock_ix,
        &[
            ctx.accounts.user_staked_mint.to_account_info(),
            ctx.accounts.owner.to_account_info(),
            ctx.accounts.token.to_account_info(),
            ctx.accounts.mint.to_account_info(),
            ctx.accounts.metadata.to_account_info(),
            ctx.accounts.edition.to_account_info(),
            ctx.accounts.token_record.to_account_info(),
            ctx.accounts.owner.to_account_info(),
            ctx.accounts.system_program.to_account_info(),
            ctx.accounts.sysvar_instruction.to_account_info(),
            ctx.accounts.token_program.to_account_info(),
            ctx.accounts.mpl_token_auth_rules_program.to_account_info(),
            ctx.accounts.authorization_rules.to_account_info(),
        ],
        signer,
    )
}

fn unlock(ctx: &Context<UnstakeAccounts>, signer: &[&[&[u8]]]) -> ProgramResult {
    let unlock_ix = UnlockBuilder::new()
        .authority(ctx.accounts.user_staked_mint.key())
        .token_owner(ctx.accounts.owner.key())
        .token(ctx.accounts.token.key())
        .mint(ctx.accounts.mint.key())
        .metadata(ctx.accounts.metadata.key())
        .edition(ctx.accounts.edition.key())
        .token_record(ctx.accounts.token_record.key())
        .payer(ctx.accounts.owner.key())
        .system_program(ctx.accounts.system_program.key())
        .sysvar_instructions(ctx.accounts.sysvar_instruction.key())
        .spl_token_program(ctx.accounts.token_program.key())
        .authorization_rules_program(ctx.accounts.mpl_token_auth_rules_program.key())
        .authorization_rules(ctx.accounts.authorization_rules.key())
        .build(UnlockArgs::V1 {
            authorization_data: None,
        })
        .unwrap()
        .instruction();

    invoke_signed(
        &unlock_ix,
        &[
            ctx.accounts.user_staked_mint.to_account_info(),
            ctx.accounts.owner.to_account_info(),
            ctx.accounts.token.to_account_info(),
            ctx.accounts.mint.to_account_info(),
            ctx.accounts.metadata.to_account_info(),
            ctx.accounts.edition.to_account_info(),
            ctx.accounts.token_record.to_account_info(),
            ctx.accounts.owner.to_account_info(),
            ctx.accounts.system_program.to_account_info(),
            ctx.accounts.sysvar_instruction.to_account_info(),
            ctx.accounts.token_program.to_account_info(),
            ctx.accounts.mpl_token_auth_rules_program.to_account_info(),
            ctx.accounts.authorization_rules.to_account_info(),
        ],
        signer,
    )
}
