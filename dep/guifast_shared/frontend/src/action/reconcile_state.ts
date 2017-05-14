import { Action as ActionBase, actionStrId, String } from "guifast_shared";

export namespace ReconcileState {
    export const str = "reconcile_state";
    export const id = actionStrId(String.module, str);

    export interface Action extends ActionBase {
        readonly state: any
    }

    export const make = (
        state: any
    ): Action => {
        return {
            type: id,
            state: state
        }
    };
}
