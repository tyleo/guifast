import * as Guifast from "guifast_shared";

export namespace ReconcileState {
    const str = "reconcile_state";
    export const id = Guifast.makeStrId(Guifast.String.module, str);

    export interface Action extends Guifast.Action { readonly state: any }

    export const make = (state: any): Action => {
        return { type: id, state: state }
    };
}
