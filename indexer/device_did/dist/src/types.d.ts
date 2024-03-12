import { AccountType, DeviceDidEvent, ParsedAccountsData } from './utils/layouts/index.js';
export type DeviceDidAccountInfo = {
    name: string;
    programId: string;
    address: string;
    type: AccountType;
    data: ParsedAccountsData;
};
export type AccessTimeStats = {
    /**
     * Total number of times the account was accessed
     */
    accesses: number;
    /**
     * Number of times accessed, grouped by program ID
     */
    accessesByProgramId: {
        [programId: string]: number;
    };
    /**
     * First access time in milliseconds digested in the stats
     */
    startTimestamp?: number;
    /**
     * Last access time in milliseconds digested in the stats
     */
    endTimestamp?: number;
};
export type TimeStats = AccessTimeStats;
export type DeviceDidAccountStats = {
    requestsStatsByHour: Record<string, AccessTimeStats>;
    last1h: AccessTimeStats;
    last24h: AccessTimeStats;
    last7d: AccessTimeStats;
    total: AccessTimeStats;
    accessingPrograms: Set<string>;
    lastRequest?: DeviceDidEvent;
};
export type HourlyStats = {
    stats: AccessTimeStats[];
    statsMap: Record<string, AccessTimeStats>;
};
export type GlobalDeviceDidStats = {
    totalAccounts: Record<AccountType, number>;
    totalAccesses: number;
    totalAccessesByProgramId: {
        [programId: string]: number;
    };
    startTimestamp?: number;
    endTimestamp?: number;
};
export type DeviceDidAccountData = {
    info: DeviceDidAccountInfo;
    stats?: DeviceDidAccountStats;
};
//# sourceMappingURL=types.d.ts.map