import { ClientEvent, Fn1, indexer, Indexer, indexerReleaseIndex, indexerTakeNextIndex } from "guifast_shared";

export class Event<T> implements ClientEvent<T> {
    private readonly handlers: Array<Fn1<void, T> | undefined> = [];
    private indexer: Indexer = indexer();

    public add(handler: Fn1<void, T>): number {
        const [indexer, index] = indexerTakeNextIndex(this.indexer);
        this.handlers[index] = handler;
        this.indexer = indexer;
        return index;
    }

    public call(data: T) {
        for (const handler of this.handlers) {
            if (handler !== undefined) {
                handler(data);
            }
        }
    }

    public remove(id: number) {
        this.handlers[id] = undefined;
        const indexer = indexerReleaseIndex(this.indexer, id);
        this.indexer = indexer;
    }
}
