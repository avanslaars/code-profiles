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
function isArray(e){return"[object Array]"=={}.toString.call(e)}function EventEmitter(){}exports.EventEmitter=EventEmitter,EventEmitter.prototype.on=function(e,t){return this.$events||(this.$events={}),this.$events[e]?isArray(this.$events[e])?this.$events[e].push(t):this.$events[e]=[this.$events[e],t]:this.$events[e]=t,this},EventEmitter.prototype.addListener=EventEmitter.prototype.on,EventEmitter.prototype.once=function(e,t){function n(){i.removeListener(e,n),t.apply(this,arguments)}var i=this;return n.listener=t,this.on(e,n),this},EventEmitter.prototype.removeListener=function(e,t){if(this.$events&&this.$events[e]){var n=this.$events[e];if(isArray(n)){for(var i=-1,r=0,s=n.length;s>r;r++)if(n[r]===t||n[r].listener&&n[r].listener===t){i=r;break}if(0>i)return this;n.splice(i,1),n.length||delete this.$events[e]}else(n===t||n.listener&&n.listener===t)&&delete this.$events[e]}return this},EventEmitter.prototype.removeAllListeners=function(e){return void 0===e?(this.$events={},this):(this.$events&&this.$events[e]&&(this.$events[e]=null),this)},EventEmitter.prototype.listeners=function(e){return this.$events||(this.$events={}),this.$events[e]||(this.$events[e]=[]),isArray(this.$events[e])||(this.$events[e]=[this.$events[e]]),this.$events[e]},EventEmitter.prototype.emit=function(e){if(!this.$events)return!1;var t=this.$events[e];if(!t)return!1;var n=[].slice.call(arguments,1);if("function"==typeof t)t.apply(this,n);else{if(!isArray(t))return!1;for(var i=t.slice(),r=0,s=i.length;s>r;r++)i[r].apply(this,n)}return!0};