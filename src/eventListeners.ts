
import {font_size, text_bold, text_italic, text_underline, align_left, align_center, align_right, text_lower_or_upper, text_slash, text_color, create_MQ_field, handleCursor} from "./index";

export function setupEventListeners() {

    document.getElementById("font-size")?.addEventListener("change", function(event) {
        font_size(event);
        event.stopImmediatePropagation();
    }, false);

    document.getElementById("btn-bold")?.addEventListener("click", function(event) {
        text_bold();
        event.stopImmediatePropagation();
    }, false);

    document.getElementById("btn-italic")?.addEventListener("click", function(event) {
        text_italic();
        event.stopImmediatePropagation();
    }, false);

    document.getElementById("btn-underline")?.addEventListener("click", function(event) {
        text_underline();
        event.stopImmediatePropagation();
    }, false);

    document.getElementById("btn-align-l")?.addEventListener("click", function(event) {
        align_left();
        event.stopImmediatePropagation();
    }, false);
    
    document.getElementById("btn-align-c")?.addEventListener("click", function(event) {
        align_center();
        event.stopImmediatePropagation();
    }, false);

    document.getElementById("btn-align-r")?.addEventListener("click", function(event) {
        align_right();
        event.stopImmediatePropagation();
    }, false);

    document.getElementById("lower-upper")?.addEventListener("click", function(event) {
        text_lower_or_upper();
        event.stopImmediatePropagation();
    }, false);

    document.getElementById("btn-slash")?.addEventListener("click", function(event) {
        text_slash();
        event.stopImmediatePropagation();
    }, false);

    document.getElementById("color-picker")?.addEventListener("change", function(event) {
        text_color(event);
        event.stopImmediatePropagation();
    }, false);

    document.getElementById("button-MQ")?.addEventListener("click", function(event) {
        create_MQ_field();
        event.stopImmediatePropagation();
    }, false);

    document.getElementById("textarea")?.addEventListener("keyup", function(event) {
        handleCursor(event);
        event.stopImmediatePropagation();
    }, false);
}