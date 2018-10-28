"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const fs = require("fs");
exports.NO_BOOKMARKS = -1;
exports.NO_MORE_BOOKMARKS = -2;
exports.JUMP_FORWARD = 1;
exports.JUMP_BACKWARD = -1;
var JUMP_DIRECTION;
(function (JUMP_DIRECTION) {
    JUMP_DIRECTION[JUMP_DIRECTION["JUMP_FORWARD"] = 0] = "JUMP_FORWARD";
    JUMP_DIRECTION[JUMP_DIRECTION["JUMP_BACKWARD"] = 1] = "JUMP_BACKWARD";
})(JUMP_DIRECTION = exports.JUMP_DIRECTION || (exports.JUMP_DIRECTION = {}));
;
;
;
class BookmarkItem {
    constructor(line, column = 1, label = "") {
        this.line = line;
        this.column = column;
        this.label = label;
    }
}
exports.BookmarkItem = BookmarkItem;
class BookmarkedFile {
    constructor(fsPath) {
        this.path = fsPath;
        this.bookmarks = [];
    }
    nextBookmark(currentPosition, direction = exports.JUMP_FORWARD) {
        return new Promise((resolve, reject) => {
            if (typeof this.bookmarks === "undefined") {
                reject('typeof this.bookmarks == "undefined"');
                return;
            }
            let navigateThroughAllFiles;
            navigateThroughAllFiles = vscode.workspace.getConfiguration("bookmarks").get("navigateThroughAllFiles", false);
            if (this.bookmarks.length === 0) {
                if (navigateThroughAllFiles) {
                    resolve(exports.NO_BOOKMARKS);
                    return;
                }
                else {
                    resolve(currentPosition);
                    return;
                }
            }
            let nextBookmark;
            if (direction === exports.JUMP_FORWARD) {
                for (let element of this.bookmarks) {
                    if (element.line > currentPosition.line) {
                        nextBookmark = new vscode.Position(element.line, element.column); //.line
                        break;
                    }
                }
                if (typeof nextBookmark === "undefined") {
                    if (navigateThroughAllFiles) {
                        resolve(exports.NO_MORE_BOOKMARKS);
                        return;
                    }
                    else {
                        resolve(new vscode.Position(this.bookmarks[0].line, this.bookmarks[0].column));
                        return;
                    }
                }
                else {
                    resolve(nextBookmark);
                    return;
                }
            }
            else {
                for (let index = this.bookmarks.length - 1; index >= 0; index--) {
                    let element = this.bookmarks[index];
                    if (element.line < currentPosition.line) {
                        nextBookmark = new vscode.Position(element.line, element.column); //.line
                        break;
                    }
                }
                if (typeof nextBookmark === "undefined") {
                    if (navigateThroughAllFiles) {
                        resolve(exports.NO_MORE_BOOKMARKS);
                        return;
                    }
                    else {
                        resolve(new vscode.Position(this.bookmarks[this.bookmarks.length - 1].line, this.bookmarks[this.bookmarks.length - 1].column));
                        return;
                    }
                }
                else {
                    resolve(nextBookmark);
                    return;
                }
            }
        });
    }
    listBookmarks() {
        return new Promise((resolve, reject) => {
            // no bookmark, returns empty
            if (this.bookmarks.length === 0) {
                resolve(undefined);
                return;
            }
            // file does not exist, returns empty
            if (!fs.existsSync(this.path)) {
                resolve(undefined);
                return;
            }
            let uriDocBookmark = vscode.Uri.file(this.path);
            vscode.workspace.openTextDocument(uriDocBookmark).then(doc => {
                let items = [];
                let invalids = [];
                // tslint:disable-next-line:prefer-for-of
                for (let index = 0; index < this.bookmarks.length; index++) {
                    let bookmarkLine = this.bookmarks[index].line + 1;
                    let bookmarkColumn = this.bookmarks[index].column + 1;
                    // check for 'invalidated' bookmarks, when its outside the document length
                    if (bookmarkLine <= doc.lineCount) {
                        let lineText = doc.lineAt(bookmarkLine - 1).text.trim();
                        let normalizedPath = doc.uri.fsPath;
                        if (this.bookmarks[index].label === "") {
                            items.push({ description: "(Ln " + bookmarkLine.toString() + ", Col " +
                                    bookmarkColumn.toString() + ")",
                                label: lineText,
                                detail: normalizedPath });
                        }
                        else {
                            items.push({ description: "(Ln " + bookmarkLine.toString() + ", Col " +
                                    bookmarkColumn.toString() + ")",
                                // label: lineText,
                                label: "$(tag) " + this.bookmarks[index].label,
                                detail: normalizedPath });
                        }
                    }
                    else {
                        invalids.push(bookmarkLine);
                    }
                }
                if (invalids.length > 0) {
                    let idxInvalid;
                    // tslint:disable-next-line:prefer-for-of
                    for (let indexI = 0; indexI < invalids.length; indexI++) {
                        idxInvalid = this.bookmarks.indexOf({ line: invalids[indexI] - 1 });
                        this.bookmarks.splice(idxInvalid, 1);
                    }
                }
                resolve(items);
                return;
            });
        });
    }
    clear() {
        this.bookmarks.length = 0;
    }
    indexOfBookmark(line) {
        for (let index = 0; index < this.bookmarks.length; index++) {
            const element = this.bookmarks[index];
            if (element.line === line) {
                return index;
            }
        }
        return -1;
    }
}
exports.BookmarkedFile = BookmarkedFile;
//# sourceMappingURL=Bookmark.js.map