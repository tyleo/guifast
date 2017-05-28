import * as Guifast from "guifast_shared";

export const indexerReleaseIndex = (state: Guifast.Indexer, index: number): Guifast.Indexer => {
    const freeIndices = [...state.freeIndices, index];

    return {
        maxUsedIndex: state.maxUsedIndex,
        freeIndices: freeIndices
    };
};
