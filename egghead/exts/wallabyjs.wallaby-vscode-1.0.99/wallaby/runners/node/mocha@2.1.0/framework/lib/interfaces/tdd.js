/*
 * Wallaby.js - v1.0.613
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
var Suite=require("../suite"),Test=require("../test"),escapeRe=require("escape-string-regexp"),utils=require("../utils");module.exports=function(e){var t=[e];e.on("pre-require",function(e,n,i){e.setup=function(e,n){t[0].beforeEach(e,n)},e.teardown=function(e,n){t[0].afterEach(e,n)},e.suiteSetup=function(e,n){t[0].beforeAll(e,n)},e.suiteTeardown=function(e,n){t[0].afterAll(e,n)},e.suite=function(e,i){var r=Suite.create(t[0],e);return r.file=n,t.unshift(r),i.call(r),t.shift(),r},e.suite.skip=function(e,n){var i=Suite.create(t[0],e);i.pending=!0,t.unshift(i),n.call(i),t.shift()},e.suite.only=function(t,n){var r=e.suite(t,n);i.grep(r.fullTitle())},e.test=function(e,i){var r=t[0];r.pending&&(i=null);var s=new Test(e,i);return s.file=n,r.addTest(s),s},e.test.only=function(t,n){var r=e.test(t,n),s="^"+escapeRe(r.fullTitle())+"$";i.grep(new RegExp(s))},e.test.skip=function(t){e.test(t)}})};