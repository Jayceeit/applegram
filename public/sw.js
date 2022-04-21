var serviceWorkerOption = {"assets":["/0.948b50c9a8047c9c0842.chunk.js","/1.0cb00dbe7629de0060c7.chunk.js","/11.4cedf32c13708a0f972d.chunk.js","/12.3862167550311cfa0c62.chunk.js","/13.a60e06bd2a9f185ee65e.chunk.js","/14.759193f71df154ab125e.chunk.js","/15.e91ef68debad566c74d5.chunk.js","/16.8f20a4414cdceb869a1b.chunk.js","/17.e503493b3028be8a4735.chunk.js","/18.7e5208c5f212e0e6a5a8.chunk.js","/19.96f69841477e2045dbd5.chunk.js","/2.935038cc2873713ebe19.chunk.js","/20.475b02f54077024062fb.chunk.js","/21.3aef9bc049fb6abb3cd5.chunk.js","/22.0606c021aacfc21418bd.chunk.js","/23.e3145c0ea9684176558f.chunk.js","/24.8835e4abc95acb08dcd5.chunk.js","/25.8300e3ae1cb91fc2bed3.chunk.js","/26.27b86f0f8f80f7f420ab.chunk.js","/27.1bfe793cc702c7aa75db.chunk.js","/28.b17aefb7c51046ff48ec.chunk.js","/29.08bf9f3c8b9be9d555f9.chunk.js","/3.bdf444277e969e63a4c3.chunk.js","/30.0ba6f57fe3c460b08e24.chunk.js","/31.623be4e5a35a57db3b0c.chunk.js","/4.6b5dd97948b29c598f75.chunk.js","/5.faa04da46f838e65acdf.chunk.js","/6.b3e7dabd69f4e9c62ffe.chunk.js","/7.52c0a0f3b6f476d2bcec.chunk.js","/8.cbbad398924d87521a47.chunk.js","/main.8a2ef69f2a1484d13c30.bundle.js","/main.e47f94920a4918a10f5a.css","/mtproto.worker.0ec58444b6446abe9aae.bundle.worker.js","/npm.qr-code-styling.c53238820878551c10bf.chunk.js","/rlottie.worker.6777ef401e7048467332.bundle.worker.js","/style-desktop.9d7b485ed526720a3aad.css","/webp.worker.bd598dc02a03fd59d71a.bundle.worker.js"]};
        
        !function(e){var t={};function n(o){if(t[o])return t[o].exports;var r=t[o]={i:o,l:!1,exports:{}};return e[o].call(r.exports,r,r.exports,n),r.l=!0,r.exports}n.m=e,n.c=t,n.d=function(e,t,o){n.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:o})},n.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},n.t=function(e,t){if(1&t&&(e=n(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var o=Object.create(null);if(n.r(o),Object.defineProperty(o,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var r in e)n.d(o,r,function(t){return e[t]}.bind(null,r));return o},n.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(t,"a",t),t},n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},n.p="",n(n.s=0)}([function(e,t,n){"use strict";n.r(t),n.d(t,"log",(function(){return H})),n.d(t,"deferredPromises",(function(){return Q}));var o={test:location.search.indexOf("test=1")>0,debug:location.search.indexOf("debug=1")>0,http:!1,ssl:!0,multipleConnections:!0,asServiceWorker:!1};const r=o.debug;"undefined"!=typeof window?window:self;var i,s=r;!function(e){e[e.None=0]="None",e[e.Error=1]="Error",e[e.Warn=2]="Warn",e[e.Log=4]="Log",e[e.Debug=8]="Debug"}(i||(i={}));const a=[i.None,i.Error,i.Warn,i.Log,i.Debug],c=Date.now();function l(){return"["+((Date.now()-c)/1e3).toFixed(3)+"]"}function u(e,t=i.Log|i.Warn|i.Error,n=!1){function o(...n){return t&i.Log&&console.log(l(),e,...n)}return s||n||(t=i.Error),o.warn=function(...n){return t&i.Warn&&console.warn(l(),e,...n)},o.info=function(...n){return t&i.Log&&console.info(l(),e,...n)},o.error=function(...n){return t&i.Error&&console.error(l(),e,...n)},o.trace=function(...n){return t&i.Log&&console.trace(l(),e,...n)},o.debug=function(...n){return t&i.Debug&&console.debug(l(),e,...n)},o.setPrefix=function(t){e="["+t+"]:"},o.setPrefix(e),o.setLevel=function(e){t=a.slice(0,e+1).reduce((e,t)=>e|t,0)},o}var h=function(e,t,n,o){return new(n||(n=Promise))((function(r,i){function s(e){try{c(o.next(e))}catch(e){i(e)}}function a(e){try{c(o.throw(e))}catch(e){i(e)}}function c(e){var t;e.done?r(e.value):(t=e.value,t instanceof n?t:new n((function(e){e(t)}))).then(s,a)}c((o=o.apply(e,t||[])).next())}))};const d=self;function f(e){return e.ok&&200===e.status}function g(e){return Promise.race([e,(t=1e4,new Promise(e=>{setTimeout(e,t)})).then(()=>Promise.reject())]);var t}function p(e,t){return new Promise(n=>{const o=new FileReader;o.addEventListener("loadend",e=>n(e.target.result)),o[t](e)})}function m(e){return function(e){return p(e,"readAsArrayBuffer")}(e).then(e=>new Uint8Array(e))}function v(e,t=""){let n;const o=function(e){if(-1===["image/jpeg","image/png","image/gif","image/webp","image/bmp","video/mp4","video/webm","video/quicktime","audio/ogg","audio/mpeg","audio/mp4","application/json","application/pdf"].indexOf(e))return"application/octet-stream";return e}(t);try{n=new Blob(e,{type:o})}catch(t){let r=new BlobBuilder;e.forEach(e=>{r.append(e)}),n=r.getBlob(o)}return n}function w(){}const y="undefined"!=typeof WorkerGlobalScope&&self instanceof WorkerGlobalScope,b="undefined"!=typeof ServiceWorkerGlobalScope&&self instanceof ServiceWorkerGlobalScope,S=()=>self.clients.matchAll({includeUncontrolled:!1,type:"window"}),P=(e,...t)=>{self.clients.matchAll({includeUncontrolled:!1,type:"window"}).then(n=>{n.length&&n.slice(e?0:-1).forEach(e=>{e.postMessage(...t)})})},A=(...e)=>{self.postMessage(...e)},O=()=>{};b&&P.bind(null,!1),b&&P.bind(null,!0);var _=function(e,t,n,o){return new(n||(n=Promise))((function(r,i){function s(e){try{c(o.next(e))}catch(e){i(e)}}function a(e){try{c(o.throw(e))}catch(e){i(e)}}function c(e){var t;e.done?r(e.value):(t=e.value,t instanceof n?t:new n((function(e){e(t)}))).then(s,a)}c((o=o.apply(e,t||[])).next())}))};var T=new class{constructor(){this.blobSupported=!0;try{v([],"")}catch(e){this.blobSupported=!1}}isAvailable(){return this.blobSupported}write(e,t){return t instanceof Blob?m(t).then(t=>e.write(t)):e.write(t)}getFakeFileWriter(e,t){const n=[];return{write:e=>_(this,void 0,void 0,(function*(){if(!this.blobSupported)throw!1;n.push(e)})),truncate:()=>{n.length=0},finalize:(o=!0)=>{const r=v(n,e);return o&&t&&t(r),r}}}},x=function(e,t,n,o){return new(n||(n=Promise))((function(r,i){function s(e){try{c(o.next(e))}catch(e){i(e)}}function a(e){try{c(o.throw(e))}catch(e){i(e)}}function c(e){var t;e.done?r(e.value):(t=e.value,t instanceof n?t:new n((function(e){e(t)}))).then(s,a)}c((o=o.apply(e,t||[])).next())}))};class j{constructor(e){this.dbName=e,this.useStorage=!0,o.test&&(this.dbName+="_test"),j.STORAGES.length&&(this.useStorage=j.STORAGES[0].useStorage),this.openDatabase(),j.STORAGES.push(this)}openDatabase(){var e;return null!==(e=this.openDbPromise)&&void 0!==e?e:this.openDbPromise=caches.open(this.dbName)}delete(e){return this.timeoutOperation(t=>t.delete("/"+e))}deleteAll(){return caches.delete(this.dbName)}get(e){return this.timeoutOperation(t=>t.match("/"+e))}save(e,t){return this.timeoutOperation(n=>n.put("/"+e,t))}getFile(e,t="blob"){return this.get(e).then(e=>{if(!e)throw"NO_ENTRY_FOUND";return e[t]()})}saveFile(e,t){t instanceof Blob||(t=v(t));const n=new Response(t,{headers:{"Content-Length":""+t.size}});return this.save(e,n).then(()=>t)}timeoutOperation(e){return this.useStorage?new Promise((t,n)=>x(this,void 0,void 0,(function*(){let o=!1;const r=setTimeout(()=>{n(),o=!0},15e3);try{const n=yield this.openDatabase();if(!n)throw this.useStorage=!1,this.openDbPromise=void 0,"no cache?";const r=yield e(n);if(o)return;t(r)}catch(e){n(e)}clearTimeout(r)}))):Promise.reject("STORAGE_OFFLINE")}getFileWriter(e,t){const n=T.getFakeFileWriter(t,t=>this.saveFile(e,t).catch(()=>t));return Promise.resolve(n)}static toggleStorage(e){return Promise.all(this.STORAGES.map(t=>{if(t.useStorage=e,!e)return t.deleteAll()}))}}j.STORAGES=[];var E=function(e,t,n,o){return new(n||(n=Promise))((function(r,i){function s(e){try{c(o.next(e))}catch(e){i(e)}}function a(e){try{c(o.throw(e))}catch(e){i(e)}}function c(e){var t;e.done?r(e.value):(t=e.value,t instanceof n?t:new n((function(e){e(t)}))).then(s,a)}c((o=o.apply(e,t||[])).next())}))};const C=new j("cachedStreamChunks");setInterval(()=>C.timeoutOperation(e=>e.keys().then(t=>{const n=new Map,o=Date.now()/1e3|0;for(const e of t){const t=e.url.match(/\/(\d+?)\?/);t&&!n.has(t[1])&&n.set(t[1],e)}const r=[];for(const[t,i]of n){const n=e.match(i).then(n=>{if(+n.headers.get("Time-Cached")+86400<=o)return H("will delete stream chunk:",t),e.delete(i,{ignoreSearch:!0,ignoreVary:!0})});r.push(n)}return Promise.all(r)})),18e5),setInterval(()=>{S().then(e=>{for(const[t,n]of Q)if(!e.find(e=>e.id===t)){for(const e in n){n[e].reject()}Q.delete(t)}})},12e4);const D=new Map;class k{constructor(e){this.info=e,this.loadedOffsets=new Set,this.destroy=()=>{D.delete(this.id)},this.id=k.getId(e),D.set(this.id,this),this.limitPart=e.size>78643200?R:F,this.destroyDebounced=function(e,t,n=!0,o=!0){let r,i,s,a,c=!1;return(...l)=>(i||(i=new Promise((e,t)=>(s=e,a=t))),r?(clearTimeout(r),c=!0,a(),i=new Promise((e,t)=>(s=e,a=t))):n&&(s(e(...l)),c=!1),r=setTimeout(()=>{!o||n&&!c||s(e(...l)),r=i=s=a=void 0,c=!1},t),i.catch(()=>{}),i)}(this.destroy,15e4,!1,!0)}requestFilePartFromWorker(e,t,n=!1){return E(this,void 0,void 0,(function*(){const o={type:"requestFilePart",payload:[this.info.dcId,this.info.location,e,t]},r=JSON.stringify(o);o.id=r;const i=yield S().then(e=>{if(e.length)return e.find(e=>Q.has(e.id))||e[0]});if(!i)throw new Error("no window");let s=Q.get(i.id);s||Q.set(i.id,s={});let a=s[r];if(a)return a.then(e=>e.bytes);i.postMessage(o),this.loadedOffsets.add(e),a=s[r]=function(){let e={isFulfilled:!1,isRejected:!1,notify:()=>{},notifyAll:(...t)=>{e.lastNotify=t,e.listeners.forEach(e=>e(...t))},listeners:[],addNotifyListener:t=>{e.lastNotify&&t(...e.lastNotify),e.listeners.push(t)}},t=new Promise((n,o)=>{e.resolve=e=>{t.isFulfilled||t.isRejected||(t.isFulfilled=!0,n(e))},e.reject=(...e)=>{t.isRejected||t.isFulfilled||(t.isRejected=!0,o(...e))}});return t.catch(w).finally(()=>{t.notify=t.notifyAll=t.lastNotify=null,t.listeners.length=0,t.cancel&&(t.cancel=()=>{})}),Object.assign(t,e),t}();const c=a.then(e=>e.bytes);return this.saveChunkToCache(c,e,t),!n&&this.preloadChunks(e,e+15*this.limitPart),c}))}requestFilePartFromCache(e,t,n){const o=this.getChunkKey(e,t);return C.getFile(o).then(e=>n?new Uint8Array:m(e),e=>{})}requestFilePart(e,t,n){return this.requestFilePartFromCache(e,t,n).then(o=>o||this.requestFilePartFromWorker(e,t,n))}saveChunkToCache(e,t,n){return e.then(e=>{const o=this.getChunkKey(t,n),r=new Response(e,{headers:{"Content-Length":""+e.length,"Content-Type":"application/octet-stream","Time-Cached":""+(Date.now()/1e3|0)}});return C.save(o,r)})}preloadChunk(e){this.loadedOffsets.has(e)||(this.loadedOffsets.add(e),this.requestFilePart(e,this.limitPart,!0))}preloadChunks(e,t){if(t>this.info.size&&(t=this.info.size),e)for(;e<t;e+=this.limitPart)this.preloadChunk(e);else this.preloadChunk(N(e,this.limitPart))}requestRange(e){this.destroyDebounced();const t=function(e,t,n){if(0===e[0]&&1===e[1])return new Response(new Uint8Array(2).buffer,{status:206,statusText:"Partial Content",headers:{"Accept-Ranges":"bytes","Content-Range":"bytes 0-1/"+(n||"*"),"Content-Length":"2","Content-Type":t||"video/mp4"}});return null}(e,this.info.mimeType,this.info.size);if(t)return t;let[n,o]=e;const r=o&&o<this.limitPart?function(e){return Math.pow(2,Math.ceil(Math.log(e)/Math.log(2)))}(o-n+1):this.limitPart,i=N(n,r);return o||(o=Math.min(n+r,this.info.size-1)),this.requestFilePart(i,r).then(e=>{n===i&&o===i+r||(e=e.slice(n-i,o-i+1));const t={"Accept-Ranges":"bytes","Content-Range":`bytes ${n}-${n+e.byteLength-1}/${this.info.size||"*"}`,"Content-Length":""+e.byteLength};return this.info.mimeType&&(t["Content-Type"]=this.info.mimeType),new Response(e,{status:206,statusText:"Partial Content",headers:t})})}getChunkKey(e,t){return this.id+"?offset="+e+"&limit="+t}static get(e){var t;return null!==(t=D.get(this.getId(e)))&&void 0!==t?t:new k(e)}static getId(e){return e.location.id}}const F=524288,R=1048576;function N(e,t=2048){return e-e%t}var L={name:"tweb",version:7,stores:[{name:"session"},{name:"stickerSets"},{name:"users"},{name:"chats"},{name:"dialogs"},{name:"messages"}]};var M="undefined"!=typeof window?window:self;const W=navigator?navigator.userAgent:null,I=(navigator.userAgent.search(/OS X|iPhone|iPad|iOS/i),navigator.userAgent.toLowerCase().indexOf("android"),/Chrome/.test(navigator.userAgent)&&/Google Inc/.test(navigator.vendor),(/iPad|iPhone|iPod/.test(navigator.platform)||"MacIntel"===navigator.platform&&navigator.maxTouchPoints>1)&&M.MSStream,!!("safari"in M)||(!W||(/\b(iPad|iPhone|iPod)\b/.test(W)||W.match("Safari")&&W.match("Chrome"))),navigator.userAgent.toLowerCase().indexOf("firefox")>-1);navigator.maxTouchPoints>0&&navigator.userAgent.search(/iOS|iPhone OS|Android|BlackBerry|BB10|Series ?[64]0|J2ME|MIDP|opera mini|opera mobi|mobi.+Gecko|Windows Phone/i);class q{constructor(e,t){this.storageIsAvailable=!0,function(e,t){if(t)for(let n in t)void 0!==t[n]&&(e[n]=t[n])}(this,e),o.test&&(this.name+="_test"),this.storeName=t,this.log=u("IDB-"+this.storeName),this.openDatabase(!0),q.STORAGES.push(this)}static closeDatabases(e){this.STORAGES.forEach(t=>{if(e&&e===t)return;const n=t.db;n&&(n.onclose=()=>{},n.close())})}isAvailable(){return this.storageIsAvailable}openDatabase(e=!1){if(this.openDbPromise&&!e)return this.openDbPromise;try{var t=indexedDB.open(this.name,this.version);if(!t)return Promise.reject()}catch(e){return this.log.error("error opening db",e.message),this.storageIsAvailable=!1,Promise.reject(e)}let n=!1;return setTimeout(()=>{n||t.onerror({type:"IDB_CREATE_TIMEOUT"})},3e3),this.openDbPromise=new Promise((e,o)=>{t.onsuccess=r=>{n=!0;const i=t.result;let s=!1;this.log("Opened"),i.onerror=e=>{this.storageIsAvailable=!1,this.log.error("Error creating/accessing IndexedDB database",e),o(e)},i.onclose=e=>{this.log.error("closed:",e),!s&&this.openDatabase()},i.onabort=e=>{this.log.error("abort:",e);const t=e.target;this.openDatabase(s=!0),t.onerror&&t.onerror(e),i.close()},i.onversionchange=e=>{this.log.error("onversionchange, lol?")},e(this.db=i)},t.onerror=e=>{n=!0,this.storageIsAvailable=!1,this.log.error("Error creating/accessing IndexedDB database",e),o(e)},t.onupgradeneeded=e=>{n=!0,this.log.warn("performing idb upgrade from",e.oldVersion,"to",e.newVersion);var t=e.target.result;this.stores.forEach(e=>{t.objectStoreNames.contains(e.name)||((e,t)=>{var n;const o=e.createObjectStore(t.name);if(null===(n=t.indexes)||void 0===n?void 0:n.length)for(const e of t.indexes)o.createIndex(e.indexName,e.keyPath,e.objectParameters)})(t,e)})}})}delete(e){return Array.isArray(e)||(e=[].concat(e)),this.getObjectStore("readwrite",t=>e.map(e=>t.delete(e)),"")}clear(e){return this.getObjectStore("readwrite",e=>e.clear(),"",e)}save(e,t){return Array.isArray(e)||(e=[].concat(e),t=[].concat(t)),this.getObjectStore("readwrite",n=>e.map((e,o)=>n.put(t[o],e)),"")}saveFile(e,t){return t instanceof Blob||(t=v([t])),this.save(e,t)}get(e){return Array.isArray(e)||(e=[].concat(e)),this.getObjectStore("readonly",t=>e.map(e=>t.get(e)),"")}getObjectStore(e,t,n,o=this.storeName){let r;return n&&(r=performance.now(),this.log(n+": start")),this.openDatabase().then(i=>new Promise((s,a)=>{const c=i.transaction([o],e);c.onerror=e=>{clearTimeout(l),a(c.error)},c.oncomplete=e=>{clearTimeout(l),n&&this.log(n+": end",performance.now()-r);const t=d.map(e=>e.result);s(h?t:t[0])};const l=setTimeout(()=>{this.log.error("transaction not finished",c)},1e4),u=t(c.objectStore(o)),h=Array.isArray(u),d=h?u:[].concat(u)}))}getAll(){return this.getObjectStore("readonly",e=>e.getAll(),"")}}q.STORAGES=[];var B=function(e,t,n,o){return new(n||(n=Promise))((function(r,i){function s(e){try{c(o.next(e))}catch(e){i(e)}}function a(e){try{c(o.throw(e))}catch(e){i(e)}}function c(e){var t;e.done?r(e.value):(t=e.value,t instanceof n?t:new n((function(e){e(t)}))).then(s,a)}c((o=o.apply(e,t||[])).next())}))};const G=self,U=location.protocol+"//"+location.hostname+location.pathname.split("/").slice(0,-1).join("/")+"/";const z=new class{constructor(e,t,n){this.defaults=n,this.cache={},this.storage=new q(e,t)}get(e){return B(this,void 0,void 0,(function*(){if(void 0!==this.cache[e])return this.cache[e];let t;try{t=yield this.storage.get(e)}catch(e){}if(void 0!==this.cache[e])return this.cache[e];if(void 0===t){const n=this.defaults[e];t="function"==typeof n?n():n}return this.cache[e]=t}))}set(e,t){return B(this,void 0,void 0,(function*(){this.cache[e]=t;try{this.storage.save(e,t)}catch(e){}}))}}(L,"session",{push_mute_until:0,push_last_alive:0,push_lang:{},push_settings:{}});G.addEventListener("push",e=>{const t=e.data.json();H("push",t);let n=!1;const o=Promise.all([z.get("push_mute_until"),z.get("push_last_alive"),G.clients.matchAll({type:"window"})]).then(e=>{const[o,r,i]=e;if(H("matched clients",i),n=i.length>0,n)throw"Supress notification because some instance is alive";const s=Date.now();if(Y()&&o&&s<o)throw`Supress notification because mute for ${Math.ceil((o-s)/6e4)} min`;if(!t.badge)throw"No badge?"});o.catch(e=>{H(e)});const r=o.then(()=>Promise.all([z.get("push_settings"),z.get("push_lang")])).then(e=>function(e,t,n){const o="assets/img/logo_filled_rounded.png";let r,i=e.title||"Telegram",s=e.description||"";e.custom&&(r=e.custom.channel_id?""+-e.custom.channel_id:e.custom.chat_id?""+-e.custom.chat_id:e.custom.from_id||"");e.custom.peerId=""+r;let a="peer"+r;t&&t.nopreview&&(i="Telegram",s=n.push_message_nopreview||"You have a new message",a="unknown_peer");H("show notify",i,s,o,e);const c=[{action:"mute1d",title:n.push_action_mute1d||"Mute for 24H"}];return G.registration.showNotification(i,{body:s,icon:o,tag:a,data:e,actions:c}).then(e=>{var t;e&&e.notification&&(t=e.notification,V.has(t)||(V.add(t),t.onclose=J))}).catch(e=>{H.error("Show notification promise",e)})}(t,e[0],e[1])).catch(()=>(H("Closing all notifications on push",n),Y()||n?K():G.registration.showNotification("Telegram",{tag:"unknown_peer"}).then(()=>{if(n)return K();setTimeout(()=>K(),n?0:100)}).catch(e=>{H.error("Show notification error",e)})));e.waitUntil(r)}),G.addEventListener("notificationclick",e=>{const t=e.notification;H("On notification click: ",t.tag),t.close();const n=e.action;if("mute1d"===n&&Y())return H("[SW] mute for 1d"),void z.set("push_mute_until",Date.now()+864e5);const o=t.data;if(!o)return;const r=G.clients.matchAll({type:"window"}).then(e=>{o.action=n,$={type:"push_click",payload:o};for(let t=0;t<e.length;t++){const n=e[t];if("focus"in n)return n.focus(),n.postMessage($),void($=void 0)}if(G.clients.openWindow)return z.get("push_settings").then(e=>G.clients.openWindow(e.baseUrl||U))}).catch(e=>{H.error("Clients.matchAll error",e)});e.waitUntil(r)}),G.addEventListener("notificationclose",J);let $,V=new Set;function J(e){var t;t=e.notification,V.delete(t)}function K(){for(const e of V)try{e.close()}catch(e){}let e;return e="getNotifications"in G.registration?G.registration.getNotifications({}).then(e=>{for(let t=0,n=e.length;t<n;++t)try{e[t].close()}catch(e){}}).catch(e=>{H.error("Offline register SW error",e)}):Promise.resolve(),V.clear(),e}function Y(){return I}const H=u("SW",i.Error|i.Debug|i.Log|i.Warn),X=self,Q=new Map,Z={notifications_clear:()=>{K()},ping:(e,t)=>{!function(e,t){const n=t.ports&&t.ports[0]||t.source,o=e.payload;o.localNotifications&&z.set("push_last_alive",Date.now()),$&&n&&"postMessage"in n&&(n.postMessage($,[]),$=void 0),o.lang&&z.set("push_lang",o.lang),o.settings&&z.set("push_settings",o.settings)}(e,t)},requestFilePart:(e,t)=>{const n=t.source,o=Q.get(n.id);if(!o)return;const r=o[e.id];r&&(e.error?r.reject(e.error):r.resolve(e.payload),delete o[e.id])},toggleStorage:e=>{j.toggleStorage(e.payload)}};X.addEventListener("message",e=>{const t=e.data,n=Z[t.type];n&&n(t,e)});const ee=e=>{if(0===e.request.url.indexOf(location.origin+"/")&&e.request.url.match(/\.(js|css|jpe?g|json|wasm|png|mp3|svg|tgs|ico|woff2?|ttf|webmanifest?)(?:\?.*)?$/))return e.respondWith(function(e){return h(this,void 0,void 0,(function*(){try{const t=yield g(d.caches.open("cachedAssets")),n=yield g(t.match(e.request,{ignoreVary:!0}));if(n&&f(n))return n;const o={Vary:"*"};let r=yield fetch(e.request,{headers:o});if(f(r))t.put(e.request,r.clone());else if(304===r.status){const n=e.request.url.replace(/\?.+$/,"")+"?"+(1e5*Math.random()|0);r=yield fetch(n,{headers:o}),f(r)&&t.put(e.request,r.clone())}return r}catch(t){return fetch(e.request)}}))}(e));try{const[,t,n,o]=/http[:s]+\/\/.*?(\/(.*?)(?:$|\/(.*)$))/.exec(e.request.url)||[];switch(n){case"stream":!function(e,t){const n=function(e){if(!e)return[0,0];const[,t]=e.split("="),n=t.split(", "),[o,r]=n[0].split("-");return[+o,+r||0]}(e.request.headers.get("Range")),o=JSON.parse(decodeURIComponent(t)),r=k.get(o);var i;e.respondWith(Promise.race([(i=45e3,new Promise(e=>{setTimeout(()=>{e(new Response("",{status:408,statusText:"Request timed out."}))},i)})),r.requestRange(n)]))}(e,o)}}catch(t){e.respondWith(new Response("",{status:500,statusText:"Internal Server Error"}))}},te=()=>{X.onfetch=ee};X.addEventListener("install",e=>{H("installing"),e.waitUntil(X.skipWaiting())}),X.addEventListener("activate",e=>{H("activating",X),e.waitUntil(X.caches.delete("cachedAssets")),e.waitUntil(X.clients.claim())}),X.onerror=e=>{H.error("error:",e)},X.onunhandledrejection=e=>{H.error("onunhandledrejection:",e)},X.onoffline=X.ononline=te,te()}]);
//# sourceMappingURL=sw.js.map