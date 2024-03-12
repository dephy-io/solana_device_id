/**
 * This code was GENERATED using the solita package.
 * Please DO NOT EDIT THIS FILE, instead rerun solita to update it or write a wrapper to add functionality.
 *
 * See: https://github.com/metaplex-foundation/solita
 */
import * as beet from '@metaplex-foundation/beet';
import * as web3 from '@solana/web3.js';
import { CreateProductCollectionArgs } from '../types/CreateProductCollectionArgs.js';
/**
 * @category Instructions
 * @category CreateProductCollection
 * @category generated
 */
export type CreateProductCollectionInstructionArgs = {
    args: CreateProductCollectionArgs;
};
/**
 * @category Instructions
 * @category CreateProductCollection
 * @category generated
 */
export declare const createProductCollectionStruct: beet.FixableBeetArgsStruct<CreateProductCollectionInstructionArgs & {
    instructionDiscriminator: number[];
}>;
/**
 * Accounts required by the _createProductCollection_ instruction
 *
 * @property [_writable_, **signer**] payer
 * @property [] vendor
 * @property [**signer**] vendorAuthority
 * @property [] global
 * @property [_writable_] product
 * @category Instructions
 * @category CreateProductCollection
 * @category generated
 */
export type CreateProductCollectionInstructionAccounts = {
    payer: web3.PublicKey;
    vendor: web3.PublicKey;
    vendorAuthority: web3.PublicKey;
    global: web3.PublicKey;
    product: web3.PublicKey;
    systemProgram?: web3.PublicKey;
    anchorRemainingAccounts?: web3.AccountMeta[];
};
export declare const createProductCollectionInstructionDiscriminator: number[];
/**
 * Creates a _CreateProductCollection_ instruction.
 *
 * @param accounts that will be accessed while the instruction is processed
 * @param args to provide as instruction data to the program
 *
 * @category Instructions
 * @category CreateProductCollection
 * @category generated
 */
export declare function createCreateProductCollectionInstruction(accounts: CreateProductCollectionInstructionAccounts, args: CreateProductCollectionInstructionArgs, programId?: web3.PublicKey): web3.TransactionInstruction;
//# sourceMappingURL=createProductCollection.d.ts.map