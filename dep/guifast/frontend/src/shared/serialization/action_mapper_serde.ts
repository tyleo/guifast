import * as Guifast from "guifast_shared";
import * as GuifastShared from "guifast/shared";

export interface ActionMapperSerde {
    readonly action_map: Array<Guifast.StringMap<number> | null>;
    readonly action_list: Array<GuifastShared.ActionInfoSerde>;
}
