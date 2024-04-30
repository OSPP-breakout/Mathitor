export class AutoCompleteField {
    private readonly keywords: Array<string> = ["int", "sum", "prod"];
    private autoCompleteSelector: HTMLSelectElement;
    // private test: HTMLButtonElement;
    private parentElement: HTMLElement;

    constructor() {
        this.autoCompleteSelector = document.createElement("select");
        this.autoCompleteSelector.options.add(new Option("integral", "int"));

        this.parentElement = document.getElementsByClassName("container")[0] as HTMLElement; 
        this.parentElement.appendChild(this.autoCompleteSelector);
    }

    private is_null(object: any): object is null {
        return object === null;
    }

    public hide() {
        
    }

    public show() {

    }
}