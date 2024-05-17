import { suggestionTab } from "../suggestionTab/suggestionTab";
import { textArea } from "../textMode";

import * as Caret from "./caret";
// Math mode global constants

declare let MathQuill: any;
const MQ = MathQuill.getInterface(2);
export let mathMode = false;

let amountOfMQFields = 0;
let mathFieldArray: Array<HTMLElement> = [];
const latexSpan = document.getElementById('latex') as HTMLElement;

const suggestionsTab = new suggestionTab();
const closeSuggestions = () => {
    suggestionsTab.close();
}

const closeMathField = (e: any) => {
    const focusedOn = e.relatedTarget;

    if (focusedOn === null || focusedOn == undefined) {

    } else if (!(focusedOn as HTMLElement).hasAttribute("suggestionValue")) {
        closeSuggestions();
    }
}

const focusSuggestions = () => {
    suggestionsTab.focus();
}

const keydownSuggestions = (e: any) => {
    if (suggestionsTab.hasSuggestions() === true && e.key === "ArrowDown") {
        suggestionsTab.focus();
    }
}

const keyupSuggestions = (e: any) => {
    function isArrowMovement(key: string): boolean {
        return key === "ArrowLeft" || key === "ArrowRight" ||
            key === "ArrowDown" || key === "ArrowUp"
    }

    if (isArrowMovement(e.key)) {
        suggestionsTab.update();
    }
}

window.addEventListener('mousedown', closeSuggestions);

/**
 * Creates a mathField with a preset config at the current caret position
 */
export function createMathField(): void {
    if (mathMode) return;
    amountOfMQFields++;
    const MQField = document.createElement('math-field' + amountOfMQFields.toString());
    MQField.setAttribute('id', 'math-field' + amountOfMQFields.toString());
    const mathFieldSpan = document.createElement('mathSpan');
    insertMathField(MQField, mathFieldSpan);

    // Link the new MQ-field to the latex-preview
    var mathField = setupMathField(MQField);

    // mathField.el().addEventListener('mousedown', clickSuggestions);
    const mathSpanObserver = new MutationObserver((a, b) => fixMathSpan);
    mathSpanObserver.observe(mathFieldSpan, { childList: true, subtree: true });
    mathFieldArray.push(MQField);
    window.getSelection()?.removeAllRanges();
    mathField.focus();
}

function setupMathField(MQField: HTMLElement) {

    var mathField = MQ.MathField(MQField, {
        handlers: {
            edit: (mathfield: any) => {
                latexSpan.textContent = mathfield.latex();
                suggestionsTab.open(mathfield);
            },
            moveOutOf: function (direction: any, mathfield: any) {
                closeSuggestions();
                mathfield.blur();

                let range = document.createRange();
                const caretPosition = document.getSelection();
                const mathFieldNode = mathfield.el() as Node;
                if (direction === 1) {
                    Caret.arrowOutRight(range, mathFieldNode);
                } else {
                    Caret.arrowOutLeft(range, mathFieldNode);
                }
                caretPosition?.removeAllRanges();
                caretPosition?.addRange(range);
                mathMode = false;
            },
            downOutOf: () => {
                focusSuggestions();
            },
            deleteOutOf: (dir: number, mathfield: any) => {
                mathMode = false;
                mathfield.blur();
                let range = document.createRange();
                const caretPos = document.getSelection();
                const mathFieldNode = mathfield.el() as Node;
                if (dir === Caret.Direction.Left) {
                    Caret.deleteOutLeft(range, mathFieldNode);
                } else {
                    Caret.deleteOutRight(range, mathFieldNode);
                }
                caretPos?.removeAllRanges();
                caretPos?.addRange(range);
            },
            selectOutOf: (direction: number, mathField: any) => {
                console.log("OUT!");
                mathField.blur();
                closeSuggestions();
            }
        }
    });

    mathField.el().querySelector('textarea').addEventListener('focusout', closeMathField);
    mathField.el().addEventListener('keyup', keyupSuggestions);
    mathField.el().addEventListener('keydown', keydownSuggestions);

    return mathField;
}

/**
 * Goes up the tree recursively until it finds the textArea
 * @param e Node to start checking from
 * @returns the node just below the textArea, else null
 */
function getCorrectParentElement(e: any): any {
    return e === null
        ? null
        : e.parentNode === textArea
            ? e
            : getCorrectParentElement(e.parentNode);
}

/**
 * Insert `mathField` at the current caret position. 
 */
