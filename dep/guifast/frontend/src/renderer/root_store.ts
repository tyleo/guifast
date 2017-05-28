import Redux from "guifast_shared/node_module/redux";
import * as Guifast from "guifast_shared";

let rootStore: Redux.Store<Guifast.RootRendererState | undefined> | undefined = undefined;

export const getRootStore = (): Redux.Store<Guifast.RootRendererState | undefined> | undefined => {
    return rootStore;
};

export const setRootStore = (value: Redux.Store<Guifast.RootRendererState | undefined>) => {
    rootStore = value;
};
