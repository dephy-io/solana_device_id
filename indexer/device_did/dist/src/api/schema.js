import { GraphQLObjectType, GraphQLString, GraphQLList, GraphQLFloat, GraphQLInt, GraphQLBoolean, GraphQLNonNull, } from 'graphql';
import { IndexerAPISchema } from '@aleph-indexer/framework';
import * as Types from './types.js';
import { APIResolvers, } from './resolvers.js';
export default class APISchema extends IndexerAPISchema {
    constructor(domain, resolver = new APIResolvers(domain)) {
        super(domain, {
            types: Types.types,
            customTimeSeriesTypesMap: { access: Types.AccessTimeStats },
            customStatsType: Types.DeviceDidStats,
            query: new GraphQLObjectType({
                name: 'Query',
                fields: {
                    accounts: {
                        type: Types.AccountsInfo,
                        args: {
                            types: { type: new GraphQLList(GraphQLString) },
                            accounts: { type: new GraphQLList(GraphQLString) },
                        },
                        resolve: (_, ctx, __, info) => {
                            ctx.includeStats =
                                !!info.fieldNodes[0].selectionSet?.selections.find((item) => item.kind === 'Field' && item.name.value === 'stats');
                            return this.resolver.getAccounts(ctx);
                        },
                    },
                    events: {
                        type: Types.Events,
                        args: {
                            account: { type: new GraphQLNonNull(GraphQLString) },
                            types: { type: new GraphQLList(Types.DeviceDidEvent) },
                            startDate: { type: GraphQLFloat },
                            endDate: { type: GraphQLFloat },
                            limit: { type: GraphQLInt },
                            skip: { type: GraphQLInt },
                            reverse: { type: GraphQLBoolean },
                        },
                        resolve: (_, ctx) => this.resolver.getEvents(ctx),
                    },
                    globalStats: {
                        type: Types.GlobalDeviceDidStats,
                        args: {
                            types: { type: GraphQLString },
                            accounts: { type: new GraphQLList(GraphQLString) },
                        },
                        resolve: (_, ctx) => resolver.getGlobalStats(ctx),
                    },
                },
            }),
        });
        this.domain = domain;
        this.resolver = resolver;
    }
}
