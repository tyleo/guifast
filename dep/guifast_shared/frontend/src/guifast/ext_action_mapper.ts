import { ActionInfo, ActionMapper, ActionMapperSerde, mapNumberOrString, ModuleMapper, NumberOrString } from "guifast_shared";

export class ExtActionMapper {
    private readonly actionMapper: ActionMapper;
    private readonly moduleMapper: ModuleMapper;

    public constructor(actionMapper: ActionMapper, moduleMapper: ModuleMapper) {
        this.actionMapper = actionMapper;
        this.moduleMapper = moduleMapper;
    }

    public get(moduleId: number, actionName: string): number {
        return this.actionMapper.get(moduleId, actionName);
    }

    public getByModuleName(moduleName: string, actionName: string): number {
        const moduleIndex = this.moduleMapper.get(moduleName);
        return this.get(moduleIndex, actionName);
    }

    public getInfo(actionId: number): ActionInfo {
        return this.actionMapper.getInfo(actionId);
    }

    public getTypeString(actionType: NumberOrString): string {
        return mapNumberOrString(
            actionType,
            (actionId: number) => {
                const actionInfo = this.getInfo(actionId);
                const moduleName = this.moduleMapper.getName(actionInfo.moduleId);
                return moduleName + " " + actionInfo.actionName;
            },
            (stringValue: string) => stringValue
        );
    }

    public makeSerde(): ActionMapperSerde {
        return this.actionMapper.makeSerde();
    }
}
