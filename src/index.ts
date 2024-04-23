const { app, BrowserWindow } = require('electron')


const createWindow = () => {
    const window = new BrowserWindow({
      width: 800,
      height: 600,
    })
    
    window.loadFile('dist/index.html');
    //add_listeners();
}

app.whenReady().then(() => {
    createWindow();
})
