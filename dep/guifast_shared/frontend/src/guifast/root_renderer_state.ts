import * as Guifast from "guifast_shared";

export interface RootRendererState {
    readonly moduleNames: Array<string>;
    readonly statesAndReducers: Guifast.StringMap<Guifast.StateAndReducer>;
}