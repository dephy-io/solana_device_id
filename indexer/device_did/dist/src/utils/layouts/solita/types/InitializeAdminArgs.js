/**
 * This code was GENERATED using the solita package.
 * Please DO NOT EDIT THIS FILE, instead rerun solita to update it or write a wrapper to add functionality.
 *
 * See: https://github.com/metaplex-foundation/solita
 */
import * as beetSolana from '@metaplex-foundation/beet-solana';
import * as beet from '@metaplex-foundation/beet';
/**
 * @category userTypes
 * @category generated
 */
export const initializeAdminArgsBeet = new beet.BeetArgsStruct([
    ['admin', beetSolana.publicKey],
    ['authority', beetSolana.publicKey],
    ['treasury', beetSolana.publicKey],
], 'InitializeAdminArgs');
