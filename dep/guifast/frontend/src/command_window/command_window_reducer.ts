import * as Guifast from "guifast_shared";
import * as CommandWindow from "guifast/command_window";

export const commandWindowReducer = (
    state: CommandWindow.CommandWindowState = {
        currentLine: "",
        previousLines: []
    },
    action: Guifast.Action = Guifast.UndefinedAction.make(),
    rendererRootState: Guifast.RootRendererState
): CommandWindow.CommandWindowState => {
    switch (action.type) {
        case Guifast.Command.id: {
            const command = action as Guifast.Command.Action;
            const newLines = [...state!.previousLines];
            newLines.push("< " + command.data);
            return {
                ...state,
                previousLines: newLines
            };
        }

        default: {
            return state;
        }
    }
};
