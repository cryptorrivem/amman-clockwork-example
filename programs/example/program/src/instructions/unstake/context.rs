use crate::state::UserStakedMint;
use anchor_lang::prelude::*;
use anchor_spl::token::Token;
use clockwork_sdk::{state::Thread, ThreadProgram};

#[derive(Accounts)]
pub struct UnstakeAccounts<'info> {
    #[account(
        mut,
        seeds = [UserStakedMint::TAG, mint.key().as_ref()],
        bump,
        close = owner
    )]
    pub user_staked_mint: Box<Account<'info, UserStakedMint>>,

    #[account(mut)]
    /// Owner of the NFT to unstake
    pub owner: Signer<'info>,

    #[account(
        mut,
        address = Thread::pubkey(thread_authority.key(), UserStakedMint::get_thread_id(user_staked_mint.key()))
    )]
    /// CHECK: will be checked by clockwork CPI
    pub thread: UncheckedAccount<'info>,

    /// The Thread Admin
    /// The authority that was used as a seed to derive the thread address
    /// `thread_authority` should equal `thread.thread_authority`
    #[account(
            seeds = [mint.key().as_ref()],
            bump
        )]
    pub thread_authority: SystemAccount<'info>,

    /// Token metadata program accounts

    /// CHECK: will be checked by mpl-token-metadata CPI
    pub mint: UncheckedAccount<'info>,

    /// CHECK: will be checked by mpl-token-metadata CPI
    #[account(mut)]
    pub token: UncheckedAccount<'info>,

    /// CHECK: will be checked by mpl-token-metadata CPI
    #[account(mut)]
    pub token_record: UncheckedAccount<'info>,

    /// CHECK: will be checked by mpl-token-metadata CPI
    #[account(mut)]
    pub metadata: UncheckedAccount<'info>,

    /// CHECK: will be checked by mpl-token-metadata CPI
    pub edition: UncheckedAccount<'info>,

    /// CHECK: will be checked by mpl-token-metadata CPI
    pub authorization_rules: UncheckedAccount<'info>,

    /// Programs
    pub system_program: Program<'info, System>,

    /// CHECK: sysvar instruction program
    pub sysvar_instruction: UncheckedAccount<'info>,

    pub token_program: Program<'info, Token>,

    /// CHECK: token metadata program
    pub mpl_token_metadata_program: UncheckedAccount<'info>,

    /// CHECK: token authorization rules program
    pub mpl_token_auth_rules_program: UncheckedAccount<'info>,

    #[account(
        address = clockwork_sdk::ID
    )]
    pub thread_program: Program<'info, ThreadProgram>,
}
