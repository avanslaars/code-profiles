"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode_1 = require("vscode");
const PrettierEditProvider_1 = require("./PrettierEditProvider");
const errorHandler_1 = require("./errorHandler");
const utils_1 = require("./utils");
const configCacheHandler_1 = require("./configCacheHandler");
const ignoreFileHandler_1 = require("./ignoreFileHandler");
let formatterHandler;
let rangeFormatterHandler;
function disposeHandlers() {
    if (formatterHandler) {
        formatterHandler.dispose();
    }
    if (rangeFormatterHandler) {
        rangeFormatterHandler.dispose();
    }
    formatterHandler = undefined;
    rangeFormatterHandler = undefined;
}
function selectors() {
    const allLanguages = utils_1.allEnabledLanguages();
    const allRangeLanguages = utils_1.rangeSupportedLanguages();
    const { disableLanguages } = utils_1.getConfig();
    const globalLanguageSelector = allLanguages.filter(l => !disableLanguages.includes(l));
    const globalRangeLanguageSelector = allRangeLanguages.filter(l => !disableLanguages.includes(l));
    if (vscode_1.workspace.workspaceFolders === undefined) {
        return {
            languageSelector: globalLanguageSelector,
            rangeLanguageSelector: globalRangeLanguageSelector,
        };
    }
    const untitledLanguageSelector = globalLanguageSelector.map(l => ({ language: l, scheme: 'untitled' }));
    const untitledRangeLanguageSelector = globalRangeLanguageSelector.map(l => ({ language: l, scheme: 'untitled' }));
    const fileLanguageSelector = globalLanguageSelector.map(l => ({ language: l, scheme: 'file' }));
    const fileRangeLanguageSelector = globalRangeLanguageSelector.map(l => ({ language: l, scheme: 'file' }));
    return {
        languageSelector: untitledLanguageSelector.concat(fileLanguageSelector),
        rangeLanguageSelector: untitledRangeLanguageSelector.concat(fileRangeLanguageSelector),
    };
}
function activate(context) {
    const { fileIsIgnored } = ignoreFileHandler_1.default(context.subscriptions);
    const editProvider = new PrettierEditProvider_1.default(fileIsIgnored);
    function registerFormatter() {
        disposeHandlers();
        const { languageSelector, rangeLanguageSelector } = selectors();
        rangeFormatterHandler = vscode_1.languages.registerDocumentRangeFormattingEditProvider(rangeLanguageSelector, editProvider);
        formatterHandler = vscode_1.languages.registerDocumentFormattingEditProvider(languageSelector, editProvider);
    }
    registerFormatter();
    context.subscriptions.push(vscode_1.workspace.onDidChangeWorkspaceFolders(registerFormatter), {
        dispose: disposeHandlers,
    }, errorHandler_1.setupErrorHandler(), configCacheHandler_1.default(), ...errorHandler_1.registerDisposables());
}
exports.activate = activate;
function deactivate() { }
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map