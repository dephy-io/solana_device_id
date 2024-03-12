import { StorageStream } from '@aleph-indexer/core';
import { IndexerMainDomain, IndexerMainDomainWithDiscovery, IndexerMainDomainWithStats, AccountIndexerConfigWithMeta, IndexerMainDomainContext } from '@aleph-indexer/framework';
import { DeviceDidEvent } from '../utils/layouts/index.js';
import { GlobalDeviceDidStats, DeviceDidAccountData, DeviceDidAccountInfo } from '../types.js';
import DeviceDidDiscoverer from './discoverer/device_did.js';
export default class MainDomain extends IndexerMainDomain implements IndexerMainDomainWithDiscovery, IndexerMainDomainWithStats {
    protected context: IndexerMainDomainContext;
    protected discoverer: DeviceDidDiscoverer;
    protected stats: GlobalDeviceDidStats;
    constructor(context: IndexerMainDomainContext, discoverer?: DeviceDidDiscoverer);
    discoverAccounts(): Promise<AccountIndexerConfigWithMeta<DeviceDidAccountInfo>[]>;
    getAccounts(includeStats?: boolean): Promise<Record<string, DeviceDidAccountData>>;
    getAccount(account: string, includeStats?: boolean): Promise<DeviceDidAccountData>;
    getAccountEventsByTime(account: string, startDate: number, endDate: number, opts: any): Promise<StorageStream<string, DeviceDidEvent>>;
    updateStats(now: number): Promise<void>;
    getGlobalStats(addresses?: string[]): Promise<GlobalDeviceDidStats>;
    computeGlobalStats(accountAddresses?: string[]): Promise<GlobalDeviceDidStats>;
    getNewGlobalStats(): GlobalDeviceDidStats;
}
//# sourceMappingURL=main.d.ts.map