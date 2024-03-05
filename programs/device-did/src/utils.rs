use crate::error::ErrorCode;
use anchor_lang::{
    prelude::*,
    solana_program::{keccak, secp256k1_recover::secp256k1_recover},
};
use libsecp256k1;

pub fn secp256k1_recover_verify(
    public_key: &[u8; 64],
    message: &Vec<u8>,
    signature: &[u8; 64],
    recovery_id: &u8,
) -> Result<()> {
    let message_hash = {
        let mut hasher = keccak::Hasher::default();
        hasher.hash(message);
        hasher.result()
    };

    {
        let sig = libsecp256k1::Signature::parse_standard_slice(signature)
            .map_err(|_| ProgramError::InvalidArgument)
            .unwrap();

        if sig.s.is_high() {
            msg!("signature with high-s value");
            return Err(ProgramError::InvalidArgument.into());
        }
    }

    let recovered_pubkey = secp256k1_recover(&message_hash.0, *recovery_id, signature)
        .map_err(|_| ProgramError::InvalidArgument)?;

    require!(
        recovered_pubkey.0 == *public_key,
        ErrorCode::InvalidVendorKey
    );

    Ok(())
}
