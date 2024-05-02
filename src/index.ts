/* import { ipcMain } from 'electron';

const electron = require("electron");
const { app, BrowserWindow } = electron; */

// -------------------------------------------------

//const electron = require("electron");
import * as fs from 'fs';
import * as path from 'path';
import { app, BrowserWindow, ipcMain, dialog } from 'electron';


// ------------------------- Create renderer process -------------------------

const createWindow = () => {
    const window = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'file_management_preload.js') // Path to preload script
        }
    })
    window.loadFile('dist/index.html');
}

app.whenReady().then(() => {
    createWindow();
})

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

ipcMain.on('save-file-as', (event, { data }) => {
    // Get file path from user
    dialog.showSaveDialog({ defaultPath: 'file.txt' }).then((result) => {
        if (!result.canceled && result.filePath) {
            // Write data to file asynchronously
            fs.writeFile(result.filePath, data, (err) => {
                if (err) {
                    console.error('Error saving file:', err);
                    event.sender.send('save-file-response', { success: false, error: err });
                } else {
                    console.log('File saved successfully:', result.filePath);
                    event.sender.send('save-file-response', { success: true });
                }
            });
        } else {
            console.log('File save operation canceled by user.');
            event.sender.send('save-file-response', { success: false, error: 'File save operation canceled by user.' });
        }
    }).catch((err) => {
        console.error('Error showing save dialog:', err);
        event.sender.send('save-file-response', { success: false, error: err });
    });
});

ipcMain.on('open-file', async (event) => {
    // Let the user select a file from the local file manager
    dialog.showOpenDialog({ properties: ['openFile'] }).then((result) => {
        if (!result.canceled && result.filePaths) {
            const filePath = result.filePaths[0];
            // Read the content of the selected file
            fs.readFile(filePath, 'utf8', (err, data) => {
                if (err) {
                    console.error('Error opening file:', err);
                    event.sender.send('open-file-response', { success: false, error: err });
                } else {
                    console.log('File opened successfully:', filePath);
                    event.sender.send('open-file-response', { success: true });

                    // Create a new window/tab (i.e. a new renderer process)
                    createWindow();
                    // TODO: Send the file's content to the >new< renderer process
                    // event.sender.send('file-content', data, filePath);
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
