export interface Indexer {
    readonly maxUsedIndex: number;
    readonly freeIndices: Array<number>;
}

export const indexer = (): Indexer => {
    return {
        maxUsedIndex: 0,
        freeIndices: [],
    };
};
