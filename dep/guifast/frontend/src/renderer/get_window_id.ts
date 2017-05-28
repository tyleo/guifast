import * as Electron from "electron";
import * as Guifast from "guifast_shared";
import * as GuifastShared from "guifast/shared";

export const getWindowId = (): number => {
    const windowId = (Electron.remote.getCurrentWindow() as GuifastShared.GuifastWindow).windowId;
    if (windowId === undefined) {
        Guifast.error("Error window has no windowId.");
        return -1;
    } else {
        return windowId;
    }
};
