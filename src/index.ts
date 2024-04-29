const electron = require("electron");
//const fs = require("fs");
import * as fs from 'fs';

const { app, BrowserWindow, ipcMain, dialog } = electron;

const createWindow = () => {
    const window = new BrowserWindow({
      width: 800,
      height: 600,
    })
    
    window.loadFile('dist/index.html');
}

app.whenReady().then(() => {
    createWindow();
})

// Listen for save-file-as event from renderer process
ipcMain.on('save-file-as', (event, { data }) => {
  // Show save dialog to get file path from user
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
