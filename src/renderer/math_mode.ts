import { textArea, underline } from "./text_mode";

import { autoComplete, clearSuggestions } from "./autoComplete/autocomplete";

// Math mode global constants
const shortCommands: string = require("./autoComplete/autoCommands.txt").replace(/[\n\r]+/g, " ");
const shortOperators: string = require("./autoComplete/autoOperators.txt").replace(/[\n\r]+/g, " ");

let mathMode = false;

declare var MathQuill: any;
const MQ = MathQuill.getInterface(2);
let amountOfMQFields = 0;
let mathPlacement = 1;
const LEFT = -1;
const RIGHT = 1;
const latexSpan = document.getElementById('latex') as HTMLElement;

// Math mode functions

export function create_MQ_field(): void {

    if (mathMode) {
        return;
    }

    var newSpan = document.createElement('mathSpan');

    amountOfMQFields++;
    var newMQField = document.createElement('math-field' + amountOfMQFields.toString());
    newMQField.setAttribute('id', 'math-field' + amountOfMQFields.toString());


    //Insert the new field at caret position
    var range = (window.getSelection() as Selection).getRangeAt(0);
    var elem;
    if((elem = getCorrectParentElement(range.startContainer)) === null) {elem = range.commonAncestorContainer}
    // var rawSpace = document.createTextNode(" ");
    if (elem.id === 'textarea' || (elem.parentNode as Element).id === 'textarea') {
        range.insertNode(newSpan);
        let span;
        newSpan.appendChild(span = document.createElement("span"));
        span.textContent = "\u00A0";
        span.style.userSelect = "none";
        span.contentEditable = "false";
        newSpan.appendChild(newMQField);
        newSpan.appendChild(span = document.createElement("span"));
        span.textContent = "\u00A0";
        span.style.userSelect = "none";
        span.contentEditable = "false";
    }

    //Link the new MQ-field to the latex-preview
    var mathField = MQ.MathField(newMQField, {
        handlers: {
            edit: function () {
                latexSpan.textContent = mathField.latex();
                autoComplete(mathField);
            },
            moveOutOf: function (direction: any, mathfield: any) {
                clearSuggestions();

                mathfield.blur();
                var range = document.createRange();
                var sel = document.getSelection();
                var mathFieldNode = mathfield.el() as Node;
                if (direction === 1) {
                    var nextParentElement = findSiblingToParentRight(mathFieldNode.parentNode as Node) as Node;
                    var nextElement = findFirstChildLeft(nextParentElement);
                    if (nextElement === null) return;
                    range.setStart(nextElement, 0);
                    range.setEnd(nextElement, 0);
                } else {
                    var previousParentElement = findSiblingToParentLeft(mathFieldNode.parentNode as Node) as Node;
                    var previousElement = findFirstChildRight(previousParentElement);
                    if (previousElement === null) return;
                    // Need to declare it as a number otherwise it complains that it might be Undef.
                    var len = (previousElement.textContent?.length as number) - 1 >= 0 ? 
                             (previousElement.textContent?.length as number) - 1 :
                             (previousElement.textContent?.length as number);
                    range.setStart(previousElement, len + 1);
                    range.setEnd(previousElement, len + 1);
                }
                sel?.removeAllRanges();
                sel?.addRange(range);
                console.log(window.getSelection()?.getRangeAt(0))
                mathMode = false;
            },
            deleteOutOf: function(dir: number, mathfield: any) {
                mathMode = false;
                mathfield.blur();
                var range = document.createRange();
                var caretPos = document.getSelection();
                var mathFieldNode = mathfield.el() as Node;
                if (dir === LEFT) {
                    deleteOutLeft(range, mathFieldNode);
                } else {
                    deleteOutRight(range, mathFieldNode);
                }
                caretPos?.removeAllRanges();
                caretPos?.addRange(range);
            },
            selectOutOf: function (direction: any, mathfield: any) {
                clearSuggestions();
            },
            enter: function(mathField: any) {
                const character = latexSpan.textContent?.charAt(latexSpan.textContent.length - 1);
                mathField.keystroke("Backspace");
                console.log(character);
                character?.valueOf
                mathField.keystroke(character?.toUpperCase);
            }, 
        },
        autoCommands: shortCommands,
        autoOperatorNames: shortOperators
    });
    
    mathField.el().querySelector('textarea').addEventListener('focusout', clearSuggestions);
    window.getSelection()?.removeAllRanges();
    mathField.focus();
}

function getCorrectParentElement(e: any): any {
    return e === null 
            ? null 
        : e.parentNode === textArea 
            ? e
        : getCorrectParentElement(e.parentNode);

    
}

