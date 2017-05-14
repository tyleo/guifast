import { Action, InitializeModule, State, UndefinedAction } from "guifast_shared";
import { commandWindowReducer } from "guifast/client/renderer_reducer";
import { GuifastState } from "guifast/client/state";

const noop = (state: GuifastState, action: Action): GuifastState => {
    return {
        ...state,
        reducer: state.reducer,
        commandWindowState: commandWindowReducer(state.commandWindowState!, action),
    }
};

export function rendererReducer(
    state: GuifastState | undefined,
    action: Action = UndefinedAction.make(),
    guifastState: State
): GuifastState {
    switch (action.type) {
        case InitializeModule.id: {
            const initializeModule = action as InitializeModule.Action;
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
