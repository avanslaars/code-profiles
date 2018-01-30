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
function Spec(e){function t(){return Array(i).join("  ")}Base.call(this,e);var n=this,i=(this.stats,0),r=0;e.on("start",function(){console.log()}),e.on("suite",function(e){++i,console.log(color("suite","%s%s"),t(),e.title)}),e.on("suite end",function(e){--i,1==i&&console.log()}),e.on("pending",function(e){var n=t()+color("pending","  - %s");console.log(n,e.title)}),e.on("pass",function(e){if("fast"==e.speed){var n=t()+color("checkmark","  "+Base.symbols.ok)+color("pass"," %s ");cursor.CR(),console.log(n,e.title)}else{var n=t()+color("checkmark","  "+Base.symbols.ok)+color("pass"," %s ")+color(e.speed,"(%dms)");cursor.CR(),console.log(n,e.title,e.duration)}}),e.on("fail",function(e,n){cursor.CR(),console.log(t()+color("fail","  %d) %s"),++r,e.title)}),e.on("end",n.epilogue.bind(n))}var Base=require("./base"),cursor=Base.cursor,color=Base.color;exports=module.exports=Spec,Spec.prototype.__proto__=Base.prototype;