export class AccessTimeSeriesAggregator {
    aggregate(curr, prev) {
        prev = this.prepareAccessStats(prev);
        this.processAccessStats(prev, curr);
        return prev;
    }
    getEmptyAccessTimeStats() {
        return {
            accesses: 0,
            accessesByProgramId: {},
            startTimestamp: undefined,
            endTimestamp: undefined,
        };
    }
    prepareAccessStats(info) {
        return info || this.getEmptyAccessTimeStats();
    }
    // @note: We assume that curr data is sorted by time
    processAccessStats(acc, curr) {
        if (curr.timestamp) {
            const event = curr;
            let signer;
            signer = event.signer;
            acc.accesses++;
            acc.accessesByProgramId[signer] = acc.accessesByProgramId[signer]
                ? acc.accessesByProgramId[signer] + 1
                : 1;
            if (!acc.startTimestamp || acc.startTimestamp > event.timestamp) {
                acc.startTimestamp = event.timestamp;
            }
            if (!acc.endTimestamp || acc.endTimestamp < event.timestamp) {
                acc.endTimestamp = event.timestamp;
            }
        }
        else {
            acc.accesses += curr.accesses || 0;
            if (curr.accessesByProgramId) {
                Object.entries(curr.accessesByProgramId).forEach(([programId, count]) => {
                    acc.accessesByProgramId[programId] = acc.accessesByProgramId[programId]
                        ? acc.accessesByProgramId[programId] + count
                        : count;
                });
            }
            if (!acc.startTimestamp) {
                acc.startTimestamp = curr.startTimestamp;
            }
            else if (curr.startTimestamp &&
                acc.startTimestamp >
                    curr.startTimestamp) {
                acc.startTimestamp = curr.startTimestamp;
            }
            if (!acc.endTimestamp) {
                acc.endTimestamp = curr.endTimestamp;
            }
            else if (curr.endTimestamp &&
                acc.endTimestamp < curr.endTimestamp) {
                acc.endTimestamp = curr.endTimestamp;
            }
        }
        return acc;
    }
    isDeviceDidEvent(event) {
        return 'type' in event;
    }
}
export const accessAggregator = new AccessTimeSeriesAggregator();
export default accessAggregator;
