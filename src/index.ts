const { app, BrowserWindow } = require('electron')


const createWindow = () => {
    const window = new BrowserWindow({
    })
    
    window.loadFile('dist/index.html');
    window.maximize();
    window.show();
    //add_listeners();
}

app.whenReady().then(() => {
    createWindow();
})
