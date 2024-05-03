import { getCurrentWord } from './autocomplete';
import * as Math_mode from './math_mode';
import * as Text_mode from './text_mode';

interface Listener_info {
    element_id: string;
    action: string;
    callback: (event?: Event) => void;
}

const listeners: Array<Listener_info> = [
    { element_id: 'font-size', action: 'change', callback: Text_mode.font_size },
    { element_id: 'selector-heading', action: 'change', callback: Text_mode.add_heading },
    { element_id: 'selector-color', action: 'change', callback: Text_mode.change_color },
    { element_id: 'selector-color', action: 'input', callback: Text_mode.change_color },
    { element_id: 'btn-undo', action: 'click', callback: Text_mode.undo },
    { element_id: 'btn-redo', action: 'click', callback: Text_mode.redo },
    { element_id: 'btn-ordered-list', action: 'click', callback: Text_mode.add_ordered_list },
    { element_id: 'btn-unordered-list', action: 'click', callback: Text_mode.add_unordered_list },
    { element_id: 'btn-link', action: 'click', callback: Text_mode.add_link },
    { element_id: 'btn-unlink', action: 'click', callback: Text_mode.remove_link },
    { element_id: 'btn-bold', action: 'click', callback: Text_mode.bold },
    { element_id: 'btn-italic', action: 'click', callback: Text_mode.italic },
    { element_id: 'btn-underline', action: 'click', callback: Text_mode.underline },
    { element_id: 'btn-align-l', action: 'click', callback: Text_mode.align_left },
    { element_id: 'btn-align-c', action: 'click', callback: Text_mode.align_center },
    { element_id: 'btn-align-r', action: 'click', callback: Text_mode.align_right },
    { element_id: 'lower-upper', action: 'click', callback: Text_mode.text_lower_or_upper },
    { element_id: 'btn-slash', action: 'click', callback: Text_mode.text_slash },
    { element_id: 'button-MQ', action: 'click', callback: Math_mode.create_MQ_field },
    { element_id: 'textarea', action: 'keyup', callback: Math_mode.handleCursor },
    { element_id: 'btn-justify-full', action: 'click', callback: Text_mode.justify_full },
    //{ element_id: 'textarea', action: 'input', callback: getCurrentWord }
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
