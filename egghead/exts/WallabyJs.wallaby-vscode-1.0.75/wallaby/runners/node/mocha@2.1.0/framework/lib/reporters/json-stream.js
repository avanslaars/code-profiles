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
function List(e){Base.call(this,e);var t=this,n=(this.stats,e.total);e.on("start",function(){console.log(JSON.stringify(["start",{total:n}]))}),e.on("pass",function(e){console.log(JSON.stringify(["pass",clean(e)]))}),e.on("fail",function(e,t){e=clean(e),e.err=t.message,console.log(JSON.stringify(["fail",e]))}),e.on("end",function(){process.stdout.write(JSON.stringify(["end",t.stats]))})}function clean(e){return{title:e.title,fullTitle:e.fullTitle(),duration:e.duration}}var Base=require("./base"),color=Base.color;exports=module.exports=List;