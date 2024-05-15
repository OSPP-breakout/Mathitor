// TODO: fix bug where interface is still shown after deleting math field
// TODO: fix completion function
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
    
    private currentMathField: any;
    private currentSuggestions: Array<suggestionEntry>;
    private displayInfo: suggestionRange;
    private wordBeingWritten: string;
    private caretIndex: number;

    private editEventInterrupted: boolean;

    constructor() {
        this.displayInfo = {maxRangeSize: 5, start: 0, end: 0};
        this.editEventInterrupted = false;
        this.possibleSuggestions = [
            {alias: "integral", actual: "\\integral"},
            {alias: "summation", actual: "\\summation"},
            {alias: "product", actual: "\\product"},
        ];
        this.currentSuggestions = this.possibleSuggestions;
        this.wordBeingWritten = "";
        this.caretIndex = 0;

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
        // TODO: rename method
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

    update() {
        if (this.currentMathField === undefined) {
            return;
        }
        
        const mathFormula = this.getStringBeforeCaret(this.markCaret());
        
        this.updateCurrentSuggestions(mathFormula);
        this.updatePlacement();
        this.displaySuggestions();
    }

    hasSuggestions(): boolean {
        return this.currentSuggestions.length > 0;
    }

    /**
     * Enter the suggestion tab and move the caret within the math field up one step. 
     */
    focusDown() {
        this.currentMathField.keystroke("Left");
        this.update();
        this.focus();
    }

    /**
     * Enter the suggestion tab.
     */
    focus() {
        const firstSuggestion = this.suggestionContainer.firstChild;

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
        this.clearSuggestions();

        const limit = this.currentSuggestions.length < this.displayInfo.maxRangeSize ? this.currentSuggestions.length : this.displayInfo.maxRangeSize;
        for (let i = 0; i < limit; ++i) {
            this.addSuggestionLast(this.currentSuggestions[i]);
        }

        this.displayInfo.end = limit - 1;
    }

    private updateCurrentSuggestions(mathFieldInput: string) {
        this.getWordBeingWritten(mathFieldInput);
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

    private markCaret(): string {
        this.editEventInterrupted = true;

        this.currentMathField.write("\uFFFF");
        const markedString = this.currentMathField.latex();
        this.currentMathField.keystroke("Backspace");
        
        this.editEventInterrupted = false;
        return markedString
    }

    private getStringBeforeCaret(markedString: string): string {
        const markedIndex = markedString.indexOf("\uFFFF");
        this.caretIndex = markedIndex;
        return markedString.substring(0, markedIndex);
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

    private setDefaultSuggestionStyle(element: HTMLDivElement) {
        const property = element.style;
        property.background = "rgb(255, 255, 255)";
    }

    /**
     * Adds a new suggestion to the suggestion tab.
     * @param suggestion The display name of the suggestion and its value.
     */
    private addSuggestionFirst(suggestion: suggestionEntry): HTMLDivElement {
        const option: HTMLDivElement = document.createElement("div");
        this.suggestionContainer.prepend(option);
        
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
    private addSuggestionLast(suggestion: suggestionEntry): HTMLDivElement {
        const option: HTMLDivElement = document.createElement("div");
        this.suggestionContainer.append(option);
        
        option.textContent = suggestion.alias;
        option.setAttribute("suggestionValue", suggestion.actual);
        this.setDefaultSuggestionStyle(option);
        option.tabIndex = 0;
        
        this.addSuggestionListeners(option);
        return option;
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