import React from "guifast_shared/node_module/react"
import * as Guifast from "guifast_shared";
import { CommandWindowComponent } from "guifast/client/component";
import { GuifastRendererState } from "guifast/client/state";

export const CommandWindowGuifastContainer: Guifast.Component = (state: Guifast.RootRendererState) => {
    const guifastState = state.rendererStates["guifast"]! as GuifastRendererState;
    const commandWindowState = guifastState.commandWindowState;

    return CommandWindowComponent(commandWindowState);
};
