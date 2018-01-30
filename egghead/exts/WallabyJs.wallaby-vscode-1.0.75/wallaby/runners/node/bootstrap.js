/*
 * Wallaby.js - v1.0.544
 * http://wallabyjs.com
 * Copyright (c) 2014-2018 Wallaby.js - All Rights Reserved.
 *
 * This source code file is a part of Wallaby.js and is a proprietary (closed source) software.

 * IMPORTANT:
 * Wallaby.js is a tool made by software developers for software developers with passion and love for what we do.
 * Pirating the tool is not only illegal and just morally wrong,
 * it is also unfair to other fellow programmers who are using it legally,
 * and very harmful for the tool and its future.
 */
module.exports=function(sourceCode){return eval('try { if (!require.main._wallabyPathsAdded) {require.main.paths.push(process.cwd());require.main.paths.push(require("path").join(process.cwd(), "node_modules")); require.main._wallabyPathsAdded = 1; }} catch(e) {}try { if (!wallaby._fileExtensionsAdded) {require.extensions[".es7"] = require.extensions[".es6"] = require.extensions[".es"] = require.extensions[".jsx"] = require.extensions[".js"];wallaby._fileExtensionsAdded = true;}} catch(e) {}try { if (wallaby._regeneratorRuntime) {require(wallaby._regeneratorRuntime);delete wallaby._regeneratorRuntime;}} catch(e) {}try {if (wallaby._frameworks.chai) {try {var chai = require("chai"); chaiVersion = (chai.version || "").split(".");if(chaiVersion[0] <= 3 && chaiVersion[1] <= 2) { chai.config.includeStack = true; }} catch(e) { delete wallaby._frameworks.chai; }}if (wallaby._frameworks.sinon) {wallaby._frameworks.sinon.wrapped = [];if (!wallaby._frameworks.sinon.initialized) {(function(){try {var sinon = require("sinon");var originalWrapMethod = sinon.wrapMethod;sinon.wrapMethod = function (obj) { wallaby._frameworks.sinon.wrapped.push(obj); return originalWrapMethod.apply(this, arguments);};wallaby._frameworks.sinon.initialized = true;} catch(e) { delete wallaby._frameworks.sinon; }})();}}} catch(e) { }try {if (wallaby._frameworks.quibble) {try {require("quibble").ignoreCallsFromThisFile(require.main.filename);} catch(e) { } finally { delete wallaby._frameworks.quibble; }}} catch(e) { }'+(sourceCode?"try {  var moduleFileName = module.filename; delete module.filename; ("+sourceCode+")(wallaby); }finally { module.filename = moduleFileName; }":""))};