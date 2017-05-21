import * as Guifast from "guifast_shared";

export class ExtActionMapper {
    private readonly actionMapper: Guifast.ActionMapper;
    private readonly moduleMapper: Guifast.ModuleMapper;

    public constructor(actionMapper: Guifast.ActionMapper, moduleMapper: Guifast.ModuleMapper) {
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

    public getInfo(actionId: number): Guifast.ActionInfo {
        return this.actionMapper.getInfo(actionId);
    }

    public getTypeString(actionType: Guifast.NumberOrString): string {
        return Guifast.mapNumberOrString(
            actionType,
            (actionId: number) => {
                const actionInfo = this.getInfo(actionId);
                const moduleName = this.moduleMapper.getName(actionInfo.moduleId);
                return moduleName + " " + actionInfo.actionName;
            },
            (stringValue: string) => stringValue
        );
    }

    public makeSerde(): Guifast.ActionMapperSerde {
        return this.actionMapper.makeSerde();
    }
}
