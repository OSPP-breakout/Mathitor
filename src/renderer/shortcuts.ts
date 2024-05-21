import { createMathField } from "./mathMode/mathMode";
import { bold, italic, underline } from "./textMode";

window.electronAPI.mathFieldShortCut(() => {
    createMathField();
});

window.electronAPI.boldShortCut(() => {
    bold();
});

window.electronAPI.italicShortCut(() => {
    italic();
});

window.electronAPI.underlineShortCut(() => {
    underline();
});