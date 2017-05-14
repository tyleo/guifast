import React from "guifast_shared/node_module/react"
import { Component, State } from "guifast_shared";
import { CommandWindowComponent } from "guifast/client/component";
import { GuifastState } from "guifast/client/state";

export const CommandWindowGuifastContainer: Component = (state: State) => {
    const guifastState = state.modulesState["guifast"]! as GuifastState;
    const commandWindowState = guifastState.commandWindowState;

    return CommandWindowComponent(commandWindowState);
};
