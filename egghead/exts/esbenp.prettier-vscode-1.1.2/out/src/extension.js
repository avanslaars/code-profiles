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
function selectorsCreator(wf) {
    const allLanguages = utils_1.allEnabledLanguages();
    const allRangeLanguages = utils_1.allJSLanguages();
    const { disableLanguages } = utils_1.getConfig(wf.uri);
    const relativePattern = new vscode_1.RelativePattern(wf, '**');
    function docFilterForLangs(languages) {
        return languages.filter(l => !disableLanguages.includes(l)).map(l => ({
            language: l,
            pattern: relativePattern,
        }));
    }
    const languageSelector = docFilterForLangs(allLanguages);
    const rangeLanguageSelector = docFilterForLangs(allRangeLanguages);
    return { languageSelector, rangeLanguageSelector };
}
function selectors() {
    const allLanguages = utils_1.allEnabledLanguages();
    const allRangeLanguages = utils_1.allJSLanguages();
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
    return vscode_1.workspace.workspaceFolders.reduce((previous, workspaceFolder) => {
        let { languageSelector, rangeLanguageSelector } = previous;
        const select = selectorsCreator(workspaceFolder);
        return {
            languageSelector: languageSelector.concat(select.languageSelector),
            rangeLanguageSelector: rangeLanguageSelector.concat(select.rangeLanguageSelector),
        };
    }, {
        languageSelector: untitledLanguageSelector,
        rangeLanguageSelector: untitledRangeLanguageSelector,
    });
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