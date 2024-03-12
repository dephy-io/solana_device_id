export class EventParser {
    parse(ixCtx, account) {
        const { instruction, parentInstruction, parentTransaction } = ixCtx;
        const parsed = instruction.parsed;
        const id = `${parentTransaction.signature}${parentInstruction
            ? ` :${parentInstruction.index.toString().padStart(2, '0')}`
            : ''}:${instruction.index.toString().padStart(2, '0')}`;
        const timestamp = parentTransaction.blockTime
            ? parentTransaction.blockTime * 1000
            : parentTransaction.slot;
        const signer = parentTransaction.parsed.message.accountKeys.find((acc) => acc.signer)?.pubkey;
        return {
            id,
            timestamp,
            type: parsed.type,
            signer: signer,
            info: parsed.info,
            account: account,
        };
    }
}
export const eventParser = new EventParser();
export default eventParser;
