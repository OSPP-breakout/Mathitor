import * as fs from "fs/promises";
import * as path from "path";
require("../assets/builtIn.json");

/**
 * 
 * @param distPath A path relative to the build path `dist`, starting with `/` (without any `.` or `..`).
 * @param errorMessage A message to output to the console upon an failed read.
 * @returns The contents of the file if found.
 */
async function loadFile(distPath: string, errorMessage: string): Promise<string> {
    const configurationPath = path.resolve(__dirname, ".") + distPath;
    
    try {
        return await fs.readFile(configurationPath, "utf-8");
    } catch (error) {
        return Promise.reject(new Error(errorMessage));
    }
}

/**
 * Load the default, built-in math field suggestions from the file `builtIn.json`. 
 * @returns A JSON string containing the built-in math field suggestions.
 */
export async function loadBuiltInSuggestions() {
    return loadFile("/assets/builtIn.json", "Could not load default math field suggestions.");
}


export async function loadUserDefinedSuggestions() {
    return loadFile("/assets/userSuggestions.json", "Could not load user defined math field suggestions.");
}

export async function saveUserDefinedSuggestion(event: any, stringifiedJSON: string) {
    const configurationPath = path.resolve(__dirname, ".") + "/assets/userSuggestions.json";
    
    try {
        await fs.writeFile(configurationPath, stringifiedJSON);
    } catch(error) {
        console.error("Could not find configuration file for user defined suggestions.");
    }
}