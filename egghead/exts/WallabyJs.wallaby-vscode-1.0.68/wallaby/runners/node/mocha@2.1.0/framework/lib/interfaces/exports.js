/*
 * Wallaby.js - v1.0.529
 * http://wallabyjs.com
 * Copyright (c) 2014-2017 Wallaby.js - All Rights Reserved.
 *
 * This source code file is a part of Wallaby.js and is a proprietary (closed source) software.

 * IMPORTANT:
 * Wallaby.js is a tool made by software developers for software developers with passion and love for what we do.
 * Pirating the tool is not only illegal and just morally wrong,
 * it is also unfair to other fellow programmers who are using it legally,
 * and very harmful for the tool and its future.
 */
var Suite=require("../suite"),Test=require("../test");module.exports=function(e){function t(e,i){var r;for(var s in e)if("function"==typeof e[s]){var o=e[s];switch(s){case"before":n[0].beforeAll(o);break;case"after":n[0].afterAll(o);break;case"beforeEach":n[0].beforeEach(o);break;case"afterEach":n[0].afterEach(o);break;default:var a=new Test(s,o);a.file=i,n[0].addTest(a)}}else r=Suite.create(n[0],s),n.unshift(r),t(e[s]),n.shift()}var n=[e];e.on("require",t)};