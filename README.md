# Mæthitor
Mæthitor is a text editor designed for mathematics. By allowing users to write mathematical symbols and expressions by writing key words in plain text, Mæthitor aims to make mathematical writing easier and faster. 

## Getting started
After this repo has been pulled from GitHub, some terminal commands must be run in order to start the program and, optionally, run automated tests. These commands are described below.

### Installing required packages
First, install all required packages. To do this, run ```npm ci```. Note that in order to run this command, the package-lock.json file is needed. This file is included in the repo. Do not remove it.

### Compiling
After installing the packages, compile and package the files into the ./dist directory by running ```npm run build```.

### Run the program
After compiling, run the program by running ```npm run start```.

### Run automated tests
If you want to run automated tests, run the commands below. Note that for some users, there have been some issues with these commands that have not yet been resolved.

    npm run make
    npm run test
