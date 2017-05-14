import * as Guifast from "guifast_shared";

export namespace WindowRequested {
    export const str = "window_requested";
    export const id = Guifast.actionStrId(Guifast.String.module, str);

    export interface Action extends Guifast.Action {
        readonly rootComponent: string;
    }

    export const make = (rootComponent: string): Action => {
        return { type: id, rootComponent: rootComponent };
    };
}