import { IndexerAPISchema } from '@aleph-indexer/framework';
import { APIResolvers } from './resolvers.js';
import MainDomain from '../domain/main.js';
export default class APISchema extends IndexerAPISchema {
    protected domain: MainDomain;
    protected resolver: APIResolvers;
    constructor(domain: MainDomain, resolver?: APIResolvers);
}
//# sourceMappingURL=schema.d.ts.map