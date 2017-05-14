import { Action as ActionBase, ActionLocation, actionStrId, String } from "guifast_shared";

export namespace ForwardAction {
    export const str = "forward_action";
    export const id = actionStrId(String.module, str);

    export interface Action extends ActionBase {
        readonly action: ActionBase,
        readonly destination: ActionLocation,
    }

    export const make = (
        action: ActionBase,
        destination: ActionLocation
    ): Action => {
        return {
            type: id,
            action: action,
            destination: destination
        };
    };
}
