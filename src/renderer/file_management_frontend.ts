// import { ipcRenderer } from 'electron'; 

const textArea = document.getElementById('textarea') as HTMLElement;
const fileName = document.getElementById('filename') as HTMLElement;
const filePath = document.getElementById('filePath') as HTMLElement;
const fileDropdown = document.getElementById("file-dropdown") as HTMLSelectElement;

// Listen for file content from the main process
window.electronAPI.getFileContent().then((fileContent: Array<string>) => {
    const data = fileContent[0] as string;
    const path = fileContent[1] as string;

    // Replace the text area in 'dist/index.html' with the file content
    textArea.outerHTML = data;
    // Replace the empty file path element in 'dist/index.html' with the file's file path
    filePath.innerHTML = path;
    console.log("filePath.innerHTML:\n\n" + filePath.innerHTML); // TODO: Remove this line
    console.log("filePath.outerHTML:\n\n" + filePath.outerHTML); // TODO: Remove this line

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
    let toSave: string = textArea.outerHTML;
    console.log("toSave:\n\n" + toSave); // TODO: Remove this line
    console.log("filePath.innerHTML:\n\n" + filePath.innerHTML); // TODO: Remove this line
    // console.log("filePath.outerHTML:\n\n" + filePath.outerHTML); // TODO: Remove this line

    // Send the contents to be saved to the main process
    window.electronAPI.saveAs(toSave);

    // Replace the empty file path element in 'dist/index.html' with the file's file path
    window.electronAPI.saveAsResponse().then((path: string) => {
        filePath.innerHTML = path;
    });

    console.log("filePath.innerHTML:\n\n" + filePath.innerHTML); // TODO: Remove this line

    // TODO: Along with toSave, also send a flag indicating that we want to 'save as' not 'save' ??
}

function saveFile(): void {
    let path: string = filePath.innerHTML;
    console.log("filePath.innerHTML:\n\n" + filePath.innerHTML); // TODO: Remove this line
    // Check if it is the first save
    if (path == "") {
        saveFileAs();
    } else {
        let toSave: string = textArea.outerHTML;
        // Send the contents (including the file path) to be saved to the main process
        window.electronAPI.save(toSave, path);
    }
}

function openFile(): void {
    // Send a message to the main process that the user wants to open a file
    window.electronAPI.openFileRequest();
}

function createFile(): void {

}

function exportAsPDF(): void {

}

