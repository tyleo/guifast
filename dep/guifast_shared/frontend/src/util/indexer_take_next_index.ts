import * as Guifast from "guifast_shared";

export const indexerTakeNextIndex = (state: Guifast.Indexer): [Guifast.Indexer, number] => {
    if (state.freeIndices.length === 0) {
        return [
            {
                maxUsedIndex: state.maxUsedIndex + 1,
                freeIndices: []
            },
            state.maxUsedIndex
        ];
    } else {
        const index = state.freeIndices.pop()!;
        return [
            {
                maxUsedIndex: state.maxUsedIndex,
                freeIndices: [...state.freeIndices]
            },
            index
        ];
    }
};
