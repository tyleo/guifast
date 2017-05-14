import { StringMap } from "guifast_shared";

export interface ModuleMapperSerde {
    readonly module_map: StringMap<number>;
    readonly module_list: Array<string>;
}
