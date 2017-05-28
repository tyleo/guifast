import * as Guifast from "guifast_shared";

export namespace Command {
    const str = "command";
    export const id = Guifast.makeStrId(Guifast.String.module, str);

    export interface Action extends Guifast.Action {
        readonly data: string;
    }

    export const make = (data: string): Action => {
        return { type: id, data: data };
    };
}
