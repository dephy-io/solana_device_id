use anchor_lang::prelude::*;

#[error_code]
pub enum ErrorCode {
    #[msg("Invalid admin.")]
    InvalidAdmin,
    #[msg("Invalid admin authority.")]
    InvalidAdminAuthority,
    #[msg("Invalid treasury.")]
    InvalidTreasury,
    #[msg("Invalid vendor key.")]
    InvalidVendorKey,
    #[msg("Publick key is invalid.")]
    InvalidPublicKey,
    #[msg("Out of valid validation time.")]
    InvalidValidationTime,
}
