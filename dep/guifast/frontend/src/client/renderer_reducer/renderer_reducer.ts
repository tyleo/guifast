import * as Guifast from "guifast_shared";
import { commandWindowReducer } from "guifast/client/renderer_reducer";
import { GuifastRendererState } from "guifast/client/state";

const noop = (state: GuifastRendererState, action: Guifast.Action): GuifastRendererState => {
    return {
        ...state,
        reducer: state.reducer,
        commandWindowState: commandWindowReducer(state.commandWindowState!, action),
    }
};

export function rendererReducer(
    state: GuifastRendererState | undefined,
    action: Guifast.Action = Guifast.UndefinedAction.make(),
    guifastState: Guifast.RootRendererState
): GuifastRendererState {
    switch (action.type) {
        case Guifast.InitializeModule.id: {
            const initializeModule = action as Guifast.InitializeModule.Action;
            return {
                reducer: initializeModule.reducer,
                commandWindowState: commandWindowReducer(undefined, undefined),
            };
        }

        default: {
            return noop(state!, action);
        }
    }
}
