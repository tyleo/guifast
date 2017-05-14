import * as electron from 'electron';
import installExtension, { REACT_DEVELOPER_TOOLS, REDUX_DEVTOOLS } from 'electron-devtools-installer'
import { getEnvironment } from "guifast/server";

try {
    require("devtron").install();
    console.log('Added devtron extension.')
} catch (err) {
    console.log('Error installing devtron extension: ', err);
}

installExtension(REACT_DEVELOPER_TOOLS)
    .then(name => console.log('Added react extension.'))
    .catch(err => console.log('Error installing react extension: ', err));

installExtension(REDUX_DEVTOOLS)
    .then(name => console.log('Added redux extension.'))
    .catch(err => console.log('Error installing redux extension: ', err));

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
