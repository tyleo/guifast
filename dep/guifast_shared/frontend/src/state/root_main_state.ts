import * as Guifast from "guifast_shared";

export interface RootMainState {
    readonly moduleNames: Array<string>;
    readonly reducersAndStates: Guifast.StringMap<[Guifast.RequireInfo, any]>;
}