import * as Guifast from "guifast_shared";

export function compactedArrayUpdate<T>(state: Guifast.CompactedArray<T>, index: number, item: T): Guifast.CompactedArray<T> {
    const result = {
        ...state,
        items: [...state.items]
    };
    result.items[index] = item;
    return result;
}