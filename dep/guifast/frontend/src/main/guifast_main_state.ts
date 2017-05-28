import Redux from "guifast_shared/node_module/redux";
import * as Guifast from "guifast_shared";
import * as GuifastMain from "guifast/main";
import * as GuifastRenderer from "guifast/renderer";
import * as GuifastShared from "guifast/shared";

export interface GuifastMainState extends Guifast.RootMainState {
    readonly actionMapper: GuifastMain.ActionMapper | undefined;
    readonly config: GuifastShared.GuifastConfigSerde | undefined;
    readonly libfloClient: GuifastMain.LibfloClient | undefined;
    readonly moduleMapper: GuifastMain.ModuleMapper | undefined;
    readonly rendererStore: Redux.Store<GuifastRenderer.GuifastRendererState | undefined>;
    readonly windows: Guifast.CompactedArray<GuifastMain.WindowEntry>;
}
