/*
 * Wallaby.js - v1.0.529
 * http://wallabyjs.com
 * Copyright (c) 2014-2017 Wallaby.js - All Rights Reserved.
 *
 * This source code file is a part of Wallaby.js and is a proprietary (closed source) software.

 * IMPORTANT:
 * Wallaby.js is a tool made by software developers for software developers with passion and love for what we do.
 * Pirating the tool is not only illegal and just morally wrong,
 * it is also unfair to other fellow programmers who are using it legally,
 * and very harmful for the tool and its future.
 */
function Dot(e){Base.call(this,e);var t=this,n=(this.stats,.75*Base.window.width|0),i=-1;e.on("start",function(){process.stdout.write("\n  ")}),e.on("pending",function(e){++i%n==0&&process.stdout.write("\n  "),process.stdout.write(color("pending",Base.symbols.dot))}),e.on("pass",function(e){++i%n==0&&process.stdout.write("\n  "),"slow"==e.speed?process.stdout.write(color("bright yellow",Base.symbols.dot)):process.stdout.write(color(e.speed,Base.symbols.dot))}),e.on("fail",function(e,t){++i%n==0&&process.stdout.write("\n  "),process.stdout.write(color("fail",Base.symbols.dot))}),e.on("end",function(){console.log(),t.epilogue()})}var Base=require("./base"),color=Base.color;exports=module.exports=Dot,Dot.prototype.__proto__=Base.prototype;