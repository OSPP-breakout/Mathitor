// TODO: make suggestions clickable (this may already work).
// TODO: add CSS style
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
    private wordBeingWritten: string;

    constructor() {
        this.displayInfo = {maxRangeSize: 5, start: 0, end: 0};
        this.openStatus = false;
        this.possibleSuggestions = [
            {alias: "integral", actual: "integral"},
            {alias: "summation", actual: "summation"},
            {alias: "product", actual: "product"},
            {alias: "pq-formula", actual: ""}
        ];
        this.currentSuggestions = this.possibleSuggestions;
        this.wordBeingWritten = "";

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

    focus() {
        const firstSuggestion = this.suggestionContainer.firstChild;
        console.log(firstSuggestion);

        if (firstSuggestion !== null) {
            (firstSuggestion as HTMLDivElement).focus();
        }
    }

    blur() {
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
        this.getWordBeingWritten(mathFieldInput);
        let suggestions: Array<suggestionEntry> = [];
    
        this.possibleSuggestions.forEach(keyword => {
            if (keyword.alias.startsWith(this.wordBeingWritten)) {
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
     * Update the word currently being written in a math field given the LaTeX output of the field.
     * Note this only checks for input being written at the end of the mathfield.
     * @param mathFieldInput 
     */
    private getWordBeingWritten(mathFieldInput: string) {
        const delimiters: Array<string> = ["\\", " ", "{", "}", "-", "+", "1", "2", "3"]; 
    
        let i = mathFieldInput.length - 1;
        while ((i >= 0) && !delimiters.includes(mathFieldInput[i])) {
            --i;
        }
        
        this.wordBeingWritten = mathFieldInput[i] === "\\" 
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
        option.setAttribute("suggestionValue", suggestion.actual);
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
        option.setAttribute("suggestionValue", suggestion.actual);
        option.tabIndex = 0;
        
        this.addSuggestionListeners(option);
        return option;
    }

    /**
     * Complete the word that is being written within the MathQuill math field with the currently selected suggestion. 
     */
    private suggestionComplete(suggestion: HTMLDivElement) {
        const toCompleteWith = suggestion.getAttribute("suggestionValue");
        this.blur();

        const mathFormula: string = this.currentMathField.latex();
        const withoutWordToComplete = mathFormula.substring(0, mathFormula.length - this.wordBeingWritten.length);

        this.currentMathField.select();
        console.log(mathFormula + "\\" + toCompleteWith);
        console.log(mathFormula);
        console.log(withoutWordToComplete);
        this.currentMathField.write(withoutWordToComplete + "\\" + toCompleteWith);
    }

    private suggestionBlur(e: any) {
        const newFocus = e.relatedTarget as HTMLElement;

        if (newFocus?.hasAttribute("suggestionValue") === false) {
            if (newFocus?.parentElement?.parentElement?.id !== this.currentMathField.el().id) {
                this.close();
            } 
        } 
    }

    private suggestionClick(e: any) {
        this.currentMathField.blur();
        this.focus();
        console.log("clicked it!")
    }

    private suggestionKeyDown(e: any) {
        switch(e.key) {
            case "Escape": 
                this.blur();
                break;
            case "Enter": 
                this.suggestionComplete(e.target);
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
        
        this.blur();
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
        this.addListener(suggestionElement, "blur", (e: any) => { this.suggestionBlur(e)});
        this.addListener(suggestionElement, "click", (e: any) => { this.suggestionClick(e)});
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