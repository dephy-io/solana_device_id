import { DEVICE_DID_PROGRAM_ID, DEVICE_DID_PROGRAM_ID_PK, } from '../../constants.js';
import { AccountType } from '../../utils/layouts/index.js';
import { ACCOUNT_DISCRIMINATOR, ACCOUNTS_DATA_LAYOUT, } from '../../utils/layouts/accounts.js';
import { solanaPrivateRPC } from '@aleph-indexer/solana';
import bs58 from 'bs58';
export default class DeviceDidDiscoverer {
    constructor(accountTypes = new Set(Object.values(AccountType)), cache = {}) {
        this.accountTypes = accountTypes;
        this.cache = cache;
    }
    async loadAccounts() {
        const newAccounts = [];
        const accounts = await this.getAllAccounts();
        for (const accountInfo of accounts) {
            if (this.cache[accountInfo.address])
                continue;
            this.cache[accountInfo.address] = accountInfo;
            newAccounts.push(this.cache[accountInfo.address]);
        }
        return newAccounts;
    }
    getAccountType(address) {
        return this.cache[address].type;
    }
    /**
     * Fetches all accounts from the program. Useful to filter which accounts should be indexed.
     */
    async getAllAccounts() {
        const connection = solanaPrivateRPC.getConnection();
        const accountsInfo = [];
        // todo: If you want to only index a subset of account types, you can filter them here
        const accountTypesToFilter = [
        /*AccountType.*/
        ];
        for (const type of this.accountTypes) {
            if (accountTypesToFilter.includes(type))
                continue;
            const accounts = await connection.getProgramAccounts(DEVICE_DID_PROGRAM_ID_PK, {
                filters: [
                    {
                        memcmp: {
                            bytes: bs58.encode(ACCOUNT_DISCRIMINATOR[type]),
                            offset: 0,
                        },
                    },
                ],
            });
            accounts.map((value) => accountsInfo.push(this.deserializeAccountResponse(value, type)));
        }
        return accountsInfo;
    }
    deserializeAccountResponse(resp, type) {
        const data = ACCOUNTS_DATA_LAYOUT[type].deserialize(resp.account.data)[0];
        const address = resp.pubkey.toBase58();
        let name = address;
        if (Object.hasOwn(data, 'name')) {
            if (data.name instanceof Uint8Array)
                name = data.name.toString();
            if (data.name instanceof String)
                name = data.name;
        }
        return {
            name,
            programId: DEVICE_DID_PROGRAM_ID,
            type,
            address: address,
            data: data,
        };
    }
}
