"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
class CodeFragmentTreeItem extends vscode.TreeItem {
    constructor(label, id, collapsibleState, command) {
        super(label, collapsibleState);
        this.label = label;
        this.id = id;
        this.collapsibleState = collapsibleState;
        this.command = command;
    }
}
exports.CodeFragmentTreeItem = CodeFragmentTreeItem;
class CodeFragmentProvider {
    constructor(fragmentManager) {
        this.fragmentManager = fragmentManager;
        this.onDidChangeTreeDataEmitter = new vscode.EventEmitter();
        this.onDidChangeTreeData = this.onDidChangeTreeDataEmitter.event;
        fragmentManager.onFragmentsChanged(() => this.onDidChangeTreeDataEmitter.fire());
    }
    getTreeItem(element) {
        return element;
    }
    getChildren(element) {
        return new Promise(resolve => {
            resolve(this.fragmentManager.getAll().map(f => new CodeFragmentTreeItem(f.label, f.id, vscode.TreeItemCollapsibleState.None, {
                arguments: [f.id],
                command: 'codeFragments.insertCodeFragment',
                title: 'Insert Code Fragment',
                tooltip: 'Insert Code Fragment'
            })));
        });
    }
}
exports.CodeFragmentProvider = CodeFragmentProvider;
//# sourceMappingURL=codeFragmentsTreeItem.js.map