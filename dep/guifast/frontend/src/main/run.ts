import * as electron from 'electron';
import * as Guifast from "guifast_shared";
import * as GuifastMain from "guifast/main";
import * as GuifastShared from "guifast/shared";

// Error
Guifast.setError((message: string) => console.log(message));

// Sending
Guifast.setSendToLibflo((action: Guifast.Action) => {
    const forwardAction = GuifastShared.ForwardAction.make(action, "Libflo");
    Guifast.sendToMain(forwardAction);
});

const queuedActions: Array<Guifast.Action> = [];
let isDispatching = false;

Guifast.setSendToMain((action: Guifast.Action) => {
    queuedActions.push(action);
    if (!isDispatching) {
        isDispatching = true;

        let currentAction = queuedActions.pop();
        while (currentAction !== undefined) {
            const newState = GuifastMain.rootMainReducer(GuifastMain.getRootMainState(), currentAction);
            GuifastMain.setRootMainState(newState);
            currentAction = queuedActions.pop();
        }

        isDispatching = false;
    }
});

Guifast.setSendToRenderer((action: Guifast.Action, destination: number | undefined) => {
    if (destination === undefined) {
        Guifast.error("Error trying to send action to renderer. Destination is undefined.");
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
electron.ipcMain.on("", (_, e) => Guifast.sendToMain(e));

// Setup
electron.app.on('ready', () => Guifast.sendToMain(GuifastShared.Ready.make()));

electron.app.on('window-all-closed', () => Guifast.sendToMain(GuifastShared.WindowAllClosed.make()));

electron.app.on('activate', () => Guifast.sendToMain(GuifastShared.Activate.make()));
