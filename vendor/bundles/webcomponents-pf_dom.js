/*! For license information please see webcomponents-pf_dom.js.LICENSE.txt */
(function(){"use strict";function e(e){var t=0;return function(){return t<e.length?{done:!1,value:e[t++]}:{done:!0}}}function t(t){var o="undefined"!=typeof Symbol&&Symbol.iterator&&t[Symbol.iterator];return o?o.call(t):{next:e(t)}}var o=document.createEvent("Event");if(o.initEvent("foo",!0,!0),o.preventDefault(),!o.defaultPrevented){var n=Event.prototype.preventDefault;Event.prototype.preventDefault=function(){this.cancelable&&(n.call(this),Object.defineProperty(this,"defaultPrevented",{get:function(){return!0},configurable:!0}))}}var r=/Trident/.test(navigator.userAgent);if(!window.Event||r&&"function"!=typeof window.Event){var i=window.Event;if(window.Event=function(e,t){t=t||{};var o=document.createEvent("Event");return o.initEvent(e,!!t.bubbles,!!t.cancelable),o},i){for(var a in i)window.Event[a]=i[a];window.Event.prototype=i.prototype}}if((!window.CustomEvent||r&&"function"!=typeof window.CustomEvent)&&(window.CustomEvent=function(e,t){t=t||{};var o=document.createEvent("CustomEvent");return o.initCustomEvent(e,!!t.bubbles,!!t.cancelable,t.detail),o},window.CustomEvent.prototype=window.Event.prototype),!window.MouseEvent||r&&"function"!=typeof window.MouseEvent){var l=window.MouseEvent;if(window.MouseEvent=function(e,t){t=t||{};var o=document.createEvent("MouseEvent");return o.initMouseEvent(e,!!t.bubbles,!!t.cancelable,t.view||window,t.detail,t.screenX,t.screenY,t.clientX,t.clientY,t.ctrlKey,t.altKey,t.shiftKey,t.metaKey,t.button,t.relatedTarget),o},l)for(var p in l)window.MouseEvent[p]=l[p];window.MouseEvent.prototype=l.prototype}Object.getOwnPropertyDescriptor(Node.prototype,"baseURI")||Object.defineProperty(Node.prototype,"baseURI",{get:function(){var e=(this.ownerDocument||this).querySelector("base[href]");return e&&e.href||window.location.href},configurable:!0,enumerable:!0});var c,u,d=Element.prototype,s=null!==(c=Object.getOwnPropertyDescriptor(d,"attributes"))&&void 0!==c?c:Object.getOwnPropertyDescriptor(Node.prototype,"attributes"),v=null!==(u=null==s?void 0:s.get)&&void 0!==u?u:function(){return this.attributes},f=Array.prototype.map;d.hasOwnProperty("getAttributeNames")||(d.getAttributeNames=function(){return f.call(v.call(this),(function(e){return e.name}))});var y,w=Element.prototype;w.hasOwnProperty("matches")||(w.matches=null!==(y=w.webkitMatchesSelector)&&void 0!==y?y:w.msMatchesSelector);var b=Node.prototype.appendChild;function h(e){(e=e.prototype).hasOwnProperty("append")||Object.defineProperty(e,"append",{configurable:!0,enumerable:!0,writable:!0,value:function(e){for(var o=[],n=0;n<arguments.length;++n)o[n]=arguments[n];for(n=(o=t(o)).next();!n.done;n=o.next())n=n.value,b.call(this,"string"==typeof n?document.createTextNode(n):n)}})}h(Document),h(DocumentFragment),h(Element);var m,g,O=Node.prototype.insertBefore,E=null!==(g=null===(m=Object.getOwnPropertyDescriptor(Node.prototype,"firstChild"))||void 0===m?void 0:m.get)&&void 0!==g?g:function(){return this.firstChild};function N(e){(e=e.prototype).hasOwnProperty("prepend")||Object.defineProperty(e,"prepend",{configurable:!0,enumerable:!0,writable:!0,value:function(e){for(var o=[],n=0;n<arguments.length;++n)o[n]=arguments[n];n=E.call(this);for(var r=(o=t(o)).next();!r.done;r=o.next())r=r.value,O.call(this,"string"==typeof r?document.createTextNode(r):r,n)}})}N(Document),N(DocumentFragment),N(Element);var P,D,j=Node.prototype.appendChild,x=Node.prototype.removeChild,C=null!==(D=null===(P=Object.getOwnPropertyDescriptor(Node.prototype,"firstChild"))||void 0===P?void 0:P.get)&&void 0!==D?D:function(){return this.firstChild};function M(e){(e=e.prototype).hasOwnProperty("replaceChildren")||Object.defineProperty(e,"replaceChildren",{configurable:!0,enumerable:!0,writable:!0,value:function(e){for(var o=[],n=0;n<arguments.length;++n)o[n]=arguments[n];for(;null!==(n=C.call(this));)x.call(this,n);for(n=(o=t(o)).next();!n.done;n=o.next())n=n.value,j.call(this,"string"==typeof n?document.createTextNode(n):n)}})}M(Document),M(DocumentFragment),M(Element);var S,T,L,A,B=Node.prototype.insertBefore,K=null!==(T=null===(S=Object.getOwnPropertyDescriptor(Node.prototype,"parentNode"))||void 0===S?void 0:S.get)&&void 0!==T?T:function(){return this.parentNode},F=null!==(A=null===(L=Object.getOwnPropertyDescriptor(Node.prototype,"nextSibling"))||void 0===L?void 0:L.get)&&void 0!==A?A:function(){return this.nextSibling};function I(e){(e=e.prototype).hasOwnProperty("after")||Object.defineProperty(e,"after",{configurable:!0,enumerable:!0,writable:!0,value:function(e){for(var o=[],n=0;n<arguments.length;++n)o[n]=arguments[n];if(null!==(n=K.call(this)))for(var r=F.call(this),i=(o=t(o)).next();!i.done;i=o.next())i=i.value,B.call(n,"string"==typeof i?document.createTextNode(i):i,r)}})}I(CharacterData),I(Element);var R,U,W=Node.prototype.insertBefore,X=null!==(U=null===(R=Object.getOwnPropertyDescriptor(Node.prototype,"parentNode"))||void 0===R?void 0:R.get)&&void 0!==U?U:function(){return this.parentNode};function Y(e){(e=e.prototype).hasOwnProperty("before")||Object.defineProperty(e,"before",{configurable:!0,enumerable:!0,writable:!0,value:function(e){for(var o=[],n=0;n<arguments.length;++n)o[n]=arguments[n];if(null!==(n=X.call(this)))for(var r=(o=t(o)).next();!r.done;r=o.next())r=r.value,W.call(n,"string"==typeof r?document.createTextNode(r):r,this)}})}Y(CharacterData),Y(Element);var k,q,G=Node.prototype.removeChild,H=null!==(q=null===(k=Object.getOwnPropertyDescriptor(Node.prototype,"parentNode"))||void 0===k?void 0:k.get)&&void 0!==q?q:function(){return this.parentNode};function V(e){(e=e.prototype).hasOwnProperty("remove")||Object.defineProperty(e,"remove",{configurable:!0,enumerable:!0,writable:!0,value:function(){var e=H.call(this);e&&G.call(e,this)}})}V(CharacterData),V(Element);var z,J,Q=Node.prototype.insertBefore,Z=Node.prototype.removeChild,$=null!==(J=null===(z=Object.getOwnPropertyDescriptor(Node.prototype,"parentNode"))||void 0===z?void 0:z.get)&&void 0!==J?J:function(){return this.parentNode};function _(e){(e=e.prototype).hasOwnProperty("replaceWith")||Object.defineProperty(e,"replaceWith",{configurable:!0,enumerable:!0,writable:!0,value:function(e){for(var o=[],n=0;n<arguments.length;++n)o[n]=arguments[n];if(null!==(n=$.call(this))){for(var r=(o=t(o)).next();!r.done;r=o.next())r=r.value,Q.call(n,"string"==typeof r?document.createTextNode(r):r,this);Z.call(n,this)}}})}_(CharacterData),_(Element);var ee=window.Element.prototype,te=window.HTMLElement.prototype,oe=window.SVGElement.prototype;!te.hasOwnProperty("classList")||ee.hasOwnProperty("classList")||oe.hasOwnProperty("classList")||Object.defineProperty(ee,"classList",Object.getOwnPropertyDescriptor(te,"classList"))}).call(this);