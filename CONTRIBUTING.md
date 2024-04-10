## Code comments
Comments should use proper punctuation and capitalize the first letter of sentences (as you would writing any other text). Avoid unnecessary detail when describing things and
add context where needed to ensure that anyone can understand what the commented on code does.


## Commit messages
A commit message should contain a title and if necessary a body. The title and body should be separated by one line. The title should generally
follow the form `Category: short description`. The following categories are valid: `Setup`, `Feature`, `Bugfix`, `Refactor`, `Documentation`, `Test` or `Other`. The category should be based on the main purpose of the commit.

The body should contain a more in-depth explanation of what has been done and, if necessary, why it has been done.

Past tense should be preferred in both title and body. Capitalize the beginning of the title and beginning of sentences (as you would writing any other text). Do not capitalize the letter after `:`. Use proper punctuation.

### Example
```
Setup: added contribution guidelines


Added contribution guidelines to avoid a commit log with clashing writing styles and formatting, and different naming conventions for branches. A good standard avoids conflicts which may lead to headaches.
```


## Branches
### Usage
Use branches when adding a new feature, refactoring a piece of code, adding tests, adding documentation or for any other task. It may sometimes be necessary or convenient to create a branch for adding a larger component or module, but try to avoid doing this. A branch should, with some exceptions, serve only one purpose.  

### Naming
A branch should have a category followed by a description or issue number, separated by `/`.

### Categories
`feature` - For adding a new feature. This could be a function or a functionality. This could also be a tool used for development (such as a formatting tool).


`refactor` - For rewriting code in order to improve readability, performance or maintainability.


`document` - For writing or editing documentation. Documentation includes any code comments or text documents that  


`bugfix` - For anything that fixes behavior that is not expected or intended.  
   
`other` - For everything else.

### Description
A short description of the task to be done in the branch. Replace spaces with dashes (`-`). All characters should be in lower case, except for the first letter in a name. In general, try to keep the description short and concise. Short means at most 50 characters, but this is an arbitrary number and should only be used as a rough guideline. Do not use abbreviations or acronyms unless they are widely used (in every-day life) or noted somewhere.

### Issue number
If the branch is created to fix an issue, write `issue-n` where `n` is the issue number.

### Examples
* `feature/add-Clang-tidy`
* `refactor/simplify-conditionals`
* `bugfix/memory-leak-after-calling-method-x`
* `bugfix/issue-42`
* `other/setup-Meson-build`