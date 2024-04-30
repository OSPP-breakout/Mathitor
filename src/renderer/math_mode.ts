import { textArea, underline } from "./text_mode";

// Math mode global constants
let mathMode = false;

declare let MathQuill: any;
const MQ = MathQuill.getInterface(2);
let amountOfMQFields = 0;
let mathPlacement = 1;

enum Direction {
    Up,
    Down,
    Left = -1,
    Right = 1,
}
const latexSpan = document.getElementById('latex') as HTMLElement;

// Math mode functions

export function create_MQ_field(): void {

    if (mathMode) {
        return;
    }

    const newSpan = document.createElement('mathSpan');

    amountOfMQFields++;
    const newMQField = document.createElement('math-field' + amountOfMQFields.toString());
    newMQField.setAttribute('id', 'math-field' + amountOfMQFields.toString());

    //Insert the new field at caret position
    const range = (window.getSelection() as Selection).getRangeAt(0);
    let elem;
    if((elem = getCorrectParentElement(range.startContainer)) === null) {elem = range.commonAncestorContainer}
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
            },
            moveOutOf: function (direction: any, mathfield: any) {
                mathfield.blur();
                let range = document.createRange();
                const caretPos = document.getSelection();
                const mathFieldNode = mathfield.el() as Node;
                if (direction === 1) {
                    arrowOutRight(range, mathFieldNode);
                } else {
                    arrowOutLeft(range, mathFieldNode);
                }
                caretPos?.removeAllRanges();
                caretPos?.addRange(range);
                console.log(window.getSelection()?.getRangeAt(0))
                mathMode = false;
            },
            deleteOutOf: function(dir: number, mathfield: any) {
                mathMode = false;
                mathfield.blur();
                let range = document.createRange();
                const caretPos = document.getSelection();
                const mathFieldNode = mathfield.el() as Node;
                if (dir === Direction.Left) {
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
    const caretOffset = caretPos.anchorOffset;
    const prevSibling = findSiblingToParentLeft(caretPos.focusNode as Node);
    let mathFieldElem;
    const nodeLengthToMathField = 1;
    if (!mathMode && ((isMathField(prevSibling as Node) && caretOffset === nodeLengthToMathField)
                     || (isMathSpan(prevSibling) && caretOffset === (nodeLengthToMathField - 1)))) {
        activateMathField(prevSibling as Node, Direction.Left);
    } else if (!mathMode && isMathField(mathFieldElem = (isMathFieldBranch(caretPos?.focusNode)) as Node)) {
        activateMathField(prevSibling as Node, Direction.Left);
    }
}

function handleRightArrow(caretPos: Selection) {
    const caretOffset = caretPos.anchorOffset;
    const nextSibling = findSiblingToParentRight(caretPos.focusNode as Node);
    let mathFieldElem = findChildMathFieldLeft(nextSibling as Node);
    const nodeLengthToMathField = (caretPos.focusNode?.textContent?.length as number);
    console.log("Next element: " + nextSibling?.nodeName + " Caret Pos: " + caretOffset + " Caret at: " + caretPos.focusNode?.textContent);
    console.log("Next child elem: " + mathFieldElem?.nodeName);
    console.log("");
    if (!mathMode && ((isMathSpan(nextSibling) || isMathField(mathFieldElem as Node)) && (caretOffset === nodeLengthToMathField))) {
        activateMathField(nextSibling as Node, Direction.Right);
    } else if (!mathMode && isMathField(mathFieldElem = (isMathFieldBranch(caretPos?.focusNode)) as Node)) {
        activateMathField(nextSibling as Node, Direction.Right);
    }
}

function handleBackSpace(caretPos: Selection) {
    const caretOffset = caretPos.anchorOffset;
    const prevSibling = findSiblingToParentLeft(caretPos.focusNode as Node);
    const nodeLengthToMathField = 1;
    if (!mathMode && ((isMathField(prevSibling as Node) && caretOffset === nodeLengthToMathField)
        || (isMathSpan(prevSibling) && caretOffset === (nodeLengthToMathField - 1)))) {
        activateMathField(prevSibling as Node, Direction.Left);
    } else if (!mathMode && caretOffset === 1 && caretPos.focusNode?.textContent?.length === 1) {
        console.log("Prev sibling: " + prevSibling?.nodeName)
        caretPos.focusNode.textContent = "\u00A0";  
        activateMathField(prevSibling as Node, Direction.Left);
    }
}

function handleDelete(caretPos: Selection) {
    const caretOffset = caretPos.anchorOffset;
    const nextSibling = findSiblingToParentRight(caretPos.focusNode as Node);
    let mathFieldElem = findChildMathFieldLeft(nextSibling as Node);
    const nodeLengthToMathField = (caretPos.focusNode?.textContent?.length as number);
    if (!mathMode && ((isMathSpan(nextSibling) || isMathField(mathFieldElem as Node)) && (caretOffset === nodeLengthToMathField))) {
        activateMathField(nextSibling as Node, Direction.Right);
    } else if (!mathMode && isMathField(mathFieldElem = (isMathFieldBranch(caretPos?.focusNode)) as Node)) {
        activateMathField(nextSibling as Node, Direction.Right);
    } else if (!mathMode && caretOffset === 0 && caretPos.focusNode?.textContent?.length === 1) {
        caretPos.focusNode.textContent = "\u00A0";
        activateMathField(nextSibling as Node, Direction.Right);
    }
}

function deleteOutLeft(range: Range, mathFieldNode: Node): void {
    const previousParentElement = findSiblingToParentLeft(mathFieldNode?.parentNode as Node) as Node;
    const previousElement = findFirstChildRight(previousParentElement);
    
    if (previousElement === null) {

    } else {
        const len = (previousElement.textContent?.length as number);
        if (MQ(mathFieldNode).latex() === "") {
            removeMathField(mathFieldNode)
        }
        range.setStart(previousElement, len);
    }
    
}

function deleteOutRight(range: Range, mathFieldNode: Node): void {
    const NextParentElement = findSiblingToParentRight(mathFieldNode?.parentNode as Node) as Node;
    const nextElement = findFirstChildLeft(NextParentElement);
    if (nextElement === null) {

    } else {
        const len = 0;
        if (MQ(mathFieldNode).latex() === "") {
            removeMathField(mathFieldNode)
        }
        range.setStart(nextElement, len);
    }
}

function arrowOutRight(range: Range, mathFieldNode: Node) {
    const nextParentElement = findSiblingToParentRight(mathFieldNode.parentNode as Node) as Node;
    const nextElement = findFirstChildLeft(nextParentElement);
    if (nextElement === null) return;
    range.setStart(nextElement, 0);
    range.setEnd(nextElement, 0);
}

function arrowOutLeft(range: Range, mathFieldNode: Node) {
    const previousParentElement = findSiblingToParentLeft(mathFieldNode.parentNode as Node) as Node;
    const previousElement = findFirstChildRight(previousParentElement);
    if (previousElement === null) return;
    // Need to declare it as a number otherwise it complains that it might be Undef.
    const len = (previousElement.textContent?.length as number) - 1 >= 0 ? 
                (previousElement.textContent?.length as number) - 1 :
                (previousElement.textContent?.length as number);
    range.setStart(previousElement, len + 1);
    range.setEnd(previousElement, len + 1);
}

function removeMathField(mathFieldNode: Node): void {
    const mathSpan = mathFieldNode.parentElement;
    const foreFather = mathSpan?.parentElement;
    foreFather?.removeChild(mathSpan as HTMLElement);
}

function activateMathField(sibling: Node, dir: number): void {
    function fixAndGetMathField(mathFieldElem: Node): any {
        if (MQ(mathFieldElem as HTMLElement) === null) {
            let childNode = mathFieldElem.childNodes[0];
            while (!(childNode.childNodes[0].nodeName.startsWith("SPAN"))) {
                childNode = childNode.childNodes[0];
                console.log(childNode.nodeName.startsWith("SPAN"));
                console.log(childNode.nodeName);
            }
            const leftChild = childNode.childNodes[0];
            const rightChild = childNode.childNodes[1];
            mathFieldElem.removeChild(mathFieldElem.childNodes[0]);
            mathFieldElem.appendChild(leftChild);
            mathFieldElem.appendChild(rightChild);
        }
        return MQ(mathFieldElem);
    }
    
    mathMode = true;
    const mathFieldElem = dir === Direction.Left ? findChildMathFieldRight(sibling) : findChildMathFieldLeft(sibling);
    const mathField = fixAndGetMathField(mathFieldElem as Node);
    mathField.focus();
    if (dir == Direction.Left) mathField.moveToRightEnd();
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
    const index = n.childNodes.length - 1;
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
    const index = 0;
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
    const children = n.childNodes;
    const indexOfchild = 0;
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
    const children = n.childNodes;
    const indexOfchild = children.length - 1;
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
    const sel = window.getSelection();
    if (sel === null || sel === undefined) {
        mathMode = false;
        return;
    }
    const focusedNode = sel.focusNode;
    const m = getMathSpan(focusedNode as Node);
    if (m?.nodeName.startsWith("MATHSPAN")) {
        mathMode = true;
        MQ(m.childNodes[1]).focus();
    } else {
        mathMode = false;
    }
}