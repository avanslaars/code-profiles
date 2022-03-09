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
function Landing(e){function t(){var e=Array(i).join("-");return"  "+color("runway",e)}Base.call(this,e);var n=this,i=(this.stats,.75*Base.window.width|0),r=e.total,s=process.stdout,o=color("plane","✈"),a=-1,l=0;e.on("start",function(){s.write("\n\n\n  "),cursor.hide()}),e.on("test end",function(e){var n=-1==a?i*++l/r|0:a;"failed"==e.state&&(o=color("plane crash","✈"),a=n),s.write("["+(i+1)+"D[2A"),s.write(t()),s.write("\n  "),s.write(color("runway",Array(n).join("⋅"))),s.write(o),s.write(color("runway",Array(i-n).join("⋅")+"\n")),s.write(t()),s.write("[0m")}),e.on("end",function(){cursor.show(),console.log(),n.epilogue()})}var Base=require("./base"),cursor=Base.cursor,color=Base.color;exports=module.exports=Landing,Base.colors.plane=0,Base.colors["plane crash"]=31,Base.colors.runway=90,Landing.prototype.__proto__=Base.prototype;