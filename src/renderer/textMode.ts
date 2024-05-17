export const textArea = document.getElementById('textarea') as HTMLElement;
import { correctAllMathFields } from "./mathMode/mathMode";
const fileName = document.getElementById('filename') as HTMLElement;

let activeBold = false;
const btn_bold = document.getElementById("btn-bold") as HTMLElement;

let activeItalic = false;
const btn_ital = document.getElementById("btn-italic") as HTMLElement;

let activeUnder = false;
const btn_under = document.getElementById("btn-underline") as HTMLElement;

const buttonArray: Array<HTMLElement> = [btn_ital, btn_bold, btn_under];
const buttonMap: Map<any, any> = new Map();
buttonMap.set(btn_bold, activeBold);
buttonMap.set(btn_ital, activeItalic);
buttonMap.set(btn_under, activeUnder);

export function undo(): void {
	document.execCommand("undo");
	correctAllMathFields();
}

export function justify_full(): void {
	document.execCommand("justify-full");
	correctAllMathFields();
}

export function redo(): void {
	document.execCommand("redo");
	correctAllMathFields();
}

export function add_ordered_list() {
	document.execCommand('insertOrderedList');
	correctAllMathFields();
}

export function add_unordered_list() {
	document.execCommand('insertUnorderedList');
	correctAllMathFields();
}

export function font_size(e: any): void {
    let value = e.target.value;
    console.log(value);
    textArea.style.fontSize = value + 'px';
	correctAllMathFields();
}

export function bold(): void {
	activeBold = !activeBold;
	applyChangeButton(btn_bold, activeBold);
    document.execCommand('bold');
	correctAllMathFields();
}

export function italic(): void {
	activeItalic = !activeItalic;
	applyChangeButton(btn_ital, activeItalic);
    document.execCommand('italic');
	correctAllMathFields();
}

export function underline(): void {
	activeUnder = !activeUnder;
	applyChangeButton(btn_under, activeUnder);
    document.execCommand('underline');
	correctAllMathFields();
}

export function align_left(): void {
    document.execCommand('justifyLeft');
	correctAllMathFields();
}

export function align_center(): void {
    document.execCommand('justifyCenter');
	correctAllMathFields();
}

export function align_right(): void {
    document.execCommand('justifyRight');
	correctAllMathFields();
}


export function text_lower_or_upper(): void {
    textArea.style.textTransform = textArea.style.textTransform === 'uppercase' ? 'none' : 'uppercase';
	correctAllMathFields();
}

export function text_slash(): void {
    document.execCommand('strikeThrough');
	correctAllMathFields();
}

export function add_link() {
	// TODO: implement function or come up with something better.
	console.log("HI! Implement me please");
	correctAllMathFields();
}

export function remove_link() {
	// TODO: implement function or come up with something better.
	console.log("HI! Implement me please");
	correctAllMathFields();
}

export function add_heading(e: any) {
	const heading: string = e.target.value;
	correctAllMathFields();
}

export function change_color(e: any) {
	document.execCommand("foreColor", false, e.target.value);
	correctAllMathFields();
}

/**
 * Changes the look of a button depending on if the boolean is true or false
 * @param button HTMLElement corresponding to a button
 * @param boolean true or false
 */
function applyChangeButton(button: HTMLElement, boolean: Boolean) {
	if (boolean) {
		button.style.border = "1px solid black";
	} else {
		button.style.border = "";
	}
}

/**
 * Moves up the tree and storing all the formatting it steps over in an array, 
 * and finally changing the buttons when it reaches the textArea element if the button 
 * is inside the array.
 * @param parentElem the parent node to the node the caret is currently at.
 * @param formattingArray an array to store all the HTMLElements corresponding to the formatting buttons
 * @returns the parent to parentElem if the current node being checked is not textArea, else void 
 */
function applyFormatting(parentElem: HTMLElement, formattingArray: Array<any>): HTMLElement | void {
	if (parentElem === textArea) {
		buttonArray.forEach(element => {
			let activeButton = buttonMap.get(element);
			if (formattingArray.includes(element)) {
				applyChangeButton(element,  activeButton = true);
			} else {
				applyChangeButton(element,  activeButton = false);
			}
		});
		return;
	} else if (parentElem.nodeName === "B") {
		formattingArray.push(btn_bold);
	} else if (parentElem.nodeName === "I") {
		formattingArray.push(btn_ital);
	} else if (parentElem.nodeName === "U") {
		formattingArray.push(btn_under);
	}

	return applyFormatting(parentElem.parentElement as HTMLElement, formattingArray);
}

/**
 * Changes the buttons' depending on the formatting being applied at the current position
 */
export function findAndApplyCurrentFormatting() {
	applyFormatting(window.getSelection()?.anchorNode?.parentElement as HTMLElement, []);
}