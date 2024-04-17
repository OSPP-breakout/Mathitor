import {setupEventListeners} from "./eventListeners";

declare var MathQuill: any;

const textarea = document.getElementById("textarea") as HTMLElement;
const latexSpan = document.getElementById('latex') as HTMLElement;
const MQ = MathQuill.getInterface(2);
var amountOfMQFields = 0;

// Setup event listeners
setupEventListeners();

// Variables
var mathMode = false;

export function font_size(e: any): void {
    let value = e.target.value;
    console.log(value);
    textarea.style.fontSize = value + "px";
}

export function text_bold(): void {
    textarea.style.fontWeight = textarea.style.fontWeight === 'bold' ? 'normal' : 'bold';
}

export function text_italic(): void {
    textarea.style.fontStyle = textarea.style.fontStyle === 'italic' ? 'normal' : 'italic';
}

export function text_underline(): void {
    textarea.style.textDecoration = textarea.style.textDecoration === 'underline' ? 'none' : 'underline';
}

export function align_left(): void {
    textarea.style.textAlign = 'left';
}

export function align_center(): void {
    textarea.style.textAlign = 'center';
}

export function align_right(): void {
    textarea.style.textAlign = 'right';
}

export function text_lower_or_upper(): void {
    textarea.style.textTransform = textarea.style.textTransform === 'uppercase' ? 'none' : 'uppercase';
}

export function text_slash(): void {
    //TODO: en funktion som stryker igenom texten
}

export function text_color(e: any): void {
    let value = e.target.value;
    textarea.style.color = value;
}

export function create_MQ_field(): void {
   amountOfMQFields++;
   var newMQField = document.createElement('math-field' + amountOfMQFields.toString());
   newMQField.setAttribute("id", 'math-field' + amountOfMQFields.toString());
   
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
            moveOutOf: function(direction: any, mf: any) {
                mathField.blur();
                console.log(mf.el());
                // mathMode = false;
                console.log(mf.el().nextSibling);
                console.log(direction); 

                if (direction === 1) {
                    var nextElement = mf.el().nextSibling as HTMLElement;
                    // nextElement?.
                } else {
                }
            }
       },
   });
}

var math_Mode = true;

export function handleCursor(e: any) {
    
    if (!mathMode) {
        var cursorPos = window.getSelection() as Selection;
        var cursorOffset = cursorPos?.anchorOffset as number;

        switch (e.key) {
            case "ArrowLeft":
                handleLeftArrow(cursorPos, cursorOffset);
                break;
            case "ArrowRight":
                handleRightArrow(cursorPos, cursorOffset);
                // Right pressed
                break;
            case "ArrowUp":
                // Up pressed
                break;
            case "ArrowDown":
                // Down pressed
                break;
            default:
                return;
        }
    }
}

function handleLeftArrow(cursorPos: Selection, cursorOffset: number) {
    var prevElem = cursorPos?.focusNode?.previousSibling;
    if (prevElem !== null && cursorOffset === 0) {
        mathMode = true;
        var math_field = MQ(document.getElementById(prevElem?.nodeName.toLowerCase() as string) as HTMLElement);
        math_field.focus();
        math_field.moveToRightEnd();
    }
}

function handleRightArrow(cursorPos: Selection, cursorOffset: number) {
    var nextElement = cursorPos?.focusNode?.nextSibling;
    if (nextElement !== null && cursorOffset === cursorPos?.focusNode?.textContent?.length) {
        mathMode = true;
        var math_field = MQ(document.getElementById(nextElement?.nodeName.toLowerCase() as string) as HTMLElement);
        math_field.focus();
        math_field.moveToLeftEnd();
    }
}

