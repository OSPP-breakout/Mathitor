const { contextBridge, ipcRenderer } = require('electron')

// TODO: Error handling (i.e. handle all the responses from the file management backend)

export const API = {
    setTitle: (title: any) => ipcRenderer.invoke('set-title', title),
    openFileRequest: () => ipcRenderer.invoke('open-file'),
    createFileRequest: () => ipcRenderer.invoke('create-file'),
    saveAs: (toSave: string) => ipcRenderer.invoke('save-file-as', { data: toSave }),
    save: (toSave: string, filePath: string) => ipcRenderer.invoke('save-file', { data: [toSave, filePath] }),

    saveAsResponse: () => new Promise<string>((resolve, reject) => {
        ipcRenderer.once('save-file-as-response', (event, { success, filePath }) => {
            console.log('Received file path (in saveAsResponse):', filePath);                  // TODO: Remove this line
            if (filePath) {
                resolve(filePath);
            } else {
                reject(new Error('Received no file path (in saveAsResponse)'));
            }
        });
    }),

    getFileContent: () => new Promise<Array<string>>((resolve, reject) => {
        ipcRenderer.once('file-content', (event, { rendererPID, data, filePath }) => {
            console.log('Received renderer PID (in getFileContent - preload):', rendererPID);  // TODO: Remove this line
            console.log('Received file content (in getFileContent  - preload):', data);        // TODO: Remove this line
            console.log('Received file path (in getFileContent  - preload):', filePath);       // TODO: Remove this line
            
            // Check for match between the newly created renderer PID and the current renderer PID
            if (process.pid == rendererPID) {
                resolve([data, filePath]);
            } else {
                reject(new Error('Received renderer PID does not match current renderer process'));
            }
        });
    }),

    getRendererPID: () => process.pid

}

contextBridge.exposeInMainWorld('electronAPI', API);