const { contextBridge, ipcRenderer } = require('electron')

export const API = {
    setTitle: (title: any) => ipcRenderer.send('set-title', title),
    saveAsMessage: (toSave: String) => ipcRenderer.send('save-file-as', { data: toSave })
}

contextBridge.exposeInMainWorld('electronAPI', API);