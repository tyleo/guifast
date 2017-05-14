import { Action, UndefinedAction } from "guifast_shared";
import { Command } from "guifast_shared/action/command";
import { CommandWindowState } from "guifast/client/state";

export const commandWindowReducer = (
    state: CommandWindowState = {
        currentLine: "",
        previousLines: []
    },
    action: Action = UndefinedAction.make()
): CommandWindowState => {
    switch (action.type) {
        case Command.id: {
            const command = action as Command.Action;
            const newLines = [...state!.previousLines];
            newLines.push("< " + command.data);
            return {
                ...state,
                previousLines: newLines
            };
        }

        default: {
            return state!;
        }
    }
}
