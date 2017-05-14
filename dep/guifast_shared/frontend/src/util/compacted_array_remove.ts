import { CompactedArray, Fn1, indexerReleaseIndex } from "guifast_shared";

export function compactedArrayRemove<T>(state: CompactedArray<T>, index: number): CompactedArray<T> {
    const indexer = indexerReleaseIndex(state.indexer, index);
    const items = [...state.items];
    items[index] = undefined;

    return {
        indexer: indexer,
        items: items
    };
}
