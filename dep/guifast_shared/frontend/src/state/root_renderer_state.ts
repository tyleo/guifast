import * as Guifast from "guifast_shared";

export interface RootRendererState {
    readonly config: Guifast.GuifastConfigSerde | undefined;
    readonly components: Guifast.StringMap<Guifast.RequireInfo>;
    readonly isInitialized: boolean;
    readonly rendererStates: Guifast.StringMap<Guifast.RendererState>;
    readonly uberPanelStates: Guifast.CompactedArray<Guifast.UberPanelState>;
    readonly uberWindowStates: Guifast.CompactedArray<Guifast.UberWindowState>;
}
