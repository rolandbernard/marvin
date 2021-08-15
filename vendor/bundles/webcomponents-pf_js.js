/*! For license information please see webcomponents-pf_js.js.LICENSE.txt */
(function(){"use strict";function t(t){var n=0;return function(){return n<t.length?{done:!1,value:t[n++]}:{done:!0}}}var n,r="function"==typeof Object.defineProperties?Object.defineProperty:function(t,n,r){return t==Array.prototype||t==Object.prototype||(t[n]=r.value),t},e=function(t){t=["object"==typeof globalThis&&globalThis,t,"object"==typeof window&&window,"object"==typeof self&&self,"object"==typeof global&&global];for(var n=0;n<t.length;++n){var r=t[n];if(r&&r.Math==Math)return r}throw Error("Cannot find global object")}(this);function o(t,n){if(n)t:{var o=e;t=t.split(".");for(var i=0;i<t.length-1;i++){var u=t[i];if(!(u in o))break t;o=o[u]}(n=n(i=o[t=t[t.length-1]]))!=i&&null!=n&&r(o,t,{configurable:!0,writable:!0,value:n})}}function i(t){return(t={next:t})[Symbol.iterator]=function(){return this},t}if(o("Symbol",(function(t){function n(t,n){this.g=t,r(this,"description",{configurable:!0,writable:!0,value:n})}if(t)return t;n.prototype.toString=function(){return this.g};var e=0;return function t(r){if(this instanceof t)throw new TypeError("Symbol is not a constructor");return new n("jscomp_symbol_"+(r||"")+"_"+e++,r)}})),o("Symbol.iterator",(function(n){if(n)return n;n=Symbol("Symbol.iterator");for(var o="Array Int8Array Uint8Array Uint8ClampedArray Int16Array Uint16Array Int32Array Uint32Array Float32Array Float64Array".split(" "),u=0;u<o.length;u++){var c=e[o[u]];"function"==typeof c&&"function"!=typeof c.prototype[n]&&r(c.prototype,n,{configurable:!0,writable:!0,value:function(){return i(t(this))}})}return n})),"function"==typeof Object.setPrototypeOf)n=Object.setPrototypeOf;else{var u;t:{var c={};try{c.__proto__={a:!0},u=c.a;break t}catch(T){}u=!1}n=u?function(t,n){if(t.__proto__=n,t.__proto__!==n)throw new TypeError(t+" is not extensible");return t}:null}var a=n;function l(){this.o=!1,this.h=null,this.A=void 0,this.g=1,this.v=0,this.m=null}function f(t){if(t.o)throw new TypeError("Generator is already running");t.o=!0}function s(t,n){t.m={B:n,C:!0},t.g=t.v}function h(t,n){return t.g=3,{value:n}}function p(t){this.g=new l,this.h=t}function y(t,n,r,e){try{var o=n.call(t.g.h,r);if(!(o instanceof Object))throw new TypeError("Iterator result "+o+" is not an object");if(!o.done)return t.g.o=!1,o;var i=o.value}catch(n){return t.g.h=null,s(t.g,n),g(t)}return t.g.h=null,e.call(t.g,i),g(t)}function g(t){for(;t.g.g;)try{var n=t.h(t.g);if(n)return t.g.o=!1,{value:n.value,done:!1}}catch(n){t.g.A=void 0,s(t.g,n)}if(t.g.o=!1,t.g.m){if(n=t.g.m,t.g.m=null,n.C)throw n.B;return{value:n.return,done:!0}}return{value:void 0,done:!0}}function v(t){this.next=function(n){return f(t.g),t.g.h?n=y(t,t.g.h.next,n,t.g.s):(t.g.s(n),n=g(t)),n},this.throw=function(n){return f(t.g),t.g.h?n=y(t,t.g.h.throw,n,t.g.s):(s(t.g,n),n=g(t)),n},this.return=function(n){return function(t,n){f(t.g);var r=t.g.h;return r?y(t,"return"in r?r.return:function(t){return{value:t,done:!0}},n,t.g.return):(t.g.return(n),g(t))}(t,n)},this[Symbol.iterator]=function(){return this}}function b(t,n){return n=new v(new p(n)),a&&t.prototype&&a(n,t.prototype),n}l.prototype.s=function(t){this.A=t},l.prototype.return=function(t){this.m={return:t},this.g=this.v},Array.from||(Array.from=function(t){return[].slice.call(t)}),Object.assign||(Object.assign=function(t){for(var n,r=[].slice.call(arguments,1),e=0;e<r.length;e++)if(n=r[e])for(var o=t,i=Object.keys(n),u=0;u<i.length;u++){var c=i[u];o[c]=n[c]}return t});var m=setTimeout;function w(){}function d(t){if(!(this instanceof d))throw new TypeError("Promises must be constructed via new");if("function"!=typeof t)throw new TypeError("not a function");this.i=0,this.u=!1,this.j=void 0,this.l=[],A(t,this)}function j(t,n){for(;3===t.i;)t=t.j;0===t.i?t.l.push(n):(t.u=!0,M((function(){var r=1===t.i?n.D:n.F;if(null===r)(1===t.i?S:_)(n.promise,t.j);else{try{var e=r(t.j)}catch(t){return void _(n.promise,t)}S(n.promise,e)}})))}function S(t,n){try{if(n===t)throw new TypeError("A promise cannot be resolved with itself.");if(n&&("object"==typeof n||"function"==typeof n)){var r=n.then;if(n instanceof d)return t.i=3,t.j=n,void P(t);if("function"==typeof r)return void A(function(t,n){return function(){t.apply(n,arguments)}}(r,n),t)}t.i=1,t.j=n,P(t)}catch(n){_(t,n)}}function _(t,n){t.i=2,t.j=n,P(t)}function P(t){2===t.i&&0===t.l.length&&M((function(){t.u||"undefined"!=typeof console&&console&&console.warn("Possible Unhandled Promise Rejection:",t.j)}));for(var n=0,r=t.l.length;n<r;n++)j(t,t.l[n]);t.l=null}function O(t,n,r){this.D="function"==typeof t?t:null,this.F="function"==typeof n?n:null,this.promise=r}function A(t,n){var r=!1;try{t((function(t){r||(r=!0,S(n,t))}),(function(t){r||(r=!0,_(n,t))}))}catch(t){r||(r=!0,_(n,t))}}function E(t){return t&&"object"==typeof t&&t.constructor===d?t:new d((function(n){n(t)}))}d.prototype.catch=function(t){return this.then(null,t)},d.prototype.then=function(t,n){var r=new this.constructor(w);return j(this,new O(t,n,r)),r},d.prototype.finally=function(t){var n=this.constructor;return this.then((function(r){return n.resolve(t()).then((function(){return r}))}),(function(r){return n.resolve(t()).then((function(){return n.reject(r)}))}))};var T,I,x,C,D,k,M="function"==typeof setImmediate&&function(t){setImmediate(t)}||function(t){m(t,0)};if(!window.Promise){window.Promise=d,d.prototype.then=d.prototype.then,d.all=function(t){return new d((function(n,r){function e(t,u){try{if(u&&("object"==typeof u||"function"==typeof u)){var c=u.then;if("function"==typeof c)return void c.call(u,(function(n){e(t,n)}),r)}o[t]=u,0==--i&&n(o)}catch(t){r(t)}}if(!t||void 0===t.length)return r(new TypeError("Promise.all accepts an array"));var o=Array.prototype.slice.call(t);if(0===o.length)return n([]);for(var i=o.length,u=0;u<o.length;u++)e(u,o[u])}))},d.race=function(t){return new d((function(n,r){if(!t||void 0===t.length)return r(new TypeError("Promise.race accepts an array"));for(var e=0,o=t.length;e<o;e++)E(t[e]).then(n,r)}))},d.resolve=E,d.reject=function(t){return new d((function(n,r){r(t)}))};var N=document.createTextNode(""),U=[];new MutationObserver((function(){for(var t=U.length,n=0;n<t;n++)U[n]();U.splice(0,t)})).observe(N,{characterData:!0}),M=function(t){U.push(t),N.textContent=0<N.textContent.length?"":"a"}}!function(t,n){if(!(n in t)){var r=typeof global==typeof r?window:global,e=0,o=String(Math.random()),i="__symbol@@"+o,u=t.getOwnPropertyNames,c=t.getOwnPropertyDescriptor,a=t.create,l=t.keys,f=t.freeze||t,s=t.defineProperty,h=t.defineProperties,p=c(t,"getOwnPropertyNames"),y=t.prototype,g=y.hasOwnProperty,v=y.propertyIsEnumerable,b=y.toString,m=function(t,n,r){g.call(t,i)||s(t,i,{enumerable:!1,configurable:!1,writable:!1,value:{}}),t[i]["@@"+n]=r},w=function(t,n){var r=a(t);return u(n).forEach((function(t){_.call(n,t)&&I(r,t,n[t])})),r},d=function(){},j=function(t){return t!=i&&!g.call(A,t)},S=function(t){return t!=i&&g.call(A,t)},_=function(t){var n=String(t);return S(n)?g.call(this,n)&&!!this[i]&&this[i]["@@"+n]:v.call(this,t)},P=function(n){return s(y,n,{enumerable:!1,configurable:!0,get:d,set:function(t){C(this,n,{enumerable:!1,configurable:!0,writable:!0,value:t}),m(this,n,!0)}}),A[n]=s(t(n),"constructor",E),f(A[n])},O=function t(n){if(this instanceof t)throw new TypeError("Symbol is not a constructor");return P("__symbol:".concat(n||"",o,++e))},A=a(null),E={value:O},T=function(t){return A[t]},I=function(t,n,r){var e=String(n);if(S(e)){if(n=C,r.enumerable){var o=a(r);o.enumerable=!1}else o=r;n(t,e,o),m(t,e,!!r.enumerable)}else s(t,n,r);return t},x=function(t){return u(t).filter(S).map(T)};p.value=I,s(t,"defineProperty",p),p.value=x,s(t,n,p),p.value=function(t){return u(t).filter(j)},s(t,"getOwnPropertyNames",p),p.value=function(t,n){var r=x(n);return r.length?l(n).concat(r).forEach((function(r){_.call(n,r)&&I(t,r,n[r])})):h(t,n),t},s(t,"defineProperties",p),p.value=_,s(y,"propertyIsEnumerable",p),p.value=O,s(r,"Symbol",p),p.value=function(t){return(t="__symbol:".concat("__symbol:",t,o))in y?A[t]:P(t)},s(O,"for",p),p.value=function(t){if(j(t))throw new TypeError(t+" is not a symbol");if(g.call(A,t)&&"__symbol:"===(t=t.slice(10)).slice(0,10)&&(t=t.slice(10))!==o)return 0<(t=t.slice(0,t.length-o.length)).length?t:void 0},s(O,"keyFor",p),p.value=function(t,n){var r=c(t,n);return r&&S(n)&&(r.enumerable=_.call(t,n)),r},s(t,"getOwnPropertyDescriptor",p),p.value=function(t,n){return 1===arguments.length||void 0===n?a(t):w(t,n)},s(t,"create",p),p.value=function(){var t=b.call(this);return"[object String]"===t&&S(this)?"[object Symbol]":t},s(y,"toString",p);try{if(!0!==a(s({},"__symbol:",{get:function(){return s(this,"__symbol:",{value:!0})["__symbol:"]}}))["__symbol:"])throw"IE11";var C=s}catch(t){C=function(t,n,r){var e=c(y,n);delete y[n],s(t,n,r),s(y,n,e)}}}}(Object,"getOwnPropertySymbols"),T=Object,I=Symbol,C=T.defineProperty,D=T.prototype,k=D.toString,"iterator match replace search split hasInstance isConcatSpreadable unscopables species toPrimitive toStringTag".split(" ").forEach((function(t){t in I||(C(I,t,{value:I(t)}),"toStringTag"===t&&((x=T.getOwnPropertyDescriptor(D,"toString")).value=function(){var t=k.call(this),n=null==this?this:this[I.toStringTag];return null==n?t:"[object "+n+"]"},C(D,"toString",x)))})),function(t,n,r){function e(){return this}n[t]||(n[t]=function(){var n=0,r=this,o={next:function(){var t=r.length<=n;return t?{done:t}:{done:t,value:r[n++]}}};return o[t]=e,o}),r[t]||(r[t]=function(){var n=String.fromCodePoint,r=this,o=0,i=r.length,u={next:function(){var t=i<=o,e=t?"":n(r.codePointAt(o));return o+=e.length,t?{done:t}:{done:t,value:e}}};return u[t]=e,u})}(Symbol.iterator,Array.prototype,String.prototype);var F=Object.prototype.toString;Object.prototype.toString=function(){return void 0===this?"[object Undefined]":null===this?"[object Null]":F.call(this)},Object.keys=function(t){return Object.getOwnPropertyNames(t).filter((function(n){return(n=Object.getOwnPropertyDescriptor(t,n))&&n.enumerable}))},String.prototype[Symbol.iterator]&&String.prototype.codePointAt||(String.prototype[Symbol.iterator]=function t(){var n,r=this;return b(t,(function(t){if(1==t.g&&(n=0),3!=t.g)return n<r.length?t=h(t,r[n]):(t.g=0,t=void 0),t;n++,t.g=2}))}),Set.prototype[Symbol.iterator]||(Set.prototype[Symbol.iterator]=function t(){var n,r,e=this;return b(t,(function(t){if(1==t.g&&(n=[],e.forEach((function(t){n.push(t)})),r=0),3!=t.g)return r<n.length?t=h(t,n[r]):(t.g=0,t=void 0),t;r++,t.g=2}))}),Map.prototype[Symbol.iterator]||(Map.prototype[Symbol.iterator]=function t(){var n,r,e=this;return b(t,(function(t){if(1==t.g&&(n=[],e.forEach((function(t,r){n.push([r,t])})),r=0),3!=t.g)return r<n.length?t=h(t,n[r]):(t.g=0,t=void 0),t;r++,t.g=2}))})}).call(this);