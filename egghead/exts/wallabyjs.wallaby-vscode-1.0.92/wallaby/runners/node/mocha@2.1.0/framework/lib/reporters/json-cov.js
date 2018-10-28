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
function JSONCov(e,t){var n=this,t=1==arguments.length?!0:t;Base.call(this,e);var i=[],r=[],s=[];e.on("test end",function(e){i.push(e)}),e.on("pass",function(e){s.push(e)}),e.on("fail",function(e){r.push(e)}),e.on("end",function(){var e=global._$jscoverage||{},o=n.cov=map(e);o.stats=n.stats,o.tests=i.map(clean),o.failures=r.map(clean),o.passes=s.map(clean),t&&process.stdout.write(JSON.stringify(o,null,2))})}function map(e){var t={instrumentation:"node-jscoverage",sloc:0,hits:0,misses:0,coverage:0,files:[]};for(var n in e){var i=coverage(n,e[n]);t.files.push(i),t.hits+=i.hits,t.misses+=i.misses,t.sloc+=i.sloc}return t.files.sort(function(e,t){return e.filename.localeCompare(t.filename)}),t.sloc>0&&(t.coverage=t.hits/t.sloc*100),t}function coverage(e,t){var n={filename:e,coverage:0,hits:0,misses:0,sloc:0,source:{}};return t.source.forEach(function(e,i){i++,0===t[i]?(n.misses++,n.sloc++):void 0!==t[i]&&(n.hits++,n.sloc++),n.source[i]={source:e,coverage:void 0===t[i]?"":t[i]}}),n.coverage=n.hits/n.sloc*100,n}function clean(e){return{title:e.title,fullTitle:e.fullTitle(),duration:e.duration}}var Base=require("./base");exports=module.exports=JSONCov;