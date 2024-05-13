// TODO: make a pretty interface
// TODO: fix bug where interface is still shown after deleting math field
// TODO: add a feature for defining new aliases for one or multiple commands (optional)

interface suggestionEntry {
    alias: string,
    actual: string
}

interface suggestionRange {
    maxRangeSize: number,
    start: number,
    end: number
}

export class suggestionTab {
    private suggestionContainer: HTMLElement;
    private possibleSuggestions: Array<suggestionEntry>;
    private currentSuggestions: Array<suggestionEntry>;
    private currentMathField: any;
    private openStatus: boolean;
    private displayInfo: suggestionRange;

    constructor() {
        this.displayInfo = {maxRangeSize: 5, start: 0, end: 0};
        this.openStatus = false;
        this.possibleSuggestions = [
            {alias: "integral", actual: "integral"},
            {alias: "a1", actual: "haswell"},
            {alias: "a2", actual: "haswellE"},
            {alias: "a3", actual: "haswellD"},
            {alias: "a4", actual: "haswellF"},
            {alias: "a5", actual: "haswellF"},
            {alias: "a6", actual: "haswellF"},
            {alias: "a7", actual: "haswellF"},
            {alias: "a8", actual: "haswellF"},
            {alias: "a9", actual: "haswellF"},
            {alias: "läsk", actual: "haswellF"},
        ];
        this.currentSuggestions = this.possibleSuggestions;

        const documentContainer = document.querySelector(".container");
        this.suggestionContainer = document.createElement("div");
        this.suggestionContainer.style.position = "absolute";
        documentContainer?.appendChild(this.suggestionContainer);
    }

    /**
     * Display the suggestion tab with suggestions based on the word that is being written within `mathField`. 
     * @param mathField A MathQuill mathField.
     */
    open(mathField: any) {
        this.openStatus = true;
        this.currentMathField = mathField;
        const mathFormula: string = this.currentMathField.latex();
    
        this.updateCurrentSuggestions(mathFormula);
        this.updatePlacement();
        this.displaySuggestions();
    }

    /**
     * Close the suggestion tab. Nothing happens if this is called when the suggestion tab is closed.
     */
    close() {
        this.openStatus = false;
        this.clearSuggestions();
    }

    isOpen(): boolean {
        return this.openStatus;
    }

    isClosed(): boolean {
        return !this.openStatus;
    }

    /**
     * Complete the word that is being written within the MathQuill math field with the currently selected suggestion. 
     */
    private complete() {
        this.currentMathField.focus();
    }

    /**
     * Remove all div elements within the suggestion tab.
     */
    private clearSuggestions() {
        this.clearDisplayRange();

        const childCount = this.suggestionContainer.children.length;
        for (let i = 0; i < childCount; ++i) {
            this.suggestionContainer.lastChild?.remove();
        }
    }

    private displaySuggestions() {
        this.openStatus = true;
        this.clearSuggestions();

        const limit = this.currentSuggestions.length < this.displayInfo.maxRangeSize ? this.currentSuggestions.length : this.displayInfo.maxRangeSize;
        for (let i = 0; i < limit; ++i) {
            this.addSuggestionLast(this.currentSuggestions[i]);
        }

        this.displayInfo.end = limit - 1;
    }

    private updateCurrentSuggestions(mathFieldInput: string) {
        const wordBeingWritten = this.getWordBeingWritten(mathFieldInput);
        let suggestions: Array<suggestionEntry> = [];
    
        this.possibleSuggestions.forEach(keyword => {
            if (keyword.alias.startsWith(wordBeingWritten)) {
                suggestions.push(keyword);
            }
        });
    
        this.currentSuggestions = suggestions;
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
    
    private clearDisplayRange() {
        this.displayInfo.start = 0;
        this.displayInfo.end = 0;
    }

    private moveDisplayRangeForward() {
        const currentStart = this.displayInfo.start;
        const currentEnd = this.displayInfo.end;

        this.displayInfo.start = currentStart + 1;
        this.displayInfo.end = currentEnd + 1;
    } 

    private moveDisplayRangeBackward() {
        const currentStart = this.displayInfo.start;
        const currentEnd = this.displayInfo.end;

        this.displayInfo.start = currentStart - 1;
        this.displayInfo.end = currentEnd - 1;
    }

    /**
     * Adds a new suggestion to the suggestion tab.
     * @param suggestion The display name of the suggestion and its value.
     */
    private addSuggestionFirst(suggestion: suggestionEntry): HTMLDivElement {
        const option = document.createElement("div");
        this.suggestionContainer.prepend(option);
        
        option.textContent = suggestion.alias;
        option.setAttribute("actualValue", suggestion.actual);
        option.tabIndex = 0;
        
        this.addSuggestionListeners(option);
        return option;
    }

    /**
     * Adds a new suggestion to the suggestion tab.
     * @param suggestion The display name of the suggestion and its value.
     */
    private addSuggestionLast(suggestion: suggestionEntry): HTMLDivElement {
        const option = document.createElement("div");
        this.suggestionContainer.append(option);
        
        option.textContent = suggestion.alias;
        option.setAttribute("actualValue", suggestion.actual);
        option.tabIndex = 0;
        
        this.addSuggestionListeners(option);
        return option;
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

    /**
     * Show the previous, hidden suggestion. This assumes the currently selected suggestion is the first shown.
     * @returns The previously hidden suggestion, if there were any.
     */
    private showPreviousHiddenSuggestion(): HTMLDivElement | null {
        // Update the visible suggestion range

        if (this.displayInfo.start > 0) {
            this.moveDisplayRangeBackward();

            this.suggestionContainer.lastChild?.remove();
            const newSuggestion = this.addSuggestionFirst(this.currentSuggestions[this.displayInfo.start]);
            return newSuggestion;
        }
        
        // TODO: enter the math field
        return null;
    }

    /**
     * Show the next, hidden suggestion. This assumes the currently selected suggestion is the last shown.
     * @returns The previously hidden suggestion, if there were any.
     */
    private showNextHiddenSuggestion(): HTMLDivElement | null {

        // Check a next suggestion exists
        if (this.currentSuggestions.length > this.displayInfo.end + 1) {
            this.moveDisplayRangeForward();

            this.suggestionContainer.firstChild?.remove();
            const newSuggestion = this.addSuggestionLast(this.currentSuggestions[this.displayInfo.end]);
            return newSuggestion;
        }

        return null;
    }

    /**
     * Move the selection to the next suggestion. In the case that `suggestion` is the last visible suggestion, 
     * also update to display the next suggestion and hide the first suggestion.  
     * @param suggestion The currently selected suggestion element. 
     */
    private selectNextSuggestion(suggestion: HTMLDivElement) {
        const next = suggestion.nextElementSibling;
        
        if (next !== null) {
            (next as HTMLDivElement).focus();
        } else {
            this.showNextHiddenSuggestion()?.focus();
        }
    }

    private selectPreviousSuggestion(suggestion: HTMLDivElement) {
        const next = suggestion.previousElementSibling;
        
        if (next !== null) {
            (next as HTMLDivElement).focus();
        } else {
            this.showPreviousHiddenSuggestion()?.focus();
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