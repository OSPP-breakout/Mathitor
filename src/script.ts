declare var MathQuill: any;

const textarea = document.getElementById("textarea") as HTMLElement;
const latexSpan = document.getElementById('latex') as HTMLElement;
const MQ = MathQuill.getInterface(2);
var amountOfMQFields = 0;


function font_size(e): void {
    let value = e.value;
    textarea.style.fontSize = value + "px";
}

function text_bold(e): void {
    textarea.style.fontWeight = textarea.style.fontWeight === 'bold' ? 'normal' : 'bold';
}

function text_italic(e): void {
    textarea.style.fontStyle = textarea.style.fontStyle === 'italic' ? 'normal' : 'italic';
}

function text_underline(e): void {
    textarea.style.textDecoration = textarea.style.textDecoration === 'underline' ? 'none' : 'underline';
}

function align_left(e): void {
    textarea.style.textAlign = 'left';
}

function align_center(e): void {
    textarea.style.textAlign = 'center';
}

function align_right(e): void {
    textarea.style.textAlign = 'right';
}

function text_lower_or_upper(e): void {
    textarea.style.textTransform = textarea.style.textTransform === 'uppercase' ? 'none' : 'uppercase';
}

function text_slash(e): void {
    //TODO: en funktion som stryker igenom texten
}

function text_color(e): void {
    let value = e.value;
    textarea.style.color = value;
}

function create_MQ_field(): void {
    amountOfMQFields++;
    var newMQField = document.createElement('math-field' + amountOfMQFields.toString());
    
    //Insert the new field at caret position
    var range = (window.getSelection() as Selection).getRangeAt(0);

    if ((range.startContainer.parentNode as Element).id ==='textarea') {
        range.insertNode(newMQField);
    }

    //Link the new MQ-field to the latex-preview  
    var mathField = MQ.MathField(newMQField, {
        handlers: {
            edit: function () {
                latexSpan.textContent = mathField.latex();
            },
        },
    });

}