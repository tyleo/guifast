import Redux from "guifast_shared/node_module/redux";
import { State } from "guifast_shared";

let rootStore: Redux.Store<State | undefined> | undefined = undefined;

export const getRootStore = (): Redux.Store<State | undefined> | undefined => {
    return rootStore;
};

export const setRootStore = (value: Redux.Store<State | undefined>) => {
    rootStore = value;
};
