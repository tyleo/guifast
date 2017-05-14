import { indexer, Indexer } from "guifast_shared";

export interface CompactedArray<T> {
    readonly indexer: Indexer;
    readonly items: Array<T | undefined>;
}

export function compactedArray<T>(): CompactedArray<T> {
    return {
        indexer: indexer(),
        items: new Array<T>()
    };
};
