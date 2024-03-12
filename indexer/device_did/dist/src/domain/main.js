import { IndexerMainDomain, BlockchainChain, } from '@aleph-indexer/framework';
import { AccountType } from '../utils/layouts/index.js';
import DeviceDidDiscoverer from './discoverer/device_did.js';
export default class MainDomain extends IndexerMainDomain {
    constructor(context, discoverer = new DeviceDidDiscoverer()) {
        super(context, {
            discoveryInterval: 1000 * 60 * 60 * 1,
            stats: 1000 * 60 * 1,
        });
        this.context = context;
        this.discoverer = discoverer;
    }
    async discoverAccounts() {
        const accounts = await this.discoverer.loadAccounts();
        return accounts.map((meta) => {
            return {
                blockchainId: BlockchainChain.Solana,
                account: meta.address,
                meta,
                index: {
                    transactions: {
                        chunkDelay: 0,
                        chunkTimeframe: 1000 * 60 * 60 * 24,
                    },
                    content: false,
                },
            };
        });
    }
    async getAccounts(includeStats) {
        const accounts = {};
        await Promise.all(Array.from(this.accounts.solana || []).map(async (account) => {
            const actual = await this.getAccount(account, includeStats);
            accounts[account] = actual;
        }));
        return accounts;
    }
    async getAccount(account, includeStats) {
        const info = (await this.context.apiClient
            .useBlockchain(BlockchainChain.Solana)
            .invokeDomainMethod({
            account,
            method: 'getAccountInfo',
        }));
        if (!includeStats)
            return { info };
        const { stats } = (await this.context.apiClient
            .useBlockchain(BlockchainChain.Solana)
            .invokeDomainMethod({
            account,
            method: 'getDeviceDidStats',
        }));
        return { info, stats };
    }
    async getAccountEventsByTime(account, startDate, endDate, opts) {
        const stream = await this.context.apiClient
            .useBlockchain(BlockchainChain.Solana)
            .invokeDomainMethod({
            account,
            method: 'getAccountEventsByTime',
            args: [startDate, endDate, opts],
        });
        return stream;
    }
    async updateStats(now) {
        this.stats = await this.computeGlobalStats();
    }
    async getGlobalStats(addresses) {
        if (!addresses || addresses.length === 0) {
            if (!this.stats) {
                await this.updateStats(Date.now());
            }
            return this.stats;
        }
        return this.computeGlobalStats(addresses);
    }
    async computeGlobalStats(accountAddresses) {
        console.log(`📊 computing global stats for ${accountAddresses?.length} accounts`);
        const accountsStats = await this.getAccountStats(BlockchainChain.Solana, accountAddresses);
        const globalStats = this.getNewGlobalStats();
        for (const accountStats of accountsStats) {
            if (!accountStats.stats)
                continue;
            const { accesses, accessesByProgramId, startTimestamp, endTimestamp } = accountStats.stats.total;
            console.log(`📊 computing global stats for ${accountStats.account} with ${accesses} accesses`);
            const type = this.discoverer.getAccountType(accountStats.account);
            globalStats.totalAccounts[type]++;
            globalStats.totalAccesses += accesses || 0;
            if (accessesByProgramId) {
                Object.entries(accessesByProgramId).forEach(([programId, accesses]) => {
                    globalStats.totalAccessesByProgramId[programId] =
                        (globalStats.totalAccessesByProgramId[programId] || 0) + accesses;
                });
            }
            globalStats.startTimestamp = Math.min(globalStats.startTimestamp || Number.MAX_SAFE_INTEGER, startTimestamp || Number.MAX_SAFE_INTEGER);
            globalStats.endTimestamp = Math.max(globalStats.endTimestamp || 0, endTimestamp || 0);
        }
        return globalStats;
    }
    getNewGlobalStats() {
        return {
            totalAccesses: 0,
            totalAccounts: {
                [AccountType.Admin]: 0,
                [AccountType.Global]: 0,
                [AccountType.Vendor]: 0,
                [AccountType.Product]: 0,
                [AccountType.Device]: 0,
                [AccountType.Did]: 0,
            },
            totalAccessesByProgramId: {},
            startTimestamp: undefined,
            endTimestamp: undefined,
        };
    }
}
