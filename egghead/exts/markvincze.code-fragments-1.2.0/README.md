# Code Fragments extension for Visual Studio Code

[![Build Status](https://travis-ci.org/markvincze/vscode-codeFragments.svg?branch=master)](https://travis-ci.org/markvincze/vscode-codeFragments)

With this extension you can save static code fragments for later use, and easily insert them into source files whenever needed.  
It can be specifically useful when doing coding demos during presentations.

## Features

After installing the extension, a new section called `CODE FRAGMENTS` is added to the Explorer, which shows a list of the previously saved fragments.  
You can save a piece of code by selecting it in the editor, and then executing the "Save selection as Code Fragment" from the Command Palette (brought up with `Ctrl+Shift+P`) or in the context menu.  
Clicking on an existing fragment in the list inserts its content into the editor at the current cursor position.

Saving a selection as a Code Fragment:

![Saving Code Fragments.](https://github.com/markvincze/vscode-codeFragments/raw/master/images/codefragments-save.gif)

Inserting a Code Fragment to the current cursor position:

![Inserting Code Fragments.](https://github.com/markvincze/vscode-codeFragments/raw/master/images/codefragments-insert.gif)

## Release Notes

### 1.1.2

Add the capability to always ask for the name of the fragment on save (controlled by the `codeFragments.askForNameOnCreate` setting) (#5).

### 1.1.1

Fix a bug causing not being able to save fragments until the Explorer is opened (#4).

### 1.1.0

Add export/import to Json, and delete all fragments features.

### 1.0.0

Initial release of Code Fragments.

## Credits

The icons are licensed under <a href="http://creativecommons.org/licenses/by/3.0/" title="Creative Commons BY 3.0" target="_blank">CC 3.0 BY</a>, and made by

 - <a href="http://www.freepik.com" title="Freepik">Freepik</a>
 - <a href="https://www.flaticon.com/authors/kirill-kazachek" title="Kirill Kazachek">Kirill Kazachek</a>
 - <a href="https://www.flaticon.com/authors/icon-works" title="Icon Works">Icon Works</a>
 
Downloaded from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a>.