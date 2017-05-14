import { Action as ActionBase, actionStrId, RequireInfo, String } from "guifast_shared";

export namespace InitializeModule {
    export const str = "initialize_module";
    export const id = actionStrId(String.module, str);

    export interface Action extends ActionBase {
        readonly reducer: RequireInfo;
    }

    export const make = (reducer: RequireInfo): Action => {
        return {
            type: id,
            reducer: reducer
        };
    };
}
