import { AccountTimeSeriesStatsManager, IndexableEntityType, TimeFrame, TimeSeriesStats, } from '@aleph-indexer/framework';
import { EventDALIndex } from '../../dal/event.js';
import statsAggregator from './statsAggregator.js';
import accessAggregator from './timeSeriesAggregator.js';
export async function createAccountStats(blockchainId, account, indexerApi, eventDAL, statsStateDAL, statsTimeSeriesDAL) {
    // @note: this aggregator is used to aggregate usage stats for the account
    const accessTimeSeries = new TimeSeriesStats({
        type: 'access',
        startDate: 0,
        timeFrames: [
            TimeFrame.Hour,
            TimeFrame.Day,
            TimeFrame.Week,
            TimeFrame.Month,
            TimeFrame.Year,
            TimeFrame.All,
        ],
        getInputStream: async ({ account, startDate, endDate }) => {
            return await eventDAL
                .useIndex(EventDALIndex.AccountTimestamp)
                .getAllValuesFromTo([account, startDate], [account, endDate]);
        },
        aggregate: ({ input, prevValue }) => {
            return accessAggregator.aggregate(input, prevValue);
        },
    }, statsStateDAL, statsTimeSeriesDAL);
    return new AccountTimeSeriesStatsManager({
        blockchainId,
        type: IndexableEntityType.Transaction,
        account,
        series: [accessTimeSeries],
        aggregate(args) {
            return statsAggregator.aggregate(args);
        },
    }, indexerApi, statsStateDAL, statsTimeSeriesDAL);
}
