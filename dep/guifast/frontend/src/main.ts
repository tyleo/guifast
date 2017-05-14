import * as electron from 'electron';
import { getEnvironment } from "guifast/server";

// Module to control application life.
const app = electron.app;

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
app.on('ready', () => getEnvironment().start());

// Quit when all windows are closed.
app.on(
    'window-all-closed',
    () => {
        // On OS X it is common for applications and their menu bar
        // to stay active until the user quits explicitly with Cmd + Q
        if (process.platform !== 'darwin') {
            app.quit();
        }
    }
);

app.on(
    'activate',
    () => {
        // On OS X it's common to re-create a window in the app when the
        // dock icon is clicked and there are no other windows open.
        // TODO: This is suspect
        if (getEnvironment().windows.items.length <= 0) {
            getEnvironment().createWindow();
        }
    }
);
