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
function Markdown(e){function t(e){return Array(s).join("#")+" "+e}function n(e,t){var i=t,r=SUITE_PREFIX+e.title;return t=t[r]=t[r]||{suite:e},e.suites.forEach(function(e){n(e,t)}),i}function i(e,t){++t;var n,r="";for(var s in e)"suite"!=s&&(s!==SUITE_PREFIX&&(n=" - ["+s.substring(1)+"]",n+="(#"+utils.slug(e[s].suite.fullTitle())+")\n",r+=Array(t).join("  ")+n),r+=i(e[s],t));return r}function r(e){var t=n(e,{});return i(t,0)}Base.call(this,e);var s=(this.stats,0),o="";r(e.suite),e.on("suite",function(e){++s;var n=utils.slug(e.fullTitle());o+='<a name="'+n+'"></a>\n',o+=t(e.title)+"\n"}),e.on("suite end",function(e){--s}),e.on("pass",function(e){var t=utils.clean(e.fn.toString());o+=e.title+".\n",o+="\n```js\n",o+=t+"\n",o+="```\n\n"}),e.on("end",function(){process.stdout.write("# TOC\n"),process.stdout.write(r(e.suite)),process.stdout.write(o)})}var Base=require("./base"),utils=require("../utils"),SUITE_PREFIX="$";exports=module.exports=Markdown;