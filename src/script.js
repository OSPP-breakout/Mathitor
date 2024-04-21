// Function to format document based on command and value
function formatDoc(cmd, value=null) {
	// Check if value is provided
	if(value) {
		// Execute the command with value
		document.execCommand(cmd, false, value);
	} else {
		// Execute the command without value
		document.execCommand(cmd);
	}
}

/* TODO: function for buttons to stay in an active state visualy
// Get all toolbar buttons
const toolbarButtons = document.querySelectorAll('.btn-toolbar button');

// Add event listeners to each toolbar button
toolbarButtons.forEach(button => {
    button.addEventListener('click', function () {
        // Toggle the 'active' class on the clicked button
        this.classList.toggle('active');
    });
});
*/

// Function to add a hyperlink
function addLink() {
	// Prompt user for URL
	const url = prompt('Insert url');
	// Call formatDoc function to create a link with the provided URL
	formatDoc('createLink', url);
}

// Get the content element
const content = document.getElementById('content');

// Add event listener for mouseenter event on content
content.addEventListener('mouseenter', function () {
	// Select all anchor elements within content
	const a = content.querySelectorAll('a');
	// Loop through each anchor element
	a.forEach(item=> {
		// Add event listener for mouseenter event on each anchor element
		item.addEventListener('mouseenter', function () {
			// Disable contenteditable when hovering over anchor
			content.setAttribute('contenteditable', false);
			// Open links in a new tab
			item.target = '_blank';
		})
		// Add event listener for mouseleave event on each anchor element
		item.addEventListener('mouseleave', function () {
			// Enable contenteditable when leaving anchor
			content.setAttribute('contenteditable', true);
		})
	})
})

/*
// Get the show-code element
const showCode = document.getElementById('show-code');
// Initialize active state
let active = false; */

// Add event listener for click event on show-code element
showCode.addEventListener('click', function () {
	// Toggle active state
	showCode.dataset.active = !active;
	active = !active;
	// If active
	if(active) {
		// Convert HTML content to text content
		content.textContent = content.innerHTML;
		// Disable contenteditable
		content.setAttribute('contenteditable', false);
	} else {
		// Convert text content to HTML content
		content.innerHTML = content.textContent;
		// Enable contenteditable
		content.setAttribute('contenteditable', true);
	}
})

// Get the filename element
const filename = document.getElementById('filename');

// Function to handle file-related actions
function fileHandle(value) {
	// If value is 'new'
	if(value === 'new') {
		// Clear content and set filename to 'untitled'
		content.innerHTML = '';
		filename.value = 'untitled';
	} 
	// If value is 'txt'
	else if(value === 'txt') {
		// Create a text file with content
		const blob = new Blob([content.innerText])
		const url = URL.createObjectURL(blob)
		const link = document.createElement('a');
		link.href = url;
		link.download = `${filename.value}.txt`;
		link.click();
	} 
	// If value is 'pdf'
	else if(value === 'pdf') {
		// Convert content to PDF and save
		html2pdf(content).save(filename.value);
	}
}
