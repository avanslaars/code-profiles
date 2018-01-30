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
!function(e){var t,n=e.$_$tracer,i=n.initialSpecId();QUnit.begin(function(e){n.started({total:e.totalTests})}),QUnit.done(function(){n.complete()}),QUnit.testStart(function(e){var r=QUnit.config;if(n.hasSpecFilter()){var s,o=e.name,a=e.name.replace(/\s\s*$/,""),l=[a];if(o!==a&&(s=[o]),e.module&&(l.unshift(e.module),s&&s.unshift(e.module)),!(n.specFilter(l)||s&&n.specFilter(s))){for(;r.queue.length;){var c=r.queue.shift();if(c&&~c.toString().indexOf(".finish();"))return}return}}r.current.run=function(){var e;r.current=this,delete r.current.stack,this.callbackStarted=(new Date).getTime();try{n.specSyncStart(),e=this.callback.call(this.testEnvironment,this.assert),this.resolvePromise(e),0===this.timeout&&0!==this.semaphore&&this.pushFailure("Test did not finish synchronously even though assert.timeout( 0 ) was used.")}catch(t){this.pushFailure(t.message,t.stack),r.blocking&&(this.semaphore=0,r.blocking=!1)}finally{n.specSyncEnd()}},t={success:!0,errors:[],id:++i,start:(new n._Date).getTime()},n.specStart(t.id,e.name)}),QUnit.log(function(e){if(!e.result){var i="",r=e.expected,s=e.actual;e.message&&(i+=e.message),t.success=!1,e.showDiff=!0;var o=n.setAssertionData(e,{message:i,stack:e.source});delete e.showDiff,t.errors.push(o),(!e.message||"undefined"!=typeof e.expected&&o.expected)&&(r||s)&&(o.message+=(e.message?"\n":"")+"Expected: "+n._inspect(r,3)+"\nActual: "+n._inspect(s,3))}}),QUnit.testDone(function(e){var i=n.specEnd(),r={id:t.id,timeRange:i,name:e.name,suite:e.module&&[e.module]||[],success:t.success,skipped:!1,time:(new n._Date).getTime()-t.start,log:t.errors||[]};r.log.length||delete r.log,n.result(r)})}(window);