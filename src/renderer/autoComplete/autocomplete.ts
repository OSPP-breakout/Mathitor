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
    private maxRangeSize: number;

    constructor() {
        this.maxRangeSize = 5;
        this.open = false;
        this.keywords = [
            {alias: "integral", actual: "integral"},
            {alias: "haswell", actual: "haswell"},
            {alias: "haswellE", actual: "haswellE"},
            {alias: "haswellD", actual: "haswellD"},
            {alias: "haswellF", actual: "haswellF"},
            {alias: "läsk", actual: "haswellF"},
        ];

        const documentContainer = document.querySelector(".container");
        this.suggestionContainer = document.createElement("div");
        this.suggestionContainer.style.position = "absolute";
        documentContainer?.appendChild(this.suggestionContainer);
    }

    /**
     * Display the suggestion tab with suggestions based on the word that is being written within `mathField`. 
     * @param mathField A MathQuill mathField.
     */
    autoComplete(mathField: any) {
        this.currentMathField = mathField;
        const mathFormula: string = this.currentMathField.latex();
    
        let suggestions: Array<suggestionEntry> = this.getSuggestions(mathFormula);
        this.updatePlacement();
        this.displaySuggestions(suggestions);
    }

    /**
     * Close the suggestion tab. Nothing happens if this is called when the suggestion tab is closed.
     */
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

    /**
     * Complete the word that is being written within the MathQuill math field with the currently selected suggestion. 
     */
    private complete() {
        this.currentMathField.focus();
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
            this.addSuggestion(suggestion);
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
            : mathFieldInput.substring(i + 1, mathFieldInput.length).toLowerCase();
    }
    
    /**
     * Update the absolute position of the component.
     */
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

    /**
     * Adds a new suggestion to the suggestion tab.
     * @param suggestion The display name of the suggestion and its value.
     */
    private addSuggestion(suggestion: suggestionEntry) {
        const option = document.createElement("div");
        this.suggestionContainer.appendChild(option);
        
        option.textContent = suggestion.alias;
        option.setAttribute("actualValue", suggestion.actual);
        option.tabIndex = 0;
        
        this.addSuggestionListeners(option);
    }

    private suggestionFocus(e: any) {
        
    }

    private suggestionBlur(e: any) {
        
    }

    private suggestionClick(e: any) {
        console.log("clicky");
    }

    private suggestionKeyDown(e: any) {
        switch(e.key) {
            case "Enter": 
                this.complete();
                break;
            case "ArrowDown": 
                this.selectNextSuggestion(e.target);
                break;
            case "ArrowUp": 
                this.selectPreviousSuggestion(e.target);
                break;
        }
    }

    private selectNextSuggestion(suggestion: HTMLDivElement) {
        const next = suggestion.nextElementSibling;
        
        if (next !== null) {
            (next as HTMLDivElement).focus();
        }
    }

    private selectPreviousSuggestion(suggestion: HTMLDivElement) {
        const next = suggestion.previousElementSibling;
        
        if (next !== null) {
            (next as HTMLDivElement).focus();
        }
    }

    private addSuggestionListeners(suggestionElement: HTMLDivElement) {
        this.addListener(suggestionElement, "focus", this.suggestionFocus);
        this.addListener(suggestionElement, "blur", (e: any) => { this.suggestionBlur(e)});
        this.addListener(suggestionElement, "click", this.suggestionClick);
        this.addListener(suggestionElement, "keydown", (e: any) => {this.suggestionKeyDown(e)});
    }

    private addListener(element: HTMLDivElement, onAction: string, callback: (event?: Event) => void) {
        element.addEventListener(
            onAction,
            (event) => {
                callback(event);
                event.stopImmediatePropagation();
            },
            false
        );
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