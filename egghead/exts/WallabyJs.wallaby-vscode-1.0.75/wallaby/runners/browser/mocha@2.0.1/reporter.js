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
!function(e){var t,n=e.$_$tracer,i=n.initialSpecId(),r=[];mocha.setup({ui:"bdd",fullTrace:!0,slow:e.wallaby.slowTestThreshold,reporter:function(e){if(e.grepTotal=function(){return!0},e.runTest=function(e){var t=this.test,i=this;this.asyncOnly&&(t.asyncOnly=!0);try{t.on("error",function(e){i.fail(t,e)}),n.specSyncStart();try{t.run(e)}finally{n.specSyncEnd()}}catch(r){e(r)}},e._grep={test:function(e){if(!n.hasSpecFilter())return!0;var t=r.slice(1);return t.push(e.substr(t.join(" ").length+1)),n.specFilter(t)}},n.needToNotifySingleTestRun()){var s=e.hook;e.hook=function(t,i){if("afterEach"!==t)return Function.prototype.apply.call(s,this,arguments);var r=arguments,o=this;n.notifySingleTestAfterEach(function(){Function.prototype.apply.call(s,o,r)}),e.hook=s}}e.on("start",function(){n.started({total:e.total})}),e.on("end",function(){n.complete()}),e.on("suite",function(e){r.push(e.title),t=e}),e.on("suite end",function(){r.pop()}),e.on("test",function(e){e._id=++i,e._failures=[],e._time=(new n._Date).getTime(),n.specStart(e._id,e.title)}),e.on("fail",function(t,n){"hook"===t.type||t._finished?(t._hook="hook"===t.type&&t.title||!0,t._failures=[n],e.emit("test end",t)):t._failures.push(n)}),e.on("test end",function(e){e._finished=!0;var t=n.specEnd(),i=e.pending===!0,s={id:e._id,timeRange:t,name:e.title,suite:r.slice(1),success:"passed"===e.state,skipped:i,time:i?0:(new n._Date).getTime()-e._time,log:[],hook:e._hook,slow:e.slow?e.duration>e.slow():void 0,testFile:e._testFile};if(!s.success&&!s.skipped)for(var o=e._failures,a=0;a<o.length;a++){var l=o[a],c=l.uncaught&&l.message,u={message:c?l.message.substr(0,l.message.lastIndexOf(" (")):l.message,stack:l.stack||c&&l.message.substring(l.message.lastIndexOf("(")+1,l.message.length-1)};n.setAssertionData(l,u),s.log.push(u)}s.log.length||delete s.log,n.result(s)})}});var s=e.it;e.it=function(){var e=Function.prototype.apply.call(s,this,arguments);return e._testFile=n.entryFile(),e},e.it.only=s.only,e.it.skip=s.skip}(window);