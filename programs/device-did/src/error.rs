use anchor_lang::prelude::*;

#[error_code]
pub enum ErrorCode {
    #[msg("Invalid vendor key and ")]
    InvalidVendorKey,

    #[msg("Signature verification failed.")]
    SigVerificationFailed,
}
