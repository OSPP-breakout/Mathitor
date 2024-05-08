// import { ipcRenderer } from 'electron'; 

const textArea = document.getElementById('textarea') as HTMLElement;
const fileName = document.getElementById('filename') as HTMLElement;
const fileDropdown = document.getElementById("file-dropdown") as HTMLSelectElement;

// // Listen for file content from the main process
window.electronAPI.getFileContent().then((fileContent: Array<string>) => {
    const data = fileContent[0] as string;
    const path = fileContent[1] as string;
    // Replace the text area in 'dist/index.html' with the file content
    textArea.outerHTML = data;
    // TODO:
    // (In 'dist/index.html') - Create an element where a file's file path can be stored
    // (In the >new< renderer process) - Replace the empty file path element in 'dist/index.html' with the file's file path
    // filePathElement = path;
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
    //const rendererPID = window.electronAPI.getRendererPID();
    let toSave: string = textArea.outerHTML;
    console.log("toSave:\n\n" + toSave); // TODO: Remove this line
    //console.log("Renderer PID: " + rendererPID); // TODO: Remove this line

    // Send the contents to be saved to the main process
    window.electronAPI.saveAsMessage(toSave);

    // TODO: Send toSave to main process, which in turn saves it as a txt file.
    // Along with toSave, also send a flag indicating that we want to 'save as' not 'save'
}

function saveFile(): void {

}

function openFile(): void {
    //const rendererPID = window.electronAPI.getRendererPID();

    // Send a message to the main process that the user wants to open a file
    window.electronAPI.openFileRequest();

    // Listen for the file content from the main process
    // const fileContent = window.electronAPI.openFileResponse() as unknown as Array<string>;
    // //const newRendererPID = fileContent[0] as number;
    // const data = fileContent[1] as string;
    // const path = fileContent[2] as string;

    // Replace the text area in 'dist/index.html' with the file content
    //textArea.outerHTML = data;
    //textArea.innerHTML = data;

    // TODO:
    // (In 'dist/index.html') - Create an element where a file's file path can be stored
    // (In the >new< renderer process) - Replace the empty file path element in 'dist/index.html' with the file's file path
    // filePathElement = path;
}

function createFile(): void {

}

function exportAsPDF(): void {

}

