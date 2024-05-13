import * as fs from 'fs';
import * as path from 'path';
import { app, BrowserWindow, ipcMain, dialog } from 'electron';

// TODO: Move file management code to file_management_backend.ts

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
    window.maximize();
    window.show();
    //add_listeners();
    return window;
}

// ----------- Create the first renderer process -----------

app.whenReady().then(() => {
    createWindow();
})

// ------------------- File Management ---------------------

// Check if file with a given file path is open
function fileIsOpen(filePath: string) {
    const allWindows = BrowserWindow.getAllWindows();
    for (const window of allWindows) {
        const title = window.getTitle();
        if (title === filePath) {
            return window;
        }
    }
    return null;
}

// Set the title of a Mathitor window
ipcMain.handle('set-title', async (event, title) => {
    const webContents = event.sender;
    const win = BrowserWindow.fromWebContents(webContents);
    win?.setTitle(title);
})

// Backend of the saveFileAs() function. Writes 'data' to a path chosen by the user
ipcMain.handle('save-file-as', async (event, { data }) => {

    // Let the user select name and path for the file
    dialog.showSaveDialog({ defaultPath: 'file.txt' }).then((result) => {
        
        if (!result.canceled && result.filePath) {
            const path: string = result.filePath;
            fs.writeFile(path, data, async (err) => {
                
                if (err) {
                    console.error('Error saving file:\n', err);
                    event.sender.send('save-file-as-response', { success: false, error: err });
                } else {
                    console.log('File saved successfully:\n', path);
                    event.sender.send('save-file-as-response', { success: true, filePath: path });
                }
            });

        } else {
            console.log('\'Save as\'-operation canceled by user.');
            event.sender.send('save-file-as-response', { success: false, error: '\'Save as\'-operation canceled by user.' });
        }
        
    }).catch((err) => {
        console.error('Error showing \'Save as\'-dialog:', err);
        event.sender.send('save-file-as-response', { success: false, error: err });
    });
});

// Backend of the saveFile() function
ipcMain.handle('save-file', async (event, { data }) => {
    const toSave: string = data[0]; // File contents to save
    const path: string = data[1]; // Path of the file to save
    fs.writeFile(path, toSave, (err) => {
        if (err) {
            console.error('Error saving file:\n', err);
            event.sender.send('save-file-response', { success: false, error: err });
        } else {
            console.log('File saved successfully:\n', path);
            event.sender.send('save-file-response', { success: true });
        }
    });
});

// Backend of the openFile() function
ipcMain.handle('open-file', async (event) => {

    // Let the user select a file from the local file manager
    dialog.showOpenDialog({ properties: ['openFile'] }).then((result) => {
        
        if (!result.canceled && result.filePaths) {
            const filePath = result.filePaths[0];
            const existingWindow = fileIsOpen(filePath);
            
            // If the selected file is already open in a window, toggle
            // focus on that window instead of opening another identical window
            if (existingWindow) {
                existingWindow.focus();
                console.log('The selected file is already open:\n', filePath);
            
            // If the selected file is not already open, open it in a new window
            } else {
                fs.readFile(filePath, 'utf8', async (err, data) => {
                    if (err) {
                        console.error('Error opening file:\n', err);
                        event.sender.send('open-file-response', { success: false, error: err });
                    } else {
                        console.log('File opened successfully:\n', filePath);
                        event.sender.send('open-file-response', { success: true });

                        // Create a new window (i.e. a new renderer process)
                        const newRendererProcess = createWindow();
                        newRendererProcess.once('ready-to-show', () => {
                            const newRendererPID = newRendererProcess.webContents.getOSProcessId();
                            console.log('New renderer process PID:\n', newRendererPID);
                            // Send file content to the new renderer process
                            newRendererProcess.webContents.send('file-content', {rendererPID: newRendererPID, data, filePath});
                        });
                    }
                });
            }
        
        } else {
            console.log('\'Open file\'-operation canceled by user.');
            event.sender.send('open-file-response', { success: false, error: '\'Open file\'-operation canceled by user.' });
        }

    }).catch((err) => {
        console.error('Error showing open dialog:\n', err);
        event.sender.send('open-file-response', { success: false, error: err });
    });
});

// Backend of the createFile() function
ipcMain.handle('create-file', async (event) => {
    try {
        createWindow();
        console.log('File created successfully');
        event.sender.send('create-file-response', { success: true });

    } catch {(err: NodeJS.ErrnoException) => {
        console.error('Error creating new file:\n', err);
        event.sender.send('create-file-response', { success: false, error: err });
        }
    }
});
