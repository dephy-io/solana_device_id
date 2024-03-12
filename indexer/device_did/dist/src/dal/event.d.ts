import { EntityStorage } from '@aleph-indexer/core';
import { DeviceDidEvent } from '../utils/layouts/index.js';
export type EventStorage = EntityStorage<DeviceDidEvent>;
export declare enum EventDALIndex {
    AccountTimestamp = "account_timestamp",
    AccountTypeTimestamp = "account_type_timestamp"
}
export declare function createEventDAL(path: string): EventStorage;
//# sourceMappingURL=event.d.ts.map