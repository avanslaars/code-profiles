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
function Progress(){this.percent=0,this.size(0),this.fontSize(11),this.font("helvetica, arial, sans-serif")}module.exports=Progress,Progress.prototype.size=function(e){return this._size=e,this},Progress.prototype.text=function(e){return this._text=e,this},Progress.prototype.fontSize=function(e){return this._fontSize=e,this},Progress.prototype.font=function(e){return this._font=e,this},Progress.prototype.update=function(e){return this.percent=e,this},Progress.prototype.draw=function(e){try{var t=Math.min(this.percent,100),n=this._size,i=n/2,r=i,s=i,o=i-1,a=this._fontSize;e.font=a+"px "+this._font;var l=2*Math.PI*(t/100);e.clearRect(0,0,n,n),e.strokeStyle="#9f9f9f",e.beginPath(),e.arc(r,s,o,0,l,!1),e.stroke(),e.strokeStyle="#eee",e.beginPath(),e.arc(r,s,o-1,0,l,!0),e.stroke();var c=this._text||(0|t)+"%",u=e.measureText(c).width;e.fillText(c,r-u/2+1,s+a/2-1)}catch(d){}return this};