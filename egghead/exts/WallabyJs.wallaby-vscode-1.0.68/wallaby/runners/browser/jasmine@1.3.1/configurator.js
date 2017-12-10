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
!function(e){var t=e.$_$tracer;e.wallaby.testFramework=jasmine;var n=jasmine.Env.prototype.it;jasmine.Env.prototype.it=function(){var e=arguments[1];return e?"encountered a declaration exception"===arguments[0]?e():(arguments[1]=function(){t.specSyncStart();try{var n=Function.prototype.apply.call(e,this,arguments)}finally{t.specSyncEnd()}return n},Function.prototype.apply.call(n,this,arguments)):Function.prototype.apply.call(n,this,arguments)};var i=jasmine.Env.prototype.afterEach;jasmine.Env.prototype.afterEach=function(){if(t.needToNotifySingleTestRun()){var e=arguments[0];arguments[0]=function(){runs(function(){t.notifySingleTestAfterEach()}),waitsFor(function(){return!t.paused()},"waiting wallaby response",1e3),runs(function(){e()})}}return Function.prototype.apply.call(i,this,arguments)},jasmine.util.formatException=function(e){return e?e.name&&e.message?e.name+": "+e.message:e.toString():"empty error"},jasmine.ExpectationResult=function(e){if(this.type="expect",this.matcherName=e.matcherName,this.passed_=e.passed,this.expected=e.expected,this.actual=e.actual,this.message=this.passed_?"Passed.":e.message,this.passed_)this.trace="";else if(e.trace)this.trace=e.trace;else{var t;try{throw new Error(this.message)}catch(n){t=n}this.trace=t}},jasmine.ExpectationResult.prototype.toString=function(){return this.message},jasmine.ExpectationResult.prototype.passed=function(){return this.passed_}}(window);