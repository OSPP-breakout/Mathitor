import { textArea, underline } from "./text_mode";

// Math mode global constants
let mathMode = false;

declare var MathQuill: any;
const MQ = MathQuill.getInterface(2);
let amountOfMQFields = 0;

const latexSpan = document.getElementById('latex') as HTMLElement;

// Math mode functions

export function create_MQ_field(): void {

    if (mathMode) {
        return;
    }

    amountOfMQFields++;
    var newMQField = document.createElement('math-field' + amountOfMQFields.toString());
    newMQField.setAttribute('id', 'math-field' + amountOfMQFields.toString());

    //Insert the new field at caret position
    var range = (window.getSelection() as Selection).getRangeAt(0);
    var elem = getCorrectParentElement(range.startContainer);
    if ((elem.parentNode as Element).id === 'textarea') {
        // range.insert
        document.dispatchEvent(new KeyboardEvent('keydown', {'key': 'g'}));
        document.dispatchEvent(new KeyboardEvent('keydown', {'key': ' '}));
        document.dispatchEvent(new KeyboardEvent('keydown', {'key': 'g'}));
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
                var mathFieldNode = mathfield.el() as Node;
                if (direction === 1) {
                    var nextElement = findSiblingToParentRight(mathFieldNode) as Node;
                    if (nextElement === null) return;
                    range.setStart(nextElement, 0);
                } else {
                    var previousElement = findSiblingToParentLeft(mathFieldNode) as Node;
                    console.log("Previous element: ", previousElement);
                    if (previousElement === null) return;
                    // Need to declare it as a number otherwise it complains that it might be Undef.
                    range.setStart(previousElement, (previousElement.textContent?.length as number));
                }
                sel?.removeAllRanges();
                sel?.addRange(range);
            },
        },
    });
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
        var cursorPos = window.getSelection() as Selection;
        //var cursorOffset = cursorPos?.anchorOffset as number;
        //console.log("offset: " + cursorOffset + " FocusNode: " + cursorPos.focusNode?.nodeName);
        switch (e.key) {
            case 'ArrowLeft':
                handleRightLeftArrow(cursorPos, -1);
                break;
            case 'ArrowRight':
                handleRightLeftArrow(cursorPos, 1);
                break;
            case 'ArrowUp':
                break;
            case 'ArrowDown':
                console.log(cursorPos.focusNode?.nodeName);
                break;
            default:
                return;
        }
    }
}

function isMathFieldBranch(n: Node | HTMLElement | null): HTMLElement | Node | null {
    console.log("");
    console.log("Math-Field branch NODENAME: " + n?.nodeName);
    console.log("Math-Field branch nodeParent: " + n?.parentNode?.nodeName + " " + (n?.parentNode as Element).id);
    return n === null
    ? n 
    : isMathField(n)
        ? n
        : (n.parentNode as Element).id ===  "textarea"
            ? null
            : isMathFieldBranch((n.parentNode as Node));
}

 
/**
 * Handles some checks when right/left Arrow is pressed.
 * @param cursorPos - position of the cursor
 * @param dir - direction moved in -1 for left and 1 for right
 */
function handleRightLeftArrow(cursorPos: Selection, dir: number) {
    var mathFieldelem = isMathFieldBranch(cursorPos?.focusNode);
    console.log(mathFieldelem + " " + "Cursor offset: " + cursorPos.anchorOffset);
    if (mathFieldelem?.nodeName.startsWith("MATH-FIELD") && !mathMode) { 
        mathMode = true;
        var math_field = MQ(mathFieldelem);
        math_field.focus();
        if (dir === 1) {
            math_field.moveToLeftEnd();
        } else {
            math_field.moveToRightEnd();
        }
    }
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
    var indexOfLastChild = children.length - 1;
    return children.length === 0
    ? null
    : isMathField(n.childNodes[indexOfLastChild])
    ? children[indexOfLastChild]
    : findFirstChildLeft(n.childNodes[indexOfLastChild]);
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
    return children.length === 0
    ? null
    : isMathField(n.childNodes[0])
    ? children[0]
    : findFirstChildRight(n.childNodes[0]);
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