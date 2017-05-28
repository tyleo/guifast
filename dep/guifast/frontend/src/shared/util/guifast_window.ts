import * as Electron from "electron";

export interface GuifastWindow extends Electron.BrowserWindow {
    windowId: number | undefined,
};
