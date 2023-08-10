use crate::state::UserStakedMint;
use anchor_lang::prelude::*;
use anchor_spl::token::Token;
use clockwork_sdk::{state::Thread, ThreadProgram};

#[derive(Accounts)]
#[instruction(lock_time: u64)]
pub struct StakeAccounts<'info> {
    #[account(
        init,
        payer = owner,
        seeds = [UserStakedMint::TAG, mint.key().as_ref()],
        bump,
        space = 8 + UserStakedMint::INIT_SPACE
    )]
    pub user_staked_mint: Box<Account<'info, UserStakedMint>>,

    #[account(mut)]
    /// Owner of the NFT to stake
    pub owner: Signer<'info>,

    /// Address to assign to the newly created thread.
    #[account(
        mut,
        address = Thread::pubkey(thread_authority.key(), UserStakedMint::get_thread_id(user_staked_mint.key()))
    )]
    /// CHECK: will be initialized by thread program
    pub thread: UncheckedAccount<'info>,

    /// The pda that will own and manage the thread.
    #[account(
        seeds = [mint.key().as_ref()],
        bump
    )]
    pub thread_authority: SystemAccount<'info>,

    /// Token metadata program accounts

    /// CHECK: will be checked by mpl-token-metadata CPI
    pub mint: UncheckedAccount<'info>,

    #[account(mut)]
    /// CHECK: will be checked by mpl-token-metadata CPI
    pub token: UncheckedAccount<'info>,

    #[account(mut)]
    /// CHECK: will be checked by mpl-token-metadata CPI
    pub token_record: UncheckedAccount<'info>,

    /// CHECK: deserialization and further checks by mpl-token-metadata CPI
    #[account(
        mut,
        seeds = [b"metadata", mpl_token_metadata::id().as_ref(), mint.key().as_ref()],
        seeds::program = mpl_token_metadata::id(),
        bump,
    )]
    pub metadata: AccountInfo<'info>,

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
