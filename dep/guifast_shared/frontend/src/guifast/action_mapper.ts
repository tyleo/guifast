import * as Guifast from "guifast_shared";

export class ActionMapper {
    public readonly actionMap: Array<Guifast.StringMap<number> | undefined>;
    public readonly actionList: Array<Guifast.ActionInfo>;

    public constructor(actionMapperSerde: Guifast.ActionMapperSerde) {
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

    public getInfo(actionId: number): Guifast.ActionInfo {
        return this.actionList[actionId]!;
    }

    public makeSerde(): Guifast.ActionMapperSerde {
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
