import { AccountAggregatorFnArgs } from '@aleph-indexer/framework';
import { DeviceDidAccountStats } from '../../types.js';
export declare class StatsAggregator {
    aggregate(args: AccountAggregatorFnArgs): Promise<DeviceDidAccountStats>;
    protected getEmptyStats(): DeviceDidAccountStats;
}
export declare const statsAggregator: StatsAggregator;
export default statsAggregator;
//# sourceMappingURL=statsAggregator.d.ts.map