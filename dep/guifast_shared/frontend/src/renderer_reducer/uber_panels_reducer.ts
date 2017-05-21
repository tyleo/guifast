import { Action, compactedArray, CompactedArray, UberPanelState } from "guifast_shared";

import { UndefinedAction } from "guifast_shared/action/undefined_action"

export const uberPanelsReducer = (
    state: CompactedArray<UberPanelState> = compactedArray<UberPanelState>(),
    action: Action = UndefinedAction.make(),
): CompactedArray<UberPanelState> => {
    switch (action.type) {
        default: {
            return state;
        }
    }
};
