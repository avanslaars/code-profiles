"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const fs = require("fs");
const Bookmark_1 = require("./Bookmark");
const Storage_1 = require("./Storage");
class BookmarksController {
    constructor(jsonObject) {
        this.onDidClearBookmarkEmitter = new vscode.EventEmitter();
        this.onDidClearAllBookmarksEmitter = new vscode.EventEmitter();
        this.onDidAddBookmarkEmitter = new vscode.EventEmitter();
        this.onDidRemoveBookmarkEmitter = new vscode.EventEmitter();
        this.onDidUpdateBookmarkEmitter = new vscode.EventEmitter();
        // public bookmarks: BookmarkedFile[];
        this.activeBookmark = undefined;
        this.updateRelativePath = (path) => {
            let wsPath = vscode.workspace.getWorkspaceFolder(vscode.Uri.file(path));
            if (wsPath) {
                path = path.replace(wsPath.uri.fsPath, "$ROOTPATH$");
            }
            return path;
        };
        this.storage = new Storage_1.Storage.BookmarksStorage();
        // this.bookmarks = [];
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
    fromUri(uri) {
        uri = BookmarksController.normalize(uri);
        for (let element of this.storage.fileList) {
            if (element.path === uri) {
                return element;
            }
        }
    }
    add(uri) {
        uri = BookmarksController.normalize(uri);
        let existing = this.fromUri(uri);
        if (typeof existing === "undefined") {
            let bookmark = new Bookmark_1.BookmarkedFile(uri);
            this.storage.fileList.push(bookmark);
        }
    }
    nextDocumentWithBookmarks(active, direction = Bookmark_1.JUMP_FORWARD) {
        let currentBookmark = active;
        let currentBookmarkId;
        for (let index = 0; index < this.storage.fileList.length; index++) {
            let element = this.storage.fileList[index];
            if (element === active) {
                currentBookmarkId = index;
            }
        }
        return new Promise((resolve, reject) => {
            if (direction === Bookmark_1.JUMP_FORWARD) {
                currentBookmarkId++;
                if (currentBookmarkId === this.storage.fileList.length) {
                    currentBookmarkId = 0;
                }
            }
            else {
                currentBookmarkId--;
                if (currentBookmarkId === -1) {
                    currentBookmarkId = this.storage.fileList.length - 1;
                }
            }
            currentBookmark = this.storage.fileList[currentBookmarkId];
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
                if (fs.existsSync(currentBookmark.path)) {
                    resolve(currentBookmark.path);
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
    clear(book) {
        let b = book ? book : this.activeBookmark;
        b.clear();
        this.onDidClearBookmarkEmitter.fire(b);
    }
    clearAll() {
        for (let element of this.storage.fileList) {
            element.clear();
        }
        this.onDidClearAllBookmarksEmitter.fire();
    }
    addBookmark(position, label) {
        if (!label) {
            this.activeBookmark.bookmarks.push(new Bookmark_1.BookmarkItem(position.line, position.character));
            this.onDidAddBookmarkEmitter.fire({
                bookmarkedFile: this.activeBookmark,
                line: position.line + 1,
                column: position.character + 1,
                linePreview: vscode.window.activeTextEditor.document.lineAt(position.line).text.trim()
            });
        }
        else {
            this.activeBookmark.bookmarks.push(new Bookmark_1.BookmarkItem(position.line, position.character, label));
            this.onDidAddBookmarkEmitter.fire({
                bookmarkedFile: this.activeBookmark,
                line: position.line + 1,
                column: position.character + 1,
                label: label
            });
        }
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
        b.bookmarks[index].line = newLine;
        if (!b.bookmarks[index].label) {
            this.onDidUpdateBookmarkEmitter.fire({
                bookmarkedFile: b,
                index: index,
                line: newLine + 1,
                linePreview: vscode.window.activeTextEditor.document.lineAt(newLine).text
            });
        }
        else {
            this.onDidUpdateBookmarkEmitter.fire({
                bookmarkedFile: b,
                index: index,
                line: newLine + 1,
                label: b.bookmarks[index].label
            });
        }
    }
    hasAnyBookmark() {
        let totalBookmarkCount = 0;
        for (let element of this.storage.fileList) {
            totalBookmarkCount = totalBookmarkCount + element.bookmarks.length;
        }
        return totalBookmarkCount > 0;
    }
    ///
    loadFrom(jsonObject, relativePath) {
        if (jsonObject === "") {
            return;
        }
        this.storage.load(jsonObject, relativePath, vscode.workspace.workspaceFolders ? vscode.workspace.workspaceFolders[0].uri.fsPath : undefined);
    }
    zip(relativePath) {
        return this.storage.save(relativePath, this.updateRelativePath);
    }
}
exports.BookmarksController = BookmarksController;
//# sourceMappingURL=Bookmarks.js.map