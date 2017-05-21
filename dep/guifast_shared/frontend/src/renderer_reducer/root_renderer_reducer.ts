import * as Guifast from "guifast_shared";

type UberPanelsState = Guifast.CompactedArray<Guifast.UberPanelState>;
type UberWindowsState = Guifast.CompactedArray<Guifast.UberWindowState>;

const addWindow = (
    rootComponent: Guifast.RequireInfo,
    uberPanels: UberPanelsState,
    uberWindows: UberWindowsState
): [UberPanelsState, UberWindowsState] => {
    let panelId = 0;
    const uberPanelsResult = Guifast.compactedArrayAdd(
        uberPanels,
        (id: number) => {
            panelId = id;
            return {
                component: rootComponent,
                children: [],
                id: id
            };
        }
    );

    const uberWindowsResult = Guifast.compactedArrayAdd(
        uberWindows,
        (id: number) => {
            return {
                id: id,
                uberPanelId: panelId
            };
        }
    );

    return [uberPanelsResult, uberWindowsResult];
};

function removePanel(
    panelId: number,
    uberPanels: UberPanelsState
): UberPanelsState {
    const panel = uberPanels.items[panelId];
    if (panel === undefined) {
        Guifast.error("Panel with id '" + panelId + "' cannot be removed. It does not exist.");
        return uberPanels;
    } else {
        let currentPanels = Guifast.compactedArrayRemove(uberPanels, panelId);
        for (const currentPanelId of panel.children) {
            currentPanels = removePanel(currentPanelId, uberPanels);
        }
        return currentPanels;
    }
};

const removeWindow = (
    windowId: number,
    uberPanels: UberPanelsState,
    uberWindows: UberWindowsState
): [UberPanelsState, UberWindowsState] => {
    const window = uberWindows.items[windowId];
    if (window === undefined) {
        Guifast.error("Window with id '" + windowId + "' cannot be removed. It does not exist.");
        return [uberPanels, uberWindows];
    } else {
        const resultWindows = Guifast.compactedArrayRemove(uberWindows, windowId);
        const resultPanels = removePanel(window.uberPanelId, uberPanels);
        return [resultPanels, resultWindows];
    }
};

export const rootRendererReducer = (
    state: Guifast.RootRendererState = {
        config: undefined,
        components: { },
        isInitialized: false,
        rendererStates: { },
        uberPanelStates: Guifast.uberPanelsReducer(undefined, undefined),
        uberWindowStates: Guifast.uberWindowsReducer(undefined, undefined),
    },
    action: Guifast.Action = Guifast.UndefinedAction.make(),
): Guifast.RootRendererState => {
    switch (action.type) {
        case Guifast.BackendInitialized.id: {
            const backendInitialized = action as Guifast.BackendInitialized.Action;
            const modules = new Guifast.Modules(backendInitialized.modules);

            let modulesState: Guifast.StringMap<Guifast.RendererState> = { };
            let uberPanelsState = Guifast.compactedArray<Guifast.UberPanelState>();
            let uberWindowsState = Guifast.compactedArray<Guifast.UberWindowState>();

            const components: Guifast.StringMap<Guifast.RequireInfo> = { };
            const startupWindowNames = new Array<string>();
            for (const module of modules.modules) {
                if (module.rendererReducer !== undefined) {
                    const reducer = Guifast.fromRequireInfo<Guifast.RendererReducer>(module.rendererReducer);
                    const moduleState = { reducer: module.rendererReducer };
                    const initializeModuleAction = Guifast.InitializeModule.make(module.rendererReducer);
                    modulesState[module.name] = reducer(moduleState, initializeModuleAction, state);
                }

                if (module.startupWindows !== null) {
                    for (const startupWindowName of module.startupWindows) {
                        startupWindowNames.push(startupWindowName);
                    }
                }

                for (const component of module.components) {
                    components[component.name] = component.requireInfo;
                }
            }

            for (const startupWindowName of startupWindowNames) {
                const rootComponent = components[startupWindowName];
                [uberPanelsState, uberWindowsState] = addWindow(rootComponent, uberPanelsState, uberWindowsState);
            }

            return {
                config: backendInitialized.config,
                components: components,
                isInitialized: true,
                rendererStates: modulesState,
                uberPanelStates: uberPanelsState,
                uberWindowStates: uberWindowsState
            };
        }

        case Guifast.ReconcileState.id: {
            const reconcileState = action as Guifast.ReconcileState.Action;
            return reconcileState.state;
        }

        case Guifast.WindowRequested.id: {
            const windowRequested = action as Guifast.WindowRequested.Action;
            const rootComponent = state.components[windowRequested.rootComponent];
            const addWindowResult = addWindow(rootComponent, state.uberPanelStates, state.uberWindowStates);

            return {
                ...state,
                uberPanelStates: addWindowResult[0],
                uberWindowStates: addWindowResult[1]
            };
        }

        case Guifast.WindowUninitialized.id: {
            const windowUninitialized = action as Guifast.WindowUninitialized.Action;
            const [uberPanelStates, uberWindowStates] = removeWindow(windowUninitialized.windowId, state.uberPanelStates, state.uberWindowStates);

            return {
                ...state,
                uberPanelStates: uberPanelStates,
                uberWindowStates: uberWindowStates
            };
        }

        default: {
            let rendererStates: Guifast.StringMap<Guifast.RendererState> = { };
            for (const key in state.rendererStates) {
                const moduleState = state.rendererStates[key];
                const reducer = Guifast.fromRequireInfo<Guifast.RendererReducer>(moduleState.reducer);
                rendererStates[key] = reducer(moduleState, action, state);
            }

            const uberPanelStates = Guifast.uberPanelsReducer(state.uberPanelStates, action);
            const uberWindowStates = Guifast.uberWindowsReducer(state.uberWindowStates, action);

            return {
                config: state.config,
                components: state.components,
                isInitialized: state.isInitialized,
                rendererStates: rendererStates,
                uberPanelStates: uberPanelStates,
                uberWindowStates: uberWindowStates
            };
        }
    }
};
