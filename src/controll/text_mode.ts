const textarea = document.getElementById('textarea') as HTMLElement

export function font_size(e: any): void {
    let value = e.target.value
    console.log(value)
    textarea.style.fontSize = value + 'px'
}

export function bold(): void {
    textarea.style.fontWeight = textarea.style.fontWeight === 'bold' ? 'normal' : 'bold'
}

export function italic(): void {
    textarea.style.fontStyle = textarea.style.fontStyle === 'italic' ? 'normal' : 'italic'
}

export function underline(): void {
    textarea.style.textDecoration = textarea.style.textDecoration === 'underline' ? 'none' : 'underline'
}

export function align_left(): void {
    textarea.style.textAlign = 'left'
}

export function align_center(): void {
    textarea.style.textAlign = 'center'
}

export function align_right(): void {
    textarea.style.textAlign = 'right'
}

export function text_lower_or_upper(): void {
    textarea.style.textTransform = textarea.style.textTransform === 'uppercase' ? 'none' : 'uppercase'
}

export function text_slash(): void {
    //TODO: en funktion som stryker igenom texten
}

export function text_color(e: any): void {
    let value = e.target.value
    textarea.style.color = value
}
