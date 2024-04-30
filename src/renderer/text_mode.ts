import { correctAllMathFields } from "./mathMode/math_mode";

export const textArea = document.getElementById('textarea') as HTMLElement;
const fileName = document.getElementById('filename') as HTMLElement;

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
    document.execCommand('bold');
	console.log("HI!");
	correctAllMathFields();
}

export function italic(): void {
    document.execCommand('italic');
	correctAllMathFields();
}

export function underline(): void {
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

