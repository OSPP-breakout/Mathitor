// import { ipcRenderer } from 'electron'; 

const textArea = document.getElementById('textarea') as HTMLElement;
const fileName = document.getElementById('filename') as HTMLElement;
const fileDropdown = document.getElementById("file-dropdown") as HTMLSelectElement;

// Handles creating, saving, loading and exporting files
export function fileManagementOption(): void {

    // Get the selected action from the dropdown menu
    const selectedOption = fileDropdown.options[fileDropdown.selectedIndex];

    // Call the appropriate function for handling the selected action
    if (selectedOption.value == "saveAs") { saveFileAs(); }
    else if (selectedOption.value == "save") { saveFile(); }
    else if (selectedOption.value == "open") { openFileInitiate(); }
    else if (selectedOption.value == "new") { createFile(); }
    else if (selectedOption.value == "pdf") { exportAsPDF(); }

    // Reset the name of the dropdown menu
    fileDropdown.selectedIndex = 0;
}

function saveFileAs(): void {
    const rendererPID = window.electronAPI.getRendererPID();

    // Copy the document contents to be saved
    let toSave: string = textArea.outerHTML;
    console.log("toSave:\n\n" + toSave); // TODO: Remove this line
    console.log("Renderer PID: " + rendererPID); // TODO: Remove this line

    // Send the contents to be saved to the main process
    window.electronAPI.saveAsMessage(toSave, rendererPID);

    // TODO: Send toSave to main process, which in turn saves it as a txt file.
    // Along with toSave, also send a flag indicating that we want to 'save as' not 'save'
}

function saveFile(): void {

}

function openFileInitiate(): void {
    const rendererPID = window.electronAPI.getRendererPID();

    // Send a message to the main process that the user wants to open a file
    window.electronAPI.openFileMessage(rendererPID);

    // // Listen for the file content from the main process
    // const fileContent = window.electronAPI.openFileResponse() as unknown as Array<string | number>;
    // const newRendererPID = fileContent[0] as number;
    // const data = fileContent[1] as string;
    // const path = fileContent[2] as string;

    // // Replace the text area in 'dist/index.html' with the file content
    // textArea.outerHTML = data;

    // TODO:
    // (In 'dist/index.html') - Create a tag where a file's file path can be stored
    // (In the >new< renderer process) - Replace the empty file path tag in 'dist/index.html' with the file's file path
    // filePathTag.outerHTML = path;
}

function createFile(): void {

}

function exportAsPDF(): void {

}

