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
function Doc(e){function t(){return Array(n).join("  ")}Base.call(this,e);var n=(this.stats,e.total,2);e.on("suite",function(e){e.root||(++n,console.log('%s<section class="suite">',t()),++n,console.log("%s<h1>%s</h1>",t(),utils.escape(e.title)),console.log("%s<dl>",t()))}),e.on("suite end",function(e){e.root||(console.log("%s</dl>",t()),--n,console.log("%s</section>",t()),--n)}),e.on("pass",function(e){console.log("%s  <dt>%s</dt>",t(),utils.escape(e.title));var n=utils.escape(utils.clean(e.fn.toString()));console.log("%s  <dd><pre><code>%s</code></pre></dd>",t(),n)}),e.on("fail",function(e,n){console.log('%s  <dt class="error">%s</dt>',t(),utils.escape(e.title));var i=utils.escape(utils.clean(e.fn.toString()));console.log('%s  <dd class="error"><pre><code>%s</code></pre></dd>',t(),i),console.log('%s  <dd class="error">%s</dd>',t(),utils.escape(n))})}var Base=require("./base"),utils=require("../utils");exports=module.exports=Doc;