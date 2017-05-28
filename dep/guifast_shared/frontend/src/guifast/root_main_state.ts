import * as Guifast from "guifast_shared";

export interface RootMainState {
    readonly moduleNames: Array<string>;
    readonly statesAndReducers: Guifast.StringMap<Guifast.StateAndReducer>;
}