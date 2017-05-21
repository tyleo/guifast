import * as electron from 'electron';
import Redux from "guifast_shared/node_module/redux";
import * as Guifast from "guifast_shared";
import { LibfloClient } from "guifast/server";

const BrowserWindow = electron.BrowserWindow;

const addFunctionsToMenu = (menuTemplate: Guifast.TopMenuSerde, moduleName: string): Electron.MenuItemOptions => {
    const result: Electron.MenuItemOptions = {};
    result.label = menuTemplate.label;

    if (menuTemplate.action !== null) {
        result.click = () => { Guifast.sendToMain(menuTemplate.action!); };
    }

    if (menuTemplate.submenu !== null) {
        result.submenu = [];
        for (const submenuTemplate of menuTemplate.submenu) {
            result.submenu.push(addFunctionsToMenu(submenuTemplate, moduleName));
        }
    }

    return result;
};

const createMenuTemplate = (guifastMenuTemplate: Array<Guifast.TopMenuSerde>, moduleName: string): Array<Electron.MenuItemOptions> => {
    const result = [];
    for (const submenuTemplate of guifastMenuTemplate) {
        result.push(addFunctionsToMenu(submenuTemplate, moduleName));
    }
    return result;
}

export class Environment {
    private libfloClientField: LibfloClient | undefined = undefined;
    private guifastField: Guifast.Guifast | undefined = undefined;
    private mainStoreField: Guifast.RootMainState = { moduleNames: [], reducersAndStates: { } };
    private rendererStoreField: Redux.Store<Guifast.RootRendererState | undefined> = Redux.createStore(Guifast.rootRendererReducer);
    private windowsField: Guifast.CompactedArray<[any, boolean]> = Guifast.compactedArray<[any, boolean]>();

    public get config(): Guifast.GuifastConfigSerde | undefined {
        return this.rendererStore.getState()!.config;
    }

    public get libfloClient(): LibfloClient | undefined {
        return this.libfloClientField;
    }

    public get guifast(): Guifast.Guifast | undefined {
        return this.guifastField;
    }

    public get rendererStore(): Redux.Store<Guifast.RootRendererState | undefined> {
        return this.rendererStoreField;
    }

    public get windows(): Guifast.CompactedArray<any> {
        return this.windowsField;
    }

    public createStrIdAction(value: Guifast.Action): Guifast.Action {
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

        this.windowsField = Guifast.compactedArrayAdd(
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
                this.windowsField = Guifast.compactedArrayRemove(this.windowsField, windowIdCopy);
                Guifast.sendToSharedRenderer(Guifast.WindowUninitialized.make(windowIdCopy));
            }
        );

        // Open the DevTools.
        window.webContents.openDevTools();

