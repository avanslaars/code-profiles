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
var JasmineReporter=function(e){var t=e.initialSpecId(),n=[];this.jasmineStarted=function(t){e.started({total:t.totalSpecsDefined})},this.jasmineDone=function(){e.complete()},this.suiteStarted=function(e){n.push(e.description)},this.suiteDone=function(){n.pop()},this.specStarted=function(n){n.id=++t,e.specStart(n.id,n.description),n._time=(new e._Date).getTime()},this.specDone=function(t){var i=e.specEnd(),r="disabled"===t.status||"pending"===t.status,s={id:t.id,timeRange:i,name:t.description,suite:n.slice(),success:"passed"===t.status,skipped:r,time:r?0:(new e._Date).getTime()-t._time,log:[],testFile:t._testFile};if(!s.success&&!s.skipped)for(var o=t.failedExpectations,a=0;a<o.length;a++){var l=o[a];l.showDiff=l.showDiff||"toEqual"===l.matcherName,s.log.push(e.setAssertionData(l,{message:l.message,stack:l.stack}))}s.log.length||delete s.log,e.result(s)}},jasmineEnv=jasmine.getEnv(),tracer=window.$_$tracer,adapter=new JasmineReporter(tracer);jasmineEnv.addReporter(adapter);