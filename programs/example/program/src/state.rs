use anchor_lang::prelude::*;

#[account]
#[derive(Default, InitSpace)]
pub struct UserStakedMint {
    pub user: Pubkey,
    pub start_time: i64,
    pub lock_time: i64,
    pub expired: bool,
}
impl UserStakedMint {
    pub const TAG: &'static [u8] = b"user_staked_mint";

    pub fn get_thread_id(key: Pubkey) -> Vec<u8> {
        key.to_bytes()[..16].to_vec()
    }
}
