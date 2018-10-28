/*
 * Wallaby.js - v1.0.612
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
module.exports=function(sourceCode){return eval('try {if (wallaby._frameworks.sinon) {var sinon = require("sinon");wallaby._frameworks.sinon.wrapped.forEach(function(obj) { sinon.restore(obj); });wallaby._frameworks.sinon.stubs.forEach(function(obj) { obj.restore(); });wallaby._frameworks.sinon.wrapped = [];}} catch(e) { }try {if (global.jasmine && global.jasmine._wallabyUndoSpies) {global.jasmine._wallabyUndoSpies();}} catch(e) { }'+(sourceCode?"try {  var moduleFileName = module.filename; delete module.filename; ("+sourceCode+")(wallaby); }finally { module.filename = moduleFileName; }":""))};