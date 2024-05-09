const { contextBridge, ipcRenderer } = require('electron')

export const API = {
    setTitle: (title: any) => ipcRenderer.send('set-title', title),
    openFileRequest: () => ipcRenderer.invoke('dialog:openFile'),
    saveAs: (toSave: string) => ipcRenderer.invoke('save-file-as', { data: toSave }),
    save: (toSave: string, filePath: string) => ipcRenderer.send('save-file', { data: [toSave, filePath] }),

    saveAsResponse: () => new Promise<string>((resolve, reject) => {
        ipcRenderer.once('save-file-as-response', (event, { success, filePath }) => {
            console.log('Received file path (in saveAsResponse):', filePath);       // TODO: Remove this line
            if (filePath) {
                resolve(filePath);
            } else {
                reject(new Error('Received no file path'));
            }
        });
    }),

    getFileContent: () => new Promise<Array<string>>((resolve, reject) => {
        ipcRenderer.once('file-content', (event, { rendererPID, data, filePath }) => {
            console.log('Received renderer PID:', rendererPID); // TODO: Remove this line
            console.log('Received file content:', data);        // TODO: Remove this line
            console.log('Received file path:', filePath);       // TODO: Remove this line
            
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