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
function JSONReporter(e){var t=this;Base.call(this,e);var n=[],i=[],r=[],s=[];e.on("test end",function(e){n.push(e)}),e.on("pass",function(e){s.push(e)}),e.on("fail",function(e){r.push(e)}),e.on("pending",function(e){i.push(e)}),e.on("end",function(){var o={stats:t.stats,tests:n.map(clean),pending:i.map(clean),failures:r.map(clean),passes:s.map(clean)};e.testResults=o,process.stdout.write(JSON.stringify(o,null,2))})}function clean(e){return{title:e.title,fullTitle:e.fullTitle(),duration:e.duration,err:errorJSON(e.err||{})}}function errorJSON(e){var t={};return Object.getOwnPropertyNames(e).forEach(function(n){t[n]=e[n]},e),t}var Base=require("./base"),cursor=Base.cursor,color=Base.color;exports=module.exports=JSONReporter;