function insertMathField(mathField: HTMLElement, mathFieldSpan: HTMLElement) {
    const range = (window.getSelection() as Selection).getRangeAt(0);
    let element;
    if ((element = getCorrectParentElement(range.startContainer)) === null) { element = range.commonAncestorContainer }
    if (element.id === 'textarea' || (element.parentNode as Element).id === 'textarea') {
        range.insertNode(mathFieldSpan);
        let span;
        mathFieldSpan.appendChild(span = document.createElement("span"));
        span.textContent = "\u00A0";
        span.style.userSelect = "none";
        span.contentEditable = "false";
        mathFieldSpan.appendChild(mathField);
        mathFieldSpan.appendChild(span = document.createElement("span"));
        span.textContent = "\u00A0";
        span.style.userSelect = "none";
        span.contentEditable = "false";
    }
}

/**
 * activates a MathField when moving into it with a caret from a given direction
 * by first finding it inside a sibling node, then activating it.
 * @param sibling Sibling to find mathField inside
 * @param dir LEFT or RIGHT (-1, 1)
 */
export function activateMathField(sibling: Node, dir: number): void {
    mathMode = true;
    const mathFieldElem = dir === Caret.Direction.Left ? Caret.findChildMathFieldRight(sibling) : Caret.findChildMathFieldLeft(sibling);
    const mathField = fixAndGetMathField(mathFieldElem as Node);
    mathField.focus();
    if (dir == Caret.Direction.Left) mathField.moveToRightEnd();
    else mathField.moveToLeftEnd();
}

/**
 * Tries to initialize a mathfield. If the initilization fails it
 * restores the mathfield to a structure that'll be initialized.
 * 
 * 
*  @example if the field looks like this
 *        mathSpan
 *     /    |       \
 *   span mathfield span
 *           |
 *          Bold
 *          / \
 *  textarea   writtenMath
 * 
 * it will become:
 *        mathSpan
 *     /    |       \
 *   span mathfield span
 *          / \
 *  textarea   writtenMath
 * 
 * @param mathFieldElem mathField to activate
 * @returns 
 */
function fixAndGetMathField(mathFieldElem: Node): any {
    if (MQ(mathFieldElem as HTMLElement) === null) {
        let childNode = mathFieldElem.childNodes[0];
        while (!(childNode.childNodes[0].nodeName.startsWith("SPAN"))) {
            childNode = childNode.childNodes[0];
        }
        const leftChild = childNode.childNodes[0];
        const rightChild = childNode.childNodes[1];
        mathFieldElem.removeChild(mathFieldElem.childNodes[0]);
        mathFieldElem.appendChild(leftChild);
        mathFieldElem.appendChild(rightChild);
    }
    return MQ(mathFieldElem);
}

/**
 * Loops over all mathFields and checks if they still work by trying to initialize them
 * if the initialization fails it removes all formatting applied to the field, and moves
 * the children to the correct position
 * 
 * @example
 *        mathSpan
 *     /    |       \
 *   span mathfield span
 *           |
 *          Bold
 *          / \
 *  textarea   writtenMath
 * 
 * will become:
 *        mathSpan
 *     /    |       \
 *   span mathfield span
 *          / \
 *  textarea   writtenMath
 * 
 */
export function correctAllMathFields() {
    mathFieldArray.forEach(mathFieldElem => {
        if (MQ(mathFieldElem as HTMLElement) === null) {
            let childNode = mathFieldElem.childNodes[0];
            while (!(childNode.childNodes[0].nodeName.startsWith("SPAN"))) {
                childNode = childNode.childNodes[0];
            }
            const leftChild = childNode.childNodes[0];
            const rightChild = childNode.childNodes[1];
            mathFieldElem.removeChild(mathFieldElem.childNodes[0]);
            mathFieldElem.appendChild(leftChild);
            mathFieldElem.appendChild(rightChild);
        }
    });
}

/**
 * Checks if the caret is inside a mathSpan by going up the tree
 * and activating the MathField inside it, if the caret is inside a
 * mathSpan. 
 */
export function isInsideMathField() {
    const sel = window.getSelection();
    if (sel === null || sel === undefined) {
        mathMode = false;
        return;
    }
    const focusedNode = sel.focusNode;
    const m = Caret.getMathSpan(focusedNode as Node);
    if (m?.nodeName.startsWith("MATHSPAN")) {
        mathMode = true;
        MQ(m.childNodes[1]).focus();
    } else {
        mathMode = false;
    }
}

