import * as Guifast from "guifast_shared";
import * as GuifastRenderer from "guifast/renderer";
import * as GuifastShared from "guifast/shared";

export interface GuifastRendererState extends Guifast.RootRendererState {
    readonly config: GuifastShared.GuifastConfigSerde | undefined;
    readonly components: Guifast.StringMap<Guifast.RequireInfo>;
    readonly isInitialized: boolean;
    readonly uberPanelStates: Guifast.CompactedArray<GuifastRenderer.UberPanelState>;
    readonly uberWindowStates: Guifast.CompactedArray<GuifastRenderer.UberWindowState>;
}
