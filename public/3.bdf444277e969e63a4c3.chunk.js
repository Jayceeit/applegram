(this.webpackJsonp=this.webpackJsonp||[]).push([[3,25],{100:function(t,e,i){"use strict";i.d(e,"a",(function(){return s}));var n=i(1);function s(t,e=!1){if(!n.IS_TOUCH_SUPPORTED||e&&document.activeElement===t)if(t.focus(),void 0!==window.getSelection&&void 0!==document.createRange){var i=document.createRange();i.selectNodeContents(t),i.collapse(!1);var s=window.getSelection();s.removeAllRanges(),s.addRange(i)}else if(void 0!==document.body.createTextRange){var a=document.body.createTextRange();a.moveToElementText(t),a.collapse(!1),a.select()}}},106:function(t,e,i){"use strict";i.d(e,"a",(function(){return l}));var n=i(16);const s=new Map;let a=0;const o=(t,e,i="")=>{i=e.country_code+i,a=Math.max(a,i.length),s.set(i,{country:t,code:e})};function l(t){s.size||n.default.countriesList.forEach(t=>{t.country_codes.forEach(e=>{e.prefixes?e.prefixes.forEach(i=>{o(t,e,i)}):o(t,e)})});let e,i=t.replace(/\D/g,""),l=i.slice(0,a);for(let t=l.length-1;t>=0&&(e=s.get(l.slice(0,t+1)),!e);--t);if(!e)return{formatted:i,country:void 0,code:void 0,leftPattern:""};const r=e.country,c=e.code.patterns||[],h=i.slice(e.code.country_code.length);let u="",d=0,p="";for(let t=c.length-1;t>=0;--t){u=c[t];const e=u.replace(/ /g,"");let i=0;for(let t=0,n=Math.min(h.length,e.length);t<n;++t){if(h[t]!==e[t]&&"X"!==e[t]){i=0;break}++i}i>d&&(d=i,p=u)}u=p||u,u=u.replace(/\d/g,"X"),u=e.code.country_code+" "+u,u.split("").forEach((t,e)=>{" "===t&&" "!==i[e]&&i.length>e&&(i=i.slice(0,e)+" "+i.slice(e))});let f=u&&u.length>i.length?u.slice(i.length):"";return f&&(f=f.replace(/X/g,"‒")),{formatted:i,country:r,code:e.code,leftPattern:f}}},115:function(t,e,i){"use strict";i.d(e,"a",(function(){return r}));var n=i(76),s=i(86),a=function(t,e,i,n){return new(i||(i=Promise))((function(s,a){function o(t){try{r(n.next(t))}catch(t){a(t)}}function l(t){try{r(n.throw(t))}catch(t){a(t)}}function r(t){var e;t.done?s(t.value):(e=t.value,e instanceof i?e:new i((function(t){t(e)}))).then(o,l)}r((n=n.apply(t,e||[])).next())}))};var o=new class{constructor(){this.blobSupported=!0;try{Object(s.a)([],"")}catch(t){this.blobSupported=!1}}isAvailable(){return this.blobSupported}write(t,e){return e instanceof Blob?Object(s.d)(e).then(e=>t.write(e)):t.write(e)}getFakeFileWriter(t,e){const i=[];return{write:t=>a(this,void 0,void 0,(function*(){if(!this.blobSupported)throw!1;i.push(t)})),truncate:()=>{i.length=0},finalize:(n=!0)=>{const a=Object(s.a)(i,t);return n&&e&&e(a),a}}}},l=function(t,e,i,n){return new(i||(i=Promise))((function(s,a){function o(t){try{r(n.next(t))}catch(t){a(t)}}function l(t){try{r(n.throw(t))}catch(t){a(t)}}function r(t){var e;t.done?s(t.value):(e=t.value,e instanceof i?e:new i((function(t){t(e)}))).then(o,l)}r((n=n.apply(t,e||[])).next())}))};class r{constructor(t){this.dbName=t,this.useStorage=!0,n.a.test&&(this.dbName+="_test"),r.STORAGES.length&&(this.useStorage=r.STORAGES[0].useStorage),this.openDatabase(),r.STORAGES.push(this)}openDatabase(){var t;return null!==(t=this.openDbPromise)&&void 0!==t?t:this.openDbPromise=caches.open(this.dbName)}delete(t){return this.timeoutOperation(e=>e.delete("/"+t))}deleteAll(){return caches.delete(this.dbName)}get(t){return this.timeoutOperation(e=>e.match("/"+t))}save(t,e){return this.timeoutOperation(i=>i.put("/"+t,e))}getFile(t,e="blob"){return this.get(t).then(t=>{if(!t)throw"NO_ENTRY_FOUND";return t[e]()})}saveFile(t,e){e instanceof Blob||(e=Object(s.a)(e));const i=new Response(e,{headers:{"Content-Length":""+e.size}});return this.save(t,i).then(()=>e)}timeoutOperation(t){return this.useStorage?new Promise((e,i)=>l(this,void 0,void 0,(function*(){let n=!1;const s=setTimeout(()=>{i(),n=!0},15e3);try{const i=yield this.openDatabase();if(!i)throw this.useStorage=!1,this.openDbPromise=void 0,"no cache?";const s=yield t(i);if(n)return;e(s)}catch(t){i(t)}clearTimeout(s)}))):Promise.reject("STORAGE_OFFLINE")}getFileWriter(t,e){const i=o.getFakeFileWriter(e,e=>this.saveFile(t,e).catch(()=>e));return Promise.resolve(i)}static toggleStorage(t){return Promise.all(this.STORAGES.map(e=>{if(e.useStorage=t,!t)return e.deleteAll()}))}}r.STORAGES=[]},121:function(t,e,i){"use strict";i.d(e,"a",(function(){return l}));var n=i(100),s=i(106),a=i(0),o=i(38);class l extends o.b{constructor(t={}){super(Object.assign({label:"Contacts.PhoneNumber.Placeholder",name:"phone"},t)),this.pasted=!1,this.lastValue="",this.container.classList.add("input-field-phone");let e=this.input;if(e instanceof HTMLInputElement)e.type="tel",e.autocomplete="rr55RandomRR55";else{e.inputMode="decimal";const t=window.devicePixelRatio;if(t>1){let i;a.IS_APPLE?i=-.16*t:a.IS_ANDROID&&(i=0),e.style.setProperty("--letter-spacing",i+"px")}const i=this.setValueSilently.bind(this);this.setValueSilently=t=>{i(t),Object(n.a)(this.input,!0)}}e.addEventListener("input",()=>{e.classList.remove("error");const i=this.value;let n;Math.abs(i.length-this.lastValue.length)>1&&!this.pasted&&a.IS_APPLE_MOBILE&&this.setValueSilently(this.lastValue+i),this.pasted=!1,this.setLabel();let o,l,r,c="";"+"===this.value.replace(/\++/,"+")?this.setValueSilently("+"):(n=Object(s.a)(this.value),o=n.formatted,l=n.country,c=n.leftPattern,r=n.code,this.setValueSilently(this.lastValue=o?"+"+o:"")),e.dataset.leftPattern=c,t.onInput&&t.onInput(n)}),e.addEventListener("paste",()=>{this.pasted=!0}),e.addEventListener("keypress",t=>{const e=t.key;if(/\D/.test(e)&&!t.metaKey&&!t.ctrlKey&&"Backspace"!==e&&("+"!==e||!t.shiftKey))return t.preventDefault(),!1})}}},36:function(t,e,i){"use strict";function n(t,e){if("string"==typeof e)return void(t.innerHTML=e);const i=t.firstChild;i?t.lastChild===i?i.replaceWith(e):(t.textContent="",t.append(e)):t.append(e)}i.d(e,"a",(function(){return n}))},38:function(t,e,i){"use strict";i.d(e,"a",(function(){return u}));var n=i(52),s=i(84),a=i(67),o=i(88);var l=i(16),r=i(31),c=i(57);let h=()=>{document.addEventListener("paste",t=>{if(!Object(s.a)(t.target,'contenteditable="true"'))return;t.preventDefault();let e=(t.originalEvent||t).clipboardData.getData("text/plain"),i=r.b.parseEntities(e);i=i.filter(t=>"messageEntityEmoji"===t._||"messageEntityLinebreak"===t._),e=r.b.wrapRichText(e,{entities:i,noLinks:!0,wrappingDraft:!0}),window.document.execCommand("insertHTML",!1,e)}),h=null};var u;!function(t){t[t.Neutral=0]="Neutral",t[t.Valid=1]="Valid",t[t.Error=2]="Error"}(u||(u={}));e.b=class{constructor(t={}){this.options=t,this.container=document.createElement("div"),this.container.classList.add("input-field"),this.required=t.required,this.validate=t.validate,void 0!==t.maxLength&&void 0===t.showLengthOn&&(t.showLengthOn=Math.min(40,Math.round(t.maxLength/3)));const{placeholder:e,maxLength:i,showLengthOn:n,name:s,plainText:r}=t;let c,u,d=t.label||t.labelText;if(r)this.container.innerHTML=`\n      <input type="text" ${s?`name="${s}"`:""} autocomplete="off" ${d?'required=""':""} class="input-field-input">\n      `,c=this.container.firstElementChild;else{h&&h(),this.container.innerHTML='\n      <div contenteditable="true" class="input-field-input"></div>\n      ',c=this.container.firstElementChild;const e=new MutationObserver(()=>{u&&u()});c.addEventListener("input",()=>{Object(o.a)(c)&&(c.innerHTML=""),this.inputFake&&(this.inputFake.innerHTML=c.innerHTML,this.onFakeInput())}),e.observe(c,{characterData:!0,childList:!0,subtree:!0}),t.animate&&(c.classList.add("scrollable","scrollable-y"),this.inputFake=document.createElement("div"),this.inputFake.setAttribute("contenteditable","true"),this.inputFake.className=c.className+" input-field-input-fake")}if(c.setAttribute("dir","auto"),e&&(Object(l._i18n)(c,e,void 0,"placeholder"),this.inputFake&&Object(l._i18n)(this.inputFake,e,void 0,"placeholder")),d||e){const t=document.createElement("div");t.classList.add("input-field-border"),this.container.append(t)}if(d&&(this.label=document.createElement("label"),this.setLabel(),this.container.append(this.label)),i){const t=this.container.lastElementChild;let e=!1;u=()=>{const s=c.classList.contains("error"),o=r?c.value.length:[...Object(a.a)(c,!1).value].length,l=i-o,h=l<0;c.classList.toggle("error",h),h||l<=n?(this.setLabel(),t.append(` (${i-o})`),e||(e=!0)):(s&&!h||e)&&(this.setLabel(),e=!1)},c.addEventListener("input",u)}this.input=c}select(){this.value&&(this.options.plainText?this.input.select():function(t){const e=document.createRange();e.selectNodeContents(t);const i=window.getSelection();i.removeAllRanges(),i.addRange(e)}(this.input))}setLabel(){this.label.textContent="",this.options.labelText?this.label.innerHTML=this.options.labelText:this.label.append(Object(l.i18n)(this.options.label,this.options.labelOptions))}onFakeInput(t=!0){const{scrollHeight:e}=this.inputFake,i=+this.input.style.height.replace("px","");if(i===e)return;const n=Math.round(50*Math.log(Math.abs(e-i)));this.input.style.transitionDuration=n+"ms",t&&(this.input.style.height=e?e+"px":"");Object(c.a)(this.input,"is-changing-height",!0,n,()=>{this.input.classList.remove("is-changing-height")})}get value(){return this.options.plainText?this.input.value:Object(a.a)(this.input,!1).value}set value(t){this.setValueSilently(t,!1),Object(n.a)(this.input,"input")}setValueSilently(t,e=!0){this.options.plainText?this.input.value=t:(this.input.innerHTML=t,this.inputFake&&(this.inputFake.innerHTML=t,e&&this.onFakeInput()))}isChanged(){return this.value!==this.originalValue}isValid(){return!this.input.classList.contains("error")&&(!this.validate||this.validate())&&(!this.required||!Object(o.a)(this.input))}isValidToChange(){return this.isValid()&&this.isChanged()}setDraftValue(t="",e=!1){this.options.plainText||(t=r.b.wrapDraftText(t)),e?this.setValueSilently(t,!1):this.value=t}setOriginalValue(t="",e=!1){this.originalValue=t,this.setDraftValue(t,e)}setState(t,e){e&&(this.label.textContent="",this.label.append(Object(l.i18n)(e,this.options.labelOptions))),this.input.classList.toggle("error",!!(t&u.Error)),this.input.classList.toggle("valid",!!(t&u.Valid))}setError(t){this.setState(u.Error,t)}}},49:function(t,e,i){"use strict";i.d(e,"b",(function(){return c})),i.d(e,"a",(function(){return h}));var n=i(1),s=i(43),a=i(87),o=i(82),l=i(5);class r{constructor(t,e="",i=document.createElement("div")){this.el=t,this.container=i,this.onScrollMeasure=0,this.isHeavyAnimationInProgress=!1,this.needCheckAfterAnimation=!1,this.container.classList.add("scrollable"),this.log=Object(s.b)("SCROLL"+(e?"-"+e:""),s.a.Error),t&&(Array.from(t.children).forEach(t=>this.container.append(t)),t.append(this.container))}setListeners(){window.addEventListener("resize",this.onScroll,{passive:!0}),this.container.addEventListener("scroll",this.onScroll,{passive:!0,capture:!0}),Object(o.a)(()=>{this.isHeavyAnimationInProgress=!0,this.onScrollMeasure&&(this.needCheckAfterAnimation=!0,window.cancelAnimationFrame(this.onScrollMeasure))},()=>{this.isHeavyAnimationInProgress=!1,this.needCheckAfterAnimation&&(this.onScroll(),this.needCheckAfterAnimation=!1)})}append(t){this.container.append(t)}scrollIntoViewNew(t,e,i,n,s,o,l,r){return Object(a.b)(this.container,t,e,i,n,s,o,l,r)}}class c extends r{constructor(t,e="",i=300,n){super(t,e),this.onScrollOffset=i,this.onAdditionalScroll=null,this.onScrolledTop=null,this.onScrolledBottom=null,this.lastScrollTop=0,this.lastScrollDirection=0,this.loadedAll={top:!0,bottom:!1},this.onScroll=()=>{if(this.isHeavyAnimationInProgress)return this.onScrollMeasure&&window.cancelAnimationFrame(this.onScrollMeasure),void(this.needCheckAfterAnimation=!0);(this.onScrolledTop||this.onScrolledBottom||this.splitUp||this.onAdditionalScroll)&&(this.onScrollMeasure&&window.cancelAnimationFrame(this.onScrollMeasure),this.onScrollMeasure=window.requestAnimationFrame(()=>{this.onScrollMeasure=0;const t=this.container.scrollTop;this.lastScrollDirection=this.lastScrollTop===t?0:this.lastScrollTop<t?1:-1,this.lastScrollTop=t,this.onAdditionalScroll&&0!==this.lastScrollDirection&&this.onAdditionalScroll(),this.checkForTriggers&&this.checkForTriggers()}))},this.checkForTriggers=()=>{if(!this.onScrolledTop&&!this.onScrolledBottom)return;if(this.isHeavyAnimationInProgress)return void this.onScroll();const t=this.container.scrollHeight;if(!t)return;const e=t-this.container.clientHeight,i=this.lastScrollTop;this.onScrolledTop&&i<=this.onScrollOffset&&this.lastScrollDirection<=0&&this.onScrolledTop(),this.onScrolledBottom&&e-i<=this.onScrollOffset&&this.lastScrollDirection>=0&&this.onScrolledBottom()},this.container.classList.add("scrollable-y"),this.setListeners()}setVirtualContainer(t){this.splitUp=t,this.log("setVirtualContainer:",t,this)}prepend(...t){(this.splitUp||this.padding||this.container).prepend(...t)}append(...t){(this.splitUp||this.padding||this.container).append(...t)}getDistanceToEnd(){return this.scrollHeight-Math.round(this.scrollTop+this.container.offsetHeight)}get isScrolledDown(){return this.getDistanceToEnd()<=1}set scrollTop(t){this.container.scrollTop=t}get scrollTop(){return this.container.scrollTop}get scrollHeight(){return this.container.scrollHeight}}class h extends r{constructor(t,e="",i=300,s=15,a=document.createElement("div")){if(super(t,e,a),this.onScrollOffset=i,this.splitCount=s,this.container=a,this.container.classList.add("scrollable-x"),!n.IS_TOUCH_SUPPORTED){const t=t=>{!t.deltaX&&this.container.scrollWidth>this.container.clientWidth&&(this.container.scrollLeft+=t.deltaY/4,Object(l.a)(t))};this.container.addEventListener("wheel",t,{passive:!1})}}}},53:function(t,e,i){"use strict";i.d(e,"a",(function(){return l}));var n=i(17),s=i(34),a=i(18),o=i(16);class l{constructor(t={}){const e=this.label=document.createElement("label");e.classList.add("checkbox-field"),t.restriction&&e.classList.add("checkbox-field-restriction"),t.round&&e.classList.add("checkbox-field-round"),t.disabled&&this.toggleDisability(!0);const i=this.input=document.createElement("input");let l;if(i.classList.add("checkbox-field-input"),i.type="checkbox",t.name&&(i.id="input-"+t.name),t.checked&&(i.checked=!0),t.stateKey&&n.default.getState().then(e=>{const a=Object(s.d)(e,t.stateKey);let o;o=t.stateValues?1===t.stateValues.indexOf(a):a,this.setValueSilently(o),i.addEventListener("change",()=>{let e;e=t.stateValues?t.stateValues[i.checked?1:0]:i.checked,n.default.setByKey(t.stateKey,e)})}),t.text?(l=this.span=document.createElement("span"),l.classList.add("checkbox-caption"),Object(o._i18n)(l,t.text,t.textArgs)):e.classList.add("checkbox-without-caption"),e.append(i),t.toggle){e.classList.add("checkbox-field-toggle");const t=document.createElement("div");t.classList.add("checkbox-toggle"),e.append(t)}else{const t=document.createElement("div");t.classList.add("checkbox-box");const i=document.createElementNS("http://www.w3.org/2000/svg","svg");i.classList.add("checkbox-box-check"),i.setAttributeNS(null,"viewBox","0 0 24 24");const n=document.createElementNS("http://www.w3.org/2000/svg","use");n.setAttributeNS(null,"href","#check"),n.setAttributeNS(null,"x","-1"),i.append(n);const s=document.createElement("div");s.classList.add("checkbox-box-background");const a=document.createElement("div");a.classList.add("checkbox-box-border"),t.append(a,s,i),e.append(t)}l&&e.append(l),t.withRipple?(e.classList.add("checkbox-ripple","hover-effect"),Object(a.ripple)(e,void 0,void 0,!0)):t.withHover&&e.classList.add("hover-effect")}get checked(){return this.input.checked}set checked(t){this.setValueSilently(t);const e=new Event("change",{bubbles:!0,cancelable:!0});this.input.dispatchEvent(e)}setValueSilently(t){this.input.checked=t}toggleDisability(t){return this.label.classList.toggle("checkbox-disabled",t),()=>this.toggleDisability(!t)}}},57:function(t,e,i){"use strict";var n=i(15);const s=(t,e,i,a,o,l)=>{const{timeout:r,raf:c}=t.dataset;if(void 0!==r&&clearTimeout(+r),void 0!==c&&(window.cancelAnimationFrame(+c),l||delete t.dataset.raf),l&&n.default.settings.animationsEnabled&&a)return void(t.dataset.raf=""+window.requestAnimationFrame(()=>{delete t.dataset.raf,s(t,e,i,a,o,l-1)}));i&&e&&t.classList.add(e);const h=()=>{delete t.dataset.timeout,!i&&e&&t.classList.remove("backwards",e),t.classList.remove("animating"),o&&o()};if(!n.default.settings.animationsEnabled||!a)return t.classList.remove("animating","backwards"),void h();t.classList.add("animating"),t.classList.toggle("backwards",!i),t.dataset.timeout=""+setTimeout(h,a)};e.a=s},59:function(t,e,i){"use strict";function n(t,e){return e?t.forEach(t=>t.setAttribute("disabled","true")):t.forEach(t=>t.removeAttribute("disabled")),()=>n(t,!e)}i.d(e,"a",(function(){return n}))},61:function(t,e,i){"use strict";function n(t,e){return t.closest(e)}i.d(e,"a",(function(){return n}))},67:function(t,e,i){"use strict";i.d(e,"a",(function(){return o}));var n=i(29),s=i(31),a=i(85);function o(t,e=!0){const i=[],n=[],o=e?[]:void 0;Object(a.a)(t,i,n,void 0,void 0,o),n.length&&i.push(n.join(""));let l=i.join("\n");return l=l.replace(/\u00A0/g," "),o&&s.b.combineSameEntities(o),{value:l,entities:o}}n.a.getRichValue=o},84:function(t,e,i){"use strict";function n(t,e){return t.closest(`[${e}]`)}i.d(e,"a",(function(){return n}))},85:function(t,e,i){"use strict";i.d(e,"b",(function(){return n})),i.d(e,"a",(function(){return s}));const n={bold:{match:'[style*="font-weight"], b',entityName:"messageEntityBold"},underline:{match:'[style*="underline"], u',entityName:"messageEntityUnderline"},italic:{match:'[style*="italic"], i',entityName:"messageEntityItalic"},monospace:{match:'[style*="monospace"], [face="monospace"], pre',entityName:"messageEntityPre"},strikethrough:{match:'[style*="line-through"], strike',entityName:"messageEntityStrike"},link:{match:"A:not(.follow)",entityName:"messageEntityTextUrl"},mentionName:{match:"A.follow",entityName:"messageEntityMentionName"}};function s(t,e,i,a,o,l,r={offset:0}){if(3===t.nodeType){const e=t.nodeValue;if(a===t?i.push(e.substr(0,o)+""+e.substr(o)):i.push(e),l&&e.trim()&&t.parentNode){const i=t.parentElement;for(const t in n){const s=n[t],a=i.closest(s.match+", [contenteditable]");a&&null===a.getAttribute("contenteditable")&&("messageEntityTextUrl"===s.entityName?l.push({_:s.entityName,url:i.href,offset:r.offset,length:e.length}):"messageEntityMentionName"===s.entityName?l.push({_:s.entityName,offset:r.offset,length:e.length,user_id:i.dataset.follow.toUserId()}):l.push({_:s.entityName,offset:r.offset,length:e.length}))}}return void(r.offset+=e.length)}if(1!==t.nodeType)return;const c=a===t,h="DIV"===t.tagName||"P"===t.tagName;if(h&&i.length||"BR"===t.tagName)e.push(i.join("")),i.splice(0,i.length);else if(t instanceof HTMLImageElement){const e=t.alt;e&&(i.push(e),r.offset+=e.length)}c&&!o&&i.push("");let u=t.firstChild;for(;u;)s(u,e,i,a,o,l,r),u=u.nextSibling;c&&o&&i.push(""),h&&i.length&&(e.push(i.join("")),i.splice(0,i.length))}},88:function(t,e,i){"use strict";i.d(e,"a",(function(){return s}));var n=i(67);function s(t){return t.hasAttribute("contenteditable")||"INPUT"!==t.tagName?!Object(n.a)(t,!1).value.trim():!t.value.trim()}}}]);
//# sourceMappingURL=3.bdf444277e969e63a4c3.chunk.js.map