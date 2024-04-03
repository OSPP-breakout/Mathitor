const textarea = document.getElementById("textarea");

function font_size(e) {
    let value = e.value;
    textarea.style.fontSize = value + "px";
}

function text_bold(e) {
    textarea.style.fontWeight = textarea.style.fontWeight === 'bold' ? 'normal' : 'bold';
}

function text_italic(e) {
    textarea.style.fontStyle = textarea.style.fontStyle === 'italic' ? 'normal' : 'italic';
}

function text_underline(e) {
    textarea.style.textDecoration = textarea.style.textDecoration === 'underline' ? 'none' : 'underline';
}

function align_left(e) {
    textarea.style.textAlign = 'left';
}

function align_center(e) {
    textarea.style.textAlign = 'center';
}

function align_right(e) {
    textarea.style.textAlign = 'right';
}

function text_lower_or_upper(e) {
    textarea.style.textTransform = textarea.style.textTransform === 'uppercase' ? 'none' : 'uppercase';
}

function text_slash(e) {
    //TODO: en funktion som stryker igenom texten
}

function text_color(e) {
    let value = e.value;
    textarea.style.color = value;
}

