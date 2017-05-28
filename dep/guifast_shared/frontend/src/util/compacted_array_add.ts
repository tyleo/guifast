import * as Guifast from "guifast_shared";

export function compactedArrayAdd<T>(state: Guifast.CompactedArray<T>, create_item: Guifast.Fn1<T, number>): Guifast.CompactedArray<T> {
    const [indexer, index] = Guifast.indexerTakeNextIndex(state.indexer);
    const item = create_item(index);
    const items = [...state.items];
    items[index] = item;

    return {
        indexer: indexer,
        items: items
    };
}
