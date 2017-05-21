import * as Guifast from "guifast_shared";

export interface Module {
    components: Array<Guifast.ComponentInfo>;
    name: string;
    mainReducer: Guifast.RequireInfo | undefined;
    rendererReducer: Guifast.RequireInfo | undefined;
    startupWindows: Array<string> | null;
}
