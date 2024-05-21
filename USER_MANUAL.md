# Mæthitor User Manual
This is the Mæthitor user manual. Mæthitor is a text editor designed for mathematics, and allows users to write mathematical symbols and expressions by writing keywords in plain text. Below is described how to use Mæthitor.

## 1. Starting and Terminating the Mæthitor Program
For instructions on how to start the program, see the [Getting Started section in the README file](README.md#getting-started). To terminate the program, close all Mæthitor windows.

## 2. File Management
The documents created by the user are saved locally as files on the user's system. In the current Mæthitor update, the format of these files are not compatible with any other programs or text editors, and must therefore be handled exclusively through the file management functionality provided by Mæthitor. This functionality is described below.

### 2.1. The Starting Window
Immediately after starting the program, an unnamed, unsaved document is created and displayed in the starting window of the program. This document can be edited and saved as described in the sections below. If the document is closed without having been saved manually, the document is removed and any changes are lost.

### 2.2. Creating Files
Aside from the file that is automatically created in the starting window, a new file can be created by selecting 'New File' in the 'File' dropdown menu in the toolbar. This will be displayed in a separate window. Again, the file will be removed if it is not saved manually.

### 2.3. Opening Files
By selecting 'Open' in the 'File'-dropdown menu in the toolbar, the user can open files that are saved locally on the user's system. This option will show a dialog in which the user can select a file to open. The chosen file is then opened and displayed in a new Mæthitor window, ready to be edited and saved.

### 2.4. Saving Files
Files can be saved using both 'Save' and 'Save as' from the 'File' dropdown menu. The first time a file is saved, a dialog will open in which the user can select the name of the file as well as where to save it. Additional copies of the file can then be created and saved in the same way, by selecting 'Save as' from the dropdown menu. When selecting 'Save', the saved file will be overwritten with the latest version of the file.

### 2.5. Exporting as PDF
In the current Mæthitor update, exporting documents to PDF is not supported. When selecting 'Export as PDF' in the 'File' dropdown menu, nothing happens.

## 3. Writing a Mæthitor Document
When writing a Mæthitor document, there are two modes in which the user can write: 'Text mode' and 'Math mode'. Text mode is the standard mode and is used for writing regular, formatted text, whereas Math mode is used for writing mathematical symbols and expressions. These are described in more detail below.

### 3.1. Text mode
By default, text is written in Text mode. In text mode, the user can write rich (i.e. formatted) text similarly to how rich text is written in other editors such as Microsoft Word or Google Docs. Text can be formatted by clicking on the icons in the toolbar, as well as by short-hand commands in the case of bold (Ctrl + B), italic (Ctrl + I) and underlined (Ctrl + U) text.

The formatting options supported are:
- Bold, italic, underlined and strikethrough text
- Left-aligned, right-aligned, and centered text
- Numbered lists and bullet points
- Text size (However, all text must have the same size in the current Mæthitor version)
- Text color

In the current Mæthitor version, the following formatting options are included in the toolbar, but are not yet implemented:
- Justified text (aligned evenly from left to right margin)
- Standard formats (the dropdown menu for selecting different level headings and paragraphs)
- Background color
- Hyperlink insertion and removal

### 3.2. Math mode
Math mode is entered by clicking on the 'Σ' icon in the toolbar. This will create a math field, i.e. a box in which to write mathematical symbols and expressions. To leave Math mode, the caret (a.k.a. insertion point or cursor), should be moved out of the math field.

In a math field, mathematical symbols and operators are written by writing their corresponding keywords in plain text. After writing a complete keyword, the keyword is replaced by the corresponding symbol or operator. When writing keywords, auto-complete suggestions will appear. For example, writing 's' in math mode will generate the suggestions 'summation' (keyword for the 'Σ' operator) and 'sigma' (keyword for the symbol 'σ').

### 3.3. Other functionality
In addition to the writing and formatting functionality mentioned above, Mæthitor also supports the following functionality:
- Undo (Ctrl + Z) and redo (Ctrl + Y). These are represented by the curved arrows in the toolbar