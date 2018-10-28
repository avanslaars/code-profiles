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
var JasmineReporter=function(e){var t=e.initialSpecId();this.reportRunnerStarting=function(t){e.started({total:t.specs().length})},this.reportRunnerResults=function(){e.complete()},this.reportSpecStarting=function(n){n.id=++t,e.specStart(n.id,n.description),n.results_.time=(new e._Date).getTime()},this.reportSpecResults=function(t){for(var n=e.specEnd(),i={id:t.id,timeRange:n,name:t.description,suite:[],success:0===t.results_.failedCount,skipped:t.results_.skipped,time:t.results_.skipped?0:(new e._Date).getTime()-t.results_.time,log:[]},r=t.suite;r;)i.suite.unshift(r.description),r=r.parentSuite;if(!i.success&&!i.skipped)for(var s=t.results_.items_,o=0;o<s.length;o++){var a=s[o];a.passed_||(a.showDiff=a.showDiff||"toEqual"===a.matcherName,i.log.push(e.setAssertionData(a,{message:a.message,stack:a.trace&&a.trace.stack?a.trace.stack:e._undefined})))}i.log.length||delete i.log,e.result(i)};var n=jasmine.getEnv();this.specFilter=function(t){if(!(n.exclusive_<=t.exclusive_))return!1;if(!e.hasSpecFilter())return!0;for(var i=[t.description],r=t.suite;r;)i.unshift(r.description),r=r.parentSuite;return e.specFilter(i)}};