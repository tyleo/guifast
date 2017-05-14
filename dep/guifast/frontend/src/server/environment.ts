import * as electron from 'electron';
import Redux from "guifast_shared/node_module/redux";
import {
    Action,
    ActionMapper,
    BackendInitialized,
    Command,
    compactedArray,
    CompactedArray,
    compactedArrayAdd,
    compactedArrayRemove,
    error,
    ForwardAction,
    fromRequireInfo,
    sendToGuifast,
    sendToLibflo,
    sendToSharedStore,
    sendToStore,
    Guifast,
    GuifastConfigSerde,
    MainReducer,
    ModuleMapper,
    ReconcileState,
    reducer,
    setError,
    setSendToGuifast,
    setSendToLibflo,
    setSendToSharedStore,
    setSendToStore,
    State,
    String,
    StringMap,
    TopMenuSerde,
    WindowInitialized,
    WindowUninitialized,
    WindowRequested
} from "guifast_shared";
import { LibfloClient } from "guifast/server";

const BrowserWindow = electron.BrowserWindow;

const addFunctionsToMenu = (menuTemplate: TopMenuSerde, moduleName: string): Electron.MenuItemOptions => {
    const result: Electron.MenuItemOptions = {};
    result.label = menuTemplate.label;

    if (menuTemplate.action !== null) {
        result.click = () => { sendToGuifast(menuTemplate.action!); };
    }

    if (menuTemplate.submenu !== null) {
        result.submenu = [];
        for (const submenuTemplate of menuTemplate.submenu) {
            result.submenu.push(addFunctionsToMenu(submenuTemplate, moduleName));
        }
    }

    return result;
};

const createMenuTemplate = (guifastMenuTemplate: Array<TopMenuSerde>, moduleName: string): Array<Electron.MenuItemOptions> => {
    const result = [];
    for (const submenuTemplate of guifastMenuTemplate) {
        result.push(addFunctionsToMenu(submenuTemplate, moduleName));
    }
    return result;
}

export class Environment {
    private libfloClientField: LibfloClient | undefined = undefined;
    private guifastField: Guifast | undefined = undefined;
    private mainReducersField: StringMap<MainReducer> = { };
    private storeField: Redux.Store<State | undefined> = Redux.createStore(reducer);
    private windowsField: CompactedArray<[any, boolean]> = compactedArray<[any, boolean]>();

    public get config(): GuifastConfigSerde | undefined {
        return this.store.getState()!.config;
    }

    public get libfloClient(): LibfloClient | undefined {
        return this.libfloClientField;
    }

    public get guifast(): Guifast | undefined {
        return this.guifastField;
    }

    public get store(): Redux.Store<State | undefined> {
        return this.storeField;
    }

    public get windows(): CompactedArray<any> {
        return this.windowsField;
    }

    public createStrIdAction(value: Action): Action {
        let originalActionType = value.type;
        if (this.guifast !== undefined) {
            originalActionType = this.guifast.actionMapper.getTypeString(originalActionType);
        }
        return { ...value, type: originalActionType };
    }

    public createWindow() {
        // Create the browser window.
        const window = new BrowserWindow({ width: 800, height: 600 });
        let windowIdCopy = 0;

        this.windowsField = compactedArrayAdd(
            this.windows,
            (windowId: number) => {
                windowIdCopy = windowId;
                (window as any).windowId = windowId;
                return [window, false];
            }
        );

        // Emitted when the window is closed.
        window.on(
            'closed',
            () => {
                // Dereference the window object, usually you would store windows
                // in an array if your app supports multi windows, this is the time
                // when you should delete the corresponding element.
                this.windowsField = compactedArrayRemove(this.windowsField, windowIdCopy);
                sendToSharedStore(WindowUninitialized.make(windowIdCopy));
            }
        );

        // Open the DevTools.
        window.webContents.openDevTools();

        // and load the index.html of the app.
        window.loadURL('file://' + __dirname + "/.." + '/index.html');
    }

