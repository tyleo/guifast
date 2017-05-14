const OriginalBinarySearchBounds = require("binary-search-bounds");

namespace BinarySearchBounds {
    export function LT<TArrayItem, TItem>(
        array: Array<TArrayItem>,
        item: TItem,
        cmp: { (arrayItem: TArrayItem, item: TItem): number }
    ): number {
        return OriginalBinarySearchBounds.lt(array, item, cmp);
    }

    export function LE<TArrayItem, TItem>(
        array: Array<TArrayItem>,
        item: TItem,
        cmp: { (arrayItem: TArrayItem, item: TItem): number }
    ): number {
        return OriginalBinarySearchBounds.le(array, item, cmp);
    }

    export function GT<TArrayItem, TItem>(
        array: Array<TArrayItem>,
        item: TItem,
        cmp: { (arrayItem: TArrayItem, item: TItem): number }
    ): number {
        return OriginalBinarySearchBounds.gt(array, item, cmp);
    }

    export function GE<TArrayItem, TItem>(
        array: Array<TArrayItem>,
        item: TItem,
        cmp: { (arrayItem: TArrayItem, item: TItem): number }
    ): number {
        return OriginalBinarySearchBounds.ge(array, item, cmp);
    }

    export function EQ<TArrayItem, TItem>(
        array: Array<TArrayItem>,
        item: TItem,
        cmp: { (arrayItem: TArrayItem, item: TItem): number }
    ): number {
        return OriginalBinarySearchBounds.eq(array, item, cmp);
    }
}

export default BinarySearchBounds;
