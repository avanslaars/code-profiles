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
var Suite=require("../suite"),Test=require("../test"),escapeRe=require("escape-string-regexp"),utils=require("../utils");module.exports=function(e){var t=[e];e.on("pre-require",function(e,n,i){e.before=function(e,n){t[0].beforeAll(e,n)},e.after=function(e,n){t[0].afterAll(e,n)},e.beforeEach=function(e,n){t[0].beforeEach(e,n)},e.afterEach=function(e,n){t[0].afterEach(e,n)},e.suite=function(e){t.length>1&&t.shift();var i=Suite.create(t[0],e);return i.file=n,t.unshift(i),i},e.suite.only=function(t,n){var r=e.suite(t,n);i.grep(r.fullTitle())},e.test=function(e,i){var r=new Test(e,i);return r.file=n,t[0].addTest(r),r},e.test.only=function(t,n){var r=e.test(t,n),s="^"+escapeRe(r.fullTitle())+"$";i.grep(new RegExp(s))},e.test.skip=function(t){e.test(t)}})};