export function handleCursor(e: any) {
    if (!mathMode) {
        var caretPos = window.getSelection() as Selection;
        //var cursorOffset = cursorPos?.anchorOffset as number;
        //console.log("offset: " + cursorOffset + " FocusNode: " + cursorPos.focusNode?.nodeName);
        switch (e.key) {
            case 'ArrowLeft':
                handleLeftArrow(caretPos);
                break;
            case 'ArrowRight':
                handleRightArrow(caretPos);
                break;
            case 'ArrowUp':
                break;
            case 'ArrowDown':
                break;
            case "Backspace":
                handleBackSpace(caretPos);
                break;
            case "Delete":
                handleDelete(caretPos);
                break;
            default:
                //console.log(e.key)
                return;
        }
    }
}

function isMathFieldBranch(n: Node | HTMLElement | null): HTMLElement | Node | null {
    return n === null
    ? n 
    : (n as Element).id === "textarea"
        ? null
        : isMathField(n)
            ? n
            : (n.parentNode as Element).id ===  "textarea"
                ? null
                : isMathFieldBranch((n.parentNode as Node));
}

function getMathSpan(n: Node | HTMLElement | null): HTMLElement | Node | null {
    return n === null
    ? n 
    : (n as Element).id === "textarea"
        ? null
        : n.nodeName.startsWith("MATHSPAN")
            ? n
            : (n.parentNode as Element).id ===  "textarea"
                ? null
                : getMathSpan((n.parentNode as Node));
}

function isMathSpan(n: Node | HTMLElement | null): boolean {
    return n === null 
    ? false
    : n.nodeName.startsWith("MATHSPAN");
}

function handleLeftArrow(caretPos: Selection) {
    var caretOffset = caretPos.anchorOffset;
    var prevSibling = findSiblingToParentLeft(caretPos.focusNode as Node);
    var mathFieldElem = findChildMathFieldRight(prevSibling as Node);
    var nodeLengthToMathField = 1;
    if (!mathMode && ((isMathField(prevSibling as Node) && caretOffset === nodeLengthToMathField)
                     || (isMathSpan(prevSibling) && caretOffset === (nodeLengthToMathField - 1)))) {
        activateMathField(prevSibling as Node, LEFT);
    } else if (!mathMode && isMathField(mathFieldElem = (isMathFieldBranch(caretPos?.focusNode)) as Node)) {
        activateMathField(prevSibling as Node, LEFT);
    }
}

function handleRightArrow(caretPos: Selection) {
    var caretOffset = caretPos.anchorOffset;
    var nextSibling = findSiblingToParentRight(caretPos.focusNode as Node);
    var mathFieldElem = findChildMathFieldLeft(nextSibling as Node);
    var nodeLengthToMathField = (caretPos.focusNode?.textContent?.length as number);
    console.log("Next element: " + nextSibling?.nodeName + " Caret Pos: " + caretOffset + " Caret at: " + caretPos.focusNode?.textContent);
    console.log("Next child elem: " + mathFieldElem?.nodeName);
    console.log("");
    if (!mathMode && ((isMathSpan(nextSibling) || isMathField(mathFieldElem as Node)) && (caretOffset === nodeLengthToMathField))) {
        activateMathField(nextSibling as Node, RIGHT);
    } else if (!mathMode && isMathField(mathFieldElem = (isMathFieldBranch(caretPos?.focusNode)) as Node)) {
        activateMathField(nextSibling as Node, RIGHT);
    }
}

function handleBackSpace(caretPos: Selection) {
    var caretOffset = caretPos.anchorOffset;
    var prevSibling = findSiblingToParentLeft(caretPos.focusNode as Node);
    var nodeLengthToMathField = 1;
    if (!mathMode && ((isMathField(prevSibling as Node) && caretOffset === nodeLengthToMathField)
        || (isMathSpan(prevSibling) && caretOffset === (nodeLengthToMathField - 1)))) {
        activateMathField(prevSibling as Node, LEFT);
    } else if (!mathMode && caretOffset === 1 && caretPos.focusNode?.textContent?.length === 1) {
        console.log("Prev sibling: " + prevSibling?.nodeName)
        caretPos.focusNode.textContent = "\u00A0";  
        activateMathField(prevSibling as Node, LEFT);
    }
}

function handleDelete(caretPos: Selection) {
    var caretOffset = caretPos.anchorOffset;
    var nextSibling = findSiblingToParentRight(caretPos.focusNode as Node);
    var mathFieldElem = findChildMathFieldLeft(nextSibling as Node);
    var nodeLengthToMathField = (caretPos.focusNode?.textContent?.length as number);
    if (!mathMode && ((isMathSpan(nextSibling) || isMathField(mathFieldElem as Node)) && (caretOffset === nodeLengthToMathField))) {
        activateMathField(nextSibling as Node, RIGHT);
    } else if (!mathMode && isMathField(mathFieldElem = (isMathFieldBranch(caretPos?.focusNode)) as Node)) {
        activateMathField(nextSibling as Node, RIGHT);
    } else if (!mathMode && caretOffset === 0 && caretPos.focusNode?.textContent?.length === 1) {
        caretPos.focusNode.textContent = "\u00A0";
        activateMathField(nextSibling as Node, RIGHT);
    }
}

