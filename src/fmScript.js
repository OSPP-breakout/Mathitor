//document.getElementById("textarea").outerHTML
//document.getElementById("textarea").outerHTML = blablaba


document.addEventListener("DOMContentLoaded", function() {
    //const fileList = document.querySelector(".file-list");
    const createFileBtn = document.getElementById("create-file-btn");
    const loadFileBtn = document.getElementById("load-file-btn");
  
    // Function to handle file creation
    async function createNewMathitorFile(htmlContent/* , cssContent, jsContent */) {
        try {
            // Request file system access and create a writable stream
            const fileHandle = await window.showSaveFilePicker();
            const writableStream = await fileHandle.createWritable(); // TODO: Rename WritableStream?
  
            // Write HTML content to the stream
            await writableStream.write(htmlContent);
  
            /* // Write CSS content to the stream
            await writableStream.write(cssContent);
  
            // Write JavaScript content to the stream
            await writableStream.write(jsContent); */
  
            // Close the stream
            await writableStream.close();
  
            // Log the name of the file
            console.log(`File ${fileHandle.name} created successfully.`);
        
        } catch (err) {
            console.error('Error creating file:', err);
        }
    }

    // Function to read file content using the Fetch API with 'file://' protocol
    /* async function readFile(filePath) {
        try {
            const response = await fetch(`file://C:\Users\Fredrik Sjögren\Desktop\Universitetet\år-2-dv\OSPP\M9 Projekt\testFileManagement${filePath}`);
    
            if (!response.ok) {
                throw new Error(`Failed to fetch file: ${response.statusText}`);
            }
            return await response.text();
    
        } catch (err) {
            console.error('Error reading file:', err);
            throw err; // rethrow the error to handle it outside
        }
    } */

    // Function to read file content using a relative file path
    /*async function readFile(filePath) {
        try {

            // Create new File object from a Blob object.
            // The Blob object contains the contents of the file specified by
            // the filePath, as plain text.
            const file = await new File(
                                       [new Blob([filePath],
                                                 { type: 'text/plain' })],
                                       filePath);
            
            // Return the contents of the file object as plain text
            return await file.text();

        } catch (err) {
            console.error('Error reading file:', err);
            throw err; // rethrow the error to handle it outside
        }
    }*/
    
    // Event listener for "Create New File" button
    createFileBtn.addEventListener("click", () => {
    
        // Fetch HTML, CSS and JavaScript contents asynchronously
        /* const TemplateHTMLPromise = fetch('index.html').then(response => response.text());
        const TemplateCSSPromise = fetch('style.css').then(response => response.text());
        const TemplateJSPromise = fetch('script.js').then(response => response.text());

        // Wait for both promises to resolve
        Promise.all([TemplateHTMLPromise,
                     TemplateCSSPromise,
                     TemplateJSPromise]).then(([TemplateHTML, TemplateCSS, TemplateJS]) => {
    
            // Call the function to create the new HTML file
            createNewMathitorFile(TemplateHTML, TemplateCSS, TemplateJS);
        }); */

        const template = `<!DOCTYPE html>
        <html lang="en" data-file-type="Mathitor">
        <head>
            <meta charset="UTF-8">
            <meta http-equiv="X-UA-Compatible" content="IE=edge">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Maethitor</title>
        
            <style>
            *
            {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }
            
            body
            {
                background: #bebb9a;
                height: 100vh;
                width: 100%;
                display: flex;
                justify-content: center;
                align-items: center;
                padding: 5px;
            }
            
            .section
            {
                height: 500px;
                width: 1000px;
            }
            
            .col
            {
                background-color: #fff;
                width: 100%;
                /*height: 200px;*/
                border-radius: 4px;
                padding: 5px;
                box-shadow: #00000059 0px 5px 15px;
            }
            
            .box
            {
                display: inline-block !important;
                padding: 0 5px;
            }
            
            .first
            {
                border-right: 2px solid #40576d33;
            }
            
            input[type=number]
            {
                outline: none;
                border: none;
                width: 50px;
                color: #131c35;
                font-size: 24px;
                padding: 10px 0px;
                margin-left: 10px;
            }
            
            .second
            {
                border-right: 2px solid #40576d33;
            }
            
            button
            {
                border: none;
                color: #131c35;    
                font-size: 20px;
                font-weight: 300;
                background: transparent;
                padding: 10px 16px;
                border-radius: 3px;
                cursor: pointer;
                user-select: none;
            }
            
            button:hover
            {
                background: #40576d1a;
            }
            
            button:focus
            {
                background: #73b1e333;
                color: #bebb9a;
            }
            
            .third
            {
                border-right: 2px solid #40576d33;
            }
            
            .third button:focus
            {
                background: #73b1e333;
                color: #5271ff;
            }
            
            input[type=color]
            {
                width: 35px;
                outline: none;
                border: none;
                background: none;
            }
            
            textarea
            {
                width: 100%;
                height: 350px;
                padding: 10px;
                border-radius: 3px;
                outline: none;
                border: none;
                resize: vertical;
            }
            </style>
        
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
        
        </head>
        <body>
            <div class="section">
                <div class="row">
                    <div class="col">
                    <div class="first box">
                        <input type="number"
                                id="font-size"
                                min="1"
                                max="100"
                                value="14"
                                onchange="font_size(this)">
        
                        </div>
                        <div class="second box">
                            <button type="button"
                            onclick="text_bold(this)">
                            <i class="fa-solid fa-bold"> </i></button>
                            <button type="button"
                            onclick="text_italic(this)">
                            <i class="fa-solid fa-italic"> </i></button>
                            <button type="button"
                            onclick="text_underline(this)">
                            <i class="fa-solid fa-underline"> </i></button>
                        </div>
                        <div class="third box">
                            <button type="button" onclick="align_left(this)">
                                <i class="fa-solid fa-align-left"></i>
                            </button>
                            <button type="button" onclick="align_center(this)">
                                <i class="fa-solid fa-align-center"></i>
                            </button>
                            <button type="button" onclick="align_right(this)">
                                <i class="fa-solid fa-align-right"></i>
                            </button>
                        </div>
                        <div class="fourth box">
                            <button type="button" onclick="text_lower_or_upper(this)">
                            aA
                            </button>
                            <button type="button" onclick="text_slash(this)">
                            <i class="fa-solid fa-text-slash"></i>
                            </button>
                            <input type="color" onchange="text_color(this)">
                        </div>
                    </div>
                    <br>
                    <div class="col">
                        
                        <textarea id="textarea" placeholder="Your text here"></textarea>
                    </div>           
                </div>
            </div>    
        
            <script>
            const textarea = document.getElementById("textarea");

            function font_size(e) {
                let value = e.value;
                textarea.style.fontSize = value + "px";
            }
            
            function text_bold(e) {
                textarea.style.fontWeight = textarea.style.fontWeight === 'bold' ? 'normal' : 'bold';
            }
            
            function text_italic(e) {
                textarea.style.fontStyle = textarea.style.fontStyle === 'italic' ? 'normal' : 'italic';
            }
            
            function text_underline(e) {
                textarea.style.textDecoration = textarea.style.textDecoration === 'underline' ? 'none' : 'underline';
            }
            
            function align_left(e) {
                textarea.style.textAlign = 'left';
            }
            
            function align_center(e) {
                textarea.style.textAlign = 'center';
            }
            
            function align_right(e) {
                textarea.style.textAlign = 'right';
            }
            
            function text_lower_or_upper(e) {
                textarea.style.textTransform = textarea.style.textTransform === 'uppercase' ? 'none' : 'uppercase';
            }
            
            function text_slash(e) {
                //TODO: en funktion som stryker igenom texten
            }
            
            function text_color(e) {
                let value = e.value;
                textarea.style.color = value;
            }
            
            </script>
        
        </body>
        </html>`;
        
        createNewMathitorFile(template);

    });

    // Event listener for "Create New File" button
    /* createFileBtn.addEventListener("click", async () => {
        try {
            // Read HTML, CSS and JavaScript contents asynchronously
            const htmlContent = await readFile('Mathitor/index.html');
            const cssContent = await readFile('Mathitor/style.css');
            const jsContent = await readFile('Mathitor/script.js');

            // Call the function to create the new Mathitor file
            createNewMathitorFile(htmlContent, cssContent, jsContent);

        } catch (err) {
            console.error('Error reading files:', err);
        }
    }); */

    // Event listener for "Load File" button
    loadFileBtn.addEventListener("click", async () => {
        try {
            // Request read access to the file system
            const handle = await window.showOpenFilePicker();
            
            // Get the file object
            const file = await handle[0].getFile();

            // Read the contents of the file
            const fileContent = await file.text();

            // Parse the file content as HTML
            const parser = new DOMParser();
            const doc = parser.parseFromString(fileContent, 'text/html');

            // Access the custom data attribute
            const fileType = doc.documentElement.dataset.fileType;

            if (fileType === "Mathitor") {
                // Create a new tab and open the file content in it
                const newTab = window.open();
                newTab.document.write(fileContent);

            } else {
                // alert("This is not a Mæthitor-file!!!!!!!");
                alert("\nTHIS IS NOT A MÆTHITOR-FILE!!!!!!!\n\n\nYOU IDIOT SANDWICH...");
            }

        } catch (err) {
            console.error('Error accessing file system:', err);
        }
    });
});
