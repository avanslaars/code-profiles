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
class Bookmark {
    constructor(fsPath) {
        this.fsPath = fsPath;
        this.bookmarks = [];
    }
    nextBookmark(currentline, direction = exports.JUMP_FORWARD) {
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
                    resolve(currentline);
                    return;
                }
            }
            let nextBookmark;
            if (direction === exports.JUMP_FORWARD) {
                for (let element of this.bookmarks) {
                    if (element > currentline) {
                        nextBookmark = element;
                        break;
                    }
                }
                if (typeof nextBookmark === "undefined") {
                    if (navigateThroughAllFiles) {
                        resolve(exports.NO_MORE_BOOKMARKS);
                        return;
                    }
                    else {
                        resolve(this.bookmarks[0]);
                        return;
                    }
                }
                else {
                    resolve(nextBookmark);
                    return;
                }
            }
            else {
                for (let index = this.bookmarks.length; index >= 0; index--) {
                    let element = this.bookmarks[index];
                    if (element < currentline) {
                        nextBookmark = element;
                        break;
                    }
                }
                if (typeof nextBookmark === "undefined") {
                    if (navigateThroughAllFiles) {
                        resolve(exports.NO_MORE_BOOKMARKS);
                        return;
                    }
                    else {
                        resolve(this.bookmarks[this.bookmarks.length - 1]);
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
            if (!fs.existsSync(this.fsPath)) {
                resolve(undefined);
                return;
            }
            let uriDocBookmark = vscode.Uri.file(this.fsPath);
            vscode.workspace.openTextDocument(uriDocBookmark).then(doc => {
                let items = [];
                let invalids = [];
                // tslint:disable-next-line:prefer-for-of
                for (let index = 0; index < this.bookmarks.length; index++) {
                    let element = this.bookmarks[index] + 1;
                    // check for 'invalidated' bookmarks, when its outside the document length
                    if (element <= doc.lineCount) {
                        let lineText = doc.lineAt(element - 1).text;
                        let normalizedPath = doc.uri.fsPath;
                        items.push({
                            label: element.toString(),
                            description: lineText,
                            detail: normalizedPath
                        });
                    }
                    else {
                        invalids.push(element);
                    }
                }
                if (invalids.length > 0) {
                    let idxInvalid;
                    // tslint:disable-next-line:prefer-for-of
                    for (let indexI = 0; indexI < invalids.length; indexI++) {
                        idxInvalid = this.bookmarks.indexOf(invalids[indexI] - 1);
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
}
exports.Bookmark = Bookmark;
//# sourceMappingURL=Bookmark.js.map