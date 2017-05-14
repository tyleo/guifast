import { Action, compactedArray, CompactedArray, UberWindowState } from "guifast_shared";

import { UndefinedAction } from "guifast_shared/action/undefined_action"

export const uberWindowsReducer = (
    state: CompactedArray<UberWindowState> = compactedArray<UberWindowState>(),
    action: Action = UndefinedAction.make(),
): CompactedArray<UberWindowState> => {
    switch (action.type) {
        default: {
            return state;
        }
    }
};
