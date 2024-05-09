/* import { ipcMain } from 'electron';

const electron = require("electron");
const { app, BrowserWindow } = electron; */

// -------------------------------------------------

//const electron = require("electron");
import * as fs from 'fs';
import * as path from 'path';
import { app, BrowserWindow, ipcMain, dialog } from 'electron';


// ------------ Create new renderer process ------------

const createWindow = () => {
    const window = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'file_management_preload.js') // Path to preload script
        }
    })
    window.loadFile('dist/index.html');
    return window;
}

// ----------- Create the first renderer process -----------

app.whenReady().then(() => {
    createWindow();
})

// -------------- Send file content to all renderer processes ----------------

function sendToAllRendererProcesses(rendererPID: number, data: string, filePath: string) {
    const allWindows = BrowserWindow.getAllWindows();
    allWindows.forEach(window => {
        // Send the file content along with the newly created renderer's PID
        window.webContents.send('file-content', {rendererPID, data, filePath});
    });
}

// -------------- Listen for messages from the renderer process ---------------

/* ipcMain.on('saveAs', (event, toSave) => {
    console.log('File contents to save: ', toSave);

    // TODO: Decomment below*/
    
    /* try {
        // Save the file
        file_management_backend.saveFileAs(toSave);
    } catch {
        // Catch and log errors when saving
        // TODO: Maybe implement other error handling?
        event.sender.send('saveAs: Result', 'Error: File could not be saved');
    }
 */
    // Confirm that the file was saved.
  /*  event.sender.send('saveAs: Result', 'File saved (NOT IMPLEMENTED YET)');
}); */

ipcMain.on('set-title', (event, title) => {
    const webContents = event.sender;
    const win = BrowserWindow.fromWebContents(webContents);
    win?.setTitle(title);
})

ipcMain.handle('save-file-as', async (event, { data }) => {
    // Get file path from user
    dialog.showSaveDialog({ defaultPath: 'file.txt' }).then((result) => {
        if (!result.canceled && result.filePath) {
            const path: string = result.filePath;
            // Write data to file asynchronously
            fs.writeFile(path, data, async (err) => {
                if (err) {
                    console.error('Error saving file (as):', err);
                    event.sender.send('save-file-as-response', { success: false, error: err });
                } else {
                    console.log('File saved (as) successfully:', path);
                    event.sender.send('save-file-as-response', { success: true, filePath: path });
                    //event.sender.send('save-file-as-response', { path });
                }
            });
        } else {
            console.log('File save (as) operation canceled by user.');
            event.sender.send('save-file-as-response', { success: false, error: 'File save (as) operation canceled by user.' });
        }
    }).catch((err) => {
        console.error('Error showing save (as) dialog:', err);
        event.sender.send('save-file-as-response', { success: false, error: err });
    });
});

ipcMain.on('save-file', (event, { data }) => {
    const toSave: string = data[0];
    const path: string = data[1];

    // Write data to file asynchronously
    fs.writeFile(path, toSave, (err) => {
        if (err) {
            console.error('Error saving file:', err);
            event.sender.send('save-file-response', { success: false, error: err });
        } else {
            console.log('File saved successfully:', path);
            event.sender.send('save-file-response', { success: true });
        }
    });
});

ipcMain.handle('dialog:openFile', async (event) => {
    // Let the user select a file from the local file manager
    dialog.showOpenDialog({ properties: ['openFile'] }).then((result) => {
        if (!result.canceled && result.filePaths) {
            const filePath = result.filePaths[0];
            // Read the content of the selected file
            fs.readFile(filePath, 'utf8', async (err, data) => {
                if (err) {
                    console.error('Error opening file:', err);
                    event.sender.send('open-file-response', { success: false, error: err });
                } else {
                    console.log('File opened successfully:', filePath);
                    event.sender.send('open-file-response', { success: true });

                    // Create a new window (i.e. a new renderer process)
                    const newRendererProcess = createWindow();
                    // Wait for the 'ready-to-show' event before retrieving the process ID
                    newRendererProcess.once('ready-to-show', () => {
                        const newRendererPID = newRendererProcess.webContents.getOSProcessId();
                        console.log('New renderer process PID:', newRendererPID);
                        sendToAllRendererProcesses(newRendererPID, data, filePath);
                    });
                }
            });
        } else {
            console.log('Open file operation canceled by user.');
            event.sender.send('open-file-response', { success: false, error: 'Open file operation canceled by user.' });
        }

    }).catch((err) => {
        console.error('Error showing open dialog:', err);
        event.sender.send('open-file-response', { success: false, error: err });
    });
});
