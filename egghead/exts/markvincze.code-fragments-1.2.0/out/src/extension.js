'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const codeFragmentsTreeItem_1 = require("./codeFragmentsTreeItem");
const exporter_1 = require("./exporter");
const fragmentManager_1 = require("./fragmentManager");
function activate(context) {
    const fragmentManager = new fragmentManager_1.FragmentManager(context);
    const codeFragmentProvider = new codeFragmentsTreeItem_1.CodeFragmentProvider(fragmentManager);
    const saveSelectedCodeFragment = () => {
        const showNoTextMsg = () => vscode.window.showInformationMessage('Select a piece of code in the editor to save it as a fragment.');
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            showNoTextMsg();
            return;
        }
        editor.edit(builder => {
            const content = editor.document.getText(editor.selection);
            if (content.length < 1) {
                showNoTextMsg();
                return;
            }
            const config = vscode.workspace.getConfiguration('codeFragments');
            const defaultLabel = content.substr(0, 100);
            if (config.get('askForNameOnCreate')) {
                const opt = {
                    ignoreFocusOut: false,
                    placeHolder: 'Code Fragment Name',
                    prompt: 'Give the fragment a name...',
                    value: defaultLabel
                };
                vscode.window.showInputBox(opt)
                    .then(label => {
                    fragmentManager.saveNewCodeFragment(content, label);
                });
            }
            else {
                fragmentManager.saveNewCodeFragment(content, defaultLabel);
            }
        });
    };
    const insertCodeFragment = fragmentId => {
        if (!fragmentId) {
            vscode.window.showInformationMessage('Insert a code fragment into the editor by clicking on it in the Code Fragments view.');
        }
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            vscode.window.showInformationMessage('Open a file in the editor to insert a fragment.');
            return;
        }
        const content = fragmentManager.getFragmentContent(fragmentId);
        if (content) {
            editor.edit(builder => {
                builder.insert(editor.selection.start, content.content);
            });
        }
    };
    const deleteCodeFragment = (fragment) => {
        if (!fragment) {
            vscode.window.showInformationMessage('Delete a fragment by right clicking on it in the list and selecting "Delete Code Fragment".');
        }
        fragmentManager.deleteFragment(fragment.id);
    };
    const renameCodeFragment = (fragment) => {
        if (!fragment) {
            vscode.window.showInformationMessage('Rename a fragment by right clicking on it in the list and selecting "Rename Code Fragment".');
        }
        const opt = {
            ignoreFocusOut: false,
            placeHolder: 'Code Fragment Name',
            prompt: 'Rename Code Fragment...',
            value: fragment.label
        };
        vscode.window.showInputBox(opt)
            .then(newName => {
            if (newName) {
                return fragmentManager.renameFragment(fragment.id, newName);
            }
        });
    };
    const moveUpCodeFragment = (fragment) => {
        if (fragment) {
            fragmentManager.moveUpCodeFragment(fragment.id);
        }
    };
    const moveDownCodeFragment = (fragment) => {
        if (fragment) {
            fragmentManager.moveDownCodeFragment(fragment.id);
        }
    };
    const moveToTopCodeFragment = (fragment) => {
        if (fragment) {
            fragmentManager.moveToTopCodeFragment(fragment.id);
        }
    };
    const moveToBottomCodeFragment = (fragment) => {
        if (fragment) {
            fragmentManager.moveToBottomCodeFragment(fragment.id);
        }
    };
    const exportFragments = () => {
        const exporter = new exporter_1.Exporter(fragmentManager);
        return exporter.export()
            .then(result => result, error => vscode.window.showErrorMessage(error.message));
    };
    const importFragments = () => {
        const exporter = new exporter_1.Exporter(fragmentManager);
        return exporter.import()
            .then(result => {
            if (result === exporter_1.ImportResult.NoFragments) {
                vscode.window.showInformationMessage('No fragments were found in the selected file.');
            }
        }, error => vscode.window.showErrorMessage(error));
    };
    const deleteAllFragments = () => {
        const exporter = new exporter_1.Exporter(fragmentManager);
        return vscode.window.showWarningMessage('All code fragments will be deleted, and there is no way to undo. Are you sure?', { modal: true, }, 'Delete')
            .then(action => {
            if (action === 'Delete') {
                return fragmentManager.deleteAllFragments()
                    .then(result => result, error => vscode.window.showErrorMessage(error));
            }
        });
    };
    fragmentManager
        .initialize()
        .then(() => {
        vscode.window.registerTreeDataProvider('codeFragments', codeFragmentProvider);
        context.subscriptions.push(vscode.commands.registerCommand('codeFragments.saveSelectedCodeFragment', saveSelectedCodeFragment));
        context.subscriptions.push(vscode.commands.registerCommand('codeFragments.insertCodeFragment', insertCodeFragment));
        context.subscriptions.push(vscode.commands.registerCommand('codeFragments.deleteCodeFragment', deleteCodeFragment));
        context.subscriptions.push(vscode.commands.registerCommand('codeFragments.renameCodeFragment', renameCodeFragment));
        context.subscriptions.push(vscode.commands.registerCommand('codeFragments.moveUpCodeFragment', moveUpCodeFragment));
        context.subscriptions.push(vscode.commands.registerCommand('codeFragments.moveDownCodeFragment', moveDownCodeFragment));
        context.subscriptions.push(vscode.commands.registerCommand('codeFragments.moveToTopCodeFragment', moveToTopCodeFragment));
        context.subscriptions.push(vscode.commands.registerCommand('codeFragments.moveToBottomCodeFragment', moveToBottomCodeFragment));
        context.subscriptions.push(vscode.commands.registerCommand('codeFragments.exportFragments', exportFragments));
        context.subscriptions.push(vscode.commands.registerCommand('codeFragments.importFragments', importFragments));
        context.subscriptions.push(vscode.commands.registerCommand('codeFragments.deleteAllFragments', deleteAllFragments));
    });
}
exports.activate = activate;
function deactivate() { }
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map