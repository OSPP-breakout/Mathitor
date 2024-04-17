declare var MathQuill: any;

const textarea = document.getElementById("textarea") as HTMLElement;
const latexSpan = document.getElementById('latex') as HTMLElement;
const MQ = MathQuill.getInterface(2);
var amountOfMQFields = 0;

//TODO: Extract all addEventListener call, something like this maybe:

type triggerFunction = (a: any) => any; 

function createEventListener(elementID: string, func: triggerFunction): void {
    document.getElementById(elementID)?.addEventListener("click", function(event) {
        func;
        event.stopImmediatePropagation();
    }, false);
}


// So then you could just do this for every element
// createEventListener("button-bold", text_bold);

document.getElementById("font-size")?.addEventListener("change", function(event) {
    font_size(event);
    event.stopImmediatePropagation();
}, false);

function font_size(e: any): void {
    let value = e.target.value;
    console.log(value);
    textarea.style.fontSize = value + "px";
}


document.getElementById("btn-bold")?.addEventListener("click", function(event) {
    text_bold();
    event.stopImmediatePropagation();
}, false);

function text_bold(): void {
    textarea.style.fontWeight = textarea.style.fontWeight === 'bold' ? 'normal' : 'bold';
}


document.getElementById("btn-italic")?.addEventListener("click", function(event) {
    text_italic();
    event.stopImmediatePropagation();
}, false);

function text_italic(): void {
    textarea.style.fontStyle = textarea.style.fontStyle === 'italic' ? 'normal' : 'italic';
}


document.getElementById("btn-underline")?.addEventListener("click", function(event) {
    text_underline();
    event.stopImmediatePropagation();
}, false);

function text_underline(): void {
    textarea.style.textDecoration = textarea.style.textDecoration === 'underline' ? 'none' : 'underline';
}


document.getElementById("btn-align-l")?.addEventListener("click", function(event) {
    align_left();
    event.stopImmediatePropagation();
}, false);

function align_left(): void {
    textarea.style.textAlign = 'left';
}


document.getElementById("btn-align-c")?.addEventListener("click", function(event) {
    align_center();
    event.stopImmediatePropagation();
}, false);

function align_center(): void {
    textarea.style.textAlign = 'center';
}


document.getElementById("btn-align-r")?.addEventListener("click", function(event) {
    align_right();
    event.stopImmediatePropagation();
}, false);

function align_right(): void {
    textarea.style.textAlign = 'right';
}


document.getElementById("lower-upper")?.addEventListener("click", function(event) {
    text_lower_or_upper();
    event.stopImmediatePropagation();
}, false);

function text_lower_or_upper(): void {
    textarea.style.textTransform = textarea.style.textTransform === 'uppercase' ? 'none' : 'uppercase';
}


document.getElementById("btn-slash")?.addEventListener("click", function(event) {
    text_slash();
    event.stopImmediatePropagation();
}, false);

function text_slash(): void {
    //TODO: en funktion som stryker igenom texten
}


document.getElementById("color-picker")?.addEventListener("change", function(event) {
    text_color(event);
    event.stopImmediatePropagation();
}, false);

function text_color(e: any): void {
    let value = e.target.value;
    textarea.style.color = value;
}


document.getElementById("button-MQ")?.addEventListener("click", function(event) {
    create_MQ_field();
    event.stopImmediatePropagation();
}, false);

function create_MQ_field(): void {
   amountOfMQFields++;
   var newMQField = document.createElement('math-field' + amountOfMQFields.toString());
   
   //Insert the new field at caret position
   var range = (window.getSelection() as Selection).getRangeAt(0);

   if ((range.startContainer.parentNode as Element).id ==='textarea') {
       range.insertNode(newMQField);
   }

   //Link the new MQ-field to the latex-preview  
   var mathField = MQ.MathField(newMQField, {
       handlers: {
           edit: function () {
               latexSpan.textContent = mathField.latex();
           },
       },
   });
}


// document.getElementById("textarea")?.addEventListener("keyup", function(event) {
//     // console.log("input event fired");
//     handleCursor();
//     event.stopImmediatePropagation();
// }, false);

// function handleCursor() {
//     var cursorPos = window.getSelection();
//     var prevElem = cursorPos?.focusNode?.previousSibling;
//     var cursorOffset = cursorPos?.anchorOffset;
//     console.log(cursorOffset);

//     if (prevElem !== null && cursorOffset === 0) {
//         console.log(prevElem?.nodeName);
//         var field = document.getElementById(prevElem?.nodeName as string) as HTMLElement;
//         field.select()
//     }
// }