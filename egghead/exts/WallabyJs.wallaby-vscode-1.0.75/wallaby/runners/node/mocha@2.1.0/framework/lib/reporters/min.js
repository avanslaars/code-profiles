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
function Min(e){Base.call(this,e),e.on("start",function(){process.stdout.write("[2J"),process.stdout.write("[1;3H")}),e.on("end",this.epilogue.bind(this))}var Base=require("./base");exports=module.exports=Min,Min.prototype.__proto__=Base.prototype;