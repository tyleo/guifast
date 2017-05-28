import * as Guifast from "guifast_shared";
import * as GuifastRenderer from "guifast/renderer";

export interface Module {
    components: Array<GuifastRenderer.ComponentInfo>;
    name: string;
    mainReducer: Guifast.RequireInfo | undefined;
    rendererReducer: Guifast.RequireInfo | undefined;
    startupWindows: Array<string> | undefined;
}
