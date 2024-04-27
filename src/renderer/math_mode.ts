import { textArea, underline } from "./text_mode";

// Math mode global constants
let mathMode = false;

declare var MathQuill: any;
const MQ = MathQuill.getInterface(2);
let amountOfMQFields = 0;
let mathPlacement = 1;

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
        span.textContent = " ";
        span.style.userSelect = "none";
        newSpan.appendChild(newMQField);
        newSpan.appendChild(span = document.createElement("span"));
        span.style.marginRight = "5px";
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
                var mathFieldNode = mathfield.el() as Node;
                if (direction === 1) {
                    var nextParentElement = findSiblingToParentRight(mathFieldNode.parentNode as Node) as Node;
                    var nextElement = findFirstChildLeft(nextParentElement);
                    if (nextElement === null) return;
                    var len = nextElement.textContent?.length === 0 ? 0 : 1;
                    range.setStart(nextElement, 0);
                } else {
                    var previousParentElement = findSiblingToParentLeft(mathFieldNode.parentNode as Node) as Node;
                    var previousElement = findFirstChildRight(previousParentElement);
                    if (previousElement === null) return;
                    // Need to declare it as a number otherwise it complains that it might be Undef.
                    var len = (previousElement.textContent?.length as number) - 1 >= 0 ? 
                             (previousElement.textContent?.length as number) - 1 :
                             (previousElement.textContent?.length as number);
                    range.setStart(previousElement, len + 1);
                }
                sel?.removeAllRanges();
                sel?.addRange(range);
            },
            deleteOutOf: function(dir: number, mathfield: any) {
                mathMode = false;
                mathfield.blur();
                var range = document.createRange();
                var caretPos = document.getSelection();
                var mathFieldNode = mathfield.el() as Node;
                if (dir === -1) {
                    deleteOutLeft(range, mathFieldNode);
                } else {
                    deleteOutRight(range, mathFieldNode);
                }
                caretPos?.removeAllRanges();
                caretPos?.addRange(range);
            },
        },
    });
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
    console.log("Previous element: " + prevSibling?.nodeName + " Caret Pos: " + caretOffset + " Caret at: " + caretPos.focusNode?.textContent);
    if (!mathMode && ((isMathField(prevSibling as Node) && caretOffset === nodeLengthToMathField)
                     || (isMathSpan(prevSibling) && caretOffset === (nodeLengthToMathField - 1)))) {
        mathMode = true;
        var mathField = MQ(mathFieldElem);
        mathField.focus();
        mathField.moveToRightEnd();
    } else if (!mathMode && isMathField(mathFieldElem = (isMathFieldBranch(caretPos?.focusNode)) as Node))
    {
        mathMode = true;
        var mathField = MQ(mathFieldElem);
        mathField.focus();
        mathField.moveToRightEnd();
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
        mathMode = true;
        var math_field = MQ(mathFieldElem);
        math_field.focus();
        math_field.moveToLeftEnd();
    } else if (!mathMode && isMathField(mathFieldElem = (isMathFieldBranch(caretPos?.focusNode)) as Node))
    {
        mathMode = true;
        var math_field = MQ(mathFieldElem);
        math_field.focus();
        math_field.moveToLeftEnd();
    }
}

function handleBackSpace(caretPos: Selection) {
    var caretOffset = caretPos.anchorOffset;
    var prevSibling = findSiblingToParentLeft(caretPos.focusNode as Node);
    var mathFieldElem = findChildMathFieldRight(prevSibling as Node);
    var nodeLengthToMathField = 1;
    console.log("Previous element: " + prevSibling?.nodeName + " Caret Pos: " + caretOffset);
    if (!mathMode && ((isMathField(prevSibling as Node) && caretOffset === nodeLengthToMathField)
        || (isMathSpan(prevSibling) && caretOffset === (nodeLengthToMathField - 1)))) {
        mathMode = true;
        var mathField = MQ(mathFieldElem);
        mathField.focus();
        mathField.moveToRightEnd();
    } else if (!mathMode && isMathField(mathFieldElem = (isMathFieldBranch(caretPos?.focusNode)) as Node)) {
        mathMode = true;
        var mathField = MQ(mathFieldElem);
        mathField.focus();
        mathField.moveToRightEnd();
    }
}

function handleDelete(caretPos: Selection) {
    var caretOffset = caretPos.anchorOffset;
    var nextSibling = findSiblingToParentRight(caretPos.focusNode as Node);
    var mathFieldElem = findChildMathFieldLeft(nextSibling as Node);
    var nodeLengthToMathField = (caretPos.focusNode?.textContent?.length as number);
    // console.log("Next element: " + nextSibling?.nodeName + " Caret Pos: " + caretOffset + " Caret at: " + caretPos.focusNode?.textContent);
    if (!mathMode && ((isMathSpan(nextSibling) || isMathField(mathFieldElem as Node)) && (caretOffset === nodeLengthToMathField))) {
        mathMode = true;
        var math_field = MQ(mathFieldElem);
        math_field.focus();
        math_field.moveToLeftEnd();
    } else if (!mathMode && isMathField(mathFieldElem = (isMathFieldBranch(caretPos?.focusNode)) as Node))
    {
        mathMode = true;
        var math_field = MQ(mathFieldElem);
        math_field.focus();
        math_field.moveToLeftEnd();
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

// /**
//  * Finds the neighbouring mathnode in a given direction if there is one
//  * @param n - node to find neighbouring mathnode node of
//  * @param dir - direction to find node of [-1 for left, 1 for right]
//  * @returns mathField or null
//  */
// function findNeighbourNode(n: Node, dir: number): Node | null {
//     var parentSibling: Node | null;
//     if (dir === 1) {
//         parentSibling = findSiblingToParentRight(n)
//         if (parentSibling === null) {
//             return null;
//         } else {
//             return isMathField(parentSibling) ? parentSibling : findFirstChildRight(parentSibling); 
//         }
//     } else {
//         parentSibling = findSiblingToParentLeft(n)
//         if (parentSibling === null) {
//             return null;
//         } else {
//             return isMathField(parentSibling) ? parentSibling : findFirstChildLeft(parentSibling); 
//         }
//     }
// }