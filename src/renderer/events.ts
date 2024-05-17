import * as FileManagement from './fileManagementFrontend';
import * as MathMode from './mathMode/mathMode';
import * as MathModeCaret from './mathMode/caret';
import * as TextMode from './textMode';

interface Listener_info {
    element_id: string;
    action: string;
    callback: (event?: Event) => void;
}

const listeners: Array<Listener_info> = [
    { element_id: 'font-size', action: 'change', callback: TextMode.font_size },
    { element_id: 'selector-heading', action: 'change', callback: TextMode.add_heading },
    { element_id: 'selector-color', action: 'change', callback: TextMode.change_color },
    { element_id: 'selector-color', action: 'input', callback: TextMode.change_color },
    { element_id: 'btn-undo', action: 'click', callback: TextMode.undo },
    { element_id: 'btn-redo', action: 'click', callback: TextMode.redo },
    { element_id: 'btn-ordered-list', action: 'click', callback: TextMode.add_ordered_list },
    { element_id: 'btn-unordered-list', action: 'click', callback: TextMode.add_unordered_list },
    { element_id: 'btn-link', action: 'click', callback: TextMode.add_link },
    { element_id: 'btn-unlink', action: 'click', callback: TextMode.remove_link },
    { element_id: 'btn-bold', action: 'click', callback: TextMode.bold },
    { element_id: 'btn-italic', action: 'click', callback: TextMode.italic },
    { element_id: 'btn-underline', action: 'click', callback: TextMode.underline },
    { element_id: 'btn-align-l', action: 'click', callback: TextMode.align_left },
    { element_id: 'btn-align-c', action: 'click', callback: TextMode.align_center },
    { element_id: 'btn-align-r', action: 'click', callback: TextMode.align_right },
    { element_id: 'lower-upper', action: 'click', callback: TextMode.text_lower_or_upper },
    { element_id: 'btn-slash', action: 'click', callback: TextMode.text_slash },
    { element_id: 'button-MQ', action: 'click', callback: MathMode.createMathField },
    { element_id: 'textarea', action: 'keydown', callback: MathModeCaret.handleCursor },
    { element_id: 'textarea', action: 'click', callback: MathMode.isInsideMathField },
    { element_id: 'textarea', action: 'click', callback: TextMode.findAndApplyCurrentFormatting },
    { element_id: 'textarea', action: 'keyup', callback: TextMode.findAndApplyCurrentFormatting },
    { element_id: 'btn-justify-full', action: 'click', callback: TextMode.justify_full },
    { element_id: 'window', action: 'mousedown', callback: MathMode.closeSuggestions },
    { element_id: 'file-dropdown', action: 'change', callback: FileManagement.fileManagementOption }
];

export function add_listeners() {
    function add_listener(info: Listener_info) {
        document.getElementById(info.element_id)?.addEventListener(
            info.action,
            function (event) {
                info.callback(event);
                event.stopImmediatePropagation();
            },
            false
        );
    }

    listeners.forEach((listener) => {
        add_listener(listener);
    });
}
