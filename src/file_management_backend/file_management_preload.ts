const { contextBridge, ipcRenderer } = require('electron')

export const API = {
    setTitle: (title: any) => ipcRenderer.send('set-title', title),
    openFileRequest: () => ipcRenderer.invoke('dialog:openFile'),
    saveAsMessage: (toSave: String) => ipcRenderer.send('save-file-as', { data: toSave }),
    //openFileMessage: (/*rendererPID: number*/) => ipcRenderer.send('open-file'/*, rendererPID*/),

    // openFileResponse: () => ipcRenderer.on('file-content', (event, { /*newRendererPID,*/ data, filePath }) => {
    //     //console.log('Received new renderer PID:', newRendererPID); // TODO: Remove this line
    //     console.log('Received file content:', data); // TODO: Remove this line
    //     console.log('Received file path:', filePath); // TODO: Remove this line
        
    //     return [/*newRendererPID,*/ data, filePath];
    // }),

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