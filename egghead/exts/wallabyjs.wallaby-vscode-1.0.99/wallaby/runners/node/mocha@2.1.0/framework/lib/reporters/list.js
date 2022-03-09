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
function List(e){Base.call(this,e);var t=this,n=(this.stats,0);e.on("start",function(){console.log()}),e.on("test",function(e){process.stdout.write(color("pass","    "+e.fullTitle()+": "))}),e.on("pending",function(e){var t=color("checkmark","  -")+color("pending"," %s");console.log(t,e.fullTitle())}),e.on("pass",function(e){var t=color("checkmark","  "+Base.symbols.dot)+color("pass"," %s: ")+color(e.speed,"%dms");cursor.CR(),console.log(t,e.fullTitle(),e.duration)}),e.on("fail",function(e,t){cursor.CR(),console.log(color("fail","  %d) %s"),++n,e.fullTitle())}),e.on("end",t.epilogue.bind(t))}var Base=require("./base"),cursor=Base.cursor,color=Base.color;exports=module.exports=List,List.prototype.__proto__=Base.prototype;