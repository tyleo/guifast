import * as Guifast from "guifast_shared";

export interface CompactedArray<T> {
    readonly indexer: Guifast.Indexer;
    readonly items: Array<T | undefined>;
}

export function compactedArray<T>(): CompactedArray<T> {
    return {
        indexer: Guifast.indexer(),
        items: new Array<T>()
    };
};
