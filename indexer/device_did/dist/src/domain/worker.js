import { IndexerWorkerDomain, createStatsStateDAL, createStatsTimeSeriesDAL, } from '@aleph-indexer/framework';
import { isParsedIx, } from '@aleph-indexer/solana';
import { eventParser as eParser } from '../parsers/event.js';
import { createEventDAL } from '../dal/event.js';
import { AccountDomain } from './account.js';
import { createAccountStats } from './stats/timeSeries.js';
import { DEVICE_DID_PROGRAM_ID } from '../constants.js';
export default class WorkerDomain extends IndexerWorkerDomain {
    constructor(context, eventParser = eParser, eventDAL = createEventDAL(context.dataPath), statsStateDAL = createStatsStateDAL(context.dataPath), statsTimeSeriesDAL = createStatsTimeSeriesDAL(context.dataPath), programId = DEVICE_DID_PROGRAM_ID) {
        super(context);
        this.context = context;
        this.eventParser = eventParser;
        this.eventDAL = eventDAL;
        this.statsStateDAL = statsStateDAL;
        this.statsTimeSeriesDAL = statsTimeSeriesDAL;
        this.programId = programId;
        this.accounts = {};
    }
    async onNewAccount(config) {
        const { blockchainId, account, meta } = config;
        const { apiClient } = this.context;
        const accountTimeSeries = await createAccountStats(blockchainId, account, apiClient, this.eventDAL, this.statsStateDAL, this.statsTimeSeriesDAL);
        this.accounts[account] = new AccountDomain(meta, this.eventDAL, accountTimeSeries);
        console.log('Account indexing', this.context.instanceName, account);
    }
    async updateStats(account, now) {
        const actual = this.getAccount(account);
        await actual.updateStats(now);
    }
    async getTimeSeriesStats(account, type, filters) {
        const actual = this.getAccount(account);
        return actual.getTimeSeriesStats(type, filters);
    }
    async getStats(account) {
        return this.getAccountStats(account);
    }
    async solanaFilterInstruction(context, entity) {
        return (isParsedIx(entity.instruction) &&
            entity.instruction.programId === this.programId);
    }
    async solanaIndexInstructions(context, ixsContext) {
        if ('account' in context) {
            const parsedIxs = ixsContext.map((ix) => this.eventParser.parse(ix, context.account));
            console.log(`indexing ${ixsContext.length} parsed ixs`);
            await this.eventDAL.save(parsedIxs);
        }
    }
    // ------------- Custom impl methods -------------------
    async getAccountInfo(actual) {
        const res = this.getAccount(actual);
        return res.info;
    }
    async getAccountStats(actual) {
        const res = this.getAccount(actual);
        return res.getStats();
    }
    async getAccountEventsByTime(account, startDate, endDate, opts) {
        const res = this.getAccount(account);
        return await res.getEventsByTime(startDate, endDate, opts);
    }
    getAccount(account) {
        const accountInstance = this.accounts[account];
        if (!accountInstance)
            throw new Error(`Account ${account} does not exist`);
        return accountInstance;
    }
}