function deleteOutLeft(range: Range, mathFieldNode: Node): void {
    var previousParentElement = findSiblingToParentLeft(mathFieldNode?.parentNode as Node) as Node;
    var previousElement = findFirstChildRight(previousParentElement);
    
    if (previousElement === null) {

    } else {
        var len = (previousElement.textContent?.length as number);
        if (MQ(mathFieldNode).latex() === "") {
            removeMathField(mathFieldNode)
        }
        range.setStart(previousElement, len);
    }
    
}

function deleteOutRight(range: Range, mathFieldNode: Node): void {
    var NextParentElement = findSiblingToParentRight(mathFieldNode?.parentNode as Node) as Node;
    var nextElement = findFirstChildLeft(NextParentElement);
    if (nextElement === null) {

    } else {
        var len = 0;
        if (MQ(mathFieldNode).latex() === "") {
            removeMathField(mathFieldNode)
        }
        range.setStart(nextElement, len);
    }
}

function removeMathField(mathFieldNode: Node): void {
    const mathSpan = mathFieldNode.parentElement;
    const foreFather = mathSpan?.parentElement;
    foreFather?.removeChild(mathSpan as HTMLElement);
}

function activateMathField(sibling: Node, dir: number): void {
    mathMode = true;
    console.log(sibling.nodeName);
    var mathFieldElem = dir === LEFT ? findChildMathFieldRight(sibling) : findChildMathFieldLeft(sibling);
    console.log(mathFieldElem);
    var mathField = MQ(mathFieldElem as HTMLElement);
    console.log(mathField);
    mathField.focus();
    if (dir == LEFT) mathField.moveToRightEnd();
    else mathField.moveToLeftEnd();
}


/**
 * Looks for the first parent (of node n) that has a sibling to the left, and returns that sibling.
 * @param n - The node that we originate from
 * @returns (the first forefather that had a sibling to it's left)'s sibling
*/
function findSiblingToParentLeft(n: Node): Node | null {
    return n.previousSibling === null
    ? (n.parentNode as Element).id === "textarea" 
        ? null
        : findSiblingToParentLeft(n.parentNode as Node)
    : n.previousSibling;
}

function findChildMathFieldRight(n: Node): Node | null {
    if (n === null || n === undefined) {
        return null;
    }
    var index = n.childNodes.length - 1;
    return isMathField(n)
    ? n
    : n.nodeName.startsWith("MATHSPAN")
        ? n.childNodes[mathPlacement]
        // case where sometimes there's an empty textfield placed to the right wich made it crasch
        // : n.childNodes[index].nodeName === "#text" && n.childNodes[index].textContent?.length === 0
        //     ? findChildMathFieldRight(n.childNodes[index - 1])
            : findChildMathFieldRight(n.childNodes[index]);
}

function findChildMathFieldLeft(n: Node): Node | null {
    var index = 0;
    return n === null || n === undefined
    ? null
    : isMathField(n)
        ? n
        : n.nodeName.startsWith("MATHSPAN")
            ? n.childNodes[mathPlacement]
            : findChildMathFieldLeft(n.childNodes[index])
}


/**
 * Looks for the first parent (of node n) that has a sibling to the right, and returns that sibling.
 * @param n - The node that we originate from
 * @returns (the first forefather that has a sibling to it's right)'s sibling
*/
function findSiblingToParentRight(n: Node): null | Node {
    return n.nextSibling === null 
    ? (n.parentNode as Element).id === "textarea"
    ? null
        : findSiblingToParentRight(n.parentNode as Node)
    : n.nextSibling;
}

/**
 * Recursively finds the first node that is a mathField
 * by doing recursive calls on the rightmost branch of the
 * parent node
 * @param n - Node to find mathField child of 
 * @returns mathField if there is one else null
*/
function findFirstChildLeft(n: Node): Node | null {
    var children = n.childNodes;
    var indexOfchild = 0;
    return children.length === 0
    ? n
    : findFirstChildRight(children[indexOfchild] as Node);
}

/**
 * Recursively finds the first node that is a mathField
 * by doing recursive calls on the leftmost branch of the
 * parent node
 * @param n - parent node to find mathField child of 
 * @returns mathField if there is one else null
*/
function findFirstChildRight(n: Node): Node | null {
    var children = n.childNodes;
    var indexOfchild = children.length - 1;
    return children.length === 0
    ? n
    : findFirstChildRight(children[indexOfchild] as Node);
}

/**
 * Checks if a node is a math field
 * @param n - The node that is checked
 * @returns true if n is a math field, false if not
*/
function isMathField(n: Node): boolean {
    if (n === null) {
        return false;
    } else {
        return n.nodeName.startsWith("MATH-FIELD");
    }
}

export function isInsideMathField() {
    var sel = window.getSelection();
    if (sel === null || sel === undefined) {
        mathMode = false;
        return;
    }
    var focusedNode = sel.focusNode;
    var m = getMathSpan(focusedNode as Node);
    if (m?.nodeName.startsWith("MATHSPAN")) {
        mathMode = true;
        MQ(m.childNodes[1]).focus();
    } else {
        mathMode = false;
    }
}