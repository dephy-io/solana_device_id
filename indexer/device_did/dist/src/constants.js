import { PublicKey } from '@solana/web3.js';
import { config } from '@aleph-indexer/core';
export var ProgramName;
(function (ProgramName) {
    ProgramName["DeviceDid"] = "device_did";
})(ProgramName || (ProgramName = {}));
const DAY = 1000 * 60 * 60 * 24;
const START_DATE = Date.now();
const SINCE_DATE = START_DATE - 7 * DAY;
export const DOMAIN_CACHE_START_DATE = config.INDEX_START_DATE
    ? Number(config.INDEX_START_DATE)
    : SINCE_DATE;
export const DEVICE_DID_PROGRAM_ID = '1234WPYMnkT2bx5MB3uLmixeDuaCHDpd3mXNhZGimKWg';
export const DEVICE_DID_PROGRAM_ID_PK = new PublicKey(DEVICE_DID_PROGRAM_ID);
