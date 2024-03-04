/// This mod contains functions that validate that an instruction
/// is constructed the way we expect. In this case, this is for
/// `Ed25519Program.createInstructionWithPublicKey()` and
/// `Secp256k1Program.createInstructionWithEthAddress()` instructions.

pub mod secp256k1;

pub use secp256k1::*;
