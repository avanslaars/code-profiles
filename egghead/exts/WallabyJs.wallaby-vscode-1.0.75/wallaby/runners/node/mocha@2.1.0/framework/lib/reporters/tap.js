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
function TAP(e){Base.call(this,e);var t=(this.stats,1),n=0,i=0;e.on("start",function(){var t=e.grepTotal(e.suite);console.log("%d..%d",1,t)}),e.on("test end",function(){++t}),e.on("pending",function(e){console.log("ok %d %s # SKIP -",t,title(e))}),e.on("pass",function(e){n++,console.log("ok %d %s",t,title(e))}),e.on("fail",function(e,n){i++,console.log("not ok %d %s",t,title(e)),n.stack&&console.log(n.stack.replace(/^/gm,"  "))}),e.on("end",function(){console.log("# tests "+(n+i)),console.log("# pass "+n),console.log("# fail "+i)})}function title(e){return e.fullTitle().replace(/#/g,"")}var Base=require("./base"),cursor=Base.cursor,color=Base.color;exports=module.exports=TAP;