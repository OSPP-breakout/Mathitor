// TODO: Error handling (i.e. handle all the responses from the file management backend)

const textArea = document.getElementById('textarea') as HTMLElement;
// const fileName = document.getElementById('filename') as HTMLElement;
const filePath = document.getElementById('filePath') as HTMLElement;
const fileDropdown = document.getElementById("file-dropdown") as HTMLSelectElement;

// Listen for file content from the main process
window.electronAPI.getFileContent().then((fileContent: Array<string>) => {
    const data = fileContent[0] as string;
    const path = fileContent[1] as string;
    console.log('Received file path (in getFileContent  - frontend):', path);     // TODO: Remove this line
    console.log('Received file content (in getFileContent  - frontend):', data);  // TODO: Remove this line

    // Insert the file content in the textarea element in 'dist/index.html'
    textArea.innerHTML = data;
    // Insert the file's file path in the filePath element in 'dist/index.html'
    filePath.innerHTML = path;
    console.log("filePath.innerHTML (in getFileContent  - frontend):\n\n" + filePath.innerHTML); // TODO: Remove this line
    console.log("textArea.innerHTML (in getFileContent  - frontend):\n\n" + textArea.innerHTML); // TODO: Remove this line

    window.electronAPI.setTitle(path);

}).catch((error: Error) => {
    console.error(error.message);
});

// Handles creating, saving, loading and exporting files
export function fileManagementOption(): void {
    const selectedOption = fileDropdown.options[fileDropdown.selectedIndex];

    if (selectedOption.value == "saveAs") { saveFileAs(); }
    else if (selectedOption.value == "save") { saveFile(); }
    else if (selectedOption.value == "open") { openFile(); }
    else if (selectedOption.value == "new") { createFile(); }
    else if (selectedOption.value == "pdf") { exportAsPDF(); }

    // Reset the name of the dropdown menu
    fileDropdown.selectedIndex = 0;
}

function saveFileAs(): void {
    let toSave: string = textArea.innerHTML;
    console.log("toSave:\n\n" + toSave);                                         // TODO: Remove this line
    console.log("filePath.innerHTML (in saveFileAs):\n\n" + filePath.innerHTML); // TODO: Remove this line

    // Send the contents to be saved to the main process
    window.electronAPI.saveAs(toSave);

    // Insert the file's file path in the filePath element in 'dist/index.html'
    window.electronAPI.saveAsResponse().then((path: string) => {
        filePath.innerHTML = path;
        window.electronAPI.setTitle(path);
    });

    console.log("filePath.innerHTML (in saveFileAs):\n\n" + filePath.innerHTML); // TODO: Remove this line
}

function saveFile(): void {
    let path: string = filePath.innerHTML;
    console.log("filePath.innerHTML (in saveFile):\n\n" + filePath.innerHTML);   // TODO: Remove this line

    // First save is handled by saveFileAs()
    if (path == "") {
        saveFileAs();
    } else {
        let toSave: string = textArea.innerHTML;
        console.log("toSave (in saveFile):\n\n" + toSave);    // TODO: Remove this line
        // Send the contents to be saved (including the file path) to the main process
        window.electronAPI.save(toSave, path);
    }
}

function openFile(): void {
    // Send an 'open file'-request to the main process
    window.electronAPI.openFileRequest();
}

function createFile(): void {
    // Send a 'create file'-request to the main process
    window.electronAPI.createFileRequest();
}

function exportAsPDF(): void {
    // TODO...
}

