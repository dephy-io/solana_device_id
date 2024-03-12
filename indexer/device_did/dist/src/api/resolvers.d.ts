import MainDomain from '../domain/main.js';
import { AccountType, DeviceDidEvent, InstructionType } from '../utils/layouts/index.js';
import { GlobalDeviceDidStats, DeviceDidAccountInfo, DeviceDidAccountData } from '../types.js';
export type AccountsFilters = {
    types?: AccountType[];
    accounts?: string[];
    includeStats?: boolean;
};
export type EventsFilters = {
    account: string;
    types?: InstructionType[];
    startDate?: number;
    endDate?: number;
    limit?: number;
    skip?: number;
    reverse?: boolean;
};
export type GlobalStatsFilters = AccountsFilters;
export declare class APIResolvers {
    protected domain: MainDomain;
    constructor(domain: MainDomain);
    getAccounts(args: AccountsFilters): Promise<DeviceDidAccountInfo[]>;
    getEvents({ account, types, startDate, endDate, limit, skip, reverse, }: EventsFilters): Promise<DeviceDidEvent[]>;
    getGlobalStats(args: GlobalStatsFilters): Promise<GlobalDeviceDidStats>;
    protected filterAccounts({ types, accounts, includeStats, }: AccountsFilters): Promise<DeviceDidAccountData[]>;
}
//# sourceMappingURL=resolvers.d.ts.map