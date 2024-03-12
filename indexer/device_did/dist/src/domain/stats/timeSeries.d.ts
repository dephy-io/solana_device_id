import { AccountTimeSeriesStatsManager, IndexerMsClient, StatsStateStorage, StatsTimeSeriesStorage } from '@aleph-indexer/framework';
import { EventStorage } from '../../dal/event.js';
import { DeviceDidAccountStats } from '../../types.js';
export declare function createAccountStats(blockchainId: string, account: string, indexerApi: IndexerMsClient, eventDAL: EventStorage, statsStateDAL: StatsStateStorage, statsTimeSeriesDAL: StatsTimeSeriesStorage): Promise<AccountTimeSeriesStatsManager<DeviceDidAccountStats>>;
//# sourceMappingURL=timeSeries.d.ts.map