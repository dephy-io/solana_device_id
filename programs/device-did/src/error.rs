use anchor_lang::prelude::*;

#[error_code]
pub enum ErrorCode {
    #[msg("Invalid vendor key.")]
    InvalidVendorKey,
    #[msg("Publick key is invalid.")]
    InvalidPublicKey,
    #[msg("Out of valid validation time.")]
    InvalidValidationTime,
}
