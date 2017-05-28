import * as Guifast from "guifast_shared";

export class Event<T> implements Guifast.ClientEvent<T> {
    private readonly handlers: Array<Guifast.Fn1<void, T> | undefined> = [];
    private indexer: Guifast.Indexer = Guifast.indexer();

    public add(handler: Guifast.Fn1<void, T>): number {
        const [indexer, index] = Guifast.indexerTakeNextIndex(this.indexer);
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
        const indexer = Guifast.indexerReleaseIndex(this.indexer, id);
        this.indexer = indexer;
    }
}
