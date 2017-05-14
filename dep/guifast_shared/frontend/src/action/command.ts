import { Action as ActionBase, actionStrId, String } from "guifast_shared";

export namespace Command {
    export const str = "command";
    export const id = actionStrId(String.module, str);

    export interface Action extends ActionBase {
        readonly data: string;
    }

    export const make = (data: string): Action => {
        return {
            type: id,
            data: data
        };
    };
}
