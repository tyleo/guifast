import * as Guifast from "guifast_shared";
import * as GuifastShared from "guifast/shared";

export namespace ForwardAction {
    const str = "forward_action";
    export const id = Guifast.makeStrId(Guifast.String.module, str);

    export interface Action extends Guifast.Action {
        readonly action: Guifast.Action,
        readonly destination: GuifastShared.ActionLocation,
    }

    export const make = (
        action: Guifast.Action,
        destination: GuifastShared.ActionLocation
    ): Action => {
        return {
            type: id,
            action: action,
            destination: destination
        };
    };
}
