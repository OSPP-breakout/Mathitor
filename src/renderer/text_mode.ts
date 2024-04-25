const textArea = document.getElementById('textarea') as HTMLElement;
const fileName = document.getElementById('filename') as HTMLElement;


export function undo(): void {
	document.execCommand("undo");
}

export function justify_full(): void {
	document.execCommand("justify-full");
}

export function redo(): void {
	document.execCommand("redo");
}

export function add_ordered_list() {
	document.execCommand('insertOrderedList');
}

export function add_unordered_list() {
	document.execCommand('insertUnorderedList');
}

export function font_size(e: any): void {
    let value = e.target.value;
    console.log(value);
    textArea.style.fontSize = value + 'px';
}

export function bold(): void {
    document.execCommand('bold');
	console.log("HI!");
}

export function italic(): void {
    document.execCommand('italic');
}

export function underline(): void {
    document.execCommand('underline');
}

export function align_left(): void {
    document.execCommand('justifyLeft');
}

export function align_center(): void {
    document.execCommand('justifyCenter');
}

export function align_right(): void {
    document.execCommand('justifyRight');
}


export function text_lower_or_upper(): void {
    textArea.style.textTransform = textArea.style.textTransform === 'uppercase' ? 'none' : 'uppercase';
}

export function text_slash(): void {
    document.execCommand('strikeThrough');
}

export function add_link() {
	// TODO: implement function or come up with something better.
	console.log("HI! Implement me please");
}

export function remove_link() {
	// TODO: implement function or come up with something better.
	console.log("HI! Implement me please");
}

export function add_heading(e: any) {
	const heading: string = e.target.value;
}

export function change_color(e: any) {
	document.execCommand("foreColor", false, e.target.value);
}

