import { createMathField } from "../renderer/mathMode/mathMode";

const { contextBridge, ipcRenderer } = require('electron')

// TODO: Error handling (i.e. handle all the responses from the file management backend)
// TODO: add function for sending a request to load suggestions and one to save suggestions.

/**
 * Gives the renderer process access to selected parts of the Node.js
 * and Electron APIs, such as ipcRenderer (used for message passing).
 * Wraps these parts in a custom API, which the renderer process
 * accesses through 'window.electronAPI'.
 */
export const API = {

    // ---------- Functions for sending messages and requests to the main process ----------

    /**
     * Sends a request for the main process to set the title of a
     * Mathitor window.
     * @param {string} title - The title to set.
     */
    setTitle: (title: string) => ipcRenderer.invoke('set-title', title),

    /**
     * Sends a request for the main process to open a file dialog
     * where the user can select a file to open.
     */
    openFileRequest: () => ipcRenderer.invoke('open-file'),

    /**
     * Sends a request for the main process to create a new file.
     */
    createFileRequest: () => ipcRenderer.invoke('create-file'),

    /**
     * Sends a request for the main process to save the file content
     * in a new file.
     * @param {string} toSave - The file content to be saved.
     */
    saveAsRequest: (toSave: string) => ipcRenderer.invoke('save-file-as', { content: toSave }),

    /**
     * Sends a request for the main process to save the file with the
     * given file path
     * @param {string} toSave - The content of the file to save.
     * @param {string} filePath - The path of the file to save.
     */
    saveRequest: (toSave: string, filePath: string) => ipcRenderer.invoke('save-file', { data: [toSave, filePath] }),


    // -------------- Functions for receiveing messages from the main process --------------

    /**
     * Handles the response from the main process after calling saveFileAs().
     * If the file was saved successfully, the file path is forwarded to the
     * renderer process.
     * @returns {Promise<string>} Resolves with the received file path
     * @throws {Error} If no file path was received
     */
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

    /**
     * Retrieves file content, file path, and the PID of the recipient
     * renderer process, from the main process. Then forwards the
     * file content and path to the renderer process.
     * @returns {Promise<Array<string>>} Resolves with an array containing
     * the received file content and file path.
     * @throws {Error} If the received renderer PID does not match the
     * current renderer process.
     */
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


    // -------------------------- Miscellaneous functions -----------------------------

    loadUserDefinedSuggestions: (): Promise<string> => ipcRenderer.invoke("load: user defined suggestions"),
    loadBuiltInSuggestions: (): Promise<string> => ipcRenderer.invoke("load: built-in suggestions"),
    saveUserDefinedSuggestion: (stringifiedJSON: string) => ipcRenderer.send("save: user defined suggestions", stringifiedJSON),
    
    // -------------------------- Shortcut functions -----------------------------
    mathFieldShortCut: (callback: (event: Electron.IpcRendererEvent, ...args: any[]) => void) => ipcRenderer.on("Shortcut: insert math field", callback),
    boldShortCut: (callback: (event: Electron.IpcRendererEvent, ...args: any[]) => void) => ipcRenderer.on("Shortcut: bold", callback),
    italicShortCut: (callback: (event: Electron.IpcRendererEvent, ...args: any[]) => void) => ipcRenderer.on("Shortcut: italic", callback),
    underlineShortCut: (callback: (event: Electron.IpcRendererEvent, ...args: any[]) => void) => ipcRenderer.on("Shortcut: underline", callback),

    /**
     * Gets the PID of the calling renderer process.
     * @returns {number} The PID of the calling renderer process.
     */
    getRendererPID: () => process.pid
}

contextBridge.exposeInMainWorld('electronAPI', API);