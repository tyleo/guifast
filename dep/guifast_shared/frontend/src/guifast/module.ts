import { ComponentInfo, RequireInfo } from "guifast_shared";

export interface Module {
    components: Array<ComponentInfo>;
    name: string;
    mainReducer: RequireInfo | undefined;
    rendererReducer: RequireInfo | undefined;
    startupWindows: Array<string> | null;
}
