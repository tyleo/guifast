import React from "guifast_shared/node_module/react"
import * as CommandWindow from "guifast/command_window";
import * as Guifast from "guifast_shared";

export const CommandWindowContainer: Guifast.Component = (state: Guifast.RootRendererState) => {
    const commandWindowState = state.statesAndReducers["guifast"]!.state as CommandWindow.CommandWindowState;
    return CommandWindow.CommandWindowComponent(commandWindowState);
};
