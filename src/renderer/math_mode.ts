// Math mode global constants
const shortCommands: string = require("./autoCommands.txt").replace(/[\n\r]+/g, " ");
const shortOperators: string = require("./autoOperators.txt").replace(/[\n\r]+/g, " ");

let mathMode = false;

declare var MathQuill: any;
const MQ = MathQuill.getInterface(2);
let amountOfMQFields = 0;

const latexSpan = document.getElementById('latex') as HTMLElement;

// Math mode functions

export function create_MQ_field(): void {
    amountOfMQFields++;
    var newMQField = document.createElement('math-field' + amountOfMQFields.toString());
    newMQField.setAttribute('id', 'math-field' + amountOfMQFields.toString());

    //Insert the new field at caret position
    var range = (window.getSelection() as Selection).getRangeAt(0);

    if ((range.startContainer.parentNode as Element).id === 'textarea') {
        range.insertNode(newMQField);
    }

    //Link the new MQ-field to the latex-preview
    var mathField = MQ.MathField(newMQField, {
        handlers: {
            edit: function () {
                latexSpan.textContent = mathField.latex();
            },
            moveOutOf: function (direction: any, mathfield: any) {
                mathMode = false;
                mathfield.blur();
                var range = document.createRange();
                var sel = document.getSelection();

                if (direction === 1) {
                    var nextElement = mathfield.el().nextSibling as HTMLElement;
                    if (nextElement === null) return;
                    range.setStart(nextElement, 0);
                } else {
                    var previousElement = mathfield.el().previousSibling as HTMLElement;
                    if (previousElement === null) return;
                    // Need to declare it as a number otherwise it complains that it might be Undef.
                    range.setStart(previousElement, previousElement.textContent?.length as number);
                }
                sel?.removeAllRanges();
                sel?.addRange(range);
            },
            enter: function(mathField: any) {
                mathField.config({autoCommands : shortCommands});
                const character = latexSpan.textContent?.charAt(latexSpan.textContent.length - 1);
                mathField.keystroke("Backspace");
                console.log(character);
                character?.valueOf
                mathField.keystroke(character?.toUpperCase);
            }, 
        },
    });
}

export function handleCursor(e: any) {
    if (!mathMode) {
        var cursorPos = window.getSelection() as Selection;
        var cursorOffset = cursorPos?.anchorOffset as number;

        switch (e.key) {
            case 'ArrowLeft':
                handleLeftArrow(cursorPos, cursorOffset);
                break;
            case 'ArrowRight':
                handleRightArrow(cursorPos, cursorOffset);
                // Right pressed
                break;
            case 'ArrowUp':
                // Up pressed
                break;
            case 'ArrowDown':
                // Down pressed
                break;
            default:
                return;
        }
    }
}

function handleLeftArrow(cursorPos: Selection, cursorOffset: number) {
    var prevElem = cursorPos?.focusNode?.previousSibling;
    console.log("prev: "+ prevElem?.nodeName + " " + prevElem?.nodeName.startsWith("MATH-FIELD") );
    if (prevElem?.nodeName.startsWith("MATH-FIELD") && cursorOffset === 0) {
        mathMode = true;
        var math_field = MQ(document.getElementById(prevElem?.nodeName.toLowerCase() as string) as HTMLElement);
        math_field.focus();
        math_field.moveToRightEnd();
    }
}

function handleRightArrow(cursorPos: Selection, cursorOffset: number) {
    var nextElement = cursorPos?.focusNode?.nextSibling;
    console.log("next: " + nextElement?.nodeName + " " + nextElement?.nodeName.startsWith("MATH-FIELD") );
    if (nextElement?.nodeName.startsWith("MATH-FIELD") && 
        cursorOffset === cursorPos?.focusNode?.textContent?.length) {
        mathMode = true;
        var math_field = MQ(document.getElementById(nextElement?.nodeName.toLowerCase() as string) as HTMLElement);
        math_field.focus();
        math_field.moveToLeftEnd();
    }
}