    public dispatch(action: Action) {
        switch (action.type) {
            case BackendInitialized.id: {
                const backendInitialized = action as BackendInitialized.Action;

                this.guifastField = new Guifast(
                    new ActionMapper(backendInitialized.action_mapper),
                    new ModuleMapper(backendInitialized.module_mapper)
                );

                let numberOfWindows = 0;
                let menuTemplate: Array<Electron.MenuItemOptions> = [];
                for (const module of backendInitialized.modules.modules) {
                    if (module.startup_windows !== null) {
                        numberOfWindows = numberOfWindows + module.startup_windows.length;
                    }

                    if (module.menu !== null) {
                        menuTemplate = menuTemplate.concat(createMenuTemplate(module.menu, module.name));
                    }

                    if (module.main_reducer !== null) {
                        this.mainReducersField[module.name] = fromRequireInfo<MainReducer>(module.main_reducer);
                    }
                }

                if (menuTemplate.length > 0) {
                    const menu = electron.Menu.buildFromTemplate(menuTemplate);
                    electron.Menu.setApplicationMenu(menu);
                }

                while (this.windows.items.length < numberOfWindows) {
                    this.createWindow();
                }

                sendToSharedStore(action);
                break;
            }

            case Command.id: {
                sendToLibflo(action);
                sendToSharedStore(action);
                break;
            }

            case ForwardAction.id: {
                const forwardAction = action as ForwardAction.Action;
                const forwardedAction = forwardAction.action;
                const forwardedStrIdAction = environment.createStrIdAction(forwardedAction);

                switch (forwardAction.destination) {
                    case "Guifast": {
                        sendToGuifast(forwardedStrIdAction);
                        break;
                    }

                    case "Libflo": {
                        sendToLibflo(forwardedStrIdAction);
                        break;
                    }

                    case "SharedStore": {
                        sendToSharedStore(forwardedStrIdAction);
                        break;
                    }

                    default: {
                        const destination = forwardAction.destination;
                        sendToStore(forwardedStrIdAction, destination.Store);
                        break;
                    }
                }
                break;
            }

            case WindowInitialized.id: {
                const windowInitialized = action as WindowInitialized.Action;
                this.windows.items[windowInitialized.windowId][1] = true;
                sendToStore(ReconcileState.make(this.store.getState()), windowInitialized.windowId);
                break;
            }

            case WindowRequested.id: {
                const windowRequested = action as WindowRequested.Action;
                this.createWindow();
                sendToSharedStore(windowRequested);
            }
        }

        const state = this.store.getState()!;
        for (const key in this.mainReducersField) {
            const moduleState = state!.modulesState[key];
            const reducer = this.mainReducersField[key];
            reducer(moduleState, action, state);
        }
    }

    public start() {
        setError((val: string) => console.log(val));
        this.tryLoadLibflo();
    }

    private setLibfloClient(value: LibfloClient | undefined) {
        if (value !== undefined) {
            value.onStdout.add(
                e => {
                    try {
                        const action = JSON.parse(e) as Action;
                        const strIdAction = this.createStrIdAction(action);
                        this.dispatch(strIdAction);
                    } catch (e) {
                        error(e);
                    }
                }
            );
            value.onStderr.add(e => error(e))
        }
        this.libfloClientField = value;
    }

    private tryLoadLibflo(): boolean {
        if (this.libfloClient !== undefined) {
            return false;
        }

        this.setLibfloClient(new LibfloClient(String.libfloPath));
        return true;
    }
}

const environment = new Environment();

export const getEnvironment = (): Environment => {
    return environment;
}

// Sending
setSendToGuifast((action: Action) => {
    getEnvironment().dispatch(action);
});

setSendToLibflo((action: Action) => {
    getEnvironment().libfloClient!.dispatch(action);
});

setSendToStore((action: Action, destination: number | undefined) => {
    if (destination !== undefined) {
        const windowEntry = getEnvironment().windows.items[destination];
        if (windowEntry !== undefined) {
            const [window, isInitialized] = windowEntry;
            if (isInitialized) {
                window.send("store", action);
            }
        }
    }
});

setSendToSharedStore((action: Action) => {
    const environment = getEnvironment();
    getEnvironment().store.dispatch(action);

    let reconcileAction: Action | undefined = undefined;
    if (environment.config !== undefined && environment.config.should_always_reconcile_stores) {
        reconcileAction = ReconcileState.make(environment.store.getState());
    } else {
        reconcileAction = action;
    }

    for (const windowEntry of environment.windows.items) {
        if (windowEntry !== undefined) {
            const [window, isInitialized] = windowEntry;
            if (isInitialized) {
                window.send("shared_store", reconcileAction);
            }
        }
    }
});

// Receiving
electron.ipcMain.on("", (_, e, id) => {
    const action = e as Action;
    const strIdAction = getEnvironment().createStrIdAction(action);
    getEnvironment().dispatch(strIdAction)
});
