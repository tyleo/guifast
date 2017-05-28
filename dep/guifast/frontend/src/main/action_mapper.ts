import * as Guifast from "guifast_shared";
import * as GuifastMain from "guifast/main";
import * as GuifastShared from "guifast/shared";

export class ActionMapper {
    public readonly actionMap: Array<Guifast.StringMap<number> | undefined>;
    public readonly actionList: Array<GuifastMain.ActionInfo>;

    public constructor(actionMapperSerde: GuifastShared.ActionMapperSerde) {
        this.actionMap = actionMapperSerde.action_map.map(
            map => {
                if (map === null) {
                    return undefined;
                } else {
                    return map;
                }
            }
        );
        this.actionList = actionMapperSerde.action_list.map(
            actionInfo => {
                return { moduleId: actionInfo.module_id, actionName: actionInfo.action_name }
            }
        );
    }

    public get(moduleId: number, actionName: string): number {
        return this.actionMap[moduleId]![actionName]!;
    }

    public getInfo(actionId: number): GuifastMain.ActionInfo {
        return this.actionList[actionId]!;
    }

    public makeSerde(): GuifastShared.ActionMapperSerde {
        const actionMap = this.actionMap.map(
            map => {
                if (map === undefined) {
                    return null;
                } else {
                    return map;
                }
            }
        );
        const actionList = this.actionList.map(
            actionInfo => {
                return { module_id: actionInfo.moduleId, action_name: actionInfo.actionName };
            }
        );
        return {
            action_map: actionMap,
            action_list: actionList
        };
    }
};
