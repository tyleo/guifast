import * as Guifast from "guifast_shared";

export interface StateAndReducer {
    readonly state: any;
    readonly reducer: Guifast.RequireInfo;
}