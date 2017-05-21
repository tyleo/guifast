import * as electron from "electron";
import installExtension, { REACT_DEVELOPER_TOOLS, REDUX_DEVTOOLS } from 'electron-devtools-installer'
import React from "guifast_shared/node_module/react";
import ReactDom from "guifast_shared/node_module/react_dom"
import Redux from "guifast_shared/node_module/redux";
import { getRootStore, getWindowId, setRootStore } from "guifast/client";
import { GuifastComponent } from "guifast/client/component";
import * as Guifast from "guifast_shared";

import { WindowInitialized } from "guifast_shared/action/window_initialized";

try {
    require("devtron").install();
    console.log('Added devtron extension.')
} catch (err) {
    console.log('Error installing devtron extension: ', err);
}

installExtension(REACT_DEVELOPER_TOOLS)
    .then(name => console.log('Added react extension.'))
    .catch(err => console.log('Error installing react extension: ', err));

installExtension(REDUX_DEVTOOLS)
    .then(name => console.log('Added redux extension.'))
    .catch(err => console.log('Error installing redux extension: ', err));

Guifast.setError(message => console.log(message));

setRootStore(
    Redux.createStore(
        Guifast.rootRendererReducer,
        (window as any).__REDUX_DEVTOOLS_EXTENSION__ && (window as any).__REDUX_DEVTOOLS_EXTENSION__()
    )
);

const guifastElement = document.getElementById("guifast");

ReactDom.render(
  <GuifastComponent/>,
  guifastElement!
);

// Sending
Guifast.setSendToMain((action: Guifast.Action) => electron.ipcRenderer.send("", action, getWindowId()));
Guifast.setSendToLibflo((action: Guifast.Action) => electron.ipcRenderer.send("", Guifast.ForwardAction.make(action, "Libflo"), getWindowId()));
Guifast.setSendToSharedRenderer((action: Guifast.Action) => electron.ipcRenderer.send("", Guifast.ForwardAction.make(action, "SharedRenderer"), getWindowId()));
Guifast.setSendToRenderer(
    (action: Guifast.Action, destination: number | undefined = undefined) => {
        if (destination === undefined || destination === getWindowId()) {
            getRootStore()!.dispatch(action);
        } else {
            electron.ipcRenderer.send("", Guifast.ForwardAction.make(action, { Renderer: destination }), getWindowId());
        }
    }
);

// Receiving
electron.ipcRenderer.on("shared_store", (_, e) => Guifast.sendToRenderer(e, undefined));
electron.ipcRenderer.on("store", (_, e) => Guifast.sendToRenderer(e as Guifast.Action, undefined));

Guifast.sendToMain(WindowInitialized.make(getWindowId()));
