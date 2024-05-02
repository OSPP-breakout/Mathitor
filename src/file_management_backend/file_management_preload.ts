const { contextBridge, ipcRenderer } = require('electron')

export const API = {
    setTitle: (title: any, rendererPID: number) => ipcRenderer.send('set-title', title, rendererPID),
    saveAsMessage: (toSave: String, rendererPID: number) => ipcRenderer.send('save-file-as', { data: toSave }, rendererPID),
    openFileMessage: (rendererPID: number) => ipcRenderer.send('open-file', rendererPID),

    openFileResponse: () => ipcRenderer.on('file-content', (event, { newRendererPID, data, filePath }) => {
        console.log('Received new renderer PID:', newRendererPID); // TODO: Remove this line
        console.log('Received file content:', data); // TODO: Remove this line
        console.log('Received file path:', filePath); // TODO: Remove this line
        
        return [newRendererPID, data, filePath];
    }),

    getRendererPID: () => process.pid
}

contextBridge.exposeInMainWorld('electronAPI', API);