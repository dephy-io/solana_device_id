import { StorageStream } from '@aleph-indexer/core';
import { IndexerDomainContext, AccountIndexerConfigWithMeta, IndexerWorkerDomain, IndexerWorkerDomainWithStats, AccountTimeSeriesStats, AccountStatsFilters, AccountStats, ParserContext } from '@aleph-indexer/framework';
import { SolanaIndexerWorkerDomainI, SolanaParsedInstructionContext } from '@aleph-indexer/solana';
import { DeviceDidEvent } from '../utils/layouts/index.js';
import { DeviceDidAccountStats, DeviceDidAccountInfo } from '../types.js';
import { AccountDomain } from './account.js';
export default class WorkerDomain extends IndexerWorkerDomain implements SolanaIndexerWorkerDomainI, IndexerWorkerDomainWithStats {
    protected context: IndexerDomainContext;
    protected eventParser: import("../parsers/event.js").EventParser;
    protected eventDAL: import("../dal/event.js").EventStorage;
    protected statsStateDAL: import("@aleph-indexer/framework").StatsStateStorage;
    protected statsTimeSeriesDAL: import("@aleph-indexer/framework").StatsTimeSeriesStorage;
    protected programId: string;
    protected accounts: Record<string, AccountDomain>;
    constructor(context: IndexerDomainContext, eventParser?: import("../parsers/event.js").EventParser, eventDAL?: import("../dal/event.js").EventStorage, statsStateDAL?: import("@aleph-indexer/framework").StatsStateStorage, statsTimeSeriesDAL?: import("@aleph-indexer/framework").StatsTimeSeriesStorage, programId?: string);
    onNewAccount(config: AccountIndexerConfigWithMeta<DeviceDidAccountInfo>): Promise<void>;
    updateStats(account: string, now: number): Promise<void>;
    getTimeSeriesStats(account: string, type: string, filters: AccountStatsFilters): Promise<AccountTimeSeriesStats>;
    getStats(account: string): Promise<AccountStats<DeviceDidAccountStats>>;
    solanaFilterInstruction(context: ParserContext, entity: SolanaParsedInstructionContext): Promise<boolean>;
    solanaIndexInstructions(context: ParserContext, ixsContext: SolanaParsedInstructionContext[]): Promise<void>;
    getAccountInfo(actual: string): Promise<DeviceDidAccountInfo>;
    getAccountStats(actual: string): Promise<AccountStats<DeviceDidAccountStats>>;
    getAccountEventsByTime(account: string, startDate: number, endDate: number, opts: any): Promise<StorageStream<string, DeviceDidEvent>>;
    private getAccount;
}
//# sourceMappingURL=worker.d.ts.map