/**
 * Function called whenever a cahnge occurs in a mathspan
 * if ever a mutation occurs that removes a span to the left or
 * right of a mathfield it is restored
 * @param record record of the occured mutations
 * @param observer the observer that is currently looking at the field
 */
function fixMathSpan(record: MutationRecord, observer: any) {
    const removedNodes = record.removedNodes;
    removedNodes.forEach(element => {
        if (element.nodeName.startsWith("SPAN")) {
            const span = document.createElement("span");
            span.textContent = "\u00A0";
            span.style.userSelect = "none";
            span.contentEditable = "false";
            if (element.previousSibling === null) {
                element.parentElement?.prepend(span)
            } else {
                element.parentElement?.appendChild(span);
            }
        }
    });
}

/**
 * When called will translate all mathfields into latexspans
 * with the latex currently written inside the mathfield
 */
export function translateMathFieldsForSave() {
    const mathSpans = textArea.children;
    const length = mathSpans.length;
    for (let i = 0; i < length; i++) {
        //hantera om det är flera rader
        if (mathSpans[i].tagName === "DIV") {
            const innerMathSpans = mathSpans[i].children;
            const innerLength = innerMathSpans.length;

            for (let j = 0; j < innerLength; j++) {
                const latexSpan = document.createElement('latexspan');
                latexSpan.textContent = MQ(innerMathSpans[j].children[1]).latex();
                textArea.children[i].insertBefore(latexSpan, innerMathSpans[j]);
                innerMathSpans[j + 1].remove();
            }
        } else {
            const latexSpan = document.createElement('latexspan');
            latexSpan.textContent = MQ(mathSpans[i].children[1]).latex();
            textArea.insertBefore(latexSpan, mathSpans[i]);
            mathSpans[i + 1].remove();
        }
    }
}

/**
 * When called will replace all <latexspans> with mathfields with the
 * contents of the <latexspan>
 */
export function translateMathFieldsAfterLoad() {
    amountOfMQFields = 0;
    const latexSpans = document.querySelectorAll("latexspan") as NodeList;
    const length = latexSpans.length;

    for (let i = 0; i < length; i++) {
        let curLatexNode = latexSpans[i];
        let curParent = curLatexNode.parentNode as ParentNode;

        //set caret position before latexspan, since createMathField() inserts field at caretposition
        let range = document.createRange();
        let sel = window.getSelection();

        var index = Array.from(curParent.childNodes).indexOf(curLatexNode as ChildNode);

        range.setStart(curParent, index);
        sel?.removeAllRanges();
        sel?.addRange(range);

        createMathField();

        const mathSpans = document.querySelectorAll("mathspan") as NodeList;
        let curMathSpan = mathSpans[i];

        MQ(curMathSpan.childNodes[1]).write(curLatexNode.textContent);

        curParent.removeChild(curLatexNode);
    }
}

export function handlePasteEvent(event: any): void {
    if (event.inputType === "insertFromPaste") {
        handleDuplicates();
    }
}

function handleDuplicates() {

    // console.log("Running handle duplicates");
    let mathSpans = document.querySelectorAll("mathspan") as NodeList;
    let length = mathSpans.length;
    // console.log("Amount of mathspans: " + length)

    for (let i = 0; i < length; i++) {
        // Handle not initiated mathfields
        let curMathField = mathSpans[i].childNodes[1];
        if (MQ(curMathField) === null) {
            // console.log("Found uninitiated mathfield");
            let curName = curMathField.nodeName

            let length2 = mathFieldArray.length;
            // console.log("Length of mathFieldArray: " + length2);

            for (let j = 0; j < length2; j++) {
                // console.log("Matching " + curName + " with " + mathFieldArray[j].nodeName);
                if (curName === mathFieldArray[j].nodeName) {
                    // console.log("Found name match");

                    amountOfMQFields++;
                    let newMathField = document.createElement('math-field' + amountOfMQFields.toString());
                    newMathField.setAttribute('id', 'math-field' + amountOfMQFields.toString());

                    let oldContent = MQ(mathFieldArray[j]).latex();

                    curMathField.parentNode?.replaceChild(newMathField, curMathField);
                    let unused = setupMathField(newMathField);

                    MQ(newMathField).write(oldContent);
                    mathFieldArray.push(newMathField);

                    // console.log("New nodeName: " + newMathField.nodeName);
                }
            }
        }
        // console.log(curMathField + " is already initialized")
    }



}
