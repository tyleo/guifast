import * as Guifast from "guifast_shared";

export interface ModuleMapperSerde {
    readonly module_map: Guifast.StringMap<number>;
    readonly module_list: Array<string>;
}
