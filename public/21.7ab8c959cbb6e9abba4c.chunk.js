(this.webpackJsonp=this.webpackJsonp||[]).push([[21],{74:function(e,t,n){"use strict";n.d(t,"a",(function(){return p}));var a=n(11),o=n(12),i=n(8),r=n(14),d=n(10),s=n(16),l=n(20);let c,u=!1,g=0;function p(e){u||(c||(c=r.a.invokeApiCacheable("help.getConfig").then(e=>e.suggested_lang_code!==i.default.lastRequestedLangCode?Promise.all([e,i.default.getStrings(e.suggested_lang_code,["Login.ContinueOnLanguage"]),i.default.getCacheLangPack()]):[]))).then(([t,n])=>{if(!t)return;const r=[];n.forEach(e=>{const t=i.default.strings.get(e.key);t&&(r.push(t),i.default.strings.set(e.key,e))});const c=Object(s.a)("btn-primary btn-secondary btn-primary-transparent primary",{text:"Login.ContinueOnLanguage"});e.append(c),d.default.addEventListener("language_change",()=>{c.remove()},!0),r.forEach(e=>{i.default.strings.set(e.key,e)}),Object(o.b)(c,e=>{Object(a.a)(e),c.disabled=!0,Object(l.f)(c),i.default.getLangPack(t.suggested_lang_code)})})}d.default.addEventListener("language_change",()=>{++g<2||(console.log("language_change"),u=!0)})},85:function(e,t,n){"use strict";n.r(t);var a=n(14),o=n(31),i=n(54),r=n(71),d=n(13),s=n(3),l=n(16),c=n(8),u=n(15),g=n(10),p=n(20),h=n(74),m=function(e,t,n,a){return new(n||(n=Promise))((function(o,i){function r(e){try{s(a.next(e))}catch(e){i(e)}}function d(e){try{s(a.throw(e))}catch(e){i(e)}}function s(e){var t;e.done?o(e.value):(t=e.value,t instanceof n?t:new n((function(e){e(t)}))).then(r,d)}s((a=a.apply(e,t||[])).next())}))};let f;const y=new o.a("page-signQR",!0,()=>f,()=>{f||(f=m(void 0,void 0,void 0,(function*(){const e=y.pageEl.querySelector(".auth-image");let t=Object(p.f)(e,!0);const o=document.createElement("div");o.classList.add("input-wrapper");const u=Object(l.a)("btn-primary btn-secondary btn-primary-transparent primary",{text:"Login.QR.Cancel"});o.append(u),Object(h.a)(o);const v=e.parentElement,b=document.createElement("h4");Object(c._i18n)(b,"Login.QR.Title");const w=document.createElement("ol");w.classList.add("qr-description"),["Login.QR.Help1","Login.QR.Help2","Login.QR.Help3"].forEach(e=>{const t=document.createElement("li");t.append(Object(c.i18n)(e)),w.append(t)}),v.append(b,w,o),u.addEventListener("click",()=>{Promise.all([n.e(1),n.e(18)]).then(n.bind(null,77)).then(e=>e.default.mount()),E=!0});const _=(yield Promise.all([n.e(9).then(n.t.bind(null,101,7))]))[0].default;let E=!1;g.default.addEventListener("user_auth",()=>{E=!0,f=null},!0);let L,O={ignoreErrors:!0};const k=o=>m(void 0,void 0,void 0,(function*(){try{let l=yield a.a.invokeApi("auth.exportLoginToken",{api_id:s.a.id,api_hash:s.a.hash,except_ids:[]},{ignoreErrors:!0});if("auth.loginTokenMigrateTo"===l._&&(O.dcId||(O.dcId=l.dc_id,a.a.setBaseDcId(l.dc_id)),l=yield a.a.invokeApi("auth.importLoginToken",{token:l.token},O)),"auth.loginTokenSuccess"===l._){const e=l.authorization;return a.a.setUserAuth(e.user.id),n.e(26).then(n.bind(null,44)).then(e=>e.default.mount()),!0}if(!L||!Object(r.b)(L,l.token)){L=l.token;let n="tg://login?token="+Object(r.d)(l.token).replace(/\+/g,"-").replace(/\//g,"_").replace(/\=+$/,"");const a=window.getComputedStyle(document.documentElement),o=a.getPropertyValue("--surface-color").trim(),i=a.getPropertyValue("--primary-text-color").trim(),s=a.getPropertyValue("--primary-color").trim(),c=yield fetch("assets/img/logo_padded.svg").then(e=>e.text()).then(e=>{e=e.replace(/(fill:).+?(;)/,`$1${s}$2`);const t=new Blob([e],{type:"image/svg+xml;charset=utf-8"});return new Promise(e=>{const n=new FileReader;n.onload=t=>{e(t.target.result)},n.readAsDataURL(t)})}),u=new _({width:240*window.devicePixelRatio,height:240*window.devicePixelRatio,data:n,image:c,dotsOptions:{color:i,type:"rounded"},cornersSquareOptions:{type:"extra-rounded"},imageOptions:{imageSize:1,margin:0},backgroundOptions:{color:o},qrOptions:{errorCorrectionLevel:"L"}});let g;u.append(e),e.lastChild.classList.add("qr-canvas"),g=u._drawingPromise?u._drawingPromise:Promise.race([Object(d.d)(1e3),new Promise(e=>{u._canvas._image.addEventListener("load",()=>{window.requestAnimationFrame(()=>e())},{once:!0})})]),yield g.then(()=>{if(t){t.style.animation="hide-icon .4s forwards";const n=e.children[1];n.style.display="none",n.style.animation="grow-icon .4s forwards",setTimeout(()=>{n.style.display=""},150),setTimeout(()=>{n.style.animation=""},500),t=void 0}else Array.from(e.children).slice(0,-1).forEach(e=>{e.remove()})})}if(o){let e=Date.now()/1e3,t=l.expires-e-i.a.serverTimeOffset;yield Object(d.d)(t>3?3e3:1e3*t|0)}}catch(e){switch(e.type){case"SESSION_PASSWORD_NEEDED":console.warn("pageSignQR: SESSION_PASSWORD_NEEDED"),e.handled=!0,Promise.all([n.e(1),n.e(3),n.e(17)]).then(n.bind(null,75)).then(e=>e.default.mount()),E=!0,f=null;break;default:console.error("pageSignQR: default error:",e),E=!0}return!0}return!1}));return()=>m(void 0,void 0,void 0,(function*(){for(E=!1;!E&&!(yield k(!0)););}))}))),f.then(e=>{e()}),u.default.pushToState("authState",{_:"authStateSignQr"})});t.default=y}}]);
//# sourceMappingURL=21.7ab8c959cbb6e9abba4c.chunk.js.map