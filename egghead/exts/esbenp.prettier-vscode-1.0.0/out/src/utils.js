"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode_1 = require("vscode");
function getConfig(uri) {
    return vscode_1.workspace.getConfiguration('prettier', uri);
}
exports.getConfig = getConfig;
function getParsersFromLanguageId(languageId, version) {
    const language = getSupportLanguages().find(lang => lang.vscodeLanguageIds.includes(languageId));
    if (!language) {
        return [];
    }
    return language.parsers;
}
exports.getParsersFromLanguageId = getParsersFromLanguageId;
function allEnabledLanguages() {
    return getSupportLanguages().reduce((ids, language) => [...ids, ...language.vscodeLanguageIds], []);
}
exports.allEnabledLanguages = allEnabledLanguages;
function allJSLanguages() {
    return getGroup('JavaScript')
        .filter(language => language.group === 'JavaScript')
        .reduce((ids, language) => [...ids, ...language.vscodeLanguageIds], []);
}
exports.allJSLanguages = allJSLanguages;
function getGroup(group) {
    return getSupportLanguages().filter(language => language.group === group);
}
exports.getGroup = getGroup;
function getSupportLanguages() {
    return require('prettier').getSupportInfo().languages;
}
//# sourceMappingURL=utils.js.map