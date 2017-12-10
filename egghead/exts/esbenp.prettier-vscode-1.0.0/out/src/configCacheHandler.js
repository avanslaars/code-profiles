"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode_1 = require("vscode");
const prettier = require('prettier');
const PRETTIER_CONFIG_FILES = [
    '.prettierrc',
    '.prettierrc.json',
    '.prettierrc.yaml',
    '.prettierrc.yml',
    '.prettierrc.js',
    'package.json',
    'prettier.config.js',
];
function fileListener() {
    const fileWatcher = vscode_1.workspace.createFileSystemWatcher(`**/{${PRETTIER_CONFIG_FILES.join(',')}}`);
    fileWatcher.onDidChange(prettier.clearConfigCache);
    fileWatcher.onDidCreate(prettier.clearConfigCache);
    fileWatcher.onDidDelete(prettier.clearConfigCache);
    return fileWatcher;
}
exports.default = fileListener;
//# sourceMappingURL=configCacheHandler.js.map