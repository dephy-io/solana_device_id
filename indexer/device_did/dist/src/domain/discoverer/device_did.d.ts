/// <reference types="node" />
import { AccountType } from '../../utils/layouts/index.js';
import { DeviceDidAccountInfo } from '../../types.js';
import { AccountInfo, PublicKey } from '@solana/web3.js';
export default class DeviceDidDiscoverer {
    accountTypes: Set<AccountType>;
    protected cache: Record<string, DeviceDidAccountInfo>;
    constructor(accountTypes?: Set<AccountType>, cache?: Record<string, DeviceDidAccountInfo>);
    loadAccounts(): Promise<DeviceDidAccountInfo[]>;
    getAccountType(address: string): AccountType;
    /**
     * Fetches all accounts from the program. Useful to filter which accounts should be indexed.
     */
    getAllAccounts(): Promise<DeviceDidAccountInfo[]>;
    deserializeAccountResponse(resp: {
        pubkey: PublicKey;
        account: AccountInfo<Buffer>;
    }, type: AccountType): DeviceDidAccountInfo;
}
//# sourceMappingURL=device_did.d.ts.map