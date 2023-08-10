use crate::state::UserStakedMint;
use anchor_lang::prelude::*;
use anchor_spl::token::Mint;

#[derive(Accounts)]
pub struct ExpireAccounts<'info> {
    #[account(
        mut,
        seeds = [UserStakedMint::TAG, mint.key().as_ref()],
        bump,
    )]
    pub user_staked_mint: Box<Account<'info, UserStakedMint>>,

    pub mint: Box<Account<'info, Mint>>,
}
