(this.webpackJsonp=this.webpackJsonp||[]).push([[20],{15:function(e,t,s){"use strict";s.r(t),s.d(t,"RootScope",(function(){return r}));var i=s(46),n=s(56),o=s(29);class r extends n.a{constructor(){super(),this.overlaysActive=0,this.idle={isIDLE:!0,deactivated:!1,focusPromise:Promise.resolve(),focusResolve:()=>{}},this.connectionStatus={},this.filterId=0,this.config={forwarded_count_max:100,edit_time_limit:172800,pinned_dialogs_count_max:5,pinned_infolder_count_max:100,message_length_max:4096,caption_length_max:1024},this.addEventListener("peer_changed",e=>{this.peerId=e}),this.addEventListener("user_auth",({id:e})=>{this.myId="number"==typeof i.b?+e:""+e}),this.addEventListener("connection_status_change",e=>{this.connectionStatus[e.name]=e}),this.addEventListener("idle",e=>{e?this.idle.focusPromise=new Promise(e=>{this.idle.focusResolve=e}):this.idle.focusResolve()})}get themeColorElem(){return void 0!==this._themeColorElem?this._themeColorElem:this._themeColorElem=document.head.querySelector('[name="theme-color"]')||null}setThemeColor(e=this.themeColor){e||(e=this.isNight()?"#212121":"#ffffff");const t=this.themeColorElem;t&&t.setAttribute("content",e)}setThemeListener(){try{const e=window.matchMedia("(prefers-color-scheme: dark)"),t=()=>{this.systemTheme=e.matches?"night":"day",this.myId?this.dispatchEvent("theme_change"):this.setTheme()};"addEventListener"in e?e.addEventListener("change",t):"addListener"in e&&e.addListener(t),t()}catch(e){}}setTheme(){const e=this.isNight(),t=document.head.querySelector('[name="color-scheme"]');t&&t.setAttribute("content",e?"dark":"light"),document.documentElement.classList.toggle("night",e),this.setThemeColor()}get isOverlayActive(){return this.overlaysActive>0}set isOverlayActive(e){this.overlaysActive+=e?1:-1,this.dispatchEvent("overlay_toggle",this.isOverlayActive)}isNight(){return"night"===this.getTheme().name}getTheme(e=("system"===this.settings.theme?this.systemTheme:this.settings.theme)){return this.settings.themes.find(t=>t.name===e)}}const c=new r;o.a.rootScope=c,t.default=c},29:function(e,t,s){"use strict";s.d(t,"a",(function(){return n}));const i=s(76).a.debug,n="undefined"!=typeof window?window:self;t.b=i},46:function(e,t,s){"use strict";s.d(t,"b",(function(){return i})),s.d(t,"c",(function(){return n})),s.d(t,"d",(function(){return o})),s.d(t,"a",(function(){return r}));const i=0,n=1271266957,o=777e3,r=2147483647},56:function(e,t,s){"use strict";s.d(t,"a",(function(){return i}));class i{constructor(e){this._constructor(e)}_constructor(e=!1){this.reuseResults=e,this.listeners={},this.listenerResults={}}addEventListener(e,t,s){var i,n;(null!==(i=this.listeners[e])&&void 0!==i?i:this.listeners[e]=[]).push({callback:t,options:s}),this.listenerResults.hasOwnProperty(e)&&(t(...this.listenerResults[e]),null===(n=s)||void 0===n?void 0:n.once)&&this.listeners[e].pop()}addMultipleEventsListeners(e){for(const t in e)this.addEventListener(t,e[t])}removeEventListener(e,t,s){this.listeners[e]&&this.listeners[e].findAndSplice(e=>e.callback===t)}dispatchEvent(e,...t){this.reuseResults&&(this.listenerResults[e]=t);const s=[],i=this.listeners[e];if(i){i.slice().forEach(n=>{var o;-1!==i.findIndex(e=>e.callback===n.callback)&&(s.push(n.callback(...t)),(null===(o=n.options)||void 0===o?void 0:o.once)&&this.removeEventListener(e,n.callback))})}return s}cleanup(){this.listeners={},this.listenerResults={}}}},76:function(e,t,s){"use strict";const i={test:location.search.indexOf("test=1")>0,debug:location.search.indexOf("debug=1")>0,http:!1,ssl:!0,multipleConnections:!0,asServiceWorker:!1};t.a=i}}]);
//# sourceMappingURL=20.a35ba2852f47b30df3d5.chunk.js.map