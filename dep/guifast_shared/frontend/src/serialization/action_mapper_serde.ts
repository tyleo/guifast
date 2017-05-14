import { ActionInfoSerde, StringMap } from "guifast_shared";

export interface ActionMapperSerde {
    readonly action_map: Array<StringMap<number> | null>;
    readonly action_list: Array<ActionInfoSerde>;
}
