(this.webpackJsonp=this.webpackJsonp||[]).push([[17],{19:function(e,t,n){"use strict";n.r(t),n.d(t,"ripple",(function(){return c}));var i=n(6),s=n(59),o=n(1),a=n(16);let r=0;function c(e,t=(()=>Promise.resolve()),n=null,c=!1){if(e.querySelector(".c-ripple"))return;e.classList.add("rp");let d=document.createElement("div");d.classList.add("c-ripple");let l;e.classList.contains("rp-square")&&d.classList.add("is-square"),e[c?"prepend":"append"](d);const u=(e,i)=>{const a=Date.now(),c=document.createElement("div"),u=r++,h=1e3*+window.getComputedStyle(d).getPropertyValue("--ripple-duration").replace("s","");l=()=>{let e=Date.now()-a;const t=()=>{s.a.mutate(()=>{c.remove()}),n&&n(u)};if(e<h){let n=Math.max(h-e,h/2);setTimeout(()=>c.classList.add("hiding"),Math.max(n-h/2,0)),setTimeout(t,n)}else c.classList.add("hiding"),setTimeout(t,h/2);o.IS_TOUCH_SUPPORTED||window.removeEventListener("contextmenu",l),l=null,p=!1},t&&t(u),window.requestAnimationFrame(()=>{const t=d.getBoundingClientRect();c.classList.add("c-ripple__circle");const n=e-t.left,s=i-t.top,o=Math.sqrt(Math.pow(Math.abs(s-t.height/2)+t.height/2,2)+Math.pow(Math.abs(n-t.width/2)+t.width/2,2)),a=n-o/2,r=s-o/2;c.style.width=c.style.height=o+"px",c.style.left=a+"px",c.style.top=r+"px",d.append(c)})},h=t=>t.target!==e&&(["BUTTON","A"].includes(t.target.tagName)||Object(i.a)(t.target,"c-ripple")!==d);let p=!1;if(o.IS_TOUCH_SUPPORTED){let t=()=>{l&&l()};e.addEventListener("touchstart",n=>{if(!a.default.settings.animationsEnabled)return;if(n.touches.length>1||p||h(n))return;p=!0;let{clientX:i,clientY:s}=n.touches[0];u(i,s),e.addEventListener("touchend",t,{once:!0}),window.addEventListener("touchmove",n=>{n.cancelBubble=!0,n.stopPropagation(),t(),e.removeEventListener("touchend",t)},{once:!0})},{passive:!0})}else e.addEventListener("mousedown",t=>{if(![0,2].includes(t.button))return;if(!a.default.settings.animationsEnabled)return;if("0"===e.dataset.ripple||h(t))return;if(p)return void(p=!1);let{clientX:n,clientY:i}=t;u(n,i),window.addEventListener("mouseup",l,{once:!0,passive:!0}),window.addEventListener("contextmenu",l,{once:!0,passive:!0})},{passive:!0})}},23:function(e,t,n){"use strict";n.r(t);var i=n(33),s=n(64),o=n(69),a=n(76),r=n(8),c=n(34),d=n(17),l=n(18),u=n(16),h=n(36),p=n(93),m=n(82),g=function(e,t,n,i){return new(n||(n=Promise))((function(s,o){function a(e){try{c(i.next(e))}catch(e){o(e)}}function r(e){try{c(i.throw(e))}catch(e){o(e)}}function c(e){var t;e.done?s(e.value):(t=e.value,t instanceof n?t:new n((function(e){e(t)}))).then(a,r)}c((i=i.apply(e,t||[])).next())}))};let f;const v=new s.a("page-signQR",!0,()=>f,()=>{f||(f=g(void 0,void 0,void 0,(function*(){const e=v.pageEl.querySelector(".auth-image");let t=Object(h.f)(e,!0);const s=document.createElement("div");s.classList.add("input-wrapper");const l=Object(c.a)("btn-primary btn-secondary btn-primary-transparent primary",{text:"Login.QR.Cancel"});s.append(l),Object(p.a)(s);const w=e.parentElement,b=document.createElement("h4");Object(d._i18n)(b,"Login.QR.Title");const y=document.createElement("ol");y.classList.add("qr-description"),["Login.QR.Help1","Login.QR.Help2","Login.QR.Help3"].forEach(e=>{const t=document.createElement("li");t.append(Object(d.i18n)(e)),y.append(t)}),w.append(b,y,s),l.addEventListener("click",()=>{Promise.all([n.e(3),n.e(30)]).then(n.bind(null,21)).then(e=>e.default.mount()),L=!0});const E=(yield Promise.all([n.e(10).then(n.t.bind(null,132,7))]))[0].default;let L=!1;u.default.addEventListener("user_auth",()=>{L=!0,f=null},{once:!0});let O,S={ignoreErrors:!0};const _=s=>g(void 0,void 0,void 0,(function*(){try{let c=yield i.a.invokeApi("auth.exportLoginToken",{api_id:r.a.id,api_hash:r.a.hash,except_ids:[]},{ignoreErrors:!0});if("auth.loginTokenMigrateTo"===c._&&(S.dcId||(S.dcId=c.dc_id,i.a.setBaseDcId(c.dc_id)),c=yield i.a.invokeApi("auth.importLoginToken",{token:c.token},S)),"auth.loginTokenSuccess"===c._){const e=c.authorization;return i.a.setUser(e.user),n.e(4).then(n.bind(null,20)).then(e=>e.default.mount()),!0}if(!O||!Object(a.b)(O,c.token)){O=c.token;let n="tg://login?token="+Object(a.d)(c.token).replace(/\+/g,"-").replace(/\//g,"_").replace(/\=+$/,"");const i=window.getComputedStyle(document.documentElement),s=i.getPropertyValue("--surface-color").trim(),o=i.getPropertyValue("--primary-text-color").trim(),r=i.getPropertyValue("--primary-color").trim(),d=yield fetch("assets/img/logo_padded.svg").then(e=>e.text()).then(e=>{e=e.replace(/(fill:).+?(;)/,`$1${r}$2`);const t=new Blob([e],{type:"image/svg+xml;charset=utf-8"});return new Promise(e=>{const n=new FileReader;n.onload=t=>{e(t.target.result)},n.readAsDataURL(t)})}),l=new E({width:240*window.devicePixelRatio,height:240*window.devicePixelRatio,data:n,image:d,dotsOptions:{color:o,type:"rounded"},cornersSquareOptions:{type:"extra-rounded"},imageOptions:{imageSize:1,margin:0},backgroundOptions:{color:s},qrOptions:{errorCorrectionLevel:"L"}});let u;l.append(e),e.lastChild.classList.add("qr-canvas"),u=l._drawingPromise?l._drawingPromise:Promise.race([Object(m.a)(1e3),new Promise(e=>{l._canvas._image.addEventListener("load",()=>{window.requestAnimationFrame(()=>e())},{once:!0})})]),yield u.then(()=>{if(t){t.style.animation="hide-icon .4s forwards";const n=e.children[1];n.style.display="none",n.style.animation="grow-icon .4s forwards",setTimeout(()=>{n.style.display=""},150),setTimeout(()=>{n.style.animation=""},500),t=void 0}else Array.from(e.children).slice(0,-1).forEach(e=>{e.remove()})})}if(s){let e=Date.now()/1e3,t=c.expires-e-o.a.serverTimeOffset;yield Object(m.a)(t>3?3e3:1e3*t|0)}}catch(e){switch(e.type){case"SESSION_PASSWORD_NEEDED":console.warn("pageSignQR: SESSION_PASSWORD_NEEDED"),e.handled=!0,n.e(15).then(n.bind(null,22)).then(e=>e.default.mount()),L=!0,f=null;break;default:console.error("pageSignQR: default error:",e),L=!0}return!0}return!1}));return()=>g(void 0,void 0,void 0,(function*(){for(L=!1;!L&&!(yield _(!0)););}))}))),f.then(e=>{e()}),l.default.pushToState("authState",{_:"authStateSignQr"})});t.default=v},31:function(e,t,n){"use strict";n.d(t,"a",(function(){return o})),n.d(t,"b",(function(){return a})),n.d(t,"c",(function(){return r})),n.d(t,"d",(function(){return c}));var i=n(1),s=n(53);const o=i.IS_TOUCH_SUPPORTED?"mousedown":"click";function a(e,t,n={}){const i=n.listenerSetter?n.listenerSetter.add(e):e.addEventListener.bind(e);n.touchMouseDown=!0,i(o,t,n)}function r(e,t,n){e.removeEventListener(o,t,n)}function c(e){Object(s.a)(e,o)}},34:function(e,t,n){"use strict";var i=n(17),s=n(19);t.a=(e,t={})=>{const n=document.createElement(t.asDiv?"div":"button");return n.className=e+(t.icon?" tgico-"+t.icon:""),t.noRipple||(t.rippleSquare&&n.classList.add("rp-square"),Object(s.ripple)(n)),t.onlyMobile&&n.classList.add("only-handhelds"),t.disabled&&n.setAttribute("disabled","true"),t.text&&n.append(Object(i.i18n)(t.text)),n}},36:function(e,t,n){"use strict";n.d(t,"f",(function(){return u})),n.d(t,"g",(function(){return h})),n.d(t,"c",(function(){return g})),n.d(t,"d",(function(){return b})),n.d(t,"e",(function(){return y})),n.d(t,"b",(function(){return O})),n.d(t,"a",(function(){return S}));var i=n(30),s=n(5),o=n(31),a=n(38),r=n(1),c=n(0),d=n(16),l=n(49);function u(e,t=!1){const n='\n  <svg xmlns="http://www.w3.org/2000/svg" class="preloader-circular" viewBox="25 25 50 50">\n  <circle class="preloader-path" cx="50" cy="50" r="20" fill="none" stroke-miterlimit="10"/>\n  </svg>';if(t){const t=document.createElement("div");return t.classList.add("preloader"),t.innerHTML=n,e&&e.appendChild(t),t}return e.insertAdjacentHTML("beforeend",n),e.lastElementChild}function h(e,t="check"){return e.classList.remove("tgico-"+t),e.disabled=!0,u(e),()=>{e.innerHTML="",e.classList.add("tgico-"+t),e.removeAttribute("disabled")}}i.a.putPreloader=u;let p=e=>{let t=f.getBoundingClientRect(),{clientX:n,clientY:i}=e,s=n>=t.right?n-t.right:t.left-n,o=i>=t.bottom?i-t.bottom:t.top-i;(s>=100||o>=100)&&g()};const m=e=>{g()},g=()=>{f&&(f.classList.remove("active"),f.parentElement.classList.remove("menu-open"),w&&w.remove(),f=null,d.default.dispatchEvent("context_menu_toggle",!1)),v&&(v(),v=null),r.IS_TOUCH_SUPPORTED||(window.removeEventListener("mousemove",p),window.removeEventListener("contextmenu",m)),document.removeEventListener(o.a,m),c.IS_MOBILE_SAFARI||l.a.removeByType("menu")};window.addEventListener("resize",()=>{f&&g()});let f=null,v=null,w=null;function b(e,t){g(),c.IS_MOBILE_SAFARI||l.a.pushItem({type:"menu",onPop:e=>{g()}}),f=e,f.classList.add("active"),f.parentElement.classList.add("menu-open"),w||(w=document.createElement("div"),w.classList.add("btn-menu-overlay"),w.addEventListener(o.a,e=>{Object(s.a)(e),m()})),f.parentElement.insertBefore(w,f),v=t,r.IS_TOUCH_SUPPORTED||(window.addEventListener("mousemove",p),window.addEventListener("contextmenu",m,{once:!0})),document.addEventListener(o.a,m),d.default.dispatchEvent("context_menu_toggle",!0)}function y({pageX:e,pageY:t},n,i){let{scrollWidth:s,scrollHeight:o}=n;const r=document.body.getBoundingClientRect(),c=r.width,d=r.height;i=a.b.isMobile?"right":"left";let l="top";const u={x:{left:e,right:e-s},intermediateX:"right"===i?8:c-s-8,y:{top:t,bottom:t-o},intermediateY:t<d/2?8:d-o-8},h={left:u.x.left+s+8<=c,right:u.x.right>=8},p={top:u.y.top+o+8<=d,bottom:u.y.bottom-8>=8};{let e;e=h[i]?u.x[i]:(i="center",u.intermediateX),n.style.left=e+"px"}{let e;e=p[l]?u.y[l]:(l="center",u.intermediateY),n.style.top=e+"px"}n.className=n.className.replace(/(top|center|bottom)-(left|center|right)/g,""),n.classList.add(("center"===l?l:"bottom")+"-"+("center"===i?i:"left"===i?"right":"left"))}let E=!1,L=0;function O(){L&&clearTimeout(L),L=window.setTimeout(()=>{L=0,E=!1},400),E=!0}function S(e,t,n){const i=n?n.add(e):e.addEventListener.bind(e),o=n?n.removeManual.bind(n,e):e.removeEventListener.bind(e);if(c.IS_APPLE&&r.IS_TOUCH_SUPPORTED){let n;const a={capture:!0},r=()=>{clearTimeout(n),o("touchmove",r,a),o("touchend",r,a),o("touchcancel",r,a)};i("touchstart",o=>{o.touches.length>1?r():(i("touchmove",r,a),i("touchend",r,a),i("touchcancel",r,a),n=window.setTimeout(()=>{E?r():(t(o.touches[0]),r(),f&&e.addEventListener("touchend",s.a,{once:!0}))},400))})}else i("contextmenu",r.IS_TOUCH_SUPPORTED?n=>{t(n),f&&e.addEventListener("touchend",s.a,{once:!0})}:t)}},49:function(e,t,n){"use strict";var i=n(30),s=n(0),o=n(44),a=n(7),r=n(5),c=n(45),d=n(72);const l=new class{constructor(){this.navigations=[],this.id=Date.now(),this.manual=!1,this.log=Object(o.b)("NC"),this.debug=!0,this.currentHash=window.location.hash;let e=!1;if(window.addEventListener("popstate",t=>{if(this.debug&&this.log("popstate",t,e),window.location.hash!==this.currentHash)return this.onHashChange&&this.onHashChange(),void this.replaceState();this.currentHash=window.location.hash;if(t.state!==this.id)return void this.pushState();const n=this.navigations.pop();n?(this.manual=!e,this.handleItem(n)):this.pushState()}),window.addEventListener("keydown",e=>{const t=this.navigations[this.navigations.length-1];t&&("Escape"!==e.key||t.onEscape&&!t.onEscape()||(Object(r.a)(e),this.back(t.type)))},{capture:!0,passive:!1}),s.IS_MOBILE_SAFARI){const t={passive:!0};window.addEventListener("touchstart",t=>{t.touches.length>1||(this.debug&&this.log("touchstart"),Object(d.a)(t)&&(e=!0,window.addEventListener("touchend",()=>{setTimeout(()=>{e=!1},100)},{passive:!0,once:!0})))},t)}history.scrollRestoration="manual",this.pushState()}handleItem(e){const t=e.onPop(!!this.manual&&void 0);this.debug&&this.log("popstate, navigation:",e,this.navigations),!1===t?this.pushItem(e):e.noBlurOnPop||Object(a.a)(),this.manual=!1}findItemByType(e){for(let t=this.navigations.length-1;t>=0;--t){const n=this.navigations[t];if(n.type===e)return{item:n,index:t}}}back(e){if(e){const t=this.findItemByType(e);if(t)return this.manual=!0,this.navigations.splice(t.index,1),void this.handleItem(t.item)}history.back()}pushItem(e){this.navigations.push(e),this.debug&&this.log("pushstate",e,this.navigations),e.noHistory||this.pushState()}pushState(){this.manual=!1,history.pushState(this.id,"")}replaceState(){history.replaceState(this.id,"",location.origin+location.pathname)}removeItem(e){Object(c.e)(this.navigations,e)}removeByType(e,t=!1){for(let n=this.navigations.length-1;n>=0;--n){if(this.navigations[n].type===e&&(this.navigations.splice(n,1),t))break}}};i.a.appNavigationController=l,t.a=l},53:function(e,t,n){"use strict";function i(e,t){const n=new Event(t,{bubbles:!0,cancelable:!0});e.dispatchEvent(n)}n.d(t,"a",(function(){return i}))},59:function(e,t,n){"use strict";var i=n(42),s=n(46),o=n(30),a=n(61);const r=new class{constructor(){this.promises={},this.raf=i.b.bind(null),this.scheduled=!1}do(e,t){let n=this.promises[e];return n||(this.scheduleFlush(),n=this.promises[e]=Object(s.a)()),void 0!==t&&n.then(()=>t()),n}measure(e){return this.do("read",e)}mutate(e){return this.do("write",e)}mutateElement(e,t){const n=Object(a.a)(e)?this.mutate():Promise.resolve();return void 0!==t&&n.then(()=>t()),n}scheduleFlush(){this.scheduled||(this.scheduled=!0,this.raf(()=>{this.promises.read&&this.promises.read.resolve(),this.promises.write&&this.promises.write.resolve(),this.scheduled=!1,this.promises={}}))}};o.a&&(o.a.sequentialDom=r),t.a=r},69:function(e,t,n){"use strict";var i=n(30),s=n(66),o=n(33);const a=new class{constructor(){this.serverTimeOffset=0,s.a.get("server_time_offset").then(e=>{e&&(this.serverTimeOffset=e)}),o.a.addTaskListener("applyServerTimeOffset",e=>{this.serverTimeOffset=e.payload})}};i.a&&(i.a.serverTimeManager=a),t.a=a},72:function(e,t,n){"use strict";n.d(t,"a",(function(){return s}));var i=n(0);function s(e){return i.IS_MOBILE_SAFARI&&e instanceof TouchEvent&&e.touches[0].clientX<30}},76:function(e,t,n){"use strict";function i(e){const t=e.length,n=new Array(t);for(let i=0;i<t;++i)n[i]=(e[i]<16?"0":"")+(e[i]||0).toString(16);return n.join("")}function s(e){const t=e.length,n=new Uint8Array(Math.ceil(t/2));let i=0;t%2&&(n[i++]=parseInt(e.charAt(0),16));for(let s=i;s<t;s+=2)n[i++]=parseInt(e.substr(s,2),16);return n}function o(e){let t,n="";for(let i=e.length,s=0,o=0;o<i;++o)t=o%3,s|=e[o]<<(16>>>t&24),2!==t&&i-o!=1||(n+=String.fromCharCode(a(s>>>18&63),a(s>>>12&63),a(s>>>6&63),a(63&s)),s=0);return n.replace(/A(?=A$|$)/g,"=")}function a(e){return e<26?e+65:e<52?e+71:e<62?e-4:62===e?43:63===e?47:65}function r(e,t){const n=e.length;if(n!==t.length)return!1;for(let i=0;i<n;++i)if(e[i]!==t[i])return!1;return!0}function c(...e){const t=e.reduce((e,t)=>e+(t.byteLength||t.length),0),n=new Uint8Array(t);let i=0;return e.forEach(e=>{n.set(e instanceof ArrayBuffer?new Uint8Array(e):e,i),i+=e.byteLength||e.length}),n}n.d(t,"e",(function(){return i})),n.d(t,"c",(function(){return s})),n.d(t,"d",(function(){return o})),n.d(t,"b",(function(){return r})),n.d(t,"a",(function(){return c}))},93:function(e,t,n){"use strict";n.d(t,"a",(function(){return p}));var i=n(5),s=n(31),o=n(9),a=n(17),r=n(33),c=n(16),d=n(34),l=n(36);let u,h=!1;function p(e){h||(u||(u=r.a.getConfig().then(e=>e.suggested_lang_code!==a.default.lastRequestedLangCode?Promise.all([e,a.default.getStrings(e.suggested_lang_code,["Login.ContinueOnLanguage"]),a.default.getCacheLangPack()]):[]))).then(([t,n])=>{if(!t)return;const r=[];n.forEach(e=>{const t=a.default.strings.get(e.key);t&&(r.push(t),a.default.strings.set(e.key,e))});const u=Object(d.a)("btn-primary btn-secondary btn-primary-transparent primary",{text:"Login.ContinueOnLanguage"});u.lastElementChild.classList.remove("i18n"),Object(o.a)().then(()=>{window.requestAnimationFrame(()=>{e.append(u)})}),c.default.addEventListener("language_change",()=>{u.remove()},{once:!0}),r.forEach(e=>{a.default.strings.set(e.key,e)}),Object(s.b)(u,e=>{Object(i.a)(e),h=!0,u.disabled=!0,Object(l.f)(u),a.default.getLangPack(t.suggested_lang_code)})})}}}]);
//# sourceMappingURL=17.1fd684018faaad43c664.chunk.js.map