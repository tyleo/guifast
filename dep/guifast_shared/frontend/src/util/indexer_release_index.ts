import { Indexer } from "guifast_shared";

export const indexerReleaseIndex = (state: Indexer, index: number): Indexer => {
    const freeIndices = [...state.freeIndices, index];

    return {
        maxUsedIndex: state.maxUsedIndex,
        freeIndices: freeIndices
    };
};
