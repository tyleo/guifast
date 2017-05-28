import * as Guifast from "guifast_shared";
import * as GuifastMain from "guifast/main";
import * as GuifastShared from "guifast/shared";

export class ExtActionMapper {
    private readonly actionMapper: GuifastMain.ActionMapper;
    private readonly moduleMapper: GuifastMain.ModuleMapper;

    public constructor(actionMapper: GuifastMain.ActionMapper, moduleMapper: GuifastMain.ModuleMapper) {
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

    public getInfo(actionId: number): GuifastMain.ActionInfo {
        return this.actionMapper.getInfo(actionId);
    }

    public getTypeString(actionType: Guifast.NumberOrString): string {
        return GuifastMain.mapNumberOrString(
            actionType,
            (actionId: number) => {
                const actionInfo = this.getInfo(actionId);
                const moduleName = this.moduleMapper.getName(actionInfo.moduleId);
                return moduleName + " " + actionInfo.actionName;
            },
            (stringValue: string) => stringValue
        );
    }

    public makeSerde(): GuifastShared.ActionMapperSerde {
        return this.actionMapper.makeSerde();
    }
}
