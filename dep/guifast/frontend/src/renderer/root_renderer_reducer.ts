import * as Guifast from "guifast_shared";
import * as GuifastRenderer from "guifast/renderer";
import * as GuifastShared from "guifast/shared";

const addWindow = (
    rootComponent: Guifast.RequireInfo,
    uberPanels: Guifast.CompactedArray<GuifastRenderer.UberPanelState>,
    uberWindows: Guifast.CompactedArray<GuifastRenderer.UberWindowState>
): [Guifast.CompactedArray<GuifastRenderer.UberPanelState>, Guifast.CompactedArray<GuifastRenderer.UberWindowState>] => {
    let panelId = 0;
    const uberPanelsResult = Guifast.compactedArrayAdd<GuifastRenderer.UberPanelState>(
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

const reduceRendererReducers = (
    action: Guifast.Action,
    state: GuifastRenderer.GuifastRendererState
): GuifastRenderer.GuifastRendererState => {
    const statesAndReducers: Guifast.StringMap<Guifast.StateAndReducer> = {};

    for (const moduleName of state.moduleNames) {
        const rendererStateAndReducer = state.statesAndReducers[moduleName];
        if (rendererStateAndReducer === undefined) {
            Guifast.error("Error reducing renderer module. The module, '" + moduleName + " could not be found.");
        } else {
            const reducer = GuifastShared.fromRequireInfo<Guifast.RendererReducer>(rendererStateAndReducer.reducer);
            statesAndReducers[moduleName] = {
                reducer: rendererStateAndReducer.reducer,
                state: reducer(rendererStateAndReducer.state, action, state)
            };
        }
    }

    return {
        ...state,
        statesAndReducers: statesAndReducers,
    };
}

function removePanel(
    panelId: number,
    uberPanels: Guifast.CompactedArray<GuifastRenderer.UberPanelState>
): Guifast.CompactedArray<GuifastRenderer.UberPanelState> {
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
    uberPanels: Guifast.CompactedArray<GuifastRenderer.UberPanelState>,
    uberWindows: Guifast.CompactedArray<GuifastRenderer.UberWindowState>
): [Guifast.CompactedArray<GuifastRenderer.UberPanelState>, Guifast.CompactedArray<GuifastRenderer.UberWindowState>] => {
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
    state: GuifastRenderer.GuifastRendererState = {
        config: undefined,
        components: {},
        isInitialized: false,
        moduleNames: [],
        statesAndReducers: {},
        uberPanelStates: Guifast.compactedArray<GuifastRenderer.UberPanelState>(),
        uberWindowStates: Guifast.compactedArray<GuifastRenderer.UberWindowState>()
    },
    action: Guifast.Action = Guifast.UndefinedAction.make()
): GuifastRenderer.GuifastRendererState => {
    const reducedState = reduceRendererReducers(action, state);

    switch (action.type) {
        case GuifastShared.LibfloInitialized.id: {
            const libfloInitialized = action as GuifastShared.LibfloInitialized.Action;
            const modules = new GuifastRenderer.Modules(libfloInitialized.modules);

            const moduleNames: Array<string> = [];
            const statesAndReducers: Guifast.StringMap<Guifast.StateAndReducer> = {};
            let uberPanelStates = Guifast.compactedArray<GuifastRenderer.UberPanelState>();
            let uberWindowStates = Guifast.compactedArray<GuifastRenderer.UberWindowState>();
            const components: Guifast.StringMap<Guifast.RequireInfo> = {};
            const startupWindowNames: Array<string> = [];

            for (const module of modules.modules) {
                if (module.rendererReducer !== undefined) {
                    const rendererReducer = GuifastShared.fromRequireInfo<Guifast.RendererReducer>(module.rendererReducer);
                    const rendererState = rendererReducer(undefined, undefined, reducedState);

                    moduleNames.push(module.name);
                    statesAndReducers[module.name] = { state: rendererState, reducer: module.rendererReducer };
                }

                if (module.startupWindows !== undefined) {
                    for (const startupWindowName of module.startupWindows) {
                        startupWindowNames.push(startupWindowName);
                    }
                }

                for (const component of module.components) {
                    components[component.name] = component.requireInfo;
                }
            }

            for (const startupWindowName of startupWindowNames) {
                const component = components[startupWindowName];
                [uberPanelStates, uberWindowStates] = addWindow(component, uberPanelStates, uberWindowStates);
            }

            return {
                config: libfloInitialized.config,
                components: components,
                isInitialized: true,
                moduleNames: moduleNames,
                statesAndReducers: statesAndReducers,
                uberPanelStates: uberPanelStates,
                uberWindowStates: uberWindowStates
            };
        }

        case GuifastShared.ReconcileState.id: {
            const reconcileState = action as GuifastShared.ReconcileState.Action;
            return reconcileState.state;
        }

        case Guifast.WindowRequested.id: {
            const windowRequested = action as Guifast.WindowRequested.Action;
            const rootComponent = reducedState.components[windowRequested.rootComponent];
            const addWindowResult = addWindow(rootComponent, reducedState.uberPanelStates, reducedState.uberWindowStates);

            return {
                ...reducedState,
                uberPanelStates: addWindowResult[0],
                uberWindowStates: addWindowResult[1]
            };
        }

        case GuifastShared.WindowUninitialized.id: {
            const windowUninitialized = action as GuifastShared.WindowUninitialized.Action;
            const [uberPanelStates, uberWindowStates] = removeWindow(windowUninitialized.windowId, reducedState.uberPanelStates, reducedState.uberWindowStates);

            return {
                ...reducedState,
                uberPanelStates: uberPanelStates,
                uberWindowStates: uberWindowStates
            };
        }

        default: {
            return reducedState;
        }
    }
};