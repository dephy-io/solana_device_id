import { EventDALIndex } from '../dal/event.js';
export class AccountDomain {
    constructor(info, eventDAL, timeSeriesStats) {
        this.info = info;
        this.eventDAL = eventDAL;
        this.timeSeriesStats = timeSeriesStats;
    }
    async updateStats(now) {
        await this.timeSeriesStats.process(now);
    }
    async getTimeSeriesStats(type, filters) {
        return this.timeSeriesStats.getTimeSeriesStats(type, filters);
    }
    async getStats() {
        return this.timeSeriesStats.getStats();
    }
    async getEventsByTime(startDate, endDate, opts) {
        return await this.eventDAL
            .useIndex(EventDALIndex.AccountTimestamp)
            .getAllFromTo([this.info.address, startDate], [this.info.address, endDate], opts);
    }
}
