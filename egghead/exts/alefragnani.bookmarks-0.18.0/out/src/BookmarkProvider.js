"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const path = require("path");
exports.NODE_FILE = 0;
exports.NODE_BOOKMARK = 1;
var BookmarkNodeKind;
(function (BookmarkNodeKind) {
    BookmarkNodeKind[BookmarkNodeKind["NODE_FILE"] = 0] = "NODE_FILE";
    BookmarkNodeKind[BookmarkNodeKind["NODE_BOOKMARK"] = 1] = "NODE_BOOKMARK";
})(BookmarkNodeKind = exports.BookmarkNodeKind || (exports.BookmarkNodeKind = {}));
;
;
let context;
let hasIcons = vscode.workspace.getConfiguration("workbench").get("iconTheme", "") !== null;
class BookmarkProvider {
    constructor(bookmarks, ctx) {
        this.bookmarks = bookmarks;
        this._onDidChangeTreeData = new vscode.EventEmitter();
        this.onDidChangeTreeData = this._onDidChangeTreeData.event;
        this.tree = [];
        context = ctx;
        bookmarks.onDidClearBookmark(bkm => {
            this._onDidChangeTreeData.fire();
        });
        bookmarks.onDidClearAllBookmarks(bkm => {
            this._onDidChangeTreeData.fire();
        });
        bookmarks.onDidAddBookmark(bkm => {
            // no bookmark in this file
            if (this.tree.length === 0) {
                this._onDidChangeTreeData.fire();
                return;
            }
            // has bookmarks - find it
            for (let bn of this.tree) {
                if (bn.bookmark === bkm.bookmark) {
                    bn.books.push({
                        file: bn.books[0].file,
                        line: bkm.line,
                        preview: bkm.line + ": " + bkm.preview
                    });
                    bn.books.sort((n1, n2) => {
                        if (n1.line > n2.line) {
                            return 1;
                        }
                        if (n1.line < n2.line) {
                            return -1;
                        }
                        return 0;
                    });
                    this._onDidChangeTreeData.fire(bn);
                    return;
                }
            }
            // not found - new file
            this._onDidChangeTreeData.fire();
        });
        bookmarks.onDidRemoveBookmark(bkm => {
            // no bookmark in this file
            if (this.tree.length === 0) {
                this._onDidChangeTreeData.fire();
                return;
            }
            // has bookmarks - find it
            for (let bn of this.tree) {
                if (bn.bookmark === bkm.bookmark) {
                    // last one - reset
                    if (bn.books.length === 1) {
                        this._onDidChangeTreeData.fire(null);
                        return;
                    }
                    // remove just that one
                    for (let index = 0; index < bn.books.length; index++) {
                        let element = bn.books[index];
                        if (element.line == bkm.line) {
                            bn.books.splice(index, 1);
                            this._onDidChangeTreeData.fire(bn);
                            return;
                        }
                    }
                }
            }
        });
        bookmarks.onDidUpdateBookmark(bkm => {
            // no bookmark in this file
            if (this.tree.length === 0) {
                this._onDidChangeTreeData.fire();
                return;
            }
            // has bookmarks - find it
            for (let bn of this.tree) {
                if (bn.bookmark === bkm.bookmark) {
                    bn.books[bkm.index].line = bkm.line;
                    bn.books[bkm.index].preview = bkm.line.toString() + ': ' + bkm.preview;
                    this._onDidChangeTreeData.fire(bn);
                    return;
                }
            }
            // not found - new file
            this._onDidChangeTreeData.fire();
        });
    }
    refresh() {
        this._onDidChangeTreeData.fire();
    }
    getTreeItem(element) {
        return element;
    }
    // very much based in `listFromAllFiles` command
    getChildren(element) {
        // no bookmark
        let totalBookmarkCount = 0;
        for (let elem of this.bookmarks.bookmarks) {
            totalBookmarkCount = totalBookmarkCount + elem.bookmarks.length;
        }
        if (totalBookmarkCount === 0) {
            this.tree = [];
            return Promise.resolve([]);
        }
        // loop !!!
        return new Promise(resolve => {
            if (element) {
                if (element.kind === BookmarkNodeKind.NODE_FILE) {
                    let ll = [];
                    for (let bbb of element.books) {
                        ll.push(new BookmarkNode(bbb.preview, vscode.TreeItemCollapsibleState.None, BookmarkNodeKind.NODE_BOOKMARK, null, [], {
                            command: "bookmarks.jumpTo",
                            title: "",
                            arguments: [bbb.file, bbb.line],
                        }));
                    }
                    resolve(ll);
                }
                else {
                    resolve([]);
                }
            }
            else {
                // ROOT
                this.tree = [];
                let promisses = [];
                for (let bookmark of this.bookmarks.bookmarks) {
                    let pp = bookmark.listBookmarks();
                    promisses.push(pp);
                }
                Promise.all(promisses).then((values) => {
                    // raw list
                    let lll = [];
                    for (let bb of this.bookmarks.bookmarks) {
                        // this bookmark has bookmarks?
                        if (bb.bookmarks.length > 0) {
                            let books = [];
                            // search from `values`
                            for (let element of values) {
                                if (element) {
                                    for (let elementInside of element) {
                                        if (bb.fsPath === elementInside.detail) {
                                            books.push({
                                                file: elementInside.detail,
                                                line: parseInt(elementInside.label, 10),
                                                preview: elementInside.label + ": " + elementInside.description
                                            });
                                        }
                                    }
                                }
                            }
                            let itemPath = removeBasePathFrom(bb.fsPath);
                            let bn = new BookmarkNode(itemPath, vscode.TreeItemCollapsibleState.Collapsed, BookmarkNodeKind.NODE_FILE, bb, books);
                            lll.push(bn);
                            this.tree.push(bn);
                        }
                    }
                    resolve(lll);
                });
            }
        });
    }
}
exports.BookmarkProvider = BookmarkProvider;
function removeBasePathFrom(aPath) {
    if (!vscode.workspace.workspaceFolders) {
        return aPath;
    }
    let inWorkspace;
    for (const wf of vscode.workspace.workspaceFolders) {
        if (aPath.indexOf(wf.uri.fsPath) === 0) {
            inWorkspace = wf;
            break;
        }
    }
    if (inWorkspace) {
        if (vscode.workspace.workspaceFolders.length === 1) {
            return aPath.split(inWorkspace.uri.fsPath).pop().substr(1);
        }
        else {
            return inWorkspace.name + path.sep + aPath.split(inWorkspace.uri.fsPath).pop().substr(1);
        }
    }
    else {
        return aPath;
    }
}
class BookmarkNode extends vscode.TreeItem {
    constructor(label, collapsibleState, kind, bookmark, books, command) {
        super(label, collapsibleState);
        this.label = label;
        this.collapsibleState = collapsibleState;
        this.kind = kind;
        this.bookmark = bookmark;
        this.books = books;
        this.command = command;
        if (kind === BookmarkNodeKind.NODE_FILE) {
            if (hasIcons) {
                this.iconPath = {
                    light: context.asAbsolutePath("images/bookmark-explorer-light.svg"),
                    dark: context.asAbsolutePath("images/bookmark-explorer-dark.svg")
                };
            }
            this.contextValue = "BookmarkNodeFile";
        }
        else {
            this.iconPath = {
                light: context.asAbsolutePath("images/bookmark.svg"),
                dark: context.asAbsolutePath("images/bookmark.svg")
            };
            this.contextValue = "BookmarkNodeBookmark";
        }
    }
}
//# sourceMappingURL=BookmarkProvider.js.map