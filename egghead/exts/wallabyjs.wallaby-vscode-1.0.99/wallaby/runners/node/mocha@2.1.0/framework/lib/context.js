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
function Context(){}module.exports=Context,Context.prototype.runnable=function(e){return 0==arguments.length?this._runnable:(this.test=this._runnable=e,this)},Context.prototype.timeout=function(e){return 0===arguments.length?this.runnable().timeout():(this.runnable().timeout(e),this)},Context.prototype.enableTimeouts=function(e){return this.runnable().enableTimeouts(e),this},Context.prototype.slow=function(e){return this.runnable().slow(e),this},Context.prototype.inspect=function(){return JSON.stringify(this,function(e,t){return"_runnable"!=e&&"test"!=e?t:void 0},2)};