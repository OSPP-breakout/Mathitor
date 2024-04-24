import { textArea } from "./text_mode";

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
                    console.log(nextElement.hasChildNodes());
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

/**
 * Handles some checks when Left Arrow is pressed.
 * @param cursorPos - position of the cursor
 * @param cursorOffset - the offset of the cursor in the current position
 */
function handleLeftArrow(cursorPos: Selection, cursorOffset: number) {
    var prevElem = cursorPos?.focusNode;
    if (prevElem?.previousSibling === null) {
        prevElem = findNeighbourNode(prevElem as Node, -1);
    } else {
        prevElem = prevElem?.previousSibling as Node;
    }
    
    console.log("prev: " + prevElem + " " + isMathField(prevElem as Node));
    
    if (cursorOffset === 0 && isMathField(prevElem as Node)) {
        mathMode = true;
        var math_field = MQ(document.getElementById(prevElem?.nodeName.toLowerCase() as string) as HTMLElement);
        math_field.focus();
        math_field.moveToRightEnd();
    }
}

/**
 * Handles some checks when Right Arrow is pressed.
 * @param cursorPos - position of the cursor
 * @param cursorOffset - the offset of the cursor in the current position
 */
function handleRightArrow(cursorPos: Selection, cursorOffset: number) {
    var nextElement = cursorPos?.focusNode;
    if (nextElement?.nextSibling === null) {
        nextElement = findNeighbourNode(nextElement as Node, 1);
    } else {
        nextElement = nextElement?.nextSibling as Node;
    }
    console.log("prev: " + nextElement + " " + isMathField(nextElement as Node));
    
    if (isMathField(nextElement as Node) && 
        cursorOffset === cursorPos?.focusNode?.textContent?.length) {
        mathMode = true;
        var math_field = MQ(document.getElementById(nextElement?.nodeName.toLowerCase() as string) as HTMLElement);
        math_field.focus();
        math_field.moveToLeftEnd();
    }
}

/**
 * Finds the neighbouring mathnode in a given direction if there is one
 * @param n - node to find neighbouring mathnode node of
 * @param dir - direction to find node of [-1 for left, 1 for right]
 * @returns mathField or null
 */
function findNeighbourNode(n: Node, dir: number): Node | null {
    var parentSibling: Node | null;
    if (dir === 1) {
        parentSibling = findSiblingToParentRight(n)
        if (parentSibling === null) {
            return null;
        } else {
            return isMathField(parentSibling) ? parentSibling : findFirstChildRight(parentSibling); 
        }
    } else {
        parentSibling = findSiblingToParentLeft(n)
        if (parentSibling === null) {
            return null;
        } else {
            return isMathField(parentSibling) ? parentSibling : findFirstChildLeft(parentSibling); 
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
    console.log(n.nextSibling);
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

