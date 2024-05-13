import { suggestionTab } from "../autoComplete/autocomplete";
import { textArea } from "../text_mode";

import * as Caret from "./caret";
// Math mode global constants

declare let MathQuill: any;
const MQ = MathQuill.getInterface(2);
export let mathMode = false;

let amountOfMQFields = 0;
let mathFieldArray: Array<any> = [];
const latexSpan = document.getElementById('latex') as HTMLElement;

const suggestionsTab = new suggestionTab();
const closeSuggestions = () => {
    suggestionsTab.close();
}

export function createMathField(): void {
    if (mathMode) return;
    amountOfMQFields++;
    const MQField = document.createElement('math-field' + amountOfMQFields.toString());
    MQField.setAttribute('id', 'math-field' + amountOfMQFields.toString());
    const mathFieldSpan = document.createElement('mathSpan');
    insertMathField(MQField, mathFieldSpan);

    // Link the new MQ-field to the latex-preview
    var mathField = MQ.MathField(MQField, {
        handlers: {
            edit: function () {
                latexSpan.textContent = mathField.latex();
                suggestionsTab.open(mathField);
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
                console.log(window.getSelection()?.getRangeAt(0))
                mathMode = false;
            },
            deleteOutOf: function(dir: number, mathfield: any) {
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
            selectOutOf: function (direction: any, mathfield: any) {
                closeSuggestions();
            }
        }
    });

    //mathField.el().querySelector('textarea').addEventListener('focusout', closeSuggestions);
    const mathSpanObserver = new MutationObserver((a, b) => fixMathSpan);
    mathSpanObserver.observe(mathFieldSpan, {childList: true, subtree: true});
    mathFieldArray.push(MQField);
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

/**
 * Insert `mathField` at the current caret position. 
 */
function insertMathField(mathField: HTMLElement, mathFieldSpan: HTMLElement) {
    const range = (window.getSelection() as Selection).getRangeAt(0);
    let element;
    if((element = getCorrectParentElement(range.startContainer)) === null) {element = range.commonAncestorContainer}
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

export function activateMathField(sibling: Node, dir: number): void {
    mathMode = true;
    const mathFieldElem = dir === Caret.Direction.Left ? Caret.findChildMathFieldRight(sibling) : Caret.findChildMathFieldLeft(sibling);
    const mathField = fixAndGetMathField(mathFieldElem as Node);
    mathField.focus();
    if (dir == Caret.Direction.Left) mathField.moveToRightEnd();
    else mathField.moveToLeftEnd();
}

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
    return;
}