var vscode = require('vscode');
var path = require('path');

exports.activate = function (context) {
  var debugMode = vscode.workspace.getConfiguration() && vscode.workspace.getConfiguration().get('quokka.debug', false);
  if (debugMode) {
    global.originalRequire = require;
    context.globalState.update('corePath', '../../' + 'wallaby/client');
  } else {
    context.globalState.update('corePath', './' + 'wallaby/client');
  }

  if (debugMode) {
    require('./out' + '/extension').activate(context);
  } else if (path.basename(__dirname) === 'dist') {
    require('./extension').activate(context);
  } else {
    global.originalRequire = require;
    require('./dist' + '/index').activate(context);
  }
};
