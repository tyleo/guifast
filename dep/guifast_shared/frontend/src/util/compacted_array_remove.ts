import * as Guifast from "guifast_shared";

export function compactedArrayRemove<T>(state: Guifast.CompactedArray<T>, index: number): Guifast.CompactedArray<T> {
    const indexer = Guifast.indexerReleaseIndex(state.indexer, index);
    const items = [...state.items];
    items[index] = undefined;

    return {
        indexer: indexer,
        items: items
    };
}
