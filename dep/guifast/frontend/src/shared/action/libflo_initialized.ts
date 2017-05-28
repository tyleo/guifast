import * as Guifast from "guifast_shared";
import * as GuifastShared from "guifast/shared";

export namespace LibfloInitialized {
    const str = "libflo_initialized";
    export const id = Guifast.makeStrId(Guifast.String.module, str);

    export interface Action extends Guifast.Action {
        readonly action_mapper: GuifastShared.ActionMapperSerde,
        readonly config: GuifastShared.GuifastConfigSerde,
        readonly module_mapper: GuifastShared.ModuleMapperSerde,
        readonly modules: GuifastShared.ModulesSerde
    }

    export const make = (
        actionMapper: GuifastShared.ActionMapperSerde,
        config: GuifastShared.GuifastConfigSerde,
        moduleMapper: GuifastShared.ModuleMapperSerde,
        modules: GuifastShared.ModulesSerde
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