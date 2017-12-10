"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const vscode = require("vscode");
class PersistedFragment {
    constructor(label, content) {
        this.label = label;
        this.content = content;
    }
}
class ExportFile {
    constructor(codeFragments) {
        this.codeFragments = codeFragments;
    }
}
var ImportResult;
(function (ImportResult) {
    ImportResult[ImportResult["Success"] = 0] = "Success";
    ImportResult[ImportResult["NoFragments"] = 1] = "NoFragments";
})(ImportResult = exports.ImportResult || (exports.ImportResult = {}));
class Exporter {
    constructor(manager) {
        this.manager = manager;
    }
    export() {
        return vscode.window.showSaveDialog({
            defaultUri: vscode.Uri.file('codeFragments.json'),
            filters: {
                'Json files': ['json'],
                'All files': ['*']
            }
        })
            .then(uri => {
            if (!uri) {
                return;
            }
            const allFragments = this.manager.getAllWithContent();
            const exportContent = JSON.stringify(new ExportFile(allFragments.map((pair) => new PersistedFragment(pair[0].label, pair[1].content))));
            return this.writeFileAsync(uri.fsPath, exportContent);
        });
    }
    import() {
        return vscode.window.showOpenDialog({
            canSelectFiles: true,
            canSelectFolders: false,
            canSelectMany: false,
            filters: {
                'Json files': ['json'],
                'All files': ['*']
            },
        })
            .then(uri => {
            if (uri) {
                return this.readFileAsync(uri[0].fsPath);
            }
            else {
                return;
            }
        })
            .then(data => {
            if (data) {
                const json = JSON.parse(data);
                if (json.codeFragments && json.codeFragments.some(f => !!f.content && !!f.label)) {
                    const tasks = json.codeFragments.map(fragment => {
                        this.manager.saveNewCodeFragment(fragment.content, fragment.label);
                    });
                    return Promise.all(tasks).then(() => ImportResult.Success);
                }
                else {
                    return ImportResult.NoFragments;
                }
            }
            else {
                // User pressed Cancel or closed the Open File dialog.
                return ImportResult.Success;
            }
        });
    }
    readFileAsync(filename) {
        return new Promise((resolve, reject) => {
            fs.readFile(filename, 'utf8', (err, data) => {
                if (err) {
                    reject(err);
                }
                resolve(data);
            });
        });
    }
    writeFileAsync(filename, data) {
        return new Promise((resolve, reject) => {
            fs.writeFile(filename, data, err => {
                if (err) {
                    reject(err);
                }
                resolve();
            });
        });
    }
}
exports.Exporter = Exporter;
//# sourceMappingURL=exporter.js.map