import { PublicKey } from '@solana/web3.js';
import BN from 'bn.js';
import { EntityStorage } from '@aleph-indexer/core';
// in this vector you can include the properties of several
// events that are BN in order to be able to cast them
const mappedBNProps = [];
// in this vector you can include the properties of several
// events that are PublicKey in order to be able to cast them
const mappedPublicKeyProps = ['programId'];
export var EventDALIndex;
(function (EventDALIndex) {
    EventDALIndex["AccountTimestamp"] = "account_timestamp";
    EventDALIndex["AccountTypeTimestamp"] = "account_type_timestamp";
})(EventDALIndex || (EventDALIndex = {}));
const idKey = {
    get: (e) => e.id,
    length: EntityStorage.VariableLength,
};
const accountKey = {
    get: (e) => e.account,
    length: EntityStorage.AddressLength,
};
const typeKey = {
    get: (e) => e.type,
    length: EntityStorage.VariableLength,
};
const timestampKey = {
    get: (e) => e.timestamp,
    length: EntityStorage.TimestampLength,
};
export function createEventDAL(path) {
    return new EntityStorage({
        name: 'event',
        path,
        key: [idKey],
        indexes: [
            {
                name: EventDALIndex.AccountTimestamp,
                key: [accountKey, timestampKey],
            },
            {
                name: EventDALIndex.AccountTypeTimestamp,
                key: [accountKey, typeKey, timestampKey],
            },
        ],
        mapFn: async function (entry) {
            const { key, value } = entry;
            // @note: Stored as hex strings (bn.js "toJSON" method), so we need to cast them to BN always
            for (const prop of mappedBNProps) {
                if (!(prop in value))
                    continue;
                if (value[prop] instanceof BN)
                    continue;
                value[prop] = new BN(value[prop], 'hex');
            }
            for (const prop of mappedPublicKeyProps) {
                if (!(prop in value))
                    continue;
                if (value[prop] instanceof PublicKey)
                    continue;
                value[prop] = new PublicKey(value[prop]);
            }
            return { key, value };
        },
    });
}
