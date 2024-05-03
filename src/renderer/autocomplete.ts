interface autoCompleteStatus {
    autoCompletable: boolean,
    matchingCharacters: number
}

export function getCurrentWord(): void {
    const selection = window.getSelection();
    const selectedElement = selection?.anchorNode;
    
    if (selectedElement !== null && selectedElement !== undefined) {
        console.log(selectedElement.textContent);
    }
}

export function autoComplete(mathField: any): void {
    const keywords: Array<string> = ["alpha", "alphone", "alpine"];
    const mathFormula: string = mathField.latex();
    let suggestions: Array<string> = [];

    keywords.forEach(keyword => {
        if (canAutoComplete(mathFormula, keyword).autoCompletable === true) {
            suggestions.push(keyword);
        }        
    });

    console.log(suggestions);
}

function autoCompleteWord(mathField: any, toCompleteWith: string) {
    const mathFormula: string = mathField.latex();
    const status = canAutoComplete(mathFormula, toCompleteWith);

    if (status.autoCompletable === true) {
        const end = mathFormula.length;
        const withoutMatches = mathFormula.substring(0, end - status.matchingCharacters);
        
        mathField.select();
        mathField.write(withoutMatches + "\\" + toCompleteWith);
    }
}

function canAutoComplete(currentInput: string, toCompleteWith: string): autoCompleteStatus {
    // There is no point in autocompleting an already complete word, which means that we start checking 
    // with a string that is one character shorter. 
    let endIndex = toCompleteWith.length - 1;

    // The string cannot be less than two characters since it would become too ambiguous (this is arbitrary).
    while (endIndex > 1) {
        const shortened = toCompleteWith.substring(0, endIndex);
        --endIndex;

        if (currentInput.endsWith(shortened)) return {autoCompletable: true, matchingCharacters: shortened.length};
    }
    
    return {autoCompletable: false, matchingCharacters: 0};
}
