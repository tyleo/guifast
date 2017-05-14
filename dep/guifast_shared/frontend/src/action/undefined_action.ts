import { Action as ActionBase, actionStrId, String } from "guifast_shared";

export namespace UndefinedAction {
    export const str = "undefined_action";
    export const id = actionStrId(String.module, str);

    export interface Action extends ActionBase { }

    export const make = (): Action => {
        return { type: id };
    };
}