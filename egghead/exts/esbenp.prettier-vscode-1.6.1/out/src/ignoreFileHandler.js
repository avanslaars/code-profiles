"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const path = require("path");
const vscode_1 = require("vscode");
const utils_1 = require("./utils");
const errorHandler_1 = require("./errorHandler");
const ignore = require('ignore');
const nullIgnorer = { ignores: () => false };
function ignoreFileHandler(disposables) {
    const ignorers = new Map();
    disposables.push({ dispose: () => ignorers.clear() });
    return {
        fileIsIgnored(filePath) {
            const { ignorer, ignoreFilePath } = getIgnorerForFile(filePath);
            return ignorer.ignores(path.relative(path.dirname(ignoreFilePath), filePath));
        },
    };
    function getIgnorerForFile(fsPath) {
        const absolutePath = getIgnorePathForFile(fsPath, utils_1.getConfig(vscode_1.Uri.file(fsPath)).ignorePath);
        if (!absolutePath) {
            return { ignoreFilePath: '', ignorer: nullIgnorer };
        }
        if (!ignorers.has(absolutePath)) {
            loadIgnorer(vscode_1.Uri.file(absolutePath));
        }
        if (!fs_1.existsSync(absolutePath)) {
            const ignorePath = utils_1.getConfig(vscode_1.Uri.file(fsPath)).ignorePath;
            if (ignorePath !== '.prettierignore') {
                errorHandler_1.addToOutput(`Wrong prettier.ignorePath provided in your settings. The path (${ignorePath}) does not exist.`);
            }
            return { ignoreFilePath: '', ignorer: nullIgnorer };
        }
        return {
            ignoreFilePath: absolutePath,
            ignorer: ignorers.get(absolutePath),
        };
    }
    function loadIgnorer(ignoreUri) {
        let ignorer = nullIgnorer;
        if (!ignorers.has(ignoreUri.fsPath)) {
            const fileWatcher = vscode_1.workspace.createFileSystemWatcher(ignoreUri.fsPath);
            disposables.push(fileWatcher);
            fileWatcher.onDidCreate(loadIgnorer, null, disposables);
            fileWatcher.onDidChange(loadIgnorer, null, disposables);
            fileWatcher.onDidDelete(unloadIgnorer, null, disposables);
        }
        if (fs_1.existsSync(ignoreUri.fsPath)) {
            const ignoreFileContents = fs_1.readFileSync(ignoreUri.fsPath, 'utf8');
            ignorer = ignore().add(ignoreFileContents);
        }
        ignorers.set(ignoreUri.fsPath, ignorer);
    }
    function unloadIgnorer(ignoreUri) {
        ignorers.set(ignoreUri.fsPath, nullIgnorer);
    }
}
function getIgnorePathForFile(filePath, ignorePath) {
    if (!ignorePath) {
        return null;
    }
    if (vscode_1.workspace.workspaceFolders) {
        const folder = vscode_1.workspace.getWorkspaceFolder(vscode_1.Uri.file(filePath));
        return folder ? getPath(ignorePath, folder.uri.fsPath) : null;
    }
    return null;
}
function getPath(fsPath, relativeTo) {
    return path.isAbsolute(fsPath) ? fsPath : path.join(relativeTo, fsPath);
}
exports.default = ignoreFileHandler;
//# sourceMappingURL=ignoreFileHandler.js.map