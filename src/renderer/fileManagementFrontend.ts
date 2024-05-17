import {translateMathFieldsForSave, translateMathFieldsAfterLoad} from "./mathMode/mathMode";

// TODO: Error handling (i.e. handle all the responses from the file management backend)

const textArea = document.getElementById('textarea') as HTMLElement;
const filePath = document.getElementById('filepath') as HTMLElement;
const fileDropdown = document.getElementById("file-dropdown") as HTMLSelectElement;

// Listen for file content from the main process
window.electronAPI.getFileContent().then((fileContent: Array<string>) => {
    const data = fileContent[0] as string;
    const path = fileContent[1] as string;
    console.log('Received file path:\n', path);
    console.log('Received file content\n:', data);

    // Insert the received file content and file path in their respective elements in 'dist/index.html'
    textArea.innerHTML = data;
    filePath.innerHTML = path;

    // Set the file path as the title of the Mathitor window
    window.electronAPI.setTitle(path);

    translateMathFieldsAfterLoad();

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

// Saves a copy of the document, and lets the user select the file's name and path
function saveFileAs(): void {

    translateMathFieldsForSave();

    let toSave: string = textArea.innerHTML;
    console.log("Contents to be saved:\n" + toSave);

    // Send the contents to be saved to the main process
    window.electronAPI.saveAs(toSave);

    // Insert the received file path in the filepath element
    window.electronAPI.saveAsResponse().then((path: string) => {
        filePath.innerHTML = path;
        console.log("Received file path:\n" + path);
        window.electronAPI.setTitle(path);
    });
}

// Saves the document
function saveFile(): void {

    translateMathFieldsForSave();

    let path: string = filePath.innerHTML;
    // Initial save is handled by saveFileAs()
    if (path == "") {
        saveFileAs();
    } else {
        let toSave: string = textArea.innerHTML;
        console.log("Contents to be saved:\n" + toSave);
        // Send the contents to be saved (including the file path) to the main process
        window.electronAPI.save(toSave, path);
    }
}

// Lets the user select a document to open
function openFile(): void {
    // Send an 'open file'-request to the main process
    window.electronAPI.openFileRequest();

}

// Creates a new, unnamed and unsaved document
function createFile(): void {
    // Send a 'create file'-request to the main process
    window.electronAPI.createFileRequest();
}

// Exports a document as a PDF (not yet implemented)
function exportAsPDF(): void {
    // TODO...
}



