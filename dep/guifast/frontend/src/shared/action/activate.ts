import * as Guifast from "guifast_shared";

export namespace Activate {
    const str = "activate";
    export const id = Guifast.makeStrId(Guifast.String.module, str);

    export interface Action extends Guifast.Action { }

    export const make = (): Action => { return { type: id }; };
}
