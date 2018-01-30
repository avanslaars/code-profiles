var vscode = require('vscode');
var path = require('path');

exports.activate = function (context) {
  var debugMode = vscode.workspace.getConfiguration() && vscode.workspace.getConfiguration().get('wallaby.debug', false);
  if (debugMode) {
    global.originalRequire = require;
  }

  return debugMode || path.basename(__dirname) === 'dist'
    ? require('./extension').activate(context)
    : (global.originalRequire = require, require('./dist' + '/index').activate(context));
};
