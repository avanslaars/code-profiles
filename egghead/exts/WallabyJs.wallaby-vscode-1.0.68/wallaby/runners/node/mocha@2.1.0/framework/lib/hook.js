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
function Hook(e,t){Runnable.call(this,e,t),this.type="hook"}var Runnable=require("./runnable");module.exports=Hook,Hook.prototype.__proto__=Runnable.prototype,Hook.prototype.error=function(e){if(0==arguments.length){var e=this._error;return this._error=null,e}this._error=e};