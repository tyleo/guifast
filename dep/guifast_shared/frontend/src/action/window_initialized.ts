import { Action as ActionBase, actionStrId, String } from "guifast_shared";

export namespace WindowInitialized {
    export const str = "window_initialized";
    export const id = actionStrId(String.module, str);

    export interface Action extends ActionBase {
        readonly windowId: number;
    }

    export const make = (windowId: number): Action => {
        return {
            type: id,
            windowId: windowId
        };
    };
}
