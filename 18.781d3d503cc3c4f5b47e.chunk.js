(this.webpackJsonp=this.webpackJsonp||[]).push([[18,20],{15:function(e,t,s){"use strict";s.r(t),s.d(t,"RootScope",(function(){return o}));var i=s(46),n=s(56),r=s(29);class o extends n.a{constructor(){super(),this.overlaysActive=0,this.idle={isIDLE:!0,deactivated:!1,focusPromise:Promise.resolve(),focusResolve:()=>{}},this.connectionStatus={},this.filterId=0,this.config={forwarded_count_max:100,edit_time_limit:172800,pinned_dialogs_count_max:5,pinned_infolder_count_max:100,message_length_max:4096,caption_length_max:1024},this.addEventListener("peer_changed",e=>{this.peerId=e}),this.addEventListener("user_auth",({id:e})=>{this.myId="number"==typeof i.b?+e:""+e}),this.addEventListener("connection_status_change",e=>{this.connectionStatus[e.name]=e}),this.addEventListener("idle",e=>{e?this.idle.focusPromise=new Promise(e=>{this.idle.focusResolve=e}):this.idle.focusResolve()})}get themeColorElem(){return void 0!==this._themeColorElem?this._themeColorElem:this._themeColorElem=document.head.querySelector('[name="theme-color"]')||null}setThemeColor(e=this.themeColor){e||(e=this.isNight()?"#212121":"#ffffff");const t=this.themeColorElem;t&&t.setAttribute("content",e)}setThemeListener(){try{const e=window.matchMedia("(prefers-color-scheme: dark)"),t=()=>{this.systemTheme=e.matches?"night":"day",this.myId?this.dispatchEvent("theme_change"):this.setTheme()};"addEventListener"in e?e.addEventListener("change",t):"addListener"in e&&e.addListener(t),t()}catch(e){}}setTheme(){const e=this.isNight(),t=document.head.querySelector('[name="color-scheme"]');t&&t.setAttribute("content",e?"dark":"light"),document.documentElement.classList.toggle("night",e),this.setThemeColor()}get isOverlayActive(){return this.overlaysActive>0}set isOverlayActive(e){this.overlaysActive+=e?1:-1,this.dispatchEvent("overlay_toggle",this.isOverlayActive)}isNight(){return"night"===this.getTheme().name}getTheme(e=("system"===this.settings.theme?this.systemTheme:this.settings.theme)){return this.settings.themes.find(t=>t.name===e)}}const c=new o;r.a.rootScope=c,t.default=c},18:function(e,t,s){"use strict";s.r(t),s.d(t,"ripple",(function(){return l}));var i=s(6),n=s(58),r=s(1),o=s(15);let c=0;function l(e,t=(()=>Promise.resolve()),s=null,l=!1){if(e.querySelector(".c-ripple"))return;e.classList.add("rp");let a=document.createElement("div");a.classList.add("c-ripple");let u;e.classList.contains("rp-square")&&a.classList.add("is-square"),e[l?"prepend":"append"](a);const d=(e,i)=>{const o=Date.now(),l=document.createElement("div"),d=c++,h=1e3*+window.getComputedStyle(a).getPropertyValue("--ripple-duration").replace("s","");u=()=>{let e=Date.now()-o;const t=()=>{n.a.mutate(()=>{l.remove()}),s&&s(d)};if(e<h){let s=Math.max(h-e,h/2);setTimeout(()=>l.classList.add("hiding"),Math.max(s-h/2,0)),setTimeout(t,s)}else l.classList.add("hiding"),setTimeout(t,h/2);r.IS_TOUCH_SUPPORTED||window.removeEventListener("contextmenu",u),u=null,m=!1},t&&t(d),window.requestAnimationFrame(()=>{const t=a.getBoundingClientRect();l.classList.add("c-ripple__circle");const s=e-t.left,n=i-t.top,r=Math.sqrt(Math.pow(Math.abs(n-t.height/2)+t.height/2,2)+Math.pow(Math.abs(s-t.width/2)+t.width/2,2)),o=s-r/2,c=n-r/2;l.style.width=l.style.height=r+"px",l.style.left=o+"px",l.style.top=c+"px",a.append(l)})},h=t=>t.target!==e&&(["BUTTON","A"].includes(t.target.tagName)||Object(i.a)(t.target,"c-ripple")!==a);let m=!1;if(r.IS_TOUCH_SUPPORTED){let t=()=>{u&&u()};e.addEventListener("touchstart",s=>{if(!o.default.settings.animationsEnabled)return;if(s.touches.length>1||m||h(s))return;m=!0;let{clientX:i,clientY:n}=s.touches[0];d(i,n),e.addEventListener("touchend",t,{once:!0}),window.addEventListener("touchmove",s=>{s.cancelBubble=!0,s.stopPropagation(),t(),e.removeEventListener("touchend",t)},{once:!0})},{passive:!0})}else e.addEventListener("mousedown",t=>{if(![0,2].includes(t.button))return;if(!o.default.settings.animationsEnabled)return;if("0"===e.dataset.ripple||h(t))return;if(m)return void(m=!1);let{clientX:s,clientY:i}=t;d(s,i),window.addEventListener("mouseup",u,{once:!0,passive:!0}),window.addEventListener("contextmenu",u,{once:!0,passive:!0})},{passive:!0})}},29:function(e,t,s){"use strict";s.d(t,"a",(function(){return n}));const i=s(76).a.debug,n="undefined"!=typeof window?window:self;t.b=i},41:function(e,t,s){"use strict";let i;function n(e){i?i.push(e):(i=[e],requestAnimationFrame(()=>{const e=i;i=void 0,e.forEach(e=>e())}))}s.d(t,"b",(function(){return n})),s.d(t,"c",(function(){return l})),s.d(t,"d",(function(){return a})),s.d(t,"a",(function(){return u}));let r,o,c=!1;function l(e){r?c?e():r.push(e):(r=[e],requestAnimationFrame(()=>{c=!0;for(let e=0;e<r.length;++e)r[e]();r=void 0,c=!1}))}function a(){return o||(o=new Promise(requestAnimationFrame),o.then(()=>{o=void 0}),o)}function u(){return new Promise(e=>{n(()=>{n(e)})})}},45:function(e,t,s){"use strict";s.d(t,"a",(function(){return n}));var i=s(99);function n(){let e={isFulfilled:!1,isRejected:!1,notify:()=>{},notifyAll:(...t)=>{e.lastNotify=t,e.listeners.forEach(e=>e(...t))},listeners:[],addNotifyListener:t=>{e.lastNotify&&t(...e.lastNotify),e.listeners.push(t)}},t=new Promise((s,i)=>{e.resolve=e=>{t.isFulfilled||t.isRejected||(t.isFulfilled=!0,s(e))},e.reject=(...e)=>{t.isRejected||t.isFulfilled||(t.isRejected=!0,i(...e))}});return t.catch(i.a).finally(()=>{t.notify=t.notifyAll=t.lastNotify=null,t.listeners.length=0,t.cancel&&(t.cancel=()=>{})}),Object.assign(t,e),t}},46:function(e,t,s){"use strict";s.d(t,"b",(function(){return i})),s.d(t,"c",(function(){return n})),s.d(t,"d",(function(){return r})),s.d(t,"a",(function(){return o}));const i=0,n=1271266957,r=777e3,o=2147483647},56:function(e,t,s){"use strict";s.d(t,"a",(function(){return i}));class i{constructor(e){this._constructor(e)}_constructor(e=!1){this.reuseResults=e,this.listeners={},this.listenerResults={}}addEventListener(e,t,s){var i,n;(null!==(i=this.listeners[e])&&void 0!==i?i:this.listeners[e]=[]).push({callback:t,options:s}),this.listenerResults.hasOwnProperty(e)&&(t(...this.listenerResults[e]),null===(n=s)||void 0===n?void 0:n.once)&&this.listeners[e].pop()}addMultipleEventsListeners(e){for(const t in e)this.addEventListener(t,e[t])}removeEventListener(e,t,s){this.listeners[e]&&this.listeners[e].findAndSplice(e=>e.callback===t)}dispatchEvent(e,...t){this.reuseResults&&(this.listenerResults[e]=t);const s=[],i=this.listeners[e];if(i){i.slice().forEach(n=>{var r;-1!==i.findIndex(e=>e.callback===n.callback)&&(s.push(n.callback(...t)),(null===(r=n.options)||void 0===r?void 0:r.once)&&this.removeEventListener(e,n.callback))})}return s}cleanup(){this.listeners={},this.listenerResults={}}}},58:function(e,t,s){"use strict";var i=s(41),n=s(45),r=s(29),o=s(60);const c=new class{constructor(){this.promises={},this.raf=i.b.bind(null),this.scheduled=!1}do(e,t){let s=this.promises[e];return s||(this.scheduleFlush(),s=this.promises[e]=Object(n.a)()),void 0!==t&&s.then(()=>t()),s}measure(e){return this.do("read",e)}mutate(e){return this.do("write",e)}mutateElement(e,t){const s=Object(o.a)(e)?this.mutate():Promise.resolve();return void 0!==t&&s.then(()=>t()),s}scheduleFlush(){this.scheduled||(this.scheduled=!0,this.raf(()=>{this.promises.read&&this.promises.read.resolve(),this.promises.write&&this.promises.write.resolve(),this.scheduled=!1,this.promises={}}))}};r.a&&(r.a.sequentialDom=c),t.a=c},60:function(e,t,s){"use strict";function i(e){return null==e?void 0:e.isConnected}s.d(t,"a",(function(){return i}))},76:function(e,t,s){"use strict";const i={test:location.search.indexOf("test=1")>0,debug:location.search.indexOf("debug=1")>0,http:!1,ssl:!0,multipleConnections:!0,asServiceWorker:!1};t.a=i},99:function(e,t,s){"use strict";function i(){}s.d(t,"a",(function(){return i}))}}]);
//# sourceMappingURL=18.781d3d503cc3c4f5b47e.chunk.js.map