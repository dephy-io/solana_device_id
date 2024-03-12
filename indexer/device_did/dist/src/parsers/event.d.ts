import { SolanaParsedInstructionContext } from '@aleph-indexer/solana';
import { DeviceDidEvent } from '../utils/layouts/index.js';
export declare class EventParser {
    parse(ixCtx: SolanaParsedInstructionContext, account: string): DeviceDidEvent;
}
export declare const eventParser: EventParser;
export default eventParser;
//# sourceMappingURL=event.d.ts.map