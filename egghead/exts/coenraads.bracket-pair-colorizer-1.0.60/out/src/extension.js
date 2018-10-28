"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const vscode_1 = require("vscode");
const documentDecorationManager_1 = require("./documentDecorationManager");
function wait(ms) {
    return new Promise((resolve) => setTimeout(() => resolve(), ms));
}
function activate(context) {
    return __awaiter(this, void 0, void 0, function* () {
        // Below new() line calls huge require()s and takes about 2 secs in MBP 15-inch Mid 2014.
        // Wait 0.5 sec to let other plugins be loaded before this plugin.
        yield wait(500);
        let documentDecorationManager = new documentDecorationManager_1.default();
        context.subscriptions.push(vscode_1.commands.registerCommand("bracket-pair-colorizer.expandBracketSelection", () => {
            const editor = vscode_1.window.activeTextEditor;
            if (!editor) {
                return;
            }
            documentDecorationManager.expandBracketSelection(editor);
        }), vscode_1.commands.registerCommand("bracket-pair-colorizer.undoBracketSelection", () => {
            const editor = vscode_1.window.activeTextEditor;
            if (!editor) {
                return;
            }
            documentDecorationManager.undoBracketSelection(editor);
        }), vscode_1.workspace.onDidChangeConfiguration((event) => {
            if (event.affectsConfiguration("bracketPairColorizer") ||
                event.affectsConfiguration("editor.lineHeight") ||
                event.affectsConfiguration("editor.fontSize")) {
                documentDecorationManager.Dispose();
                documentDecorationManager = new documentDecorationManager_1.default();
                documentDecorationManager.updateAllDocuments();
            }
        }), vscode_1.window.onDidChangeVisibleTextEditors(() => {
            documentDecorationManager.updateAllDocuments();
        }), vscode_1.workspace.onDidChangeTextDocument((event) => {
            documentDecorationManager.onDidChangeTextDocument(event);
        }), vscode_1.workspace.onDidCloseTextDocument((event) => {
            documentDecorationManager.onDidCloseTextDocument(event);
        }), vscode_1.workspace.onDidOpenTextDocument((event) => {
            documentDecorationManager.onDidOpenTextDocument(event);
        }), vscode_1.window.onDidChangeTextEditorSelection((event) => {
            documentDecorationManager.onDidChangeSelection(event);
        }));
        documentDecorationManager.updateAllDocuments();
    });
}
exports.activate = activate;
// tslint:disable-next-line:no-empty
function deactivate() {
}
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map