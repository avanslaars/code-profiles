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
var tracer=$_$tracer,jasmineEnv=jasmine.getEnv(),originalIt=jasmineEnv.it;jasmineEnv.it=function(){var e=arguments[1];return e?("encountered a declaration exception"===arguments[0]&&e(),arguments[1]=function(){tracer.specSyncStart();try{var t=Function.prototype.apply.call(e,this,arguments)}finally{tracer.specSyncEnd()}return t},Function.prototype.apply.call(originalIt,this,arguments)):Function.prototype.apply.call(originalIt,this,arguments)},jasmineEnv.it.only=originalIt.only,jasmine.util.formatException=function(e){return e?e.name&&e.message?e.name+": "+e.message:e.toString():"empty error"},jasmine.ExpectationResult=function(e){if(this.type="expect",this.matcherName=e.matcherName,this.passed_=e.passed,this.expected=e.expected,this.actual=e.actual,this.message=this.passed_?"Passed.":e.message,this.passed_)this.trace="";else if(e.trace)this.trace=e.trace;else{var t;try{throw new Error(this.message)}catch(n){t=n}this.trace=t}},jasmine.ExpectationResult.prototype.toString=function(){return this.message},jasmine.ExpectationResult.prototype.passed=function(){return this.passed_},jasmineEnv.addReporter(tracer._jasmineAdapter);var existingSpecFilter=jasmineEnv.specFilter.bind(jasmineEnv);jasmineEnv.specFilter=function(e){return existingSpecFilter(e)&&tracer._jasmineAdapter.specFilter(e)};