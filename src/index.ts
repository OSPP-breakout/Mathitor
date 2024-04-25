const electron = require("electron");
const { app, BrowserWindow } = electron;

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
