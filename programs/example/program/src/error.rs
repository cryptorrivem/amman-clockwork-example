use anchor_lang::prelude::*;

#[error_code]
pub enum ErrorCode {
    #[msg("NFT does not belong to user")]
    NotOwnerOfMint,

    #[msg("NFT lock time is not over")]
    LockTimeNotOver,

    #[msg("NFT lock must be expired before unstaking")]
    NotExpired,
}
