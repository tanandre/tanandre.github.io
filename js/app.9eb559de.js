(function(t){function e(e){for(var r,i,s=e[0],c=e[1],l=e[2],p=0,f=[];p<s.length;p++)i=s[p],a[i]&&f.push(a[i][0]),a[i]=0;for(r in c)Object.prototype.hasOwnProperty.call(c,r)&&(t[r]=c[r]);u&&u(e);while(f.length)f.shift()();return o.push.apply(o,l||[]),n()}function n(){for(var t,e=0;e<o.length;e++){for(var n=o[e],r=!0,s=1;s<n.length;s++){var c=n[s];0!==a[c]&&(r=!1)}r&&(o.splice(e--,1),t=i(i.s=n[0]))}return t}var r={},a={app:0},o=[];function i(e){if(r[e])return r[e].exports;var n=r[e]={i:e,l:!1,exports:{}};return t[e].call(n.exports,n,n.exports,i),n.l=!0,n.exports}i.m=t,i.c=r,i.d=function(t,e,n){i.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:n})},i.r=function(t){"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},i.t=function(t,e){if(1&e&&(t=i(t)),8&e)return t;if(4&e&&"object"===typeof t&&t&&t.__esModule)return t;var n=Object.create(null);if(i.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var r in t)i.d(n,r,function(e){return t[e]}.bind(null,r));return n},i.n=function(t){var e=t&&t.__esModule?function(){return t["default"]}:function(){return t};return i.d(e,"a",e),e},i.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},i.p="/";var s=window["webpackJsonp"]=window["webpackJsonp"]||[],c=s.push.bind(s);s.push=e,s=s.slice();for(var l=0;l<s.length;l++)e(s[l]);var u=c;o.push([0,"chunk-vendors"]),n()})({0:function(t,e,n){t.exports=n("56d7")},"48ed":function(t,e,n){"use strict";var r=n("a213"),a=n.n(r);a.a},"496e":function(t,e,n){"use strict";var r=n("789b"),a=n.n(r);a.a},"56d7":function(t,e,n){"use strict";n.r(e);n("cadf"),n("551c"),n("f751"),n("097d");var r=n("2b0e"),a=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{attrs:{id:"app"}},[n("router-view")],1)},o=[],i=n("2877"),s={},c=Object(i["a"])(s,a,o,!1,null,null,null),l=c.exports,u=n("8c4f"),p=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{staticClass:"wrapper"},[n("nav",{staticClass:"main-nav"},[n("Profile")],1),n("article",{staticClass:"content"},[n("ProjectLinks",{attrs:{msg:"Welcome to Your Vue.js App"}})],1)])},f=[],d=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{staticClass:"links"},[n("p",[t._v("Welcome to my home page. In case you are interested in one of my projects please click the links below.")]),n("h3",[t._v("My projects:")]),t._l(t.links,function(e){return n("a",{key:e.url,attrs:{href:e.url}},[n("div",{staticClass:"link"},[t._v(t._s(e.name))])])})],2)},m=[],v=[{name:"Planning Poker (Vue+Socket.io)",url:"http://planningpoker-bb.herokuapp.com/"},{name:"Memori Game (Vue)",url:"https://webmemori.netlify.app/"},{name:"Memori Game (Android)",url:"https://play.google.com/store/apps/details?id=nl.tan.memory"},{name:"String Tools (Vue)",url:"https://stringtools.netlify.app/"},{name:"Avatar Generator (Vue+SVG)",url:"https://avatar-generator.netlify.app/"},{name:"Web XSLT Processor (React)",url:"https://webxslt.netlify.app/"},{name:"Flight Tracker (Vue + GMaps)",url:"https://flight-tracker.netlify.app/"}],h={data:function(){return{links:v}}},b=h,g=(n("f198"),Object(i["a"])(b,d,m,!1,null,"bece562c",null)),y=g.exports,_=function(){var t=this,e=t.$createElement,r=t._self._c||e;return r("div",{staticClass:"main"},[r("h3",[t._v("andretan.nl")]),r("img",{staticClass:"avatar",attrs:{alt:"My avatar",src:n("bc28")}}),r("div",{staticClass:"icons"},t._l(t.links,function(t){return r("a",{key:t.url,class:"socicon socicon-"+t.socicon,attrs:{href:t.url}})}),0),t._m(0)])},k=[function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{staticClass:"links"},[n("a",{attrs:{href:"https://lousycoder.netlify.com/"}},[t._v("Blog")])])}],w=[{socicon:"github",url:"https://github.com/tanandre"},{socicon:"gitlab",url:"https://gitlab.com/tanneman1"},{socicon:"linkedin",url:"https://www.linkedin.com/in/andre-tan-56a6445/"},{socicon:"twitter",url:"https://twitter.com/tan_andre"},{socicon:"android",url:"https://play.google.com/store/apps/developer?id=Andre+Tan"}],j={data:function(){return{links:w}}},O=j,P=(n("48ed"),Object(i["a"])(O,_,k,!1,null,"2dfb130c",null)),x=P.exports,S={name:"home",components:{ProjectLinks:y,Profile:x}},C=S,M=(n("496e"),Object(i["a"])(C,p,f,!1,null,"206eee69",null)),T=M.exports;r["a"].use(u["a"]);var V=new u["a"]({routes:[{path:"/",name:"home",component:T}]}),$=n("2f62");r["a"].use($["a"]);var E=new $["a"].Store({state:{},mutations:{},actions:{}});r["a"].config.productionTip=!1,new r["a"]({router:V,store:E,render:function(t){return t(l)}}).$mount("#app")},"789b":function(t,e,n){},a213:function(t,e,n){},bc28:function(t,e,n){t.exports=n.p+"img/avatar.1155c0c6.svg"},c310:function(t,e,n){},f198:function(t,e,n){"use strict";var r=n("c310"),a=n.n(r);a.a}});
//# sourceMappingURL=app.9eb559de.js.map