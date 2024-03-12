import { StorageStream } from '@aleph-indexer/core';
import { AccountTimeSeriesStatsManager, AccountTimeSeriesStats, AccountStatsFilters, AccountStats } from '@aleph-indexer/framework';
import { EventStorage } from '../dal/event.js';
import { DeviceDidEvent } from '../utils/layouts/index.js';
import { DeviceDidAccountInfo, DeviceDidAccountStats } from '../types.js';
export declare class AccountDomain {
    info: DeviceDidAccountInfo;
    protected eventDAL: EventStorage;
    protected timeSeriesStats: AccountTimeSeriesStatsManager<DeviceDidAccountStats>;
    constructor(info: DeviceDidAccountInfo, eventDAL: EventStorage, timeSeriesStats: AccountTimeSeriesStatsManager<DeviceDidAccountStats>);
    updateStats(now: number): Promise<void>;
    getTimeSeriesStats(type: string, filters: AccountStatsFilters): Promise<AccountTimeSeriesStats>;
    getStats(): Promise<AccountStats<DeviceDidAccountStats>>;
    getEventsByTime(startDate: number, endDate: number, opts: any): Promise<StorageStream<string, DeviceDidEvent>>;
}
//# sourceMappingURL=account.d.ts.map