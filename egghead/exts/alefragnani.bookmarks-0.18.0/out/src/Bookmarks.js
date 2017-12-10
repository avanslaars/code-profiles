"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const fs = require("fs");
const Bookmark_1 = require("./Bookmark");
class Bookmarks {
    constructor(jsonObject) {
        this.onDidClearBookmarkEmitter = new vscode.EventEmitter();
        this.onDidClearAllBookmarksEmitter = new vscode.EventEmitter();
        this.onDidAddBookmarkEmitter = new vscode.EventEmitter();
        this.onDidRemoveBookmarkEmitter = new vscode.EventEmitter();
        this.onDidUpdateBookmarkEmitter = new vscode.EventEmitter();
        this.activeBookmark = undefined;
        this.bookmarks = [];
    }
    get onDidClearBookmark() { return this.onDidClearBookmarkEmitter.event; }
    get onDidClearAllBookmarks() { return this.onDidClearAllBookmarksEmitter.event; }
    get onDidAddBookmark() { return this.onDidAddBookmarkEmitter.event; }
    get onDidRemoveBookmark() { return this.onDidRemoveBookmarkEmitter.event; }
    get onDidUpdateBookmark() { return this.onDidUpdateBookmarkEmitter.event; }
    static normalize(uri) {
        // a simple workaround for what appears to be a vscode.Uri bug
        // (inconsistent fsPath values for the same document, ex. ///foo/x.cpp and /foo/x.cpp)
        return uri.replace("///", "/");
    }
    dispose() {
        this.zip();
    }
    loadFrom(jsonObject, relativePath) {
        if (jsonObject === "") {
            return;
        }
        let jsonBookmarks = jsonObject.bookmarks;
        for (let idx = 0; idx < jsonBookmarks.length; idx++) {
            let jsonBookmark = jsonBookmarks[idx];
            // each bookmark (line)
            this.add(jsonBookmark.fsPath);
            for (let element of jsonBookmark.bookmarks) {
                this.bookmarks[idx].bookmarks.push(element);
            }
        }
        // it replaced $ROOTPATH$ for the rootPath itself 
        if (relativePath) {
            for (let element of this.bookmarks) {
                element.fsPath = element.fsPath.replace("$ROOTPATH$", vscode.workspace.workspaceFolders[0].uri.fsPath);
            }
        }
    }
    fromUri(uri) {
        uri = Bookmarks.normalize(uri);
        for (let element of this.bookmarks) {
            if (element.fsPath === uri) {
                return element;
            }
        }
    }
    add(uri) {
        uri = Bookmarks.normalize(uri);
        let existing = this.fromUri(uri);
        if (typeof existing === "undefined") {
            let bookmark = new Bookmark_1.Bookmark(uri);
            this.bookmarks.push(bookmark);
        }
    }
    nextDocumentWithBookmarks(active, direction = Bookmark_1.JUMP_FORWARD) {
        let currentBookmark = active;
        let currentBookmarkId;
        for (let index = 0; index < this.bookmarks.length; index++) {
            let element = this.bookmarks[index];
            if (element === active) {
                currentBookmarkId = index;
            }
        }
        return new Promise((resolve, reject) => {
            if (direction === Bookmark_1.JUMP_FORWARD) {
                currentBookmarkId++;
                if (currentBookmarkId === this.bookmarks.length) {
                    currentBookmarkId = 0;
                }
            }
            else {
                currentBookmarkId--;
                if (currentBookmarkId === -1) {
                    currentBookmarkId = this.bookmarks.length - 1;
                }
            }
            currentBookmark = this.bookmarks[currentBookmarkId];
            if (currentBookmark.bookmarks.length === 0) {
                if (currentBookmark === this.activeBookmark) {
                    resolve(Bookmark_1.NO_MORE_BOOKMARKS);
                    return;
                }
                else {
                    this.nextDocumentWithBookmarks(currentBookmark, direction)
                        .then((nextDocument) => {
                        resolve(nextDocument);
                        return;
                    })
                        .catch((error) => {
                        reject(error);
                        return;
                    });
                }
            }
            else {
                if (fs.existsSync(currentBookmark.fsPath)) {
                    resolve(currentBookmark.fsPath);
                    return;
                }
                else {
                    this.nextDocumentWithBookmarks(currentBookmark, direction)
                        .then((nextDocument) => {
                        resolve(nextDocument);
                        return;
                    })
                        .catch((error) => {
                        reject(error);
                        return;
                    });
                }
            }
        });
    }
    nextBookmark(active, currentLine) {
        let currentBookmark = active;
        let currentBookmarkId;
        for (let index = 0; index < this.bookmarks.length; index++) {
            let element = this.bookmarks[index];
            if (element === active) {
                currentBookmarkId = index;
            }
        }
        return new Promise((resolve, reject) => {
            currentBookmark.nextBookmark(currentLine)
                .then((newLine) => {
                resolve(newLine);
                return;
            })
                .catch((error) => {
                // next document                  
                currentBookmarkId++;
                if (currentBookmarkId === this.bookmarks.length) {
                    currentBookmarkId = 0;
                }
                currentBookmark = this.bookmarks[currentBookmarkId];
            });
        });
    }
    zip(relativePath) {
        function isNotEmpty(book) {
            return book.bookmarks.length > 0;
        }
        let newBookmarks = new Bookmarks("");
        newBookmarks.bookmarks = JSON.parse(JSON.stringify(this.bookmarks)).filter(isNotEmpty);
        if (!relativePath) {
            return newBookmarks;
        }
        for (let element of newBookmarks.bookmarks) {
            element.fsPath = element.fsPath.replace(vscode.workspace.getWorkspaceFolder(vscode.Uri.file(element.fsPath)).uri.fsPath, "$ROOTPATH$");
        }
        return newBookmarks;
    }
    clear(book) {
        let b = book ? book : this.activeBookmark;
        b.clear();
        this.onDidClearBookmarkEmitter.fire(b);
    }
    clearAll() {
        for (let element of this.bookmarks) {
            element.clear();
        }
        this.onDidClearAllBookmarksEmitter.fire();
    }
    addBookmark(aline) {
        this.activeBookmark.bookmarks.push(aline);
        this.onDidAddBookmarkEmitter.fire({
            bookmark: this.activeBookmark,
            line: aline + 1,
            preview: vscode.window.activeTextEditor.document.lineAt(aline).text
        });
    }
    removeBookmark(index, aline, book) {
        let b = book ? book : this.activeBookmark;
        b.bookmarks.splice(index, 1);
        this.onDidRemoveBookmarkEmitter.fire({
            bookmark: b,
            line: aline + 1
        });
    }
    updateBookmark(index, oldLine, newLine, book) {
        let b = book ? book : this.activeBookmark;
        b.bookmarks[index] = newLine;
        this.onDidUpdateBookmarkEmitter.fire({
            bookmark: b,
            index: index,
            line: newLine + 1,
            preview: vscode.window.activeTextEditor.document.lineAt(newLine).text
        });
    }
}
exports.Bookmarks = Bookmarks;
//# sourceMappingURL=Bookmarks.js.map