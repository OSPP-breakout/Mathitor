import * as MathMode from "./math_mode"
import {mathMode} from "./math_mode"
const mathPlacement = 1;
export enum Direction {
    Up,
    Down,
    Left = -1,
    Right = 1,
}
declare let MathQuill: any;
const MQ = MathQuill.getInterface(2);

/**
 * Checks which key is pressed and applies the correct function
 * depending on the key pressed
 * @param e Key being pressed
 */
export function handleCursor(e: any) {
    if (!mathMode) {
        var caretPos = window.getSelection() as Selection;
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

/**
 * When at the edge in the assigned direction
 * of a mathfield will move out of it if the assigned key is pressed.
 * If the field is empty and backspace or delete is pressed the field will be removed.
 * @param range Range containing an element to move to
 * @param mathFieldNode The current mathField the caret is inside
 */
export function arrowOutRight(range: Range, mathFieldNode: Node) {
    const nextParentElement = findSiblingToParentRight(mathFieldNode.parentNode as Node) as Node;
    let nextElement: Node;
    if (nextParentElement === null) nextElement = putElementOutside(mathFieldNode, Direction.Right);
    else nextElement = findFirstChildLeft(nextParentElement) as Node;
    range.setStart(nextElement, 0);
    range.setEnd(nextElement, 0);
}

/**
 * When at the edge in the assigned direction
 * of a mathfield will move out of it if the assigned key is pressed.
 * If the field is empty and backspace or delete is pressed the field will be removed.
 * @param range Range containing an element to move to
 * @param mathFieldNode The current mathField the caret is inside
 */
export function arrowOutLeft(range: Range, mathFieldNode: Node) {
    const previousParentElement = findSiblingToParentLeft(mathFieldNode.parentNode as Node) as Node;
    let previousElement: Node;
    if (previousParentElement === null) previousElement = putElementOutside(mathFieldNode, Direction.Left);
    else previousElement = findFirstChildRight(previousParentElement) as Node;
    // Need to declare it as a number otherwise it complains that it might be Undef.
    const len = (previousElement.textContent?.length as number) - 1 >= 0 ? 
                (previousElement.textContent?.length as number) - 1 :
                (previousElement.textContent?.length as number);
    range.setStart(previousElement, len + 1);
    range.setEnd(previousElement, len + 1);
}

function putElementOutside(mathFieldNode: Node, dir: number): Node {
    const newElem = document.createTextNode("");
    if (dir == Direction.Right) mathFieldNode.parentElement?.parentElement?.append(newElem);
    else mathFieldNode.parentElement?.parentElement?.prepend(newElem);
    return newElem;
}

/**
 * When at the edge in the assigned direction
 * of a mathfield will move out of it if the assigned key is pressed.
 * If the field is empty and backspace or delete is pressed the field will be removed.
 * @param range Range containing an element to move to
 * @param mathFieldNode The current mathField the caret is inside
 */
export function deleteOutLeft(range: Range, mathFieldNode: Node): void {
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

/**
 * When at the edge in the assigned direction
 * of a mathfield will move out of it if the assigned key is pressed.
 * If the field is empty and backspace or delete is pressed the field will be removed.
 * @param range Range containing an element to move to
 * @param mathFieldNode The current mathField the caret is inside
 */
export function deleteOutRight(range: Range, mathFieldNode: Node): void {
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

/**
 * Takes an arbitrary node and checks if it's inside a subtree of a mathField
 * Example:
 *        mathField
 *          / \
 *       var   var
 * will give the mathField if called from var
 * @param n a node or HTMLElement to check
 * @returns returns the mathField that is an ancestor in a tree if there is one, else null
 */
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

/**
 * Fetches an ancestor mathSpan if there is one to a node
 * @param n node or HTMLElement if to start from
 * @returns returns the mathSpan that is an ancestor in a tree if there is one, else null
 */
export function getMathSpan(n: Node | HTMLElement | null): HTMLElement | Node | null {
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

/**
 * Returns wheter an element is a mathSpan or not
 * @param n Node or HTMLElement to check
 * @returns returns true if the element is a mathSpan, else false
 */
function isMathSpan(n: Node | HTMLElement | null): boolean {
    return n === null 
    ? false
    : n.nodeName.startsWith("MATHSPAN");
}

/**
 * Checks for mathFields in the assigned direction if there is one. If the caret is
 * at the edge of the node bordering a mathField, it'll move into the field at the next 
 * keypress in that direction. For events where there is no mathFields bordering the node,
 * it does nothing.
 * @param caretPos The current selection containing the caret.
 */
function handleLeftArrow(caretPos: Selection) {
    const caretOffset = caretPos.anchorOffset;
    const prevSibling = findSiblingToParentLeft(caretPos.focusNode as Node);
    let mathFieldElem;
    const nodeLengthToMathField = 1;
    if (!mathMode && ((isMathField(prevSibling as Node) && caretOffset === nodeLengthToMathField)
                     || (isMathSpan(prevSibling) && caretOffset === (nodeLengthToMathField - 1)))) {
        MathMode.activateMathField(prevSibling as Node, Direction.Left);
    } else if (!mathMode && isMathField(mathFieldElem = (isMathFieldBranch(caretPos?.focusNode)) as Node)) {
        MathMode.activateMathField(prevSibling as Node, Direction.Left);
    }
}

/**
 * Checks for mathFields in the assigned direction if there is one. If the caret is
 * at the edge of the node bordering a mathField, it'll move into the field at the next 
 * keypress in that direction. For events where there is no mathFields bordering the node,
 * it does nothing.
 * @param caretPos The current selection containing the caret.
 */
function handleRightArrow(caretPos: Selection) {
    const caretOffset = caretPos.anchorOffset;
    const nextSibling = findSiblingToParentRight(caretPos.focusNode as Node);
    let mathFieldElem = findChildMathFieldLeft(nextSibling as Node);
    const nodeLengthToMathField = (caretPos.focusNode?.textContent?.length as number);
    if (!mathMode && ((isMathSpan(nextSibling) || isMathField(mathFieldElem as Node)) && (caretOffset === nodeLengthToMathField))) {
        MathMode.activateMathField(nextSibling as Node, Direction.Right);
    } else if (!mathMode && isMathField(mathFieldElem = (isMathFieldBranch(caretPos?.focusNode)) as Node)) {
        MathMode.activateMathField(nextSibling as Node, Direction.Right);
    }
}

/**
 * Checks for mathFields in the assigned direction if there is one. If the caret is
 * at the edge of the node bordering a mathField, it'll move into the field at the next 
 * keypress in that direction. For events where there is no mathFields bordering the node,
 * it does nothing.
 * @param caretPos The current selection containing the caret.
 */
function handleBackSpace(caretPos: Selection) {
    const caretOffset = caretPos.anchorOffset;
    const prevSibling = findSiblingToParentLeft(caretPos.focusNode as Node);
    const nodeLengthToMathField = 1;
    if (!mathMode && ((isMathField(prevSibling as Node) && caretOffset === nodeLengthToMathField)
        || (isMathSpan(prevSibling) && caretOffset === (nodeLengthToMathField - 1)))) {
            MathMode.activateMathField(prevSibling as Node, Direction.Left);
    } else if (!mathMode && caretOffset === 1 && caretPos.focusNode?.textContent?.length === 1) {
        console.log("Prev sibling: " + prevSibling?.nodeName)
        caretPos.focusNode.textContent = "\u00A0";  
        MathMode.activateMathField(prevSibling as Node, Direction.Left);
    }
}

/**
 * Checks for mathFields in the assigned direction if there is one. If the caret is
 * at the edge of the node bordering a mathField, it'll move into the field at the next 
 * keypress in that direction. For events where there is no mathFields bordering the node,
 * it does nothing.
 * @param caretPos The current selection containing the caret.
 */
function handleDelete(caretPos: Selection) {
    const caretOffset = caretPos.anchorOffset;
    const nextSibling = findSiblingToParentRight(caretPos.focusNode as Node);
    let mathFieldElem = findChildMathFieldLeft(nextSibling as Node);
    const nodeLengthToMathField = (caretPos.focusNode?.textContent?.length as number);
    if (!mathMode && ((isMathSpan(nextSibling) || isMathField(mathFieldElem as Node)) && (caretOffset === nodeLengthToMathField))) {
        MathMode.activateMathField(nextSibling as Node, Direction.Right);
    } else if (!mathMode && isMathField(mathFieldElem = (isMathFieldBranch(caretPos?.focusNode)) as Node)) {
        MathMode.activateMathField(nextSibling as Node, Direction.Right);
    } else if (!mathMode && caretOffset === 0 && caretPos.focusNode?.textContent?.length === 1) {
        caretPos.focusNode.textContent = "\u00A0";
        MathMode.activateMathField(nextSibling as Node, Direction.Right);
    }
}

/**
 * Takes a mathField as an HTMLElement and removes the mathSpan containing that
 * field from the DOM.
 * @param mathFieldNode The mathField to remove 
 */
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

/**
 * Finds a mathField to the right if there is one by recursively going down the tree
 * at the rightmost branch.
 * @param n node to start checking from
 * @returns mathField if there is one, else null
 */
export function findChildMathFieldRight(n: Node): Node | null {
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

/**
 * Finds a mathField to the left if there is one by recursively going down the tree
 * at the leftmost branch.
 * @param n node to start checking from
 * @returns mathField if there is one, else null
 */
export function findChildMathFieldLeft(n: Node): Node | null {
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
