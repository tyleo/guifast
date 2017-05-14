import * as electron from "electron";

export const getWindowId = (): number => {
    return (electron.remote.getCurrentWindow() as any).windowId
};
