import { CompactedArray, Fn1, indexerTakeNextIndex } from "guifast_shared";

export function compactedArrayAdd<T>(state: CompactedArray<T>, create_item: Fn1<T, number>): CompactedArray<T> {
    const [indexer, index] = indexerTakeNextIndex(state.indexer);
    const item = create_item(index);
    const items = [...state.items];
    items[index] = item;

    return {
        indexer: indexer,
        items: items
    };
}
