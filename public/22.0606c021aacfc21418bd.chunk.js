(this.webpackJsonp=this.webpackJsonp||[]).push([[22],{27:function(t,n,r){"use strict";r.r(n);var e=r(75);Object.defineProperty(Uint8Array.prototype,"hex",{get:function(){return Object(e.e)(this)},set:function(t){this.set(Object(e.c)(t))},enumerable:!0,configurable:!0}),Uint8Array.prototype.randomize=function(){if(!crypto||!("getRandomValues"in crypto))throw new Error("NO_SECURE_RANDOM");return crypto.getRandomValues(this),this},Uint8Array.prototype.concat=function(...t){return Object(e.a)(this,...t)},Uint8Array.prototype.toJSON=function(){return[...this]},Array.prototype.findAndSplice=function(t){let n=this.findIndex(t);return-1!==n?this.splice(n,1)[0]:void 0},String.prototype.toHHMMSS=function(t=!1){const n=parseInt(this+"",10),r=Math.floor(n/3600);let e=Math.floor((n-3600*r)/60),o=n-3600*r-60*e;return r&&(t=!0),e<10&&(e=t?"0"+e:e),o<10&&(o="0"+o),(r?r+":":"")+e+":"+o},Promise.prototype.finally=Promise.prototype.finally||function(t){const n=n=>Promise.resolve(t()).then(n);return this.then(t=>n(()=>t),t=>n(()=>Promise.reject(t)))},Promise.prototype.safeFinally=function(t){return this.catch(()=>{}).finally(t)}},75:function(t,n,r){"use strict";function e(t){const n=t.length,r=new Array(n);for(let e=0;e<n;++e)r[e]=(t[e]<16?"0":"")+(t[e]||0).toString(16);return r.join("")}function o(t){const n=t.length,r=new Uint8Array(Math.ceil(n/2));let e=0;n%2&&(r[e++]=parseInt(t.charAt(0),16));for(let o=e;o<n;o+=2)r[e++]=parseInt(t.substr(o,2),16);return r}function i(t){let n,r="";for(let e=t.length,o=0,i=0;i<e;++i)n=i%3,o|=t[i]<<(16>>>n&24),2!==n&&e-i!=1||(r+=String.fromCharCode(c(o>>>18&63),c(o>>>12&63),c(o>>>6&63),c(63&o)),o=0);return r.replace(/A(?=A$|$)/g,"=")}function c(t){return t<26?t+65:t<52?t+71:t<62?t-4:62===t?43:63===t?47:65}function u(t,n){const r=t.length;if(r!==n.length)return!1;for(let e=0;e<r;++e)if(t[e]!==n[e])return!1;return!0}function s(...t){const n=t.reduce((t,n)=>t+(n.byteLength||n.length),0),r=new Uint8Array(n);let e=0;return t.forEach(t=>{r.set(t instanceof ArrayBuffer?new Uint8Array(t):t,e),e+=t.byteLength||t.length}),r}r.d(n,"e",(function(){return e})),r.d(n,"c",(function(){return o})),r.d(n,"d",(function(){return i})),r.d(n,"b",(function(){return u})),r.d(n,"a",(function(){return s}))}}]);
//# sourceMappingURL=22.0606c021aacfc21418bd.chunk.js.map