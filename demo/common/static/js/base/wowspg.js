var wow={};!function(){var a={};wow.define=function(b,c,d){var e;if("string"==typeof b?(e={},e[b]=c,d=d||"p"):(e=b,d=c||"p"),"g"==d)for(var f in e)e.hasOwnProperty(f)&&(a[f]=e[f])},wow.data=function(b,c){var c=c||"p";return"g"==c?a[b]:void 0}}(),wow.history=function(){var a=!!history.pushState,b={},c=null,d={},e=function(a){return a&&b[a]?b[a]:{}},f=function(){return e(c)},g=function(a,d,e){if(!c)return void h(a,d,e);var f=(new Date).getTime(),e=e.replace(/#/g,"");b[f]={title:d||document.title,url:e,data:a},c=f;var g=wow.config.isRenderHash?"#"+e:e;"#/"==g&&(g="#"),history.pushState({_id:f},d,g),c=f},h=function(a,d,e){c||(c=(new Date).getTime());var e=e.replace(/#/g,"");b[c]={title:d||document.title,url:e,data:a};var f=wow.config.isRenderHash?"#"+e:e;"#/"==f&&(f="#"),history.replaceState({_id:c},d,f)},i=function(a){c=a},j=function(a,b,c){d={title:b||document.title,url:c,data:a};var e=c.replace(/#/g,"");"/"==e&&(e="")},k=function(){},l=function(){return{}},m=function(){return d},n=function(a){d=a};return a?{setCurrentId:i,push:g,replace:h,getInfo:e,getCurrentInfo:f}:{setCurrentObj:n,push:j,replace:k,getInfo:l,getCurrentInfo:m}}(),wow.router=function(){var a=null,b=function(a){var b=a,c=0;for(var d in a)if(a.hasOwnProperty(d)){var e=a[d];e&&(e.block||e.router)&&c++}return c?b:!1},c=function(d,e){var f=$.Deferred(),g=e?b(e):a,h=null,i={},j=[],d=d;for(var k in g)if(g.hasOwnProperty(k)){var l=new RegExp(k);if("/"==k)l=/^\/(\?[^#]*)?$/;else{var m="";/^\//.test(k)&&(m="^"+m),m+=/\/$/.test(k)?k.replace(/\/$/,"/?(\\?[^#]*)?$"):k,m=m.replace(/\(:([^\)]+)\)/g,function(a,b){return j.push(b),"([^\\)/?#]+)"}),l=new RegExp(m)}var n=l.exec(d);if(n&&"undefined"!=typeof n[0]){for(var o=0,p=j.length;p>o;o++)i[j[o]]=n[o+1];h={conf:g[k]}}}if(h){var q=h.conf.router;q?"string"==typeof q?require([q],function(a){c(d,a).done(function(a,b){h.router=a,i=$.extend(i,b),f.resolve(h,i)}).fail(function(a){f.reject(a)})}):c(d,q).done(function(a,b){h.router=a,i=$.extend(i,b),f.resolve(h,i)}).fail(function(a){f.reject(a)}):f.resolve(h,i)}else f.reject({code:404,msg:"Url not found!"});return f.promise()},d=function(a){if(!/\?/.test(a))return{};for(var a=a.replace(/[^?]*\?/,""),b=a.split("&"),c={},d=0,e=b.length;e>d;d++){var f=b[d],g=f.split("=");2==g.length&&(c[g[0]]=g[1])}return c},e=function(a,b){var a=/^\//.test(a)?a:"/"+a;return c(a,b).then(function(b,c){var e=[],f={},g=!0,h=$.extend(c,d(a)),i=function(a){if(a.conf&&a.conf.block){var b=a.conf.block;for(var c in b)if(b.hasOwnProperty(c)&&"ds"!=c&&"dt"!=c&&"handler"!=c){var d=b[c];if(f[c]=f[c]||{},f[c].ds=d.ds||b.ds,f[c].title=d.title||b.title,f[c].ds&&"string"==typeof f[c].ds&&(f[c].ds=f[c].ds.replace(/\{([^\{\}]+)\}/g,function(a,b){var c=b.split("|"),d=c[0],e=c[1],f=h[d]||e||"";return f||(f=wow.data(d,"g")||""),f})),f[c].dt=d.dt||b.dt,f[c].handler=d.handler||b.handler,f[c].css=d.css||b.css,f[c].deps=f[c].deps||d.deps,f[c].selector=f[c].selector||d.selector,f[c].tpl="undefined"==typeof d.tpl?f[c].tpl:d.tpl,f[c].fillType=d.fillType||"fill",f[c].option=f[c].option||{},d.option&&(f[c].option=$.extend(f[c].option,d.option)),d.deps)for(var j=[].concat(d.deps),k=0,l=j.length;l>k;k++){var m=j[k];b.hasOwnProperty(m)&&(f[m]=f[m]||{},f[m].follows=f[m].follows||[],f[m].follows.push(c))}else g&&e.push(c);var n=d.block;if(n)for(var o in n)if(n.hasOwnProperty(o)){var p=n[o];n.hasOwnProperty(o)&&(f[o]=f[o]||{},f[o].selector=f[o].selector||p.selector,f[c].follows=f[c].follows||[],f[c].follows.push(o),f[c].children=f[c].children||[],f[c].children.push(o))}}g=!1}a.router&&i(a.router)};return i(b),{root:e,tree:f,params:h}})},f=function(c){var d=$.Deferred();return a=b(c),a?d.resolve(a):d.reject({code:1001,msg:"Router's config does not have any correct item!"}),d.promise()};return{init:f,map:c,getRenderTree:e,config:a}}(),wow.render=function(){var a={},b=(!!history.pushState,""),c=function(b,c,d){if(a[b]&&a[b].tpl==c){var e=a[b].ds;if("string"==typeof d&&d==e)return!0;if("object"==typeof d&&"object"==typeof e){for(var f in d)if(d.hasOwnProperty(f)&&e[f]!=d[f])return!1;for(var f in e)if(!d.hasOwnProperty(f))return!1;return!0}if(!d&&!e)return!0}return!1},d=function(b,c,d,e,f){var g=[];if(f&&f.length)for(var h=0,i=f.length;i>h;h++)g.push(f[h]);a[b]={tpl:c,handler:e,ds:d,children:g}},e=function(a){if(a){var b=[];a.start&&(b=b.concat(a.start)),a.ready&&(b=b.concat(a.ready)),a.usable&&(b=b.concat(a.usable));for(var c=0,d=b.length;d>c;c++)b[c]&&b[c].destroy&&b[c].destroy()}},f=function(b){var c=a[b];if(c&&c.handler&&e(c.handler),c&&c.children)for(var d=0,g=c.children.length;g>d;d++){var h=c.children[d];a[h]&&f(h)}delete a[b]},g=function(a){var b=$.Deferred(),a=[].concat(a);return require(a,function(){for(var a=[],c=0,d=arguments.length;d>c;c++)a.push(arguments[c]);b.resolve(a)},function(a){b.reject(a)}),b.promise()},h=function(a,c,d){var e=$.Deferred(),f=$.extend({wow:{url:b,title:document.title},location:location},c);return a(f,function(a,b){a?e.reject(a):e.resolve(b,d)}),e.promise()},i=function(a){var b=$.Deferred();if(wow.config.handler.loading){var c=wow.config.handler.loading(a);if(c&&c.done)return c;b.resolve()}else b.resolve();return b.promise()},j=function(a,b,e){var k=$.Deferred(),e=e||{},l=e.$parent||$(document),m=b[a],n=null,o=o||null,p=e.params,q=e.rd||{};if(!m.selector)return k.resolve(q),k.promise();if(n=l.find(m.selector),!n||!n[0])return k.resolve(q),k.promise();if(m.deps)for(var r=0,s=m.deps.length;s>r;r++){var t=m.deps[r],u=b[t];if(!c(t,u.tpl,u.ds))return k.resolve(q),k.promise()}var v=!1;if(c(a,m.tpl,m.ds))v=!0;else if(m.tpl){var w=[m.tpl],x=!1,y=!1,z={},A="wow.ds.dataready."+(new Date).getTime();if(q[a]||!m.ds?(x=!0,z=q[a]||{}):"string"==typeof m.ds?$.ajax({cache:!1,dataType:"json",url:m.ds.replace(/\{([^\{\}]+)\}/g,function(a,b){return p[b]||""})}).then(function(a){x=!0,z=a,$(window).trigger(A)}).fail(function(){return k.reject({code:504,msg:'Data source "'+m.ds+'" load error!',data:{block:m}}),k.promise()}):(x=!0,z=m.ds),m.dt&&w.push(m.dt),m.handler&&m.handler.start&&m.handler.start.length&&(w=w.concat(m.handler.start)),m.css)for(var r=0,s=m.css.length;s>r;r++)w.push("css!"+m.css[r]);var B={};f(a),m.title&&m.title!=document.title&&(document.title=m.title),i(n).done(function(){g(w).then(function(b){var c=new $.Deferred,d=null,e=[],f=0,g=b[f++];if(m.dt&&(d=b[f++]),m.handler&&m.handler.start&&m.handler.start.length){for(var i=b.length;i>f;f++)e.push(b[f]);B.start=e}if(y=!0,x){d&&"function"==typeof d&&(z=d(z)),q[a]=z;var j=$.extend(z,m.option);j.params=p,h(g,j,B).then(function(a){c.resolve(a)}).fail(function(){var a={code:505,msg:'Tpl "'+m.tpl+'" renter error!',data:{block:m}};k.reject(a),c.reject(a)})}else $(window).one(A,function(){d&&"function"==typeof d&&(z=d(z)),q[a]=z;var b=$.extend(z,m.option);b.params=p,h(g,b,B).then(function(a){c.resolve(a)}).fail(function(){var a={code:505,msg:'Tpl "'+m.tpl+'" renter error!',data:{block:m}};k.reject(a),c.reject(a)})});return c.promise()}).then(function(c){k.resolve(q);var e=B.start;switch(d(a,m.tpl,m.ds,B,m.children),m.fillType){case"fill":n.html(c);break;case"append":n.append(c);break;case"prepend":n.prepend(c)}if(e)for(var f=0,h=e.length;h>f;f++){var i=e[f];i&&i.init&&i.init(n,z,p)}var l=null;if(m.handler&&m.handler.ready&&m.handler.ready.length&&(l=g(m.handler.ready).then(function(a){B.ready=a;for(var b=0,c=a.length;c>b;b++){var d=a[b];d&&d.init&&d.init(n,z,p)}})),m.follows)for(var o=0,f=0,h=m.follows.length;h>f;f++){var r=m.follows[f];if(b[r]){var s=null;b.children&&$.inArray(r,b.children)>-1&&(s=n),j(r,b,{$parent:s,rd:q,params:p}).then(function(){o++,o>=m.follows.length&&k.resolve(q)})}}return l}).then(function(){return k.resolve(q),m.handler&&m.handler.usable&&m.handler.usable.length?g(m.handler.usable).then(function(a){B.usable=a;for(var b=0,c=a.length;c>b;b++){var d=a[b];d&&d.init&&d.init(n,z,p)}}):void 0}).fail(function(){k.reject({code:1002,msg:"Resource load fail!",block:m})})})}else d(a,m.tpl,m.ds,null,m.children),v=!0;if(v)if(m.follows)for(var C=0,r=0,s=m.follows.length;s>r;r++){var D=m.follows[r];b[D]&&j(D,b,{rd:q,params:p}).then(function(){C++,C>=m.follows.length&&k.resolve(q)})}else k.resolve(q);return o||(o=setTimeout(function(){k.reject({code:503,msg:"Render Time out!"})},o)),k.promise()};return function(a,c,d){var d=d||{};return wow.router.getRenderTree(a,c).then(function(c){var e=c.root,f=c.tree,g=c.params,h={};d.isInHistory||wow.config.isForbidHistory||wow.history.push(h,d.title,a||"/"),$(window).trigger("wow.pagechange",wow.history.getCurrentInfo()),b=a,d.title&&(document.title=d.title),d.isInHistory&&(h=wow.history.getCurrentInfo());for(var i=0,k=e.length;k>i;i++){var l=e[i];j(l,f,{rd:h,params:g}).then(function(){}).fail(function(a){$(window).trigger("wow.loadfail",a)})}})}}(),wow.go=function(a){if(wow.config.isRenderHash)location.href=a;else{/^(http|https|ftp):\/\//.test(a)&&a.indexOf(b)<0?location.href=a:wow.render(a,wow.router.config);var b=wow.config.baseUrl||""}},wow.listener=function(){var a=!!history.pushState,b=function(a){var b=wow.config.baseUrl,c=null;return a.indexOf(b)>-1?c=a.replace(b,""):/^(http|https|ftp):\/\//.test(a)||/^#/.test(a)||/javascript:/.test(a)||(c=a),c},c=function(){var c=wow.router.config;$(document).on("click","a",function(a){var d=$(this),e=d.attr("target");if(!e||"_blank"!=e){var f=d.attr("href");if("undefined"!=typeof f){var g=b(f),h=d.attr("title")||"";null!==g&&(a.preventDefault(),wow.render(g,c,{title:h}).fail(function(a){404==a.code&&(location.href=wow.config.baseUrl+g)}))}}}),a?$(window).bind("popstate",function(){var a=history.state;if(a&&a._id){wow.history.setCurrentId&&wow.history.setCurrentId(a._id);var d=wow.history.getInfo(a._id);d&&d.url&&d.data||location.reload();var e=b(d.url);null!==e&&wow.render(e,c,{isInHistory:!0}).fail(function(a){404==a.code&&(location.href=wow.config.baseUrl+e)})}}):$(window).bind("hashchange",function(){wow.render(location.hash,c).done(function(){})})},d=function(){wow.config.type;c()};return{init:d}}(),wow.init=function(a,b){if(!a)throw new Error("Wow.init need a router config");var b=b||{},c=!!history.pushState,d=b.type||"all",e=!("hash"!=d&&c),f="undefined"==typeof b.baseUrl?location.protocol+"//"+location.hostname+(location.port?":"+location.port:""):b.baseUrl,g=b.timeout||30,h=b.url,i=b.forbidHistory,j=b.handler||{};wow.config={type:d,baseUrl:f,isRenderHash:e,isForbidHistory:i,timeout:g,handler:{loading:j.loading}},wow.router.init(a);var k=location.hash.replace(/#/g,""),l=function(){var b=h||location.href.replace(f,"")||"/";return wow.render(b.replace(/^#|#.*/,""),a).fail(function(){})};k&&""!==k&&"#"!=k?wow.render(h||k,a).done(function(){c&&"hash"!=b.type&&(location.hash="")}).fail(function(){l()}):l(),c&&location.href.indexOf("zhida.baidu.com")<0&&location.href.indexOf("/appworks")<0&&wow.listener.init()};