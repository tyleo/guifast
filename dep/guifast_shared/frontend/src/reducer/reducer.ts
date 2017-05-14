import { Action, BackendInitialized, compactedArray, compactedArrayAdd, fromRequireInfo, InitializeModule, ModuleReducer, Modules, ModuleState, ReconcileState, RequireInfo, State, StringMap, uberPanelsReducer, UberPanelState, uberWindowsReducer, UberWindowState, UndefinedAction } from "guifast_shared";
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

    const uberWindowsResult = compactedArrayAdd(
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

export const reducer = (
    state: State = {
        config: undefined,
        components: { },
        isInitialized: false,
        modulesState: { },
        uberPanelsState: uberPanelsReducer(undefined, undefined),
        uberWindowsState: uberWindowsReducer(undefined, undefined),
    },
    action: Action = UndefinedAction.make(),
): State => {
    switch (action.type) {
        case BackendInitialized.id: {
            const backendInitialized = action as BackendInitialized.Action;
            const modules = new Modules(backendInitialized.modules);

            let modulesState: StringMap<ModuleState> = { };
            let uberPanelsState = compactedArray<UberPanelState>();
            let uberWindowsState = compactedArray<UberWindowState>();

            const components: StringMap<RequireInfo> = { };
            const startupWindowNames = new Array<string>();
            for (const module of modules.modules) {
                if (module.rendererReducer !== undefined) {
                    const reducer = fromRequireInfo<ModuleReducer>(module.rendererReducer);
                    const moduleState = { reducer: module.rendererReducer };
                    const initializeModuleAction = InitializeModule.make(module.rendererReducer);
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
                modulesState: modulesState,
                uberPanelsState: uberPanelsState,
                uberWindowsState: uberWindowsState
            };
        }

        case ReconcileState.id: {
            const reconcileState = action as ReconcileState.Action;
            return reconcileState.state;
        }

        case Guifast.WindowRequested.id: {
            const windowRequested = action as Guifast.WindowRequested.Action;
            const rootComponent = state.components[windowRequested.rootComponent];
            const addWindowResult = addWindow(rootComponent, state.uberPanelsState, state.uberWindowsState);

            return {
                ...state,
                uberPanelsState: addWindowResult[0],
                uberWindowsState: addWindowResult[1]
            };
        }

        case Guifast.WindowUninitialized.id: {
            const windowUninitialized = action as Guifast.WindowUninitialized.Action;
            const [uberPanelsState, uberWindowsState] = removeWindow(windowUninitialized.windowId, state.uberPanelsState, state.uberWindowsState);

            return {
                ...state,
                uberPanelsState: uberPanelsState,
                uberWindowsState: uberWindowsState
            };
        }

        default: {
            let modulesState: StringMap<ModuleState> = { };
            for (const key in state.modulesState) {
                const moduleState = state.modulesState[key];
                const reducer = fromRequireInfo<ModuleReducer>(moduleState.reducer);
                modulesState[key] = reducer(moduleState, action, state);
            }

            const uberPanelsState = uberPanelsReducer(state.uberPanelsState, action);
            const uberWindowsState = uberWindowsReducer(state.uberWindowsState, action);

            return {
                config: state.config,
                components: state.components,
                isInitialized: state.isInitialized,
                modulesState: modulesState,
                uberPanelsState: uberPanelsState,
                uberWindowsState: uberWindowsState
            };
        }
    }
};
