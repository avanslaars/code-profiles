"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const Bookmark_1 = require("./Bookmark");
class Selection {
    static selectLines(editor, lines) {
        const doc = editor.document;
        editor.selections.shift();
        let sels = new Array();
        let newSe;
        lines.forEach(line => {
            newSe = new vscode.Selection(line, 0, line, doc.lineAt(line).text.length);
            sels.push(newSe);
        });
        editor.selections = sels;
    }
    static expandLineRange(editor, toLine, direction) {
        const doc = editor.document;
        let newSe;
        let actualSelection = editor.selection;
        // no matter 'the previous selection'. going FORWARD will become 'isReversed = FALSE'
        if (direction === Bookmark_1.JUMP_FORWARD) {
            if (actualSelection.isEmpty || !actualSelection.isReversed) {
                newSe = new vscode.Selection(editor.selection.start.line, editor.selection.start.character, toLine, doc.lineAt(toLine).text.length);
            }
            else {
                newSe = new vscode.Selection(editor.selection.end.line, editor.selection.end.character, toLine, doc.lineAt(toLine).text.length);
            }
        }
        else {
            if (actualSelection.isEmpty || !actualSelection.isReversed) {
                newSe = new vscode.Selection(editor.selection.start.line, editor.selection.start.character, toLine, 0);
            }
            else {
                newSe = new vscode.Selection(editor.selection.end.line, editor.selection.end.character, toLine, 0);
            }
        }
        editor.selection = newSe;
    }
    static shrinkLineRange(editor, toLine, direction) {
        const doc = editor.document;
        let newSe;
        // no matter 'the previous selection'. going FORWARD will become 'isReversed = FALSE'
        if (direction === Bookmark_1.JUMP_FORWARD) {
            newSe = new vscode.Selection(editor.selection.end.line, editor.selection.end.character, toLine, 0);
        }
        else {
            newSe = new vscode.Selection(editor.selection.start.line, editor.selection.start.character, toLine, doc.lineAt(toLine).text.length);
        }
        editor.selection = newSe;
    }
    static expandRange(editor, toPosition, direction) {
        const doc = editor.document;
        let newSe;
        let actualSelection = editor.selection;
        // no matter 'the previous selection'. going FORWARD will become 'isReversed = FALSE'
        if (direction === Bookmark_1.JUMP_FORWARD) {
            if (actualSelection.isEmpty || !actualSelection.isReversed) {
                newSe = new vscode.Selection(editor.selection.start.line, editor.selection.start.character, toPosition.line, toPosition.character);
            }
            else {
                newSe = new vscode.Selection(editor.selection.end.line, editor.selection.end.character, toPosition.line, toPosition.character);
            }
        }
        else {
            if (actualSelection.isEmpty || !actualSelection.isReversed) {
                newSe = new vscode.Selection(editor.selection.start.line, editor.selection.start.character, toPosition.line, toPosition.character);
            }
            else {
                newSe = new vscode.Selection(editor.selection.end.line, editor.selection.end.character, toPosition.line, toPosition.character);
            }
        }
        editor.selection = newSe;
    }
    static shrinkRange(editor, toPosition, direction) {
        const doc = editor.document;
        let newSe;
        // no matter 'the previous selection'. going FORWARD will become 'isReversed = FALSE'
        if (direction === Bookmark_1.JUMP_FORWARD) {
            newSe = new vscode.Selection(editor.selection.end.line, editor.selection.end.character, toPosition.line, toPosition.character);
        }
        else {
            newSe = new vscode.Selection(editor.selection.start.line, editor.selection.start.character, toPosition.line, toPosition.character);
        }
        editor.selection = newSe;
    }
}
exports.Selection = Selection;
//# sourceMappingURL=Selection.js.map