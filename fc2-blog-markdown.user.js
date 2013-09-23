// ==UserScript==
// @name        FC2 Blog Markdown
// @version     1.0.0
// @namespace   admin.blog.fc2.com
// @description FC2ブログでMarkdownを使用できるようにします。
// @include     http://admin.blog.fc2.com/control.php?mode=editor&process=new*
// @include     http://admin.blog.fc2.com/control.php?mode=editor&process=load*
// ==/UserScript==

window.addEventListener('load', function(){

function myFunction() {(function(global, $) {

/*!
 * Copyright (c) 2013, Leon Sorokin
 * All rights reserved. (MIT Licensed)
 *
 * reMarked.js - DOM > markdown
 */
reMarked=function(opts){var links=[];var cfg={link_list:false,h1_setext:true,h2_setext:true,h_atx_suf:false,gfm_code:false,li_bullet:"*-+"[0],hr_char:"-_*"[0],indnt_str:["    ","\t","  "][0],bold_char:"*_"[0],emph_char:"*_"[1],gfm_del:true,gfm_tbls:true,tbl_edges:false,hash_lnks:false,br_only:false,unsup_tags:{ignore:"script style noscript",inline:"span sup sub i u b center big",block2:"div form fieldset dl header footer address article aside figure hgroup section",block1c:"dt dd caption legend figcaption output",block2c:"canvas audio video iframe"}};extend(cfg,opts);function extend(a,b){if(!b)return a;for(var i in a){if(typeOf(b[i])=="Object")extend(a[i],b[i]);else if(typeof b[i]!=="undefined")a[i]=b[i]}}function typeOf(val){return Object.prototype.toString.call(val).slice(8,-1)}function rep(str,num){var s="";while(num-->0)s+=str;return s}function trim12(str){var str=str.replace(/^\s\s*/,''),ws=/\s/,i=str.length;while(ws.test(str.charAt(--i)));return str.slice(0,i+1)}function lpad(targ,padStr,len){return rep(padStr,len-targ.length)+targ}function rpad(targ,padStr,len){return targ+rep(padStr,len-targ.length)}function otag(tag,e){if(!tag)return"";var buf="<"+tag;for(var attr,i=0,attrs=e.attributes,l=attrs.length;i<l;i++){attr=attrs.item(i);buf+=" "+attr.nodeName+'="'+attr.nodeValue+'"'}return buf+">"}function ctag(tag){if(!tag)return"";return"</"+tag+">"}function pfxLines(txt,pfx){return txt.replace(/^/gm,pfx)}function nodeName(e){return(e.nodeName=="#text"?"txt":e.nodeName).toLowerCase()}function wrap(str,opts){var pre,suf;if(opts instanceof Array){pre=opts[0];suf=opts[1]}else pre=suf=opts;pre=pre instanceof Function?pre.call(this,str):pre;suf=suf instanceof Function?suf.call(this,str):suf;return pre+str+suf}function outerHTML(node){return node.outerHTML||(function(n){var div=document.createElement('div'),h;div.appendChild(n.cloneNode(true));h=div.innerHTML;div=null;return h})(node)}this.render=function(ctr){links=[];if(typeof ctr=="string"){var htmlstr=ctr;ctr=document.createElement("div");ctr.innerHTML=htmlstr}var s=new lib.tag(ctr,null,0);var re=s.rend().replace(/^[\t ]+\n/gm,"\n");if(cfg.link_list&&links.length>0){re+="\n\n";var maxlen=0;for(var y in links){if(!links[y].e.title)continue;var len=links[y].e.href.length;if(len&&len>maxlen)maxlen=len}for(var k in links){var title=links[k].e.title?rep(" ",(maxlen+2)-links[k].e.href.length)+'"'+links[k].e.title+'"':"";re+="  ["+(+k+1)+"]: "+(nodeName(links[k].e)=="a"?links[k].e.href:links[k].e.src)+title+"\n"}}return re.replace(/^[\t ]+\n/gm,"\n")};var lib={};lib.tag=klass({wrap:"",lnPfx:"",lnInd:0,init:function(e,p,i){this.e=e;this.p=p;this.i=i;this.c=[];this.tag=nodeName(e);this.initK()},initK:function(){var i;if(this.e.hasChildNodes()){var inlRe=cfg.unsup_tags.inline,n,name;for(i in this.e.childNodes){if(!/\d+/.test(i))continue;n=this.e.childNodes[i];name=nodeName(n);if(cfg.unsup_tags.ignore.test(name))continue;if(name=="txt"&&/^\s+$/.test(n.textContent)){if(i==0||i==this.e.childNodes.length-1)continue;var prev=this.e.childNodes[i-1],next=this.e.childNodes[i+1];if(prev&&!nodeName(prev).match(inlRe)||next&&!nodeName(next).match(inlRe))continue}var wrap=null;if(!lib[name]){var unsup=cfg.unsup_tags;if(unsup.inline.test(name))name="tinl";else if(unsup.block2.test(name))name="tblk";else if(unsup.block1c.test(name))name="ctblk";else if(unsup.block2c.test(name)){name="ctblk";wrap=["\n\n",""]}else name="rawhtml"}var node=new lib[name](n,this,this.c.length);if(wrap)node.wrap=wrap;if(node instanceof lib.a&&n.href||node instanceof lib.img){node.lnkid=links.length;links.push(node)}this.c.push(node)}}},rend:function(){return this.rendK().replace(/\n{3,}/gm,"\n\n")},rendK:function(){var n,buf="";for(var i in this.c){n=this.c[i];buf+=(n.bef||"")+n.rend()+(n.aft||"")}return buf.replace(/^\n+|\n+$/,"")}});lib.blk=lib.tag.extend({wrap:["\n\n",""],wrapK:null,tagr:false,lnInd:null,init:function(e,p,i){this.supr(e,p,i);if(this.lnInd===null){if(this.p&&this.tagr&&this.c[0]instanceof lib.blk)this.lnInd=4;else this.lnInd=0}if(this.wrapK===null){if(this.tagr&&this.c[0]instanceof lib.blk)this.wrapK="\n";else this.wrapK=""}},rend:function(){return wrap.call(this,(this.tagr?otag(this.tag,this.e):"")+wrap.call(this,pfxLines(pfxLines(this.rendK(),this.lnPfx),rep(" ",this.lnInd)),this.wrapK)+(this.tagr?ctag(this.tag):""),this.wrap)},rendK:function(){var kids=this.supr();if(this.p instanceof lib.li){var repl=null,spcs=kids.match(/^[\t ]+/gm);if(!spcs)return kids;for(var i in spcs){if(repl===null||spcs[i][0].length<repl.length)repl=spcs[i][0]}return kids.replace(new RegExp("^"+repl),"")}var id=this.e.getAttribute('id'),cls=this.e.className.split(' '),sfx=[];if(!!id)sfx[0]='#'+id;for(var i=0,iz=cls.length;i<iz;i++){if(!!cls[i])sfx.push('.'+cls[i])}sfx=sfx.length>0?' {'+sfx.join(' ')+'}':'';kids+=sfx;return kids}});lib.tblk=lib.blk.extend({tagr:true});lib.cblk=lib.blk.extend({wrap:["\n",""]});lib.ctblk=lib.cblk.extend({tagr:true});lib.inl=lib.tag.extend({rend:function(){return wrap.call(this,this.rendK(),this.wrap)}});lib.tinl=lib.inl.extend({tagr:true,rend:function(){return otag(this.tag,this.e)+wrap.call(this,this.rendK(),this.wrap)+ctag(this.tag)}});lib.p=lib.blk.extend({rendK:function(){return this.supr().replace(/^\s+/gm,"")}});lib.list=lib.blk.extend({expn:false,wrap:[function(){return this.p instanceof lib.li?"\n":"\n\n"},""]});lib.ul=lib.list.extend({});lib.ol=lib.list.extend({});lib.li=lib.cblk.extend({wrap:["\n",function(kids){return this.p.expn||kids.match(/\n{2}/gm)?"\n":""}],wrapK:[function(){return this.p.tag=="ul"?cfg.li_bullet+" ":(this.i+1)+".  "},""],rendK:function(){return this.supr().replace(/\n([^\n])/gm,"\n"+cfg.indnt_str+"$1")}});lib.hr=lib.blk.extend({wrap:["\n\n",rep(cfg.hr_char,3)]});lib.h=lib.blk.extend({});lib.h_setext=lib.h.extend({});cfg.h1_setext&&(lib.h1=lib.h_setext.extend({wrapK:["",function(kids){return"\n"+rep("=",kids.length)}]}));cfg.h2_setext&&(lib.h2=lib.h_setext.extend({wrapK:["",function(kids){return"\n"+rep("-",kids.length)}]}));lib.h_atx=lib.h.extend({wrapK:[function(kids){return rep("#",this.tag[1])+" "},function(kids){return cfg.h_atx_suf?" "+rep("#",this.tag[1]):""}]});!cfg.h1_setext&&(lib.h1=lib.h_atx.extend({}));!cfg.h2_setext&&(lib.h2=lib.h_atx.extend({}));lib.h3=lib.h_atx.extend({});lib.h4=lib.h_atx.extend({});lib.h5=lib.h_atx.extend({});lib.h6=lib.h_atx.extend({});lib.a=lib.inl.extend({lnkid:null,rend:function(){var kids=this.rendK(),href=this.e.getAttribute("href"),title=this.e.title?' "'+this.e.title+'"':"";if(!href||href==kids||href[0]=="#"&&!cfg.hash_lnks)return kids;if(cfg.link_list)return"["+kids+"] ["+(this.lnkid+1)+"]";return"["+kids+"]("+href+title+")"}});lib.img=lib.inl.extend({lnkid:null,rend:function(){var kids=this.e.alt,src=this.e.getAttribute("src");if(cfg.link_list)return"!["+kids+"] ["+(this.lnkid+1)+"]";var title=this.e.title?' "'+this.e.title+'"':"";return"!["+kids+"]("+src+title+")"}});lib.em=lib.inl.extend({wrap:cfg.emph_char});lib.del=cfg.gfm_del?lib.inl.extend({wrap:"~~"}):lib.tinl.extend();lib.br=lib.inl.extend({wrap:["",function(){var end=cfg.br_only?"<br>":"  ";return this.p instanceof lib.h?"<br>":end+"\n"}]});lib.strong=lib.inl.extend({wrap:rep(cfg.bold_char,2)});lib.blockquote=lib.blk.extend({lnPfx:"> ",rend:function(){return this.supr().replace(/>[ \t]$/gm,">")}});lib.pre=lib.blk.extend({tagr:true,wrapK:"\n",lnInd:0});lib.code=lib.blk.extend({tagr:false,wrap:"",wrapK:function(kids){return kids.indexOf("`")!==-1?"``":"`"},lnInd:0,init:function(e,p,i){this.supr(e,p,i);if(this.p instanceof lib.pre){this.p.tagr=false;if(cfg.gfm_code){var cls=this.e.getAttribute("class");cls=(cls||"").split(" ")[0];if(cls.indexOf("lang-")===0)cls=cls.substr(5);this.wrapK=["```"+cls+"\n","\n```"]}else{this.wrapK="";this.p.lnInd=4}}}});lib.table=cfg.gfm_tbls?lib.blk.extend({cols:[],init:function(e,p,i){this.supr(e,p,i);this.cols=[]},rend:function(){for(var tsec in this.c)for(var row in this.c[tsec].c)for(var cell in this.c[tsec].c[row].c)this.c[tsec].c[row].c[cell].prep();return this.supr()}}):lib.tblk.extend();lib.thead=cfg.gfm_tbls?lib.cblk.extend({wrap:["\n",function(kids){var buf="";for(var i in this.p.cols){var col=this.p.cols[i],al=col.a[0]=="c"?":":" ",ar=col.a[0]=="r"||col.a[0]=="c"?":":" ";buf+=(i==0&&cfg.tbl_edges?"|":"")+al+rep("-",col.w)+ar+(i<this.p.cols.length-1||cfg.tbl_edges?"|":"")}return"\n"+trim12(buf)}]}):lib.ctblk.extend();lib.tbody=cfg.gfm_tbls?lib.cblk.extend():lib.ctblk.extend();lib.tfoot=cfg.gfm_tbls?lib.cblk.extend():lib.ctblk.extend();lib.tr=cfg.gfm_tbls?lib.cblk.extend({wrapK:[cfg.tbl_edges?"| ":"",cfg.tbl_edges?" |":""],}):lib.ctblk.extend();lib.th=cfg.gfm_tbls?lib.inl.extend({guts:null,wrap:[function(){var col=this.p.p.p.cols[this.i],spc=this.i==0?"":" ",pad,fill=col.w-this.guts.length;switch(col.a[0]){case"r":pad=rep(" ",fill);break;case"c":pad=rep(" ",Math.floor(fill/2));break;default:pad=""}return spc+pad},function(){var col=this.p.p.p.cols[this.i],edg=this.i==this.p.c.length-1?"":" |",pad,fill=col.w-this.guts.length;switch(col.a[0]){case"r":pad="";break;case"c":pad=rep(" ",Math.ceil(fill/2));break;default:pad=rep(" ",fill)}return pad+edg}],prep:function(){this.guts=this.rendK();this.rendK=function(){return this.guts};var cols=this.p.p.p.cols;if(!cols[this.i])cols[this.i]={w:null,a:""};var col=cols[this.i];col.w=Math.max(col.w||0,this.guts.length);if(this.e.align)col.a=this.e.align},}):lib.ctblk.extend();lib.td=lib.th.extend();lib.txt=lib.inl.extend({initK:function(){this.c=this.e.textContent.split(/^/gm)},rendK:function(){var kids=this.c.join("").replace(/\r/gm,"");if(!(this.p instanceof lib.code||this.p instanceof lib.pre)){kids=kids.replace(/^\s*#/gm,"\\#").replace(/\*/gm,"\\*")}if(this.i==0)kids=kids.replace(/^\n+/,"");if(this.i==this.p.c.length-1)kids=kids.replace(/\n+$/,"");return kids}});lib.rawhtml=lib.blk.extend({initK:function(){this.guts=outerHTML(this.e)},rendK:function(){return this.guts}});for(var i in cfg.unsup_tags)cfg.unsup_tags[i]=new RegExp("^(?:"+(i=="inline"?"a|em|strong|img|code|del|":"")+cfg.unsup_tags[i].replace(/\s/g,"|")+")$")};

/*!
 * klass: a classical JS OOP façade
 * https://github.com/ded/klass
 * License MIT (c) Dustin Diaz & Jacob Thornton 2012
 */
!function(a,b){typeof define=="function"?define(b):typeof module!="undefined"?module.exports=b():this[a]=b()}("klass",function(){function f(a){return j.call(g(a)?a:function(){},a,1)}function g(a){return typeof a===c}function h(a,b,c){return function(){var d=this.supr;this.supr=c[e][a];var f=b.apply(this,arguments);return this.supr=d,f}}function i(a,b,c){for(var f in b)b.hasOwnProperty(f)&&(a[f]=g(b[f])&&g(c[e][f])&&d.test(b[f])?h(f,b[f],c):b[f])}function j(a,b){function c(){}function l(){this.init?this.init.apply(this,arguments):(b||h&&d.apply(this,arguments),j.apply(this,arguments))}c[e]=this[e];var d=this,f=new c,h=g(a),j=h?a:this,k=h?{}:a;return l.methods=function(a){return i(f,a,d),l[e]=f,this},l.methods.call(l,k).prototype.constructor=l,l.extend=arguments.callee,l[e].implement=l.statics=function(a,b){return a=typeof a=="string"?function(){var c={};return c[a]=b,c}():a,i(this,a,d),this},l}var a=this,b=a.klass,c="function",d=/xyz/.test(function(){xyz})?/\bsupr\b/:/.*/,e="prototype";return f.noConflict=function(){return a.klass=b,this},a.klass=f,f});

/**
 * marked - a markdown parser
 * Copyright (c) 2011-2013, Christopher Jeffrey. (MIT Licensed)
 * https://github.com/chjj/marked
 */
(function(){function s(a){this.tokens=[];this.tokens.links={};this.options=a||k.defaults;this.rules=e.normal;this.options.gfm&&(this.rules=this.options.tables?e.tables:e.gfm)}function q(a,b){this.options=b||k.defaults;this.links=a;this.rules=h.normal;if(!this.links)throw Error("Tokens array requires a `links` property.");this.options.gfm?this.rules=this.options.breaks?h.breaks:h.gfm:this.options.pedantic&&(this.rules=h.pedantic)}function p(a){this.tokens=[];this.token=null;this.options=a||k.defaults}function n(a,b){return a.replace(b?/&/g:/&(?!#?\w+;)/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;")}function l(a,b){a=a.source;b=b||"";return function d(c,e){if(!c)return RegExp(a,b);e=e.source||e;e=e.replace(/(^|[^\[])\^/g,"$1");a=a.replace(c,e);return d}}function t(){}function r(a){for(var b=1,m,d;b<arguments.length;b++)for(d in m=arguments[b],m)Object.prototype.hasOwnProperty.call(m,d)&&(a[d]=m[d]);return a}function k(a,b,m){if(m||"function"===typeof b){m||(m=b,b=null);b=r({},k.defaults,b||{});var d=b.highlight,c,e,f=0;try{c=s.lex(a,b)}catch(g){return m(g)}e=c.length;var h=function(){var a,e;try{a=p.parse(c,b)}catch(f){e=f}b.highlight=d;return e?m(e):m(null,a)};if(!d||3>d.length)return h();delete b.highlight;if(!e)return h();for(;f<c.length;f++)(function(a){return"code"!==a.type?--e||h():d(a.text,a.lang,function(b,c){if(null==c||c===a.text)return--e||h();a.text=c;a.escaped=!0;--e||h()})})(c[f])}else try{return b&&(b=r({},k.defaults,b)),p.parse(s.lex(a,b),b)}catch(l){l.message+="\nPlease report this to https://github.com/chjj/marked.";if((b||k.defaults).silent)return"<p>An error occured:</p><pre>"+n(l.message+"",!0)+"</pre>";throw l;}}var e={newline:/^\n+/,code:/^( {4}[^\n]+\n*)+/,fences:t,hr:/^( *[-*_]){3,} *(?:\n+|$)/,heading:/^ *(#{1,6}) *([^\n]+?) *#* *(?:\n+|$)/,nptable:t,lheading:/^([^\n]+)\n *(=|-){2,} *(?:\n+|$)/,blockquote:/^( *>[^\n]+(\n[^\n]+)*\n*)+/,list:/^( *)(bull) [\s\S]+?(?:hr|\n{2,}(?! )(?!\1bull )\n*|\s*$)/,html:/^ *(?:comment|closed|closing) *(?:\n{2,}|\s*$)/,def:/^ *\[([^\]]+)\]: *<?([^\s>]+)>?(?: +["(]([^\n]+)[")])? *(?:\n+|$)/,table:t,paragraph:/^((?:[^\n]+\n?(?!hr|heading|lheading|blockquote|tag|def))+)\n*/,text:/^[^\n]+/,bullet:/(?:[*+-]|\d+\.)/,item:/^( *)(bull) [^\n]*(?:\n(?!\1bull )[^\n]*)*/};e.item=l(e.item,"gm")(/bull/g,e.bullet)();e.list=l(e.list)(/bull/g,e.bullet)("hr",/\n+(?=(?: *[-*_]){3,} *(?:\n+|$))/)();e._tag="(?!(?:a|em|strong|small|s|cite|q|dfn|abbr|data|time|code|var|samp|kbd|sub|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo|span|br|wbr|ins|del|img)\\b)\\w+(?!:/|@)\\b";e.html=l(e.html)("comment",/\x3c!--[\s\S]*?--\x3e/)("closed",/<(tag)[\s\S]+?<\/\1>/)("closing",/<tag(?:"[^"]*"|'[^']*'|[^'">])*?>/)(/tag/g,e._tag)();e.paragraph=l(e.paragraph)("hr",e.hr)("heading",e.heading)("lheading",e.lheading)("blockquote",e.blockquote)("tag","<"+e._tag)("def",e.def)();e.normal=r({},e);e.gfm=r({},e.normal,{fences:/^ *(`{3,}|~{3,}) *(\S+)? *\n([\s\S]+?)\s*\1 *(?:\n+|$)/,paragraph:/^/});e.gfm.paragraph=l(e.paragraph)("(?!","(?!"+e.gfm.fences.source.replace("\\1","\\2")+"|"+e.list.source.replace("\\1","\\3")+"|")();e.tables=r({},e.gfm,{nptable:/^ *(\S.*\|.*)\n *([-:]+ *\|[-| :]*)\n((?:.*\|.*(?:\n|$))*)\n*/,table:/^ *\|(.+)\n *\|( *[-:]+[-| :]*)\n((?: *\|.*(?:\n|$))*)\n*/});s.rules=e;s.lex=function(a,b){return(new s(b)).lex(a)};s.prototype.lex=function(a){a=a.replace(/\r\n|\r/g,"\n").replace(/\t/g,"    ").replace(/\u00a0/g," ").replace(/\u2424/g,"\n");return this.token(a,!0)};s.prototype.token=function(a,b){a=a.replace(/^ +$/gm,"");for(var m,d,c,h,f,g,k;a;){if(c=this.rules.newline.exec(a))a=a.substring(c[0].length),1<c[0].length&&this.tokens.push({type:"space"});if(c=this.rules.code.exec(a))a=a.substring(c[0].length),c=c[0].replace(/^ {4}/gm,""),this.tokens.push({type:"code",text:this.options.pedantic?c:c.replace(/\n+$/,"")});else if(c=this.rules.fences.exec(a))a=a.substring(c[0].length),this.tokens.push({type:"code",lang:c[2],text:c[3]});else if(c=this.rules.heading.exec(a))a=a.substring(c[0].length),this.tokens.push({type:"heading",depth:c[1].length,text:c[2]});else if(b&&(c=this.rules.nptable.exec(a))){a=a.substring(c[0].length);f={type:"table",header:c[1].replace(/^ *| *\| *$/g,"").split(/ *\| */),align:c[2].replace(/^ *|\| *$/g,"").split(/ *\| */),cells:c[3].replace(/\n$/,"").split("\n")};for(g=0;g<f.align.length;g++)/^ *-+: *$/.test(f.align[g])?f.align[g]="right":/^ *:-+: *$/.test(f.align[g])?f.align[g]="center":/^ *:-+ *$/.test(f.align[g])?f.align[g]="left":f.align[g]=null;for(g=0;g<f.cells.length;g++)f.cells[g]=f.cells[g].split(/ *\| */);this.tokens.push(f)}else if(c=this.rules.lheading.exec(a))a=a.substring(c[0].length),this.tokens.push({type:"heading",depth:"="===c[2]?1:2,text:c[1]});else if(c=this.rules.hr.exec(a))a=a.substring(c[0].length),this.tokens.push({type:"hr"});else if(c=this.rules.blockquote.exec(a))a=a.substring(c[0].length),this.tokens.push({type:"blockquote_start"}),c=c[0].replace(/^ *> ?/gm,""),this.token(c,b),this.tokens.push({type:"blockquote_end"});else if(c=this.rules.list.exec(a)){a=a.substring(c[0].length);h=c[2];this.tokens.push({type:"list_start",ordered:1<h.length});c=c[0].match(this.rules.item);m=!1;k=c.length;for(g=0;g<k;g++)f=c[g],d=f.length,f=f.replace(/^ *([*+-]|\d+\.) +/,""),~f.indexOf("\n ")&&(d-=f.length,f=this.options.pedantic?f.replace(/^ {1,4}/gm,""):f.replace(RegExp("^ {1,"+d+"}","gm"),"")),this.options.smartLists&&g!==k-1&&(d=e.bullet.exec(c[g+1])[0],h===d||1<h.length&&1<d.length||(a=c.slice(g+1).join("\n")+a,g=k-1)),d=m||/\n\n(?!\s*$)/.test(f),g!==k-1&&(m="\n"===f.charAt(f.length-1),d||(d=m)),this.tokens.push({type:d?"loose_item_start":"list_item_start"}),this.token(f,!1),this.tokens.push({type:"list_item_end"});this.tokens.push({type:"list_end"})}else if(c=this.rules.html.exec(a))a=a.substring(c[0].length),this.tokens.push({type:this.options.sanitize?"paragraph":"html",pre:"pre"===c[1]||"script"===c[1]||"style"===c[1],text:c[0]});else if(b&&(c=this.rules.def.exec(a)))a=a.substring(c[0].length),this.tokens.links[c[1].toLowerCase()]={href:c[2],title:c[3]};else if(b&&(c=this.rules.table.exec(a))){a=a.substring(c[0].length);f={type:"table",header:c[1].replace(/^ *| *\| *$/g,"").split(/ *\| */),align:c[2].replace(/^ *|\| *$/g,"").split(/ *\| */),cells:c[3].replace(/(?: *\| *)?\n$/,"").split("\n")};for(g=0;g<f.align.length;g++)/^ *-+: *$/.test(f.align[g])?f.align[g]="right":/^ *:-+: *$/.test(f.align[g])?f.align[g]="center":/^ *:-+ *$/.test(f.align[g])?f.align[g]="left":f.align[g]=null;for(g=0;g<f.cells.length;g++)f.cells[g]=f.cells[g].replace(/^ *\| *| *\| *$/g,"").split(/ *\| */);this.tokens.push(f)}else if(b&&(c=this.rules.paragraph.exec(a)))a=a.substring(c[0].length),this.tokens.push({type:"paragraph",text:"\n"===c[1].charAt(c[1].length-1)?c[1].slice(0,-1):c[1]});else if(c=this.rules.text.exec(a))a=a.substring(c[0].length),this.tokens.push({type:"text",text:c[0]});else if(a)throw Error("Infinite loop on byte: "+a.charCodeAt(0));}return this.tokens};var h={escape:/^\\([\\`*{}\[\]()#+\-.!_>])/,autolink:/^<([^ >]+(@|:\/)[^ >]+)>/,url:t,tag:/^\x3c!--[\s\S]*?--\x3e|^<\/?\w+(?:"[^"]*"|'[^']*'|[^'">])*?>/,link:/^!?\[(inside)\]\(href\)/,reflink:/^!?\[(inside)\]\s*\[([^\]]*)\]/,nolink:/^!?\[((?:\[[^\]]*\]|[^\[\]])*)\]/,strong:/^__([\s\S]+?)__(?!_)|^\*\*([\s\S]+?)\*\*(?!\*)/,em:/^\b_((?:__|[\s\S])+?)_\b|^\*((?:\*\*|[\s\S])+?)\*(?!\*)/,code:/^(`+)\s*([\s\S]*?[^`])\s*\1(?!`)/,br:/^ {2,}\n(?!\s*$)/,del:t,text:/^[\s\S]+?(?=[\\<!\[_*`]| {2,}\n|$)/,_inside:/(?:\[[^\]]*\]|[^\[\]]|\](?=[^\[]*\]))*/,_href:/\s*<?([\s\S]*?)>?(?:\s+['"]([\s\S]*?)['"])?\s*/};h.link=l(h.link)("inside",h._inside)("href",h._href)();h.reflink=l(h.reflink)("inside",h._inside)();h.normal=r({},h);h.pedantic=r({},h.normal,{strong:/^__(?=\S)([\s\S]*?\S)__(?!_)|^\*\*(?=\S)([\s\S]*?\S)\*\*(?!\*)/,em:/^_(?=\S)([\s\S]*?\S)_(?!_)|^\*(?=\S)([\s\S]*?\S)\*(?!\*)/});h.gfm=r({},h.normal,{escape:l(h.escape)("])","~|])")(),url:/^(https?:\/\/[^\s<]+[^<.,:;"')\]\s])/,del:/^~~(?=\S)([\s\S]*?\S)~~/,text:l(h.text)("]|","~]|")("|","|https?://|")()});h.breaks=r({},h.gfm,{br:l(h.br)("{2,}","*")(),text:l(h.gfm.text)("{2,}","*")()});q.rules=h;q.output=function(a,b,e){return(new q(b,e)).output(a)};q.prototype.output=function(a){for(var b="",e,d;a;)if(d=this.rules.escape.exec(a))a=a.substring(d[0].length),b+=d[1];else if(d=this.rules.autolink.exec(a))a=a.substring(d[0].length),"@"===d[2]?(e=":"===d[1].charAt(6)?this.mangle(d[1].substring(7)):this.mangle(d[1]),d=this.mangle("mailto:")+e):d=e=n(d[1]),b+='<a href="'+d+'">'+e+"</a>";else if(d=this.rules.url.exec(a))a=a.substring(d[0].length),d=e=n(d[1]),b+='<a href="'+d+'">'+e+"</a>";else if(d=this.rules.tag.exec(a))a=a.substring(d[0].length),b+=this.options.sanitize?n(d[0]):d[0];else if(d=this.rules.link.exec(a))a=a.substring(d[0].length),b+=this.outputLink(d,{href:d[2],title:d[3]});else if((d=this.rules.reflink.exec(a))||(d=this.rules.nolink.exec(a)))a=a.substring(d[0].length),e=(d[2]||d[1]).replace(/\s+/g," "),(e=this.links[e.toLowerCase()])&&e.href?b+=this.outputLink(d,e):(b+=d[0].charAt(0),a=d[0].substring(1)+a);else if(d=this.rules.strong.exec(a))a=a.substring(d[0].length),b+="<strong>"+this.output(d[2]||d[1])+"</strong>";else if(d=this.rules.em.exec(a))a=a.substring(d[0].length),b+="<em>"+this.output(d[2]||d[1])+"</em>";else if(d=this.rules.code.exec(a))a=a.substring(d[0].length),b+="<code>"+n(d[2],!0)+"</code>";else if(d=this.rules.br.exec(a))a=a.substring(d[0].length),b+="<br>";else if(d=this.rules.del.exec(a))a=a.substring(d[0].length),b+="<del>"+this.output(d[1])+"</del>";else if(d=this.rules.text.exec(a))a=a.substring(d[0].length),b+=n(this.smartypants(d[0]));else if(a)throw Error("Infinite loop on byte: "+a.charCodeAt(0));return b};q.prototype.outputLink=function(a,b){return"!"!==a[0].charAt(0)?'<a href="'+n(b.href)+'"'+(b.title?' title="'+n(b.title)+'"':"")+">"+this.output(a[1])+"</a>":'<img src="'+n(b.href)+'" alt="'+n(a[1])+'"'+(b.title?' title="'+n(b.title)+'"':"")+">"};q.prototype.smartypants=function(a){return this.options.smartypants?a.replace(/--/g,"\u2014").replace(/(^|[-\u2014/(\[{"\s])'/g,"$1\u2018").replace(/'/g,"\u2019").replace(/(^|[-\u2014/(\[{\u2018\s])"/g,"$1\u201c").replace(/"/g,"\u201d").replace(/\.{3}/g,"\u2026"):a};q.prototype.mangle=function(a){for(var b="",e=a.length,d=0,c;d<e;d++)c=a.charCodeAt(d),0.5<Math.random()&&(c="x"+c.toString(16)),b+="&#"+c+";";return b};p.parse=function(a,b){return(new p(b)).parse(a)};p.prototype.parse=function(a){this.inline=new q(a.links,this.options);this.tokens=a.reverse();for(a="";this.next();)a+=this.tok();return a};p.prototype.next=function(){return this.token=this.tokens.pop()};p.prototype.peek=function(){return this.tokens[this.tokens.length-1]||0};p.prototype.parseText=function(){for(var a=this.token.text;"text"===this.peek().type;)a+="\n"+this.next().text;return this.inline.output(a)};p.prototype.tok=function(){switch(this.token.type){case "space":return"";case "hr":return"<hr>\n";case "heading":var a=[],b=this.token.text.match(/[\s\t]*\{([^\}]+)\}[\s\t]*$/);if(b){var e,d=[],c=b[1].split(" ");a[0]="";for(var b=0,h=c.length;b<h;b++)c[b]&&(/#.+/.test(c[b])?e=c[b].replace("#",""):/\..+/.test(c[b])&&d.push(c[b].replace(".","")));e&&a.push('id="'+e+'"');0<d.length&&a.push('class="'+d.join(" ")+'"');this.token.text=this.token.text.replace(/[\s\t]*\{([^\}]+)\}[\s\t]*$/,"")}return"<h"+this.token.depth+a.join(" ")+">"+this.inline.output(this.token.text)+"</h"+this.token.depth+">\n";case "code":return this.options.highlight&&(b=this.options.highlight(this.token.text,this.token.lang),null!=b&&b!==this.token.text&&(this.token.escaped=!0,this.token.text=b)),this.token.escaped||(this.token.text=n(this.token.text,!0)),"<pre><code"+(this.token.lang?' class="'+this.options.langPrefix+this.token.lang+'"':"")+">"+this.token.text+"</code></pre>\n";case "table":a="<thead>\n<tr>\n";for(b=0;b<this.token.header.length;b++)e=this.inline.output(this.token.header[b]),a+="<th",this.token.align[b]&&(a+=' style="text-align:'+this.token.align[b]+'"'),a+=">"+e+"</th>\n";a+="</tr>\n</thead>\n<tbody>\n";for(b=0;b<this.token.cells.length;b++){e=this.token.cells[b];a+="<tr>\n";for(c=0;c<e.length;c++)d=this.inline.output(e[c]),a+="<td",this.token.align[c]&&(a+=' style="text-align:'+this.token.align[c]+'"'),a+=">"+d+"</td>\n";a+="</tr>\n"}a+="</tbody>\n";return"<table>\n"+a+"</table>\n";case "blockquote_start":for(a="";"blockquote_end"!==this.next().type;)a+=this.tok();return"<blockquote>\n"+a+"</blockquote>\n";case "list_start":b=this.token.ordered?"ol":"ul";for(a="";"list_end"!==this.next().type;)a+=this.tok();return"<"+b+">\n"+a+"</"+b+">\n";case "list_item_start":for(a="";"list_item_end"!==this.next().type;)a+="text"===this.token.type?this.parseText():this.tok();return"<li>"+a+"</li>\n";case "loose_item_start":for(a="";"list_item_end"!==this.next().type;)a+=this.tok();return"<li>"+a+"</li>\n";case "html":return this.token.pre||this.options.pedantic?this.token.text:this.inline.output(this.token.text);case "paragraph":return"<p>"+this.inline.output(this.token.text)+"</p>\n";case "text":return"<p>"+this.parseText()+"</p>\n"}};t.exec=t;k.options=k.setOptions=function(a){r(k.defaults,a);return k};k.defaults={gfm:!0,tables:!0,breaks:!1,pedantic:!1,sanitize:!1,smartLists:!1,silent:!1,highlight:null,langPrefix:"lang-",smartypants:!1};k.Parser=p;k.parser=p.parse;k.Lexer=s;k.lexer=s.lex;k.InlineLexer=q;k.inlineLexer=q.output;k.parse=k;"object"===typeof exports?module.exports=k:"function"===typeof define&&define.amd?define(function(){return k}):this.marked=k}).call(function(){return this||("undefined"!==typeof window?window:global)}());

/*!
 * Copyright (c) 2013, hami
 * All rights reserved.
 *
 * Licensed under the MIT license.
 */
var exceptRules = {
  'admin.blog.fc2.com': [{name: 'entry[sendtb]'}]
};

var $inputs = $('form textarea'),
    $buttons = (function() {
      var $e = $inputs.parent();
      while($e.get(0).tagName.toLowerCase() != 'form') {
        $e = $e.parent();
      }
      return $e.find('input[type="submit"]');
    })();

(function() {
  var rules = exceptRules[location.host],
      filter = [];
  if (!rules) return;

  for(var i = 0, iz = rules.length; i < iz; i++) {
    var rule = rules[i],
        f = '';
    for(var j in rule) {
      f += '[' + j + '="' + rule[j] + '"]';
    }
    filter[i] = f;
  }

  $inputs = $inputs.not(filter.join(','));
})();

function throttle(fn, interval) {
  var timer = null;
  return function() {
    var self = this, args = arguments;
    if (!timer) {
      timer = setTimeout(function() {
        timer = null;
        fn.apply(self, args);
      }, interval);
    }
  };
}

function toMarkdown() {
  $inputs.each(function() {
    var $input = $(this),
        $data = $input.data('markdown'),
        reMarker = new reMarked({
          indnt_str: '  ',
          hash_lnks: true,
          gfm_code: true,
          unsup_tags: {
            ignore: "script style noscript",
            inline: "span sup sub i u b center big abbr time samp var kbd mark ruby rt rp bdo wbr cite q dfn small big ins",
            block2: "div form fieldset dl header footer address article aside figure hgroup section",
            block1c: "dt dd caption legend figcaption output",
            block2c: "canvas audio video iframe"
          }
        });
    if (!$data) {
      $data = $input.clone().insertAfter($input);
      $input.attr({id: '', name: ''});
      $input.data('markdown', $data);
      $input.css({opacity:0,position:'fixed',zIndex:-1}).hide();
      $data.on('keyup change', throttle(function() {
        toHTML($input);
      }, 1000));
    }
    $data.val(reMarker.render($input.val()));
  });
}

function toHTML($elem) {
  if (!$elem) {
    $inputs.each(function() {
      var $input = $(this), $data = $input.data('markdown');
      $input.attr({name: $data.attr('name'), id: $data.attr('id')});
      $data.attr({id: '', name: ''});
      $input.val(marked($data.val()));
    });
  } else {
    $elem.val(marked($elem.data('markdown').val())).trigger('keyup');
  }
}

toMarkdown();

$buttons.each(function() {
  var self = this,
      $button = $(this),
      callback = $button.attr('onclick');
      if (callback) {
        callback = callback ? eval('(function(){' + callback + '})') : void 0;
      }
  $button.attr('onclick', '');
  $button.on('click.markdown', function(event) {
    var f;
    toHTML();
    callback && (f = callback.apply(this, arguments));
    if (f === false) {
      return false;
    }
  });
});

})(this, window.jQuery)};

var s = document.createElement('script');
s.textContent = '(' + myFunction + ')();';
document.body.appendChild(s);

}, false);