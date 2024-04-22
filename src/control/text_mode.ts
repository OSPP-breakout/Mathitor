const textArea = document.getElementById('textarea') as HTMLElement;
const fileName = document.getElementById('filename') as HTMLElement;

export function font_size(e: any): void {
    let value = e.target.value;
    console.log(value);
    textArea.style.fontSize = value + 'px';
}

export function bold(): void {
    // textarea.style.fontWeight = textarea.style.fontWeight === 'bold' ? 'normal' : 'bold';
    document.execCommand('bold');
}

export function italic(): void {
    // textarea.style.fontStyle = textarea.style.fontStyle === 'italic' ? 'normal' : 'italic';
    document.execCommand('italic');
}

export function underline(): void {
    // textarea.style.textDecoration = textarea.style.textDecoration === 'underline' ? 'none' : 'underline';
    document.execCommand('underline');
}

export function align_left(): void {
    // textarea.style.textAlign = 'left';
    document.execCommand('justifyLeft');
}

export function align_center(): void {
    // textarea.style.textAlign = 'center';
    document.execCommand('justifyCenter');
}

export function align_right(): void {
    // textarea.style.textAlign = 'right';
    document.execCommand('justifyRight');
}

export function text_lower_or_upper(): void {
    textArea.style.textTransform = textArea.style.textTransform === 'uppercase' ? 'none' : 'uppercase';
}

export function text_slash(): void {
    //TODO: en funktion som stryker igenom texten
    document.execCommand('strikeThrough');
}

export function text_color(e: any): void {
    let value = e.target.value;
    textArea.style.color = value;
}

//TODO: Implementera dessa

// Function to format document based on command and value
function formatDoc(cmd: any, value=null) {
	// Check if value is provided
	if(value) {
		// Execute the command with value
		document.execCommand(cmd, false, value);
	} else {
		// Execute the command without value
		document.execCommand(cmd);
	}
}

// Function to add a hyperlink
function addLink() {
	// Prompt user for URL
	const url = prompt('Insert url');
	// Call formatDoc function to create a link with the provided URL
	// formatDoc('createLink', url);
}

// Function to handle file-related actions
function fileHandle(value: any) {
	// If value is 'new'
	if(value === 'new') {
		// Clear content and set filename to 'untitled'
		textArea.innerHTML = '';
		// filename.value = 'untitled';
        fileName.nodeValue = 'untitled';
	} 
	// If value is 'txt'
	else if(value === 'txt') {
		// Create a text file with content
		const blob = new Blob([textArea.innerText])
		const url = URL.createObjectURL(blob)
		const link = document.createElement('a');
		link.href = url;
		link.download = `${fileName.nodeValue}.txt`;
		link.click();
	} 
	// If value is 'pdf'
	else if(value === 'pdf') {
		// Convert content to PDF and save
		// html2pdf(textarea).save(filename.nodeValue);
	}
}


