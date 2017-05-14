import { ModuleMapperSerde, StringMap } from "guifast_shared";

export class ModuleMapper {
    public readonly moduleMap: StringMap<number>;
    public readonly moduleList: Array<string>;

    public constructor(moduleMapperSerde: ModuleMapperSerde) {
        this.moduleMap = moduleMapperSerde.module_map;
        this.moduleList = moduleMapperSerde.module_list;
    }

    public get(moduleName: string): number {
        return this.moduleMap[moduleName]!;
    }

    public getName(moduleId: number): string {
        return this.moduleList[moduleId];
    }

    public makeSerde(): ModuleMapperSerde {
        return {
            module_map: this.moduleMap,
            module_list: this.moduleList
        };
    }
};
