"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Bookmark_1 = require("./Bookmark");
var Storage;
(function (Storage) {
    Storage.WORKSPACE_ROOTPATH = "$ROOTPATH$";
    Storage.WORKSPACE_UNDEFINED = '$UNTITLED$';
    Storage.WORKSPACE_SINGLE = '.';
    /**
     * Implements *THE `Storage`*
     */
    class BookmarksStorage {
        constructor() {
            this.fileList = [];
        }
        /**
         * Adds a file to the list
         *
         * @param `filepath` The [File path](#File.path)
         *
         * @return `void`
         */
        pushFile(filePath) {
            this.fileList.push(new Bookmark_1.BookmarkedFile(filePath));
        }
        /**
         * Loads the `bookmarks.json` file
         *
         * @return A `string` containing the _Error Message_ in case something goes wrong.
         *         An **empty string** if everything is ok.
         */
        load(jsonObject, relativePath, folder) {
            try {
                // OLD format
                if ((jsonObject.bookmarks)) {
                    for (let file of jsonObject.bookmarks) {
                        if (relativePath) {
                            file.fsPath = file.fsPath.replace(Storage.WORKSPACE_ROOTPATH, folder);
                        }
                        const fi = new Bookmark_1.BookmarkedFile(file.fsPath);
                        for (const bkm of file.bookmarks) {
                            fi.bookmarks.push(new Bookmark_1.BookmarkItem(bkm));
                        }
                        this.fileList.push(fi);
                    }
                    this.saveLoaded(folder);
                }
                else {
                    for (let file of jsonObject) {
                        if (relativePath) {
                            file.path = file.path.replace(Storage.WORKSPACE_ROOTPATH, folder);
                        }
                        const fi = new Bookmark_1.BookmarkedFile(file.path);
                        for (const bkm of file.bookmarks) {
                            fi.bookmarks.push(new Bookmark_1.BookmarkItem(bkm.line, bkm.column, bkm.label));
                        }
                        this.fileList.push(fi);
                    }
                    this.saveLoaded(folder);
                }
                return "";
            }
            catch (error) {
                console.log(error);
                return error.toString();
            }
        }
        /**
         * Saves the `bookmarks.json` file to disk
         *
         * @param `split` Should it save each workspace it it's own folder?
         *
         * @return `void`
         */
        saveLoaded(folder) {
            return;
            // if (!folder) {
            //     return;
            // }
            // fs.writeFileSync(path.join(folder, "teste-bookmarks-fileList.json"), JSON.stringify(this.fileList, null, "\t"));
        }
        save(relativePath, updateRelativePath) {
            function isNotEmpty(file) {
                return file.bookmarks.length > 0;
            }
            let newStorage = new Storage.BookmarksStorage();
            newStorage.fileList = JSON.parse(JSON.stringify(this.fileList)).filter(isNotEmpty);
            if (!relativePath) {
                return newStorage.fileList;
            }
            for (let element of newStorage.fileList) {
                element.path = updateRelativePath(element.path);
            }
            return newStorage.fileList;
        }
    }
    Storage.BookmarksStorage = BookmarksStorage;
})(Storage = exports.Storage || (exports.Storage = {}));
//# sourceMappingURL=Storage.js.map