import { CompactedArray, GuifastConfigSerde, ModuleState, RequireInfo, StringMap, UberPanelState, UberWindowState } from "guifast_shared";

export interface State {
    readonly config: GuifastConfigSerde | undefined;
    readonly components: StringMap<RequireInfo>;
    readonly isInitialized: boolean;
    readonly modulesState: StringMap<ModuleState>;
    readonly uberPanelsState: CompactedArray<UberPanelState>;
    readonly uberWindowsState: CompactedArray<UberWindowState>;
}
