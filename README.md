# Mæthitor
Mæthitor is a text editor designed for mathematics. By allowing users to write mathematical symbols and expressions by writing key words in plain text, Mæthitor aims to make mathematical writing easier and faster. 

## Getting started
After this repo has been pulled from GitHub, some commands must be run in order to start the program and run automated tests. These commands are described below.

### Installing required packages
First, install all required packages. To do this, run ```npm ci```. 

    npm ci - install required packages (note: requires package-lock.json)

### Compiling
After installing the packages, compile and package the files into the ./dist directory by running ```npm run build```.
    npm run build - compile and package files into ./dist

### Run the program
After compiling, run the program by running ```npm run start```.

### Run automated tests
If you want to run automated tests, run the commands below. Note that for some users, there have been some issues with these commands that have not yet been resolved.

    npm run make
    npm run test