        // and load the index.html of the app.
        window.loadURL('file://' + __dirname + "/.." + '/index.html');
    }

    public dispatch(action: Guifast.Action) {
        switch (action.type) {
            case Guifast.BackendInitialized.id: {
                const backendInitialized = action as Guifast.BackendInitialized.Action;

                this.guifastField = new Guifast.Guifast(
                    new Guifast.ActionMapper(backendInitialized.action_mapper),
                    new Guifast.ModuleMapper(backendInitialized.module_mapper)
                );

                let numberOfWindows = 0;
                let menuTemplate: Array<Electron.MenuItemOptions> = [];

                const mainReducerModuleNames: Array<string> = [];
                const mainReducerReducersAndStates: Guifast.StringMap<[Guifast.RequireInfo, any]> = { };
                for (const module of backendInitialized.modules.modules) {
                    if (module.startup_windows !== null) {
                        numberOfWindows = numberOfWindows + module.startup_windows.length;
                    }

                    if (module.menu !== null) {
                        menuTemplate = menuTemplate.concat(createMenuTemplate(module.menu, module.name));
                    }

                    if (module.main_reducer !== null) {
                        const requiredMainReducer = Guifast.fromRequireInfo<Guifast.MainReducer>(module.main_reducer);
                        const mainState = requiredMainReducer(undefined, undefined, undefined, this.mainStoreField, this.rendererStoreField.getState()!);

                        mainReducerModuleNames.push(module.name);
                        mainReducerReducersAndStates[module.name] = [module.main_reducer, mainState];
                    }
                }
                this.mainStoreField = { moduleNames: mainReducerModuleNames, reducersAndStates: mainReducerReducersAndStates };

                if (menuTemplate.length > 0) {
                    const menu = electron.Menu.buildFromTemplate(menuTemplate);
                    electron.Menu.setApplicationMenu(menu);
                }

                while (this.windows.items.length < numberOfWindows) {
                    this.createWindow();
                }

                Guifast.sendToSharedRenderer(action);
                break;
            }

            case Guifast.Command.id: {
                Guifast.sendToLibflo(action);
                Guifast.sendToSharedRenderer(action);
                break;
            }

            case Guifast.ForwardAction.id: {
                const forwardAction = action as Guifast.ForwardAction.Action;
                const forwardedAction = forwardAction.action;
                const forwardedStrIdAction = environment.createStrIdAction(forwardedAction);

                switch (forwardAction.destination) {
                    case "Main": {
                        Guifast.sendToMain(forwardedStrIdAction);
                        break;
                    }

                    case "Libflo": {
                        Guifast.sendToLibflo(forwardedStrIdAction);
                        break;
                    }

                    case "SharedRenderer": {
                        Guifast.sendToSharedRenderer(forwardedStrIdAction);
                        break;
                    }

                    default: {
                        const destination = forwardAction.destination;
                        Guifast.sendToRenderer(forwardedStrIdAction, destination.Renderer);
                        break;
                    }
                }
                break;
            }

            case Guifast.WindowInitialized.id: {
                const windowInitialized = action as Guifast.WindowInitialized.Action;
                this.windows.items[windowInitialized.windowId][1] = true;
                Guifast.sendToRenderer(Guifast.ReconcileState.make(this.rendererStore.getState()), windowInitialized.windowId);
                break;
            }

            case Guifast.WindowRequested.id: {
                const windowRequested = action as Guifast.WindowRequested.Action;
                this.createWindow();
                Guifast.sendToSharedRenderer(windowRequested);
            }
        }

        const state = this.rendererStore.getState()!;
        const newReducersAndStates: Guifast.StringMap<[Guifast.RequireInfo, any]> = { };
        for (const moduleName of this.mainStoreField.moduleNames) {
            const [mainReducerRequireInfo, mainState] = this.mainStoreField.reducersAndStates[moduleName];
            let rendererReducerState: Guifast.RendererState | undefined = undefined;
            if (state.rendererStates[moduleName] !== undefined) {
                rendererReducerState = state.rendererStates[moduleName];
            }
            const mainReducer = Guifast.fromRequireInfo<Guifast.MainReducer>(mainReducerRequireInfo);
            const newMainState = mainReducer(mainState, rendererReducerState, action, this.mainStoreField, state);
            newReducersAndStates[moduleName] = [mainReducerRequireInfo, newMainState];
        }
        this.mainStoreField = { ...this.mainStoreField, newReducersAndStates };
    }

    public start() {
        Guifast.setError((val: string) => console.log(val));
        this.tryLoadLibflo();
    }

    private setLibfloClient(value: LibfloClient | undefined) {
        if (value !== undefined) {
            value.onStdout.add(
                e => {
                    try {
                        const action = JSON.parse(e) as Guifast.Action;
                        const strIdAction = this.createStrIdAction(action);
                        this.dispatch(strIdAction);
                    } catch (e) {
                        Guifast.error(e);
                    }
                }
            );
            value.onStderr.add(e => Guifast.error(e))
        }
        this.libfloClientField = value;
    }

    private tryLoadLibflo(): boolean {
        if (this.libfloClient !== undefined) {
            return false;
        }

        this.setLibfloClient(new LibfloClient(Guifast.String.libfloPath));
        return true;
    }
}

const environment = new Environment();

export const getEnvironment = (): Environment => {
    return environment;
}

// Sending
Guifast.setSendToMain((action: Guifast.Action) => {
    getEnvironment().dispatch(action);
});

Guifast.setSendToLibflo((action: Guifast.Action) => {
    getEnvironment().libfloClient!.dispatch(action);
});

Guifast.setSendToRenderer((action: Guifast.Action, destination: number | undefined) => {
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

Guifast.setSendToSharedRenderer((action: Guifast.Action) => {
    const environment = getEnvironment();
    getEnvironment().rendererStore.dispatch(action);

    let reconcileAction: Guifast.Action | undefined = undefined;
    if (environment.config !== undefined && environment.config.should_always_reconcile_stores) {
        reconcileAction = Guifast.ReconcileState.make(environment.rendererStore.getState());
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
    const action = e as Guifast.Action;
    const strIdAction = getEnvironment().createStrIdAction(action);
    getEnvironment().dispatch(strIdAction)
});
