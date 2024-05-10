// TODO: make the suggestions selectable
// TODO: make a pretty interface
// TODO: fix bug where interface is still shown after deleting math field
// TODO: add a feature for defining new aliases for one or multiple commands (optional)

interface suggestionEntry {
    alias: string,
    actual: string
}

export class suggestionTab {
    private suggestionContainer: HTMLElement;
    private keywords: Array<suggestionEntry>;
    private currentMathField: any;
    private open: boolean;

    constructor() {
        this.open = false;
        this.keywords = [
            {alias: "integral", actual: "integral"},
            {alias: "haswell", actual: "haswell"},
            {alias: "haswellE", actual: "haswellE"},
            {alias: "haswellD", actual: "haswellD"},
            {alias: "haswellF", actual: "haswellF"},
        ];

        const documentContainer = document.querySelector(".container");
        this.suggestionContainer = document.createElement("div");
        this.suggestionContainer.style.position = "absolute";
        documentContainer?.appendChild(this.suggestionContainer);
    }

    autoComplete(mathField: any): void {
        this.currentMathField = mathField;
        const mathFormula: string = this.currentMathField.latex();
    
        let suggestions: Array<suggestionEntry> = this.getSuggestions(mathFormula);
        this.updatePlacement();
        this.displaySuggestions(suggestions);
    }

    close() {
        this.open = false;
        this.clearSuggestions();
    }

    isOpen(): boolean {
        return this.open;
    }

    isClosed(): boolean {
        return !this.open;
    }

    private getSuggestions(mathFieldInput: string): Array<suggestionEntry> {
        const wordBeingWritten = this.getWordBeingWritten(mathFieldInput);
        let suggestions: Array<suggestionEntry> = [];
    
        this.keywords.forEach(keyword => {
            if (keyword.alias.startsWith(wordBeingWritten)) {
                suggestions.push(keyword);
            }
        });
    
        return suggestions;
    }

    /**
     * Remove all div elements within the suggestion tab.
     */
    private clearSuggestions() {
        const childCount = this.suggestionContainer.children.length;

        for (let i = 0; i < childCount; ++i) {
            this.suggestionContainer.lastChild?.remove();
        }
    }

    private displaySuggestions(suggestions: Array<suggestionEntry>) {
        this.open = true;
        this.clearSuggestions();
        
        suggestions.forEach(suggestion => {
            const option = document.createElement("div");
            option.textContent = suggestion.alias;
            this.suggestionContainer.appendChild(option);
        });
    }

    /**
     * Retrieve the word currently being written in a math field given the LaTeX output of the field.
     * Note this only checks for input being written at the end of the mathfield.
     * @param mathFieldInput 
     * @returns The text currently being written in the math field containing `mathFieldInput`. An 
     * empty string is returned if nothing is being written. 
     */
    private getWordBeingWritten(mathFieldInput: string): string {
        const delimiters: Array<string> = ["\\", " ", "{", "}", "-", "+", "1", "2", "3"]; 
    
        let i = mathFieldInput.length - 1;
        while ((i >= 0) && !delimiters.includes(mathFieldInput[i])) {
            --i;
        }
    
        return mathFieldInput[i] === "\\" 
            ? ""
            : mathFieldInput.substring(i + 1, mathFieldInput.length);
    }
    
    private updatePlacement() {
        // TODO: refactor function and make it aware of different screen sizes and font sizes 
        // (may be needed)
        this.currentMathField.focus();
        let offset = this.currentMathField.__controller.cursor.offset();
        if (offset === null) {
            offset = { 'top': 0, 'left': 0 }
        }
        
        const offsetFix = 20;
        const topOffset = ((offset.top + offsetFix) as Number).toFixed() + "px";
        const leftOffset = (offset.left as Number).toFixed() + "px";
    
        this.suggestionContainer.style.top = topOffset;
        this.suggestionContainer.style.left = leftOffset;
    }
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