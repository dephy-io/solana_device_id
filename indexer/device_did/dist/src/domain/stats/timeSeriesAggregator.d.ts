import { AccessTimeStats } from '../../types.js';
import { DeviceDidEvent } from '../../utils/layouts/index.js';
export declare class AccessTimeSeriesAggregator {
    aggregate(curr: DeviceDidEvent | AccessTimeStats, prev?: AccessTimeStats): AccessTimeStats;
    getEmptyAccessTimeStats(): AccessTimeStats;
    protected prepareAccessStats(info?: AccessTimeStats): AccessTimeStats;
    protected processAccessStats(acc: AccessTimeStats, curr: DeviceDidEvent | AccessTimeStats): AccessTimeStats;
    protected isDeviceDidEvent(event: DeviceDidEvent | AccessTimeStats): event is DeviceDidEvent;
}
export declare const accessAggregator: AccessTimeSeriesAggregator;
export default accessAggregator;
//# sourceMappingURL=timeSeriesAggregator.d.ts.map