!function(e){function t(t){for(var n,a,i=t[0],r=t[1],c=0,s=[];c<i.length;c++)a=i[c],Object.prototype.hasOwnProperty.call(o,a)&&o[a]&&s.push(o[a][0]),o[a]=0;for(n in r)Object.prototype.hasOwnProperty.call(r,n)&&(e[n]=r[n]);for(u&&u(t);s.length;)s.shift()()}var n={},o={9:0};function a(e){return i.p+""+({10:"npm.qr-code-styling"}[e]||e)+"."+{0:"948b50c9a8047c9c0842",1:"df932056b1c74b1da3f2",2:"935038cc2873713ebe19",3:"bdf444277e969e63a4c3",4:"6b5dd97948b29c598f75",5:"faa04da46f838e65acdf",6:"8007c3b0a1c5ceb9bb0d",7:"52c0a0f3b6f476d2bcec",8:"cbbad398924d87521a47",10:"c53238820878551c10bf",11:"4cedf32c13708a0f972d",12:"3862167550311cfa0c62",13:"a60e06bd2a9f185ee65e",14:"ba63da74172fa2891eeb",15:"e91ef68debad566c74d5",16:"8f20a4414cdceb869a1b",17:"e503493b3028be8a4735",18:"7e5208c5f212e0e6a5a8",19:"96f69841477e2045dbd5",20:"475b02f54077024062fb",21:"3aef9bc049fb6abb3cd5",22:"0606c021aacfc21418bd",23:"e3145c0ea9684176558f",24:"8835e4abc95acb08dcd5",25:"8300e3ae1cb91fc2bed3",26:"27b86f0f8f80f7f420ab",27:"1bfe793cc702c7aa75db",28:"b17aefb7c51046ff48ec",29:"08bf9f3c8b9be9d555f9",30:"0ba6f57fe3c460b08e24",31:"623be4e5a35a57db3b0c"}[e]+".chunk.js"}function i(t){if(n[t])return n[t].exports;var o=n[t]={i:t,l:!1,exports:{}};return e[t].call(o.exports,o,o.exports,i),o.l=!0,o.exports}i.e=function(e){var t=[],n=o[e];if(0!==n)if(n)t.push(n[2]);else{var r=new Promise((function(t,a){n=o[e]=[t,a]}));t.push(n[2]=r);var c=new Error;var s=function t(n,r){var s,u=document.createElement("script");u.charset="utf-8",u.timeout=120,i.nc&&u.setAttribute("nonce",i.nc),u.src=n,s=function(n){u.onerror=u.onload=null,clearTimeout(d);var i=o[e];if(0!==i)if(i)if(0===r){var s=n&&("load"===n.type?"missing":n.type),l=n&&n.target&&n.target.src;c.message="Loading chunk "+e+" failed after 999999 retries.\n("+s+": "+l+")",c.name="ChunkLoadError",c.type=s,c.request=l,i[1](c),o[e]=void 0}else setTimeout((function(){var n=Date.now(),o=t(a(e)+"?"+n,r-1);document.head.appendChild(o)}),0);else o[e]=void 0};var d=setTimeout((function(){s({type:"timeout",target:u})}),12e4);return u.onerror=u.onload=s,u}(a(e),999999);document.head.appendChild(s)}return Promise.all(t)},i.m=e,i.c=n,i.d=function(e,t,n){i.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:n})},i.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},i.t=function(e,t){if(1&t&&(e=i(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var n=Object.create(null);if(i.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var o in e)i.d(n,o,function(t){return e[t]}.bind(null,o));return n},i.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return i.d(t,"a",t),t},i.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},i.p="",i.oe=function(e){throw console.error(e),e};var r=this.webpackJsonp=this.webpackJsonp||[],c=r.push.bind(r);r.push=t,r=r.slice();for(var s=0;s<r.length;s++)t(r[s]);var u=c;i(i.s=11)}([function(e,t,n){"use strict";n.r(t),n.d(t,"USER_AGENT",(function(){return a})),n.d(t,"IS_APPLE",(function(){return i})),n.d(t,"IS_ANDROID",(function(){return r})),n.d(t,"IS_CHROMIUM",(function(){return c})),n.d(t,"IS_APPLE_MOBILE",(function(){return s})),n.d(t,"IS_SAFARI",(function(){return u})),n.d(t,"IS_FIREFOX",(function(){return d})),n.d(t,"IS_MOBILE_SAFARI",(function(){return l})),n.d(t,"IS_MOBILE",(function(){return f}));var o=n(2);const a=navigator?navigator.userAgent:null,i=-1!==navigator.userAgent.search(/OS X|iPhone|iPad|iOS/i),r=-1!==navigator.userAgent.toLowerCase().indexOf("android"),c=/Chrome/.test(navigator.userAgent)&&/Google Inc/.test(navigator.vendor),s=(/iPad|iPhone|iPod/.test(navigator.platform)||"MacIntel"===navigator.platform&&navigator.maxTouchPoints>1)&&!o.a.MSStream,u=!!("safari"in o.a)||!(!a||!(/\b(iPad|iPhone|iPod)\b/.test(a)||a.match("Safari")&&!a.match("Chrome"))),d=navigator.userAgent.toLowerCase().indexOf("firefox")>-1,l=u&&s,f=navigator.maxTouchPoints>0&&-1!=navigator.userAgent.search(/iOS|iPhone OS|Android|BlackBerry|BB10|Series ?[64]0|J2ME|MIDP|opera mini|opera mobi|mobi.+Gecko|Windows Phone/i)},function(e,t,n){"use strict";n.r(t),n.d(t,"IS_TOUCH_SUPPORTED",(function(){return o}));const o="ontouchstart"in window||window.DocumentTouch&&document instanceof DocumentTouch},function(e,t,n){"use strict";const o="undefined"!=typeof window?window:self;t.a=o},function(e,t,n){"use strict";n.d(t,"a",(function(){return c})),n.d(t,"b",(function(){return s}));var o=n(1),a=n(0),i=n(6),r=n(4);const c=a.IS_SAFARI&&a.IS_MOBILE&&o.IS_TOUCH_SUPPORTED;if(c){let e="clientY",t=0;const n={capture:!0,passive:!1},o=n=>{const o=n.touches[0],a=Object(i.a)(o.target,"scrollable-y");if(a){const i=o[e],r=t-i,c=a.scrollTop,s=a.scrollHeight,u=a.clientHeight,d=c?Math.round(c+a.clientHeight+r):c+r;(s===u||d>=s||d<=0)&&n.preventDefault()}else n.preventDefault()};let a=0;document.addEventListener("focusin",i=>{!i.target.classList.contains("is-sticky-input-bugged")||i.timeStamp-a<50||(Object(r.a)(i.target),document.addEventListener("touchmove",o,n),document.addEventListener("touchstart",n=>{if(n.touches.length>1)return;const o=n.touches[0];t=o[e]}))},{passive:!0}),document.addEventListener("focusout",e=>{document.removeEventListener("touchmove",o,n),a=e.timeStamp},{passive:!0}),document.addEventListener("visibilitychange",()=>{document.activeElement&&document.activeElement.classList.contains("is-sticky-input-bugged")&&document.activeElement.blur&&Object(r.a)(document.activeElement)},{passive:!0})}function s(e){c&&e.classList.add("is-sticky-input-bugged")}},function(e,t,n){"use strict";function o(e){e.style.transform="translateY(-99999px)",e.focus(),setTimeout(()=>{e.style.transform=""},0)}n.d(t,"a",(function(){return o}))},function(e,t,n){"use strict";function o(e){if(e=e||window.event){e=e.originalEvent||e;try{e.stopPropagation&&e.stopPropagation(),e.preventDefault&&e.preventDefault(),e.returnValue=!1,e.cancelBubble=!0}catch(e){}}return!1}n.d(t,"a",(function(){return o}))},function(e,t,n){"use strict";function o(e,t){return e.closest("."+t)}n.d(t,"a",(function(){return o}))},function(e,t,n){"use strict";function o(){return!(!document.activeElement||!document.activeElement.blur)&&(document.activeElement.blur(),!0)}n.d(t,"a",(function(){return o}))},function(e,t,n){"use strict";const o={id:2782814,hash:"0301ec07940020f06eaf4243b31623c3",version:"0.9.2",versionFull:"0.9.2 (35)",build:35,langPackVersion:"0.3.7",langPack:"macos",langPackCode:"en",domains:["web.telegram.org"],baseDcId:2,isMainDomain:"web.telegram.org"===location.hostname,suffix:"K"};o.isMainDomain&&(o.id=2496,o.hash="8da85b0d5bfe62527e5b244c209159c3"),t.a=o},function(e,t,n){"use strict";let o;function a(){return o||(o="fonts"in document?Promise.race([Promise.all(["400 1rem Roboto","500 1rem Roboto","500 1rem tgico"].map(e=>document.fonts.load(e))),new Promise(e=>setTimeout(e,1e3))]):Promise.resolve())}n.d(t,"a",(function(){return a}))},function(e,t,n){"use strict";const o=-1!==navigator.userAgent.search(/OS X|iPhone|iPad|iOS/i);t.a=o},function(e,t,n){"use strict";n.r(t);var o=n(8),a=n(7),i=n(5),r=n(3),c=n(9),s=n(10),u=n(0),d=(n(12),n(13),n(14),function(e,t,n,o){return new(n||(n=Promise))((function(a,i){function r(e){try{s(o.next(e))}catch(e){i(e)}}function c(e){try{s(o.throw(e))}catch(e){i(e)}}function s(e){var t;e.done?a(e.value):(t=e.value,t instanceof n?t:new n((function(e){e(t)}))).then(r,c)}s((o=o.apply(e,t||[])).next())}))});document.addEventListener("DOMContentLoaded",()=>d(void 0,void 0,void 0,(function*(){Element.prototype.toggleAttribute||(Element.prototype.toggleAttribute=function(e,t){return void 0!==t&&(t=!!t),this.hasAttribute(e)?!!t||(this.removeAttribute(e),!1):!1!==t&&(this.setAttribute(e,""),!0)});const e=window.visualViewport||window;let t,d=!1;const l=()=>{const n=.01*(d&&!v.default.isOverlayActive?e.height||e.innerHeight:window.innerHeight);t!==n&&(b.IS_TOUCH_SUPPORTED&&t<n&&n-t>1&&Object(a.a)(),t=n,document.documentElement.style.setProperty("--vh",n+"px"))},f=new Proxy(Worker,{construct:(e,t)=>new e(t[0]+location.search)});Worker=f;const[m,b,h,v,g,p,P]=yield Promise.all([n.e(22).then(n.bind(null,27)),Promise.resolve().then(n.bind(null,1)),Promise.resolve().then(n.bind(null,0)),n.e(20).then(n.bind(null,15)),Promise.all([n.e(0),n.e(27)]).then(n.bind(null,17)),Promise.all([n.e(0),n.e(1)]).then(n.bind(null,16)),n.e(26).then(n.bind(null,28))]);if(window.addEventListener("resize",l),l(),r.a){const t=()=>{d=1===n&&r.a&&!v.default.isOverlayActive,l(),e!==window&&(d?(window.removeEventListener("resize",l),e.addEventListener("resize",l)):(e.removeEventListener("resize",l),window.addEventListener("resize",l)))};let n;v.default.addEventListener("im_tab_change",e=>{const o=void 0!==n;n=e,(o||1===n)&&t()}),v.default.addEventListener("overlay_toggle",()=>{t()})}h.IS_FIREFOX&&!s.a&&document.addEventListener("dragstart",e=>{const t=e.target;if("IMG"===t.tagName&&t.classList.contains("emoji"))return Object(i.a)(e),!1}),document.addEventListener("dragstart",e=>{var t;if("IMG"===(null===(t=e.target)||void 0===t?void 0:t.tagName))return e.preventDefault(),!1}),h.IS_FIREFOX&&document.documentElement.classList.add("is-firefox"),h.IS_APPLE?(h.IS_SAFARI&&document.documentElement.classList.add("is-safari"),document.documentElement.classList.add("emoji-supported"),h.IS_APPLE_MOBILE?document.documentElement.classList.add("is-ios"):document.documentElement.classList.add("is-mac")):h.IS_ANDROID&&document.documentElement.classList.add("is-android"),b.IS_TOUCH_SUPPORTED?document.documentElement.classList.add("is-touch"):document.documentElement.classList.add("no-touch");const y=performance.now(),E=p.default.getCacheLangPack(),[S,w]=yield Promise.all([g.default.getState(),E]);function I(e,t){e.style.opacity="0",t.then(()=>{window.requestAnimationFrame(()=>{e.style.opacity=""})})}p.default.setTimeFormat(S.settings.timeFormat),v.default.setThemeListener(),w.appVersion!==o.a.langPackVersion&&p.default.getLangPack(w.lang_code),console.log("got state, time:",performance.now()-y);const O=S.authState;if("authStateSignedIn"!==O._){console.log("Will mount auth page:",O._,Date.now()/1e3);const e=document.getElementById("auth-pages");let t,o;if(e){t=e.querySelector(".scrollable"),b.IS_TOUCH_SUPPORTED&&!u.IS_MOBILE_SAFARI||t.classList.add("no-scrollbar"),t.style.opacity="0";const n=document.createElement("div");n.classList.add("auth-placeholder"),t.prepend(n),t.append(n.cloneNode())}try{yield Promise.all([Promise.all([n.e(0),n.e(1)]).then(n.bind(null,24)),Promise.all([n.e(0),n.e(1)]).then(n.bind(null,26))]).then(([e,t])=>{e.default.setAuthorized(!1),t.default.forceUnsubscribe()})}catch(e){}switch(O._){case"authStateSignIn":o=(yield Promise.all([n.e(0),n.e(1),n.e(2),n.e(3),n.e(16)]).then(n.bind(null,20))).default.mount();break;case"authStateSignQr":o=(yield Promise.all([n.e(0),n.e(1),n.e(2),n.e(17)]).then(n.bind(null,22))).default.mount();break;case"authStateAuthCode":o=(yield Promise.all([n.e(0),n.e(1),n.e(2),n.e(3),n.e(13)]).then(n.bind(null,23))).default.mount(O.sentCode);break;case"authStatePassword":o=(yield Promise.all([n.e(0),n.e(1),n.e(2),n.e(11)]).then(n.bind(null,21))).default.mount();break;case"authStateSignUp":o=(yield Promise.all([n.e(0),n.e(1),n.e(2),n.e(5),n.e(12)]).then(n.bind(null,25))).default.mount(O.authCode)}if(t){o&&(yield o);I(t,"fonts"in document?Promise.race([new Promise(e=>setTimeout(e,1e3)),document.fonts.ready]):Promise.resolve())}}else console.log("Will mount IM page:",Date.now()/1e3),I(document.getElementById("main-columns"),Object(c.a)()),(yield Promise.all([n.e(0),n.e(1),n.e(2),n.e(29)]).then(n.bind(null,19))).default.mount();const L=(yield n.e(18).then(n.bind(null,18))).ripple;Array.from(document.getElementsByClassName("rp")).forEach(e=>L(e))})))},function(e,t,n){},function(e,t,n){},function(e,t,n){}]);
//# sourceMappingURL=main.35eabc4ff0d0ba23658c.bundle.js.map