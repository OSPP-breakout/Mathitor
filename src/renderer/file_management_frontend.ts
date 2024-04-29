//import { ipcRenderer } from 'electron'; 

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
    else if (selectedOption.value == "open") { loadFile(); }
    else if (selectedOption.value == "new") { createFile(); }
    else if (selectedOption.value == "pdf") { exportAsPDF(); }

    // Reset the name of the dropdown menu
    fileDropdown.selectedIndex = 0;
}

function saveFileAs(): void {
    
    // Copy the document contents to be saved
    let toSave: string = textArea.outerHTML;
    //window.electronAPI.setTitle("ABCASD");
    
    console.log("toSave:\n\n" + toSave); // TODO: Remove this line

    // Send the contents to be saved to the main process
    //ipcRenderer.send('saveAs', toSave);
    window.electronAPI.saveAsMessage(toSave);

    // TODO: Send toSave to main process, which in turn saves it as a txt file.
    // Along with toSave, also send a flag indicating that we want to 'save as' not 'save'
}

function saveFile(): void {

}

function loadFile(): void {

}

function createFile(): void {

}

function exportAsPDF(): void {

}

