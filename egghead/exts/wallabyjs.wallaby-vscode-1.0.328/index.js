const vscode = require('vscode');
const path = require('path');

exports.activate = function (context) {
  const debugMode = vscode.workspace.getConfiguration() && vscode.workspace.getConfiguration().get('wallaby.debug', false);
  if (debugMode) {
    global.originalRequire = require;
  }

  return debugMode || path.basename(__dirname) === 'dist'
    ? require('./extension').activate(context)
    : (global.originalRequire = require, require('./dist' + '/index').activate(context));
};
