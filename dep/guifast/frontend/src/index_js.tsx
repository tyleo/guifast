import * as electron from "electron";
import installExtension, { REACT_DEVELOPER_TOOLS, REDUX_DEVTOOLS } from 'electron-devtools-installer'
import React from "guifast_shared/node_module/react";
import ReactDom from "guifast_shared/node_module/react_dom"
import Redux from "guifast_shared/node_module/redux";
import { getRootStore, getWindowId, setRootStore } from "guifast/client";
import { GuifastComponent } from "guifast/client/component";
import {
    Action,
    error,
    ForwardAction,
    sendToGuifast,
    sendToLibflo,
    sendToSharedStore,
    sendToStore,
    reducer,
    setError,
    setSendToGuifast,
    setSendToLibflo,
    setSendToStore,
    setSendToSharedStore
} from "guifast_shared";

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

setError(message => console.log(message));

setRootStore(
    Redux.createStore(
        reducer,
        (window as any).__REDUX_DEVTOOLS_EXTENSION__ && (window as any).__REDUX_DEVTOOLS_EXTENSION__()
    )
);

const guifastElement = document.getElementById("guifast");

ReactDom.render(
  <GuifastComponent/>,
  guifastElement!
);

// Sending
setSendToGuifast((action: Action) => electron.ipcRenderer.send("", action, getWindowId()));
setSendToLibflo((action: Action) => electron.ipcRenderer.send("", ForwardAction.make(action, "Libflo"), getWindowId()));
setSendToSharedStore((action: Action) => electron.ipcRenderer.send("", ForwardAction.make(action, "SharedStore"), getWindowId()));
setSendToStore(
    (action: Action, destination: number | undefined = undefined) => {
        if (destination === undefined || destination === getWindowId()) {
            getRootStore()!.dispatch(action);
        } else {
            electron.ipcRenderer.send("", ForwardAction.make(action, { Store: destination }), getWindowId());
        }
    }
);

// Receiving
electron.ipcRenderer.on("shared_store", (_, e) => sendToStore(e, undefined));
electron.ipcRenderer.on("store", (_, e) => sendToStore(e as Action, undefined));

sendToGuifast(WindowInitialized.make(getWindowId()));
