import * as Guifast from "guifast_shared";
import * as GuifastMain from "guifast/main";

export const tryCreateStrIdAction = (
    action: Guifast.Action,
    actionMapper: GuifastMain.ActionMapper | undefined,
    moduleMapper: GuifastMain.ModuleMapper | undefined
): Guifast.Action => {
    if (actionMapper === undefined || moduleMapper === undefined) {
        return action;
    } else {
        const extActionMapper = new GuifastMain.ExtActionMapper(actionMapper, moduleMapper);
        const stringType = extActionMapper.getTypeString(action.type);
        return { ...action, type: stringType };
    }
};