import * as electron from "electron";
import installExtension from "electron-devtools-installer";
import * as ElectronDevtoolsInstaller from "electron-devtools-installer";
import React from "guifast_shared/node_module/react";
import ReactDom from "guifast_shared/node_module/react_dom"
import Redux from "guifast_shared/node_module/redux";
import * as Guifast from "guifast_shared";
import * as GuifastRenderer from "guifast/renderer";
import * as GuifastShared from "guifast/shared";

// Error
Guifast.setError(message => console.log(message));

// Sending
Guifast.setSendToLibflo((action: Guifast.Action) => {
    const forwardAction = GuifastShared.ForwardAction.make(action, "Libflo");
    Guifast.sendToMain(forwardAction);
});

Guifast.setSendToMain((action: Guifast.Action) => {
    electron.ipcRenderer.send("", action);
});

Guifast.setSendToRenderer((action: Guifast.Action, destination: number | undefined) => {
    if (destination === undefined || destination === GuifastRenderer.getWindowId()) {
        GuifastRenderer.getRootStore()!.dispatch(action);
    } else {
        const forwardAction = GuifastShared.ForwardAction.make(action, { Renderer: destination });
        Guifast.sendToMain(forwardAction);
    }
});

Guifast.setSendToSharedRenderer((action: Guifast.Action) => {
    const forwardAction = GuifastShared.ForwardAction.make(action, "SharedRenderer");
    Guifast.sendToMain(forwardAction);
});

// Recieving
electron.ipcRenderer.on("", (_, e) => Guifast.sendToRenderer(e, undefined));

// Setup
try {
    require("devtron").install();
    console.log('Added devtron extension.')
} catch (err) {
    console.log('Error installing devtron extension: ', err);
}

installExtension(ElectronDevtoolsInstaller.REACT_DEVELOPER_TOOLS)
    .then(name => console.log('Added react extension.'))
    .catch(err => console.log('Error installing react extension: ', err));

installExtension(ElectronDevtoolsInstaller.REDUX_DEVTOOLS)
    .then(name => console.log('Added redux extension.'))
    .catch(err => console.log('Error installing redux extension: ', err));

GuifastRenderer.setRootStore(
    Redux.createStore(
        GuifastRenderer.rootRendererReducer,
        (window as any).__REDUX_DEVTOOLS_EXTENSION__ && (window as any).__REDUX_DEVTOOLS_EXTENSION__()
    )
);

const guifastElement = document.getElementById("guifast");


ReactDom.render(
  <GuifastRenderer.GuifastComponent/>,
  guifastElement!
);

Guifast.sendToMain(GuifastShared.WindowInitialized.make(GuifastRenderer.getWindowId()));
