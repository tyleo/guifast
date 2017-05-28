import * as Electron from "electron";
import Redux from "guifast_shared/node_module/redux";
import * as Guifast from "guifast_shared";
import * as GuifastMain from "guifast/main";
import * as GuifastRenderer from "guifast/renderer";
import * as GuifastShared from "guifast/shared";

function addFunctionsToMenu(menuTemplate: GuifastShared.TopMenuSerde, moduleName: string): Electron.MenuItemOptions {
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

const createMenuTemplate = (guifastMenuTemplate: Array<GuifastShared.TopMenuSerde>, moduleName: string): Array<Electron.MenuItemOptions> => {
    const result = [];
    for (const submenuTemplate of guifastMenuTemplate) {
        result.push(addFunctionsToMenu(submenuTemplate, moduleName));
    }
    return result;
};

const createWindow = (
    windows: Guifast.CompactedArray<GuifastMain.WindowEntry>
): Guifast.CompactedArray<GuifastMain.WindowEntry> => {
    // Create the browser window.
    const window = new Electron.BrowserWindow({ width: 800, height: 600 }) as GuifastShared.GuifastWindow;
    let windowIdCopy = 0;

    const resultWindows = Guifast.compactedArrayAdd(
        windows,
        (windowId: number) => {
            windowIdCopy = windowId;
            (window as GuifastShared.GuifastWindow).windowId = windowId;
            return { window: window, isInitialized: false };
        }
    );

    // Emitted when the window is closed.
    window.on(
        'closed',
        () => Guifast.sendToMain(GuifastShared.WindowUninitialized.make(windowIdCopy))
    );

    // Open the DevTools.
    window.webContents.openDevTools();

    // and load the index.html of the app.
    window.loadURL('file://' + __dirname + "/.." + '/renderer/index.html');

    return resultWindows;
};

const reduceMainReducers = (
    action: Guifast.Action,
    state: GuifastMain.GuifastMainState
): GuifastMain.GuifastMainState => {
    const statesAndReducers: Guifast.StringMap<Guifast.StateAndReducer> = {};
    const rendererRootState = state.rendererStore.getState()!;

    for (const moduleName of state.moduleNames) {
        const mainStateAndReducer = state.statesAndReducers[moduleName];
        if (mainStateAndReducer === undefined) {
            Guifast.error("Error reducing main module. The module, '" + moduleName + " could not be found.");
        } else {
            const rendererStateAndReducer = rendererRootState.statesAndReducers[moduleName];
            let rendererState = undefined;
            if (rendererStateAndReducer !== undefined) {
                rendererState = rendererStateAndReducer.state;
            }
            const reducer = GuifastShared.fromRequireInfo<Guifast.MainReducer>(mainStateAndReducer.reducer);
            statesAndReducers[moduleName] = {
                reducer: mainStateAndReducer.reducer,
                state: reducer(mainStateAndReducer.state, rendererState, action, state, rendererRootState)
            };
        }
    }

    return {
        ...state,
        statesAndReducers: statesAndReducers
    };
};

const trySendActionToWindow = (
    action: Guifast.Action,
    windowEntry: GuifastMain.WindowEntry | undefined
): boolean => {
    if (windowEntry !== undefined) {
        if (windowEntry.isInitialized) {
            windowEntry.window.webContents.send("", action);
            return true;
        } else {
            return false;
        }
    } else {
        return false;
    }
};

export const rootMainReducer = (
    state: GuifastMain.GuifastMainState = {
        actionMapper: undefined,
        config: undefined,
        libfloClient: undefined,
        moduleMapper: undefined,
        moduleNames: [],
        statesAndReducers: {},
        rendererStore: Redux.createStore(GuifastRenderer.rootRendererReducer),
        windows: Guifast.compactedArray<GuifastMain.WindowEntry>()
    },
    action: Guifast.Action = Guifast.UndefinedAction.make()
): GuifastMain.GuifastMainState => {
    const reducedState = reduceMainReducers(action, state);

    switch (action.type) {
        case GuifastShared.Activate.id: {
            // On OS X it's common to re-create a window in the app when the
            // dock icon is clicked and there are no other windows open.
            if (reducedState.windows.items.length <= 0) {
                // TODO: Create a default here
                // createWindow();
            }
            return reducedState;
        }

        case GuifastShared.LibfloInitialized.id: {
            const libfloInitialized = action as GuifastShared.LibfloInitialized.Action;

            const rendererRootState = reducedState.rendererStore.getState()!;

            const actionMapper = new GuifastMain.ActionMapper(libfloInitialized.action_mapper);
            const config = libfloInitialized.config;
            const moduleMapper = new GuifastMain.ModuleMapper(libfloInitialized.module_mapper);

            let numberOfWindows = 0;
            let menuTemplate: Array<Electron.MenuItemOptions> = [];
            const moduleNames: Array<string> = [];
            const statesAndReducers: Guifast.StringMap<Guifast.StateAndReducer> = {};

            for (const module of libfloInitialized.modules.modules) {
                if (module.startup_windows !== null) {
                    numberOfWindows = numberOfWindows + module.startup_windows.length;
                }

                if (module.menu !== null) {
                    menuTemplate = menuTemplate.concat(createMenuTemplate(module.menu, module.name));
                }

                if (module.main_reducer !== null) {
                    const requiredMainReducer = GuifastShared.fromRequireInfo<Guifast.MainReducer>(module.main_reducer);
                    const mainState = requiredMainReducer(undefined, undefined, undefined, reducedState, rendererRootState);

                    moduleNames.push(module.name);
                    statesAndReducers[module.name] = { state: mainState, reducer: module.main_reducer };
                }
            }

            if (menuTemplate.length > 0) {
                const menu = Electron.Menu.buildFromTemplate(menuTemplate);
                Electron.Menu.setApplicationMenu(menu);
            }

            let windows = reducedState.windows;
            while (windows.items.length < numberOfWindows) {
                windows = createWindow(windows);
            }

            Guifast.sendToSharedRenderer(action);

            return {
                ...reducedState,
                actionMapper: actionMapper,
                config: config,
                moduleMapper: moduleMapper,
                moduleNames: moduleNames,
                statesAndReducers: statesAndReducers,
                windows: windows
            };
        }

        case Guifast.Command.id: {
            Guifast.sendToLibflo(action);
            Guifast.sendToSharedRenderer(action);
            return reducedState;
        }

        case GuifastShared.ForwardAction.id: {
            const forwardAction = action as GuifastShared.ForwardAction.Action;
            const forwardedAction = forwardAction.action;
            const forwardedStrIdAction = GuifastMain.tryCreateStrIdAction(
                forwardedAction,
                reducedState.actionMapper,
                reducedState.moduleMapper
            );

            switch (forwardAction.destination) {
                case "Libflo": {
                    if (reducedState.libfloClient === undefined) {
                        Guifast.error("Error: Trying to send to libflo cilent but it is not initialized.");
                    } else {
                        reducedState.libfloClient.dispatch(forwardedStrIdAction);
                    }
                    return reducedState;
                }

                case "SharedRenderer": {
                    reducedState.rendererStore.dispatch(forwardedStrIdAction);

                    let reconcileAction: Guifast.Action | undefined = undefined;
                    if (reducedState.config === undefined || reducedState.config.should_always_reconcile_stores) {
                        reconcileAction = GuifastShared.ReconcileState.make(reducedState.rendererStore.getState());
                    } else {
                        reconcileAction = forwardedStrIdAction;
                    }

                    for (const windowEntry of reducedState.windows.items) {
                        trySendActionToWindow(forwardedStrIdAction, windowEntry);
                    }
                    return reducedState;
                }

                default: {
                    const destination = forwardAction.destination as { Renderer: number };
                    const windowEntry = reducedState.windows.items[destination.Renderer];
                    if (!trySendActionToWindow(forwardedStrIdAction, windowEntry)) {
                        Guifast.error("Cannot send action to window with id, '" + destination.Renderer + "', it is uninitialized or undefined.");
                    }
                    return reducedState;
                }
            }
        }

        case GuifastShared.Ready.id: {
            if (reducedState.libfloClient === undefined) {
                const libfloClient = new GuifastMain.LibfloClient(GuifastShared.String.libfloPath);

                libfloClient.onStdout.add(
                    e => {
                        try {
                            const rootMainState = GuifastMain.getRootMainState();
                            const action = JSON.parse(e) as Guifast.Action;
                            const strIdAction = GuifastMain.tryCreateStrIdAction(action, rootMainState.actionMapper, rootMainState.moduleMapper);
                            Guifast.sendToMain(strIdAction);
                        } catch (e) {
                            Guifast.error(e);
                        }
                    }
                )

                libfloClient.onStderr.add(e => Guifast.error(e));

                return { ...reducedState, libfloClient: libfloClient };
            } else {
                Guifast.error("Error, Libflo is already set!");
                return reducedState;
            }
        }

        case GuifastShared.WindowAllClosed.id: {
            // On OS X it is common for applications and their menu bar
            // to stay active until the user quits explicitly with Cmd + Q
            if (process.platform !== 'darwin') {
                Electron.app.quit();
            }
            return reducedState;
        }

        case GuifastShared.WindowInitialized.id: {
            const windowInitialized = action as GuifastShared.WindowInitialized.Action;

            const windowEntry = {
                ...state.windows.items[windowInitialized.windowId],
                isInitialized: true
            }

            if (windowEntry.window === undefined) {
                Guifast.error("Error initializing window with id '" + windowInitialized.windowId + "' it does not exist.");
                return reducedState;
            }
            else {
                const windows = Guifast.compactedArrayUpdate(reducedState.windows, windowInitialized.windowId, windowEntry);

                Guifast.sendToRenderer(GuifastShared.ReconcileState.make(reducedState.rendererStore.getState()), windowInitialized.windowId);

                return { ...reducedState, windows: windows };
            }
        }

        case Guifast.WindowRequested.id: {
            const windows = createWindow(reducedState.windows);

            Guifast.sendToSharedRenderer(action);

            return { ...reducedState, windows: windows };
        }

        case GuifastShared.WindowUninitialized.id: {
            const windowUninitialized = action as GuifastShared.WindowUninitialized.Action;

            const windows = Guifast.compactedArrayRemove(reducedState.windows, windowUninitialized.windowId);

            Guifast.sendToSharedRenderer(action);

            return { ...reducedState, windows: windows };
        }

        default: {
            return reducedState;
        }
    }
};