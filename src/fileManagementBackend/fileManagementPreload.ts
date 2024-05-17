import { loadBuiltInSuggestions, loadUserDefinedSuggestions, saveUserDefinedSuggestion } from "./configLoader";

const { contextBridge, ipcRenderer } = require('electron')

// TODO: Error handling (i.e. handle all the responses from the file management backend)

// Gives the renderer process access to selected parts of the Node.js
// and Electron APIs, such as ipcRenderer (used for message passing).
// Wraps these parts in a custom API, which the renderer process
// accesses through 'window.electronAPI'.

// TODO: add function for sending a request to load suggestions and one to save suggestions.
export const API = {

    // Functions for sending messages and requests to the main process
    setTitle: (title: any) => ipcRenderer.invoke('set-title', title),
    openFileRequest: () => ipcRenderer.invoke('open-file'),
    createFileRequest: () => ipcRenderer.invoke('create-file'),
    saveAs: (toSave: string) => ipcRenderer.invoke('save-file-as', { data: toSave }),
    save: (toSave: string, filePath: string) => ipcRenderer.invoke('save-file', { data: [toSave, filePath] }),

    // Handles the response from the main process after calling saveFileAs()
    saveAsResponse: () => new Promise<string>((resolve, reject) => {
        ipcRenderer.once('save-file-as-response', (event, { success, filePath }) => {
            console.log('Received file path:\n', filePath);
            if (filePath) {
                resolve(filePath);
            } else {
                reject(new Error('Received no file path'));
            }
        });
    }),

    // Lets new renderer processes receive file content from the main process
    getFileContent: () => new Promise<Array<string>>((resolve, reject) => {
        ipcRenderer.once('file-content', (event, { rendererPID, data, filePath }) => {
            console.log('Received renderer PID\n:', rendererPID);
            console.log('Received file content\n:', data);
            console.log('Received file path\n:', filePath);
            
            // Check for match between the newly created renderer PID and the current renderer PID
            if (process.pid == rendererPID) {
                resolve([data, filePath]);
            } else {
                reject(new Error('Received renderer PID does not match current renderer process'));
            }
        });
    }),

    loadUserDefinedSuggestions: (): Promise<string> => ipcRenderer.invoke("load: user defined suggestions"),
    loadBuiltInSuggestions: (): Promise<string> => ipcRenderer.invoke("load: built-in suggestions"),
    saveUserDefinedSuggestion: (stringifiedJSON: string) => ipcRenderer.send("save: user defined suggestions", stringifiedJSON),

    // Returns the PID of the renderer process that called this function
    getRendererPID: () => process.pid
}

contextBridge.exposeInMainWorld('electronAPI', API);