import * as fs from 'fs';
import * as path from 'path';
import { app, BrowserWindow, ipcMain, dialog, globalShortcut } from 'electron';
import * as Config from "./fileManagementBackend/configLoader";
import { createMathField } from './renderer/mathMode/mathMode';

// TODO: Move file management code to file_management_backend.ts

// ------------ Create new renderer process ------------

/**
 * Creates a new renderer process by creating a new Mathitor window.
 * Specifies the dimensions of the windows and loads the index.html file.
 * @returns {BrowserWindow} The newly created Mathitor window.
 */
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

    return window;
}


// ----------- Create the first renderer process -----------

// Creates the first renderer process by creating a new Mathitor
// window when the app is ready.
app.whenReady().then(() => {
    const window = createWindow();
    const insertMathField = () => {window.webContents.send("Shortcut: insert math field")};

    ipcMain.handle("load: user defined suggestions", Config.loadUserDefinedSuggestions);
    ipcMain.handle("load: built-in suggestions", Config.loadBuiltInSuggestions);
    ipcMain.on("save: user defined suggestions", Config.saveUserDefinedSuggestion);

    globalShortcut.register("CommandOrControl+M", insertMathField);
});


// ------------------- File Management ---------------------

/**
 * Checks if a file with a given file path is open in any Mathitor window.
 * @param {string} filePath - The file path to check.
 * @returns {BrowserWindow | null} The window containing the file, if it
 * is open. Otherwise, null is returned.
 */
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

/**
 * Sets the title of a Mathitor window.
 * @param {Electron.IpcMainInvokeEvent} event - The IPC event object
 * @param {string} title - The title to set for the window
 */
ipcMain.handle('set-title', async (event, title) => {
    const webContents = event.sender;
    const win = BrowserWindow.fromWebContents(webContents);
    win?.setTitle(title);
})

/**
 * Backend of the saveFileAs() function.
 * 
 * Writes the file content to a path chosen by the user.
 * 
 * Responds to the renderer process with a boolean indicating whether
 * the file was successfully saved, as well as the file's path on
 * success or an error message on failure.
 * 
 * @param {Electron.IpcMainInvokeEvent} event - The IPC event object
 * @param {string} content - The file content to be written to the file
 * @throws {Error} If the operation failed or was canceled by the user.
 */
ipcMain.handle('save-file-as', async (event, { content }) => {

    // Let the user select name and path for the file
    dialog.showSaveDialog({ defaultPath: 'file.txt' }).then((result) => {
        
        if (!result.canceled && result.filePath) {
            const path: string = result.filePath;
            fs.writeFile(path, content, async (err) => {
                
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

/**
 * Backend of the saveFile() function.
 * 
 * Writes the file content to the specified path.
 * 
 * Responds to the renderer process with a boolean indicating whether
 * the operation was successful, as well as any error message (handling
 * this response is not yet implemented in the renderer process)
 * 
 * @param {Electron.IpcMainInvokeEvent} event - The IPC event object.
 * @param {Array<string>} data - An array containing the content and
 * path of the file to be saved.
 * @throws {Error} If there is an error while saving the file.
 */
ipcMain.handle('save-file', async (event, { data }) => {
    const content: string = data[0];    // File contents to save
    const path: string = data[1];       // Path of the file to save
    fs.writeFile(path, content, (err) => {
        if (err) {
            console.error('Error saving file:\n', err);
            event.sender.send('save-file-response', { success: false, error: err });
        } else {
            console.log('File saved successfully:\n', path);
            event.sender.send('save-file-response', { success: true });
        }
    });
});

/**
 * Backend of the openFile() function.
 * 
 * Opens a file selected by the user in a new window. A file can only
 * be open in one window at a time, so if the chosen file is already open,
 * focus is shifted to the window where the file is open.
 * 
 * Once the new window (renderer process) is opened, a message containing
 * the PID of that process, as well as the content and path of the file,
 * is sent to that process 
 * 
 * Responds to the calling renderer process with a boolean indicating
 * whether the operation was successful, as well as any error message
 * (handling this response is not yet implemented in the renderer process).
 * 
 * @param {Electron.IpcMainEvent} event - The IPC event object.
 * @throws {Error} If the operation is canceled by the user, or there
 * is an error while opening the file or showing the open dialog.
 */
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

/**
 * Backend of the createFile() function.
 * 
 * Handles the creation of a new file by opening a new Mathitor window,
 * i.e. creating a new renderer process.
 * 
 * Responds to the calling renderer process with a boolean indicating
 * whether the operation was successful, as well as any error message
 * (handling this response is not yet implemented in the renderer process).
 * 
 * @param {Electron.IpcMainEvent} event - The event object.
 * @throws {NodeJS.ErrnoException} If there is an error while creating the new file.
 */
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
