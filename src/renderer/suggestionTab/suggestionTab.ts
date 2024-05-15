// TODO: add a feature for defining new aliases for one or multiple commands (optional)
// TODO: load possible suggestions from a JSON file.

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
    
    private currentMathField: any;
    private currentSuggestions: Array<suggestionEntry> = [];
    private displayInfo: suggestionRange;
    private wordBeingWritten: string = "";
    private caretIndex: number = 0;

    private editEventInterrupted: boolean = false;

    constructor(maxDisplayed: number = 5) {
        this.displayInfo = {maxRangeSize: maxDisplayed, start: 0, end: 0};
        this.possibleSuggestions = [
            {alias: "integral", actual: "\\integral"},
            {alias: "p1", actual: "\\integral"},
            {alias: "p2", actual: "\\integral"},
            {alias: "p3", actual: "\\integral"},
            {alias: "p4", actual: "\\integral"},
            {alias: "p5", actual: "\\integral"},
            {alias: "p6", actual: "\\integral"},
            {alias: "p7", actual: "\\integral"},
            {alias: "summation", actual: "\\summation"},
            {alias: "product", actual: "\\product"},
        ];

        const documentContainer = document.querySelector(".container");
        this.suggestionContainer = document.createElement("div");
        this.suggestionContainer.style.position = "absolute";
        documentContainer?.appendChild(this.suggestionContainer);
    }

    /**
     * Display the suggestion tab with suggestions based on the word that is being written within `mathField`. Attaches
     * `math field` to the suggestion tab. All operations which depend on a math field will use the field passed to this method. 
     * @param mathField A MathQuill mathField.
     */
    open(mathField: any) {
        if (this.editEventInterrupted == true) {
            return;
        }

        this.currentMathField = mathField;
        this.update();
    }

    /**
     * Close the suggestion tab. Nothing happens if this is called when the suggestion tab is closed.
     */
    close() {
        this.clearSuggestions();
    }

    /**
     * Makes the first suggestion focused. In essence, this means that the suggestion tab is
     * entered.
     */
    focus() {
        const firstSuggestion = this.suggestionContainer.firstChild;

        if (firstSuggestion !== null) {
            (firstSuggestion as HTMLDivElement).focus();
        }
    }

    /**
     * Set the focus on the math field related to the suggestion tab. This should be used when exiting
     * the suggestion tab.
     */
    blur() {
       this.currentMathField.focus(); 
    }

    /**
     * Updates suggestions within the tab.
     */
    update() {
        if (this.currentMathField === undefined) {
            return;
        }
        
        this.updateCurrentSuggestions();
        this.updatePlacement();
        this.displaySuggestions();
    }

    /**
     * Check if the suggestion tab has any suggestions.
     * @returns True if the suggestion tab has any suggestions.
     */
    hasSuggestions(): boolean {
        return this.currentSuggestions.length > 0;
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

    /**
     * Add div elements representing the current suggestions.
     */
    private displaySuggestions() {
        this.clearSuggestions();

        const limit = this.currentSuggestions.length < this.displayInfo.maxRangeSize ? this.currentSuggestions.length : this.displayInfo.maxRangeSize;
        for (let i = 0; i < limit; ++i) {
            this.addSuggestionLast(this.currentSuggestions[i]);
        }

        this.displayInfo.end = limit - 1;
    }

    /**
     * Update the current suggestions based on what is written within the math field
     * that was in focus last. 
     */
    private updateCurrentSuggestions() {
        this.getCurrentWord();
        if (this.wordBeingWritten.length === 0) {
            this.currentSuggestions = [];
            return;
        }
        
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
        this.currentMathField.focus();
        let offset = this.currentMathField.__controller.cursor.offset();
        offset = offset === null ? { 'top': 0, 'left': 0 } : offset;
        
        const offsetFix = 20;
        const topOffset = ((offset.top + offsetFix) as Number).toFixed() + "px";
        const leftOffset = (offset.left as Number).toFixed() + "px";
    
        this.suggestionContainer.style.top = topOffset;
        this.suggestionContainer.style.left = leftOffset;
    }

    /**
     * Mark the position of the caret within the latex string represented by attached math field.
     * @returns A string with a marker which points to the current position of the caret (text cursor).
     */
    private markCaret(): string {
        this.editEventInterrupted = true;

        this.currentMathField.write("\uFFFF");
        const markedString = this.currentMathField.latex();
        this.currentMathField.keystroke("Backspace");
        
        this.editEventInterrupted = false;
        return markedString
    }

    /**
     * Update the index of the caret (text cursor) within the latex code retrieved from the
     * attached math field.
     * @returns The part of the latex code before the cursor.
     */
    private updateCaretIndex(): string {
        const markedString = this.markCaret()
        const markedIndex = markedString.indexOf("\uFFFF");
        this.caretIndex = markedIndex;
        return markedString.substring(0, markedIndex);
    }

    /**
     * Update the word currently being written in a math field given the LaTeX output of the field.
     */
    private getCurrentWord() {
        const mathFieldInput = this.updateCaretIndex();
        const delimiters: Array<string> = ["\\", " ", "{", "}", "-", "+", "1", "2", "3"]; 
        let i = mathFieldInput.length - 1;

        while ((i >= 0) && !delimiters.includes(mathFieldInput[i])) {
            --i;
        }
        
        this.wordBeingWritten = mathFieldInput[i] === "\\" 
            ? ""
            : mathFieldInput.substring(i + 1, mathFieldInput.length).toLowerCase();
    }

    /**
     * Reset the range of suggestions being displayed. 
     */
    private clearDisplayRange() {
        this.displayInfo.start = 0;
        this.displayInfo.end = 0;
    }

    /**
     * Moves the range of displayed suggestions forward by one.
     */
    private moveDisplayRangeForward() {
        const currentStart = this.displayInfo.start;
        const currentEnd = this.displayInfo.end;

        this.displayInfo.start = currentStart + 1;
        this.displayInfo.end = currentEnd + 1;
    } 

    /**
     * Moves the range of displayed suggestions backward by one.
     */
    private moveDisplayRangeBackward() {
        const currentStart = this.displayInfo.start;
        const currentEnd = this.displayInfo.end;

        this.displayInfo.start = currentStart - 1;
        this.displayInfo.end = currentEnd - 1;
    }

    private setDefaultSuggestionStyle(element: HTMLDivElement) {
        const property = element.style;
        property.background = "rgb(255, 255, 255)";
    }

    private createSuggestionElement(suggestion: suggestionEntry): HTMLDivElement {
        const option: HTMLDivElement = document.createElement("div");
        
        option.textContent = suggestion.alias;
        option.setAttribute("suggestionValue", suggestion.actual);
        this.setDefaultSuggestionStyle(option);
        option.tabIndex = 0;
        
        this.addSuggestionListeners(option);
        return option;
    } 

    /**
     * Adds a new suggestion to the suggestion tab.
     * @param suggestion The display name of the suggestion and its value.
     */
    private addSuggestionFirst(suggestion: suggestionEntry): HTMLDivElement {
        const element = this.createSuggestionElement(suggestion);
        this.suggestionContainer.prepend(element);
        return element;
    }

    /**
     * Adds a new suggestion to the suggestion tab.
     * @param suggestion The display name of the suggestion and its value.
     */
    private addSuggestionLast(suggestion: suggestionEntry): HTMLDivElement {
        const element = this.createSuggestionElement(suggestion);
        this.suggestionContainer.append(element);
        return element;
    }

    /**
     * Complete the word that is being written within the MathQuill math field with the currently selected suggestion. 
     */
    private complete(suggestion: HTMLDivElement) {
        const completion = suggestion.getAttribute("suggestionValue");
        this.blur();

        const mathFieldInput: string = this.currentMathField.latex();
        const beforeCaret = mathFieldInput.substring(0, this.caretIndex - this.wordBeingWritten.length);
        const afterCaret = mathFieldInput.substring(this.caretIndex, mathFieldInput.length);

        this.currentMathField.select();
        this.currentMathField.write(beforeCaret + completion + afterCaret);
    }
    
    private suggestionBlur(e: any) {
        const element: HTMLDivElement = e.target;
        element.style.background = "rgb(255, 255, 255)";

        const newFocus = e.relatedTarget as HTMLElement;

        if (newFocus?.hasAttribute("suggestionValue") === false) {
            if (newFocus?.parentElement?.parentElement?.id !== this.currentMathField.el().id) {
                this.close();
            } 
        } 
    }

    private suggestionFocus(e: any) {
        const element: HTMLDivElement = e.target;
        element.style.background = "rgb(200, 200, 200)";
    }

    private suggestionClick(e: any) {
        this.currentMathField.blur();
        e.target.focus();
    }

    private suggestionKeyDown(e: any) {
        switch(e.key) {
            case "Escape": 
                this.blur();
                break;
            case "Enter": 
                this.complete(e.target);
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
        // Check if a previous suggestion which is hidden exists.
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

    /**
     * Move the selection to the previous suggestion. In the case that `suggestion` is the last visible suggestion, 
     * also update to display the previous, hidden suggestion and hide the last suggestion displayed. If no hidden 
     * suggestion exists, the attached math field will be entered.
     * @param suggestion The currently suggestion element. 
     */
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
        this.addListener(suggestionElement, "focus", (e: any) => { this.suggestionFocus(e)});
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