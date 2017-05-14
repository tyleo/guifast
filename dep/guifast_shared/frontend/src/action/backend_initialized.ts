import { Action as ActionBase, ActionMapperSerde, actionStrId, GuifastConfigSerde, ModulesSerde, ModuleMapperSerde, String } from "guifast_shared";

export namespace BackendInitialized {
    export const str = "backend_initialized";
    export const id = actionStrId(String.module, str);

    export interface Action extends ActionBase {
        readonly action_mapper: ActionMapperSerde;
        readonly config: GuifastConfigSerde;
        readonly module_mapper: ModuleMapperSerde;
        readonly modules: ModulesSerde;
    }

    export const make = (
        actionMapper: ActionMapperSerde,
        config: GuifastConfigSerde,
        moduleMapper: ModuleMapperSerde,
        modules: ModulesSerde
    ): Action => {
        return {
            type: id,
            action_mapper: actionMapper,
            config: config,
            module_mapper: moduleMapper,
            modules: modules
        };
    };
}
