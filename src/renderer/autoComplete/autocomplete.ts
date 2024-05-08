interface autoCompleteStatus {
    autoCompletable: boolean,
    matchingCharacters: number
}

interface suggestionEntry {
    alias: string,
    actual: string
}

const keywords: Array<suggestionEntry> = [
    {alias: "integral", actual: "integral"},
    {alias: "haswell", actual: "haswell"},
    {alias: "haswell-E", actual: "haswell-E"},
    {alias: "haswell-D", actual: "haswell-D"},
    {alias: "haswell-F", actual: "haswell-F"},
    {alias: "better sounding on drugs", actual: "BSOD"},
];

const documentContainer = document.querySelector(".container");

const suggestionContainer = document.createElement("div");
suggestionContainer.style.position = "absolute";
documentContainer?.appendChild(suggestionContainer);


export function autoComplete(mathField: any): void {
    const mathFormula: string = mathField.latex();

    let suggestions: Array<suggestionEntry> = getSuggestions(mathFormula);
    updateSuggestionTabPlacement(mathField, suggestionContainer);
    displaySuggestions(suggestions, suggestionContainer);
}

function getWordBeingWritten(mathFieldInput: string): string {
    const delimiters: Array<string> = ["\\", " ", "{", "}", "-", "+", "1", "2", "3"]; 

    let i = mathFieldInput.length - 1;
    while ((i >= 0) && !delimiters.includes(mathFieldInput[i])) {
        --i;
    }

    return mathFieldInput[i] === "\\" 
        ? ""
        : mathFieldInput.substring(i + 1, mathFieldInput.length);
}


function getSuggestions(mathFieldInput: string): Array<suggestionEntry> {
    const wordBeingWritten = getWordBeingWritten(mathFieldInput);
    let suggestions: Array<suggestionEntry> = [];

    keywords.forEach(keyword => {
        if (keyword.alias.startsWith(wordBeingWritten)) {
            suggestions.push(keyword);
        }
    });

    return suggestions;
}

// function autoCompleteWord(mathField: any, toCompleteWith: string) {
//     const mathFormula: string = mathField.latex();
//     const status = canAutoComplete(mathFormula, toCompleteWith);

//     if (status.autoCompletable === true) {
//         const end = mathFormula.length;
//         const withoutMatches = mathFormula.substring(0, end - status.matchingCharacters);
        
//         mathField.select();
//         mathField.write(withoutMatches + "\\" + toCompleteWith);
//     }
// }

function updateSuggestionTabPlacement(mathField: any, tab: HTMLElement) {
    mathField.focus();
    let offset = mathField.__controller.cursor.offset();
    if (offset === null) {
        offset = { 'top': 0, 'left': 0 }
    }

    const topOffset = (offset.top as Number).toFixed() + "px";
    const leftOffset = (offset.left as Number).toFixed() + "px";

    tab.style.top = topOffset;
    tab.style.left = leftOffset;
}

export function clearSuggestions() {
    const container = suggestionContainer;

    while (container.lastChild !== null) {
        container.lastChild.remove();
    }
}

function displaySuggestions(suggestions: Array<suggestionEntry>, container: HTMLElement) {
    clearSuggestions();
    
    suggestions.forEach(suggestion => {
        const option = document.createElement("div");
        option.textContent = suggestion.alias;
        container.appendChild(option);
    });
}