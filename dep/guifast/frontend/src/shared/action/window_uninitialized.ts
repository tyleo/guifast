import * as Guifast from "guifast_shared";

export namespace WindowUninitialized {
    const str = "window_uninitialized";
    export const id = Guifast.makeStrId(Guifast.String.module, str);

    export interface Action extends Guifast.Action {
        readonly windowId: number;
    }

    export const make = (windowId: number): Action => {
        return { type: id, windowId: windowId };
    };
}
