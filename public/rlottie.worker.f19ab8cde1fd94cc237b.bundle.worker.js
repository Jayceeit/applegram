/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./node_modules/ts-loader/index.js!./node_modules/ifdef-loader/ifdef-loader.js?!./src/lib/rlottie/rlottie.worker.ts");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./node_modules/ts-loader/index.js!./node_modules/ifdef-loader/ifdef-loader.js?!./src/lib/rlottie/rlottie.worker.ts":
/*!**************************************************************************************************************************!*\
  !*** ./node_modules/ts-loader!./node_modules/ifdef-loader/ifdef-loader.js??ref--5-1!./src/lib/rlottie/rlottie.worker.ts ***!
  \**************************************************************************************************************************/
/*! exports provided: RLottieItem */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "RLottieItem", function() { return RLottieItem; });
/*
 * https://github.com/morethanwords/tweb
 * Copyright (C) 2019-2021 Eduard Kuzmenko
 * https://github.com/morethanwords/tweb/blob/master/LICENSE
 */
importScripts('rlottie-wasm.js');
//import Module, { allocate, intArrayFromString } from './rlottie-wasm';
const _Module = self.Module;
const DEFAULT_FPS = 60;
class RLottieItem {
    //private context: OffscreenCanvasRenderingContext2D;
    constructor(reqId, jsString, width, height, fps /* , private canvas: OffscreenCanvas */) {
        this.reqId = reqId;
        this.width = width;
        this.height = height;
        this.fps = fps;
        this.stringOnWasmHeap = null;
        this.handle = null;
        this.frameCount = 0;
        this.dead = false;
        this.fps = Math.max(1, Math.min(60, fps || DEFAULT_FPS));
        //this.context = canvas.getContext('2d');
        this.init(jsString);
        reply('loaded', this.reqId, this.frameCount, this.fps);
        /* let frame = 0;
        setInterval(() => {
          if(frame >= this.frameCount) frame = 0;
          let _frame = frame++;
          this.render(_frame, null);
        }, 1000 / this.fps); */
    }
    init(jsString) {
        try {
            this.handle = worker.Api.init();
            // @ts-ignore
            this.stringOnWasmHeap = allocate(intArrayFromString(jsString), 'i8', 0);
            this.frameCount = worker.Api.loadFromData(this.handle, this.stringOnWasmHeap);
            worker.Api.resize(this.handle, this.width, this.height);
        }
        catch (e) {
            console.error('init RLottieItem error:', e);
            reply('error', this.reqId, e);
        }
    }
    render(frameNo, clamped) {
        if (this.dead)
            return;
        //return;
        if (this.frameCount < frameNo || frameNo < 0) {
            return;
        }
        try {
            worker.Api.render(this.handle, frameNo);
            var bufferPointer = worker.Api.buffer(this.handle);
            var data = _Module.HEAPU8.subarray(bufferPointer, bufferPointer + (this.width * this.height * 4));
            if (!clamped) {
                clamped = new Uint8ClampedArray(data);
            }
            else {
                clamped.set(data);
            }
            //this.context.putImageData(new ImageData(clamped, this.width, this.height), 0, 0);
            reply('frame', this.reqId, frameNo, clamped);
        }
        catch (e) {
            console.error('Render error:', e);
            this.dead = true;
            reply('error', this.reqId, e);
        }
    }
    destroy() {
        this.dead = true;
        worker.Api.destroy(this.handle);
    }
}
class RLottieWorker {
    constructor() {
        this.Api = {};
    }
    initApi() {
        this.Api = {
            init: _Module.cwrap('lottie_init', '', []),
            destroy: _Module.cwrap('lottie_destroy', '', ['number']),
            resize: _Module.cwrap('lottie_resize', '', ['number', 'number', 'number']),
            buffer: _Module.cwrap('lottie_buffer', 'number', ['number']),
            render: _Module.cwrap('lottie_render', '', ['number', 'number']),
            loadFromData: _Module.cwrap('lottie_load_from_data', 'number', ['number', 'number']),
        };
    }
    init() {
        this.initApi();
        reply('ready');
    }
}
const worker = new RLottieWorker();
_Module.onRuntimeInitialized = function () {
    worker.init();
};
const items = {};
const queryableFunctions = {
    loadFromData: function (reqId, jsString, width, height /* , canvas: OffscreenCanvas */) {
        try {
            // ! WARNING, с этой проверкой не все стикеры работают, например - ДУРКА
            /* if(!/"tgs":\s*?1./.test(jsString)) {
              throw new Error('Invalid file');
            } */
            /* let perf = performance.now();
            let json = JSON.parse(jsString);
            console.log('sticker decode:', performance.now() - perf); */
            const match = jsString.match(/"fr":\s*?(\d+?),/);
            const frameRate = +(match === null || match === void 0 ? void 0 : match[1]) || DEFAULT_FPS;
            //console.log('Rendering sticker:', reqId, frameRate, 'now rendered:', Object.keys(items).length);
            items[reqId] = new RLottieItem(reqId, jsString, width, height, frameRate /* , canvas */);
        }
        catch (e) {
            console.error('Invalid file for sticker:', jsString);
            reply('error', reqId, e);
        }
    },
    destroy: function (reqId) {
        if (!items.hasOwnProperty(reqId)) {
            return;
        }
        items[reqId].destroy();
        delete items[reqId];
    },
    renderFrame: function (reqId, frameNo, clamped) {
        //console.log('worker renderFrame', reqId, frameNo, clamped);
        items[reqId].render(frameNo, clamped);
    }
};
function defaultReply(message) {
    // your default PUBLIC function executed only when main page calls the queryableWorker.postMessage() method directly
    // do something
}
/**
 * Returns true when run in WebKit derived browsers.
 * This is used as a workaround for a memory leak in Safari caused by using Transferable objects to
 * transfer data between WebWorkers and the main thread.
 * https://github.com/mapbox/mapbox-gl-js/issues/8771
 *
 * This should be removed once the underlying Safari issue is fixed.
 *
 * @private
 * @param scope {WindowOrWorkerGlobalScope} Since this function is used both on the main thread and WebWorker context,
 *      let the calling scope pass in the global scope object.
 * @returns {boolean}
 */
let _isSafari = null;
function isSafari(scope) {
    if (_isSafari === null) {
        const userAgent = scope.navigator ? scope.navigator.userAgent : null;
        _isSafari = !!scope.safari ||
            !!(userAgent && (/\b(iPad|iPhone|iPod)\b/.test(userAgent) || (!!userAgent.match('Safari') && !userAgent.match('Chrome'))));
    }
    return _isSafari;
}
function reply(...args) {
    if (arguments.length < 1) {
        throw new TypeError('reply - not enough arguments');
    }
    //if(arguments[0] === 'frame') return;
    var args = Array.prototype.slice.call(arguments, 1);
    if (isSafari(self)) {
        postMessage({ 'queryMethodListener': arguments[0], 'queryMethodArguments': args });
    }
    else {
        var transfer = [];
        for (var i = 0; i < args.length; i++) {
            if (args[i] instanceof ArrayBuffer) {
                transfer.push(args[i]);
            }
            if (args[i].buffer && args[i].buffer instanceof ArrayBuffer) {
                transfer.push(args[i].buffer);
                //args[i] = args[i].buffer;
            }
        }
        postMessage({ 'queryMethodListener': arguments[0], 'queryMethodArguments': args }, transfer);
    }
    //postMessage({ 'queryMethodListener': arguments[0], 'queryMethodArguments': Array.prototype.slice.call(arguments, 1) });
    //console.error(transfer, args);
}
onmessage = function (oEvent) {
    if (oEvent.data instanceof Object && oEvent.data.hasOwnProperty('queryMethod') && oEvent.data.hasOwnProperty('queryMethodArguments')) {
        // @ts-ignore
        queryableFunctions[oEvent.data.queryMethod].apply(self, oEvent.data.queryMethodArguments);
    }
    else {
        defaultReply(oEvent.data);
    }
};


/***/ })

/******/ });
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vc3JjL2xpYi9ybG90dGllL3Jsb3R0aWUud29ya2VyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7UUFBQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7UUFDQTs7O1FBR0E7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBLDBDQUEwQyxnQ0FBZ0M7UUFDMUU7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQSx3REFBd0Qsa0JBQWtCO1FBQzFFO1FBQ0EsaURBQWlELGNBQWM7UUFDL0Q7O1FBRUE7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBLHlDQUF5QyxpQ0FBaUM7UUFDMUUsZ0hBQWdILG1CQUFtQixFQUFFO1FBQ3JJO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0EsMkJBQTJCLDBCQUEwQixFQUFFO1FBQ3ZELGlDQUFpQyxlQUFlO1FBQ2hEO1FBQ0E7UUFDQTs7UUFFQTtRQUNBLHNEQUFzRCwrREFBK0Q7O1FBRXJIO1FBQ0E7OztRQUdBO1FBQ0E7Ozs7Ozs7Ozs7Ozs7QUNsRkE7QUFBQTtBQUFBOzs7O0dBSUc7QUFFSCxhQUFhLENBQUMsaUJBQWlCLENBQUMsQ0FBQztBQUNqQyx3RUFBd0U7QUFFeEUsTUFBTSxPQUFPLEdBQUksSUFBWSxDQUFDLE1BQWEsQ0FBQztBQUU1QyxNQUFNLFdBQVcsR0FBRyxFQUFFLENBQUM7QUFFaEIsTUFBTSxXQUFXO0lBTXRCLHFEQUFxRDtJQUVyRCxZQUFvQixLQUFhLEVBQUUsUUFBZ0IsRUFBVSxLQUFhLEVBQVUsTUFBYyxFQUFVLEdBQVcsd0NBQXVDO1FBQTFJLFVBQUssR0FBTCxLQUFLLENBQVE7UUFBNEIsVUFBSyxHQUFMLEtBQUss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Q0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUM7S0FDM0I7QUFDSCxDQUFDLENBQUMiLCJmaWxlIjoicmxvdHRpZS53b3JrZXIuZjE5YWI4Y2RlMWZkOTRjYzIzN2IuYnVuZGxlLndvcmtlci5qcyIsInNvdXJjZXNDb250ZW50IjpbIiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKSB7XG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG4gXHRcdH1cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGk6IG1vZHVsZUlkLFxuIFx0XHRcdGw6IGZhbHNlLFxuIFx0XHRcdGV4cG9ydHM6IHt9XG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmwgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb24gZm9yIGhhcm1vbnkgZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kID0gZnVuY3Rpb24oZXhwb3J0cywgbmFtZSwgZ2V0dGVyKSB7XG4gXHRcdGlmKCFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywgbmFtZSkpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgbmFtZSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGdldHRlciB9KTtcbiBcdFx0fVxuIFx0fTtcblxuIFx0Ly8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5yID0gZnVuY3Rpb24oZXhwb3J0cykge1xuIFx0XHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcbiBcdFx0fVxuIFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xuIFx0fTtcblxuIFx0Ly8gY3JlYXRlIGEgZmFrZSBuYW1lc3BhY2Ugb2JqZWN0XG4gXHQvLyBtb2RlICYgMTogdmFsdWUgaXMgYSBtb2R1bGUgaWQsIHJlcXVpcmUgaXRcbiBcdC8vIG1vZGUgJiAyOiBtZXJnZSBhbGwgcHJvcGVydGllcyBvZiB2YWx1ZSBpbnRvIHRoZSBuc1xuIFx0Ly8gbW9kZSAmIDQ6IHJldHVybiB2YWx1ZSB3aGVuIGFscmVhZHkgbnMgb2JqZWN0XG4gXHQvLyBtb2RlICYgOHwxOiBiZWhhdmUgbGlrZSByZXF1aXJlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnQgPSBmdW5jdGlvbih2YWx1ZSwgbW9kZSkge1xuIFx0XHRpZihtb2RlICYgMSkgdmFsdWUgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKHZhbHVlKTtcbiBcdFx0aWYobW9kZSAmIDgpIHJldHVybiB2YWx1ZTtcbiBcdFx0aWYoKG1vZGUgJiA0KSAmJiB0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnICYmIHZhbHVlICYmIHZhbHVlLl9fZXNNb2R1bGUpIHJldHVybiB2YWx1ZTtcbiBcdFx0dmFyIG5zID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5yKG5zKTtcbiBcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KG5zLCAnZGVmYXVsdCcsIHsgZW51bWVyYWJsZTogdHJ1ZSwgdmFsdWU6IHZhbHVlIH0pO1xuIFx0XHRpZihtb2RlICYgMiAmJiB0eXBlb2YgdmFsdWUgIT0gJ3N0cmluZycpIGZvcih2YXIga2V5IGluIHZhbHVlKSBfX3dlYnBhY2tfcmVxdWlyZV9fLmQobnMsIGtleSwgZnVuY3Rpb24oa2V5KSB7IHJldHVybiB2YWx1ZVtrZXldOyB9LmJpbmQobnVsbCwga2V5KSk7XG4gXHRcdHJldHVybiBucztcbiBcdH07XG5cbiBcdC8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSBmdW5jdGlvbihtb2R1bGUpIHtcbiBcdFx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0RGVmYXVsdCgpIHsgcmV0dXJuIG1vZHVsZVsnZGVmYXVsdCddOyB9IDpcbiBcdFx0XHRmdW5jdGlvbiBnZXRNb2R1bGVFeHBvcnRzKCkgeyByZXR1cm4gbW9kdWxlOyB9O1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCAnYScsIGdldHRlcik7XG4gXHRcdHJldHVybiBnZXR0ZXI7XG4gXHR9O1xuXG4gXHQvLyBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGxcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubyA9IGZ1bmN0aW9uKG9iamVjdCwgcHJvcGVydHkpIHsgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIHByb3BlcnR5KTsgfTtcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXyhfX3dlYnBhY2tfcmVxdWlyZV9fLnMgPSBcIi4vbm9kZV9tb2R1bGVzL3RzLWxvYWRlci9pbmRleC5qcyEuL25vZGVfbW9kdWxlcy9pZmRlZi1sb2FkZXIvaWZkZWYtbG9hZGVyLmpzPyEuL3NyYy9saWIvcmxvdHRpZS9ybG90dGllLndvcmtlci50c1wiKTtcbiIsIi8qXHJcbiAqIGh0dHBzOi8vZ2l0aHViLmNvbS9tb3JldGhhbndvcmRzL3R3ZWJcclxuICogQ29weXJpZ2h0IChDKSAyMDE5LTIwMjEgRWR1YXJkIEt1em1lbmtvXHJcbiAqIGh0dHBzOi8vZ2l0aHViLmNvbS9tb3JldGhhbndvcmRzL3R3ZWIvYmxvYi9tYXN0ZXIvTElDRU5TRVxyXG4gKi9cclxuXHJcbmltcG9ydFNjcmlwdHMoJ3Jsb3R0aWUtd2FzbS5qcycpO1xyXG4vL2ltcG9ydCBNb2R1bGUsIHsgYWxsb2NhdGUsIGludEFycmF5RnJvbVN0cmluZyB9IGZyb20gJy4vcmxvdHRpZS13YXNtJztcclxuXHJcbmNvbnN0IF9Nb2R1bGUgPSAoc2VsZiBhcyBhbnkpLk1vZHVsZSBhcyBhbnk7XHJcblxyXG5jb25zdCBERUZBVUxUX0ZQUyA9IDYwO1xyXG5cclxuZXhwb3J0IGNsYXNzIFJMb3R0aWVJdGVtIHtcclxuICBwcml2YXRlIHN0cmluZ09uV2FzbUhlYXA6IGFueSA9IG51bGw7XHJcbiAgcHJpdmF0ZSBoYW5kbGU6IGFueSA9IG51bGw7XHJcbiAgcHJpdmF0ZSBmcmFtZUNvdW50ID0gMDtcclxuXHJcbiAgcHJpdmF0ZSBkZWFkID0gZmFsc2U7XHJcbiAgLy9wcml2YXRlIGNvbnRleHQ6IE9mZnNjcmVlbkNhbnZhc1JlbmRlcmluZ0NvbnRleHQyRDtcclxuXHJcbiAgY29uc3RydWN0b3IocHJpdmF0ZSByZXFJZDogbnVtYmVyLCBqc1N0cmluZzogc3RyaW5nLCBwcml2YXRlIHdpZHRoOiBudW1iZXIsIHByaXZhdGUgaGVpZ2h0OiBudW1iZXIsIHByaXZhdGUgZnBzOiBudW1iZXIvKiAsIHByaXZhdGUgY2FudmFzOiBPZmZzY3JlZW5DYW52YXMgKi8pIHtcclxuICAgIHRoaXMuZnBzID0gTWF0aC5tYXgoMSwgTWF0aC5taW4oNjAsIGZwcyB8fCBERUZBVUxUX0ZQUykpO1xyXG5cclxuICAgIC8vdGhpcy5jb250ZXh0ID0gY2FudmFzLmdldENvbnRleHQoJzJkJyk7XHJcblxyXG4gICAgdGhpcy5pbml0KGpzU3RyaW5nKTtcclxuXHJcbiAgICByZXBseSgnbG9hZGVkJywgdGhpcy5yZXFJZCwgdGhpcy5mcmFtZUNvdW50LCB0aGlzLmZwcyk7XHJcblxyXG4gICAgLyogbGV0IGZyYW1lID0gMDtcclxuICAgIHNldEludGVydmFsKCgpID0+IHtcclxuICAgICAgaWYoZnJhbWUgPj0gdGhpcy5mcmFtZUNvdW50KSBmcmFtZSA9IDA7XHJcbiAgICAgIGxldCBfZnJhbWUgPSBmcmFtZSsrO1xyXG4gICAgICB0aGlzLnJlbmRlcihfZnJhbWUsIG51bGwpO1xyXG4gICAgfSwgMTAwMCAvIHRoaXMuZnBzKTsgKi9cclxuICB9XHJcblxyXG4gIHByaXZhdGUgaW5pdChqc1N0cmluZzogc3RyaW5nKSB7XHJcbiAgICB0cnkge1xyXG4gICAgICB0aGlzLmhhbmRsZSA9IHdvcmtlci5BcGkuaW5pdCgpO1xyXG4gIFxyXG4gICAgICAvLyBAdHMtaWdub3JlXHJcbiAgICAgIHRoaXMuc3RyaW5nT25XYXNtSGVhcCA9IGFsbG9jYXRlKGludEFycmF5RnJvbVN0cmluZyhqc1N0cmluZyksICdpOCcsIDApO1xyXG4gIFxyXG4gICAgICB0aGlzLmZyYW1lQ291bnQgPSB3b3JrZXIuQXBpLmxvYWRGcm9tRGF0YSh0aGlzLmhhbmRsZSwgdGhpcy5zdHJpbmdPbldhc21IZWFwKTtcclxuICBcclxuICAgICAgd29ya2VyLkFwaS5yZXNpemUodGhpcy5oYW5kbGUsIHRoaXMud2lkdGgsIHRoaXMuaGVpZ2h0KTtcclxuICAgIH0gY2F0Y2goZSkge1xyXG4gICAgICBjb25zb2xlLmVycm9yKCdpbml0IFJMb3R0aWVJdGVtIGVycm9yOicsIGUpO1xyXG4gICAgICByZXBseSgnZXJyb3InLCB0aGlzLnJlcUlkLCBlKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHB1YmxpYyByZW5kZXIoZnJhbWVObzogbnVtYmVyLCBjbGFtcGVkOiBVaW50OENsYW1wZWRBcnJheSkge1xyXG4gICAgaWYodGhpcy5kZWFkKSByZXR1cm47XHJcbiAgICAvL3JldHVybjtcclxuICBcclxuICAgIGlmKHRoaXMuZnJhbWVDb3VudCA8IGZyYW1lTm8gfHwgZnJhbWVObyA8IDApIHtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG4gIFxyXG4gICAgdHJ5IHtcclxuICAgICAgd29ya2VyLkFwaS5yZW5kZXIodGhpcy5oYW5kbGUsIGZyYW1lTm8pO1xyXG4gIFxyXG4gICAgICB2YXIgYnVmZmVyUG9pbnRlciA9IHdvcmtlci5BcGkuYnVmZmVyKHRoaXMuaGFuZGxlKTtcclxuICBcclxuICAgICAgdmFyIGRhdGEgPSBfTW9kdWxlLkhFQVBVOC5zdWJhcnJheShidWZmZXJQb2ludGVyLCBidWZmZXJQb2ludGVyICsgKHRoaXMud2lkdGggKiB0aGlzLmhlaWdodCAqIDQpKTtcclxuICBcclxuICAgICAgaWYoIWNsYW1wZWQpIHtcclxuICAgICAgICBjbGFtcGVkID0gbmV3IFVpbnQ4Q2xhbXBlZEFycmF5KGRhdGEpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGNsYW1wZWQuc2V0KGRhdGEpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICAvL3RoaXMuY29udGV4dC5wdXRJbWFnZURhdGEobmV3IEltYWdlRGF0YShjbGFtcGVkLCB0aGlzLndpZHRoLCB0aGlzLmhlaWdodCksIDAsIDApO1xyXG4gIFxyXG4gICAgICByZXBseSgnZnJhbWUnLCB0aGlzLnJlcUlkLCBmcmFtZU5vLCBjbGFtcGVkKTtcclxuICAgIH0gY2F0Y2goZSkge1xyXG4gICAgICBjb25zb2xlLmVycm9yKCdSZW5kZXIgZXJyb3I6JywgZSk7XHJcbiAgICAgIHRoaXMuZGVhZCA9IHRydWU7XHJcbiAgICAgIHJlcGx5KCdlcnJvcicsIHRoaXMucmVxSWQsIGUpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcHVibGljIGRlc3Ryb3koKSB7XHJcbiAgICB0aGlzLmRlYWQgPSB0cnVlO1xyXG5cclxuICAgIHdvcmtlci5BcGkuZGVzdHJveSh0aGlzLmhhbmRsZSk7XHJcbiAgfVxyXG59XHJcblxyXG5jbGFzcyBSTG90dGllV29ya2VyIHtcclxuICBwdWJsaWMgQXBpOiBhbnkgPSB7fTtcclxuXHJcbiAgcHVibGljIGluaXRBcGkoKSB7XHJcbiAgICB0aGlzLkFwaSA9IHtcclxuICAgICAgaW5pdDogX01vZHVsZS5jd3JhcCgnbG90dGllX2luaXQnLCAnJywgW10pLFxyXG4gICAgICBkZXN0cm95OiBfTW9kdWxlLmN3cmFwKCdsb3R0aWVfZGVzdHJveScsICcnLCBbJ251bWJlciddKSxcclxuICAgICAgcmVzaXplOiBfTW9kdWxlLmN3cmFwKCdsb3R0aWVfcmVzaXplJywgJycsIFsnbnVtYmVyJywgJ251bWJlcicsICdudW1iZXInXSksXHJcbiAgICAgIGJ1ZmZlcjogX01vZHVsZS5jd3JhcCgnbG90dGllX2J1ZmZlcicsICdudW1iZXInLCBbJ251bWJlciddKSxcclxuICAgICAgcmVuZGVyOiBfTW9kdWxlLmN3cmFwKCdsb3R0aWVfcmVuZGVyJywgJycsIFsnbnVtYmVyJywgJ251bWJlciddKSxcclxuICAgICAgbG9hZEZyb21EYXRhOiBfTW9kdWxlLmN3cmFwKCdsb3R0aWVfbG9hZF9mcm9tX2RhdGEnLCAnbnVtYmVyJywgWydudW1iZXInLCAnbnVtYmVyJ10pLFxyXG4gICAgfTtcclxuICB9XHJcblxyXG4gIHB1YmxpYyBpbml0KCkge1xyXG4gICAgdGhpcy5pbml0QXBpKCk7XHJcbiAgICByZXBseSgncmVhZHknKTtcclxuICB9XHJcbn1cclxuXHJcbmNvbnN0IHdvcmtlciA9IG5ldyBSTG90dGllV29ya2VyKCk7XHJcblxyXG5fTW9kdWxlLm9uUnVudGltZUluaXRpYWxpemVkID0gZnVuY3Rpb24oKSB7XHJcbiAgd29ya2VyLmluaXQoKTtcclxufTtcclxuXHJcbmNvbnN0IGl0ZW1zOiB7W3JlcUlkOiBzdHJpbmddOiBSTG90dGllSXRlbX0gPSB7fTtcclxuY29uc3QgcXVlcnlhYmxlRnVuY3Rpb25zID0ge1xyXG4gIGxvYWRGcm9tRGF0YTogZnVuY3Rpb24ocmVxSWQ6IG51bWJlciwganNTdHJpbmc6IHN0cmluZywgd2lkdGg6IG51bWJlciwgaGVpZ2h0OiBudW1iZXIvKiAsIGNhbnZhczogT2Zmc2NyZWVuQ2FudmFzICovKSB7XHJcbiAgICB0cnkge1xyXG4gICAgICAvLyAhIFdBUk5JTkcsINGBINGN0YLQvtC5INC/0YDQvtCy0LXRgNC60L7QuSDQvdC1INCy0YHQtSDRgdGC0LjQutC10YDRiyDRgNCw0LHQvtGC0LDRjtGCLCDQvdCw0L/RgNC40LzQtdGAIC0g0JTQo9Cg0JrQkFxyXG4gICAgICAvKiBpZighL1widGdzXCI6XFxzKj8xLi8udGVzdChqc1N0cmluZykpIHtcclxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0ludmFsaWQgZmlsZScpO1xyXG4gICAgICB9ICovXHJcblxyXG4gICAgICAvKiBsZXQgcGVyZiA9IHBlcmZvcm1hbmNlLm5vdygpO1xyXG4gICAgICBsZXQganNvbiA9IEpTT04ucGFyc2UoanNTdHJpbmcpO1xyXG4gICAgICBjb25zb2xlLmxvZygnc3RpY2tlciBkZWNvZGU6JywgcGVyZm9ybWFuY2Uubm93KCkgLSBwZXJmKTsgKi9cclxuXHJcbiAgICAgIGNvbnN0IG1hdGNoID0ganNTdHJpbmcubWF0Y2goL1wiZnJcIjpcXHMqPyhcXGQrPyksLyk7XHJcbiAgICAgIGNvbnN0IGZyYW1lUmF0ZSA9ICttYXRjaD8uWzFdIHx8IERFRkFVTFRfRlBTO1xyXG5cclxuICAgICAgLy9jb25zb2xlLmxvZygnUmVuZGVyaW5nIHN0aWNrZXI6JywgcmVxSWQsIGZyYW1lUmF0ZSwgJ25vdyByZW5kZXJlZDonLCBPYmplY3Qua2V5cyhpdGVtcykubGVuZ3RoKTtcclxuXHJcbiAgICAgIGl0ZW1zW3JlcUlkXSA9IG5ldyBSTG90dGllSXRlbShyZXFJZCwganNTdHJpbmcsIHdpZHRoLCBoZWlnaHQsIGZyYW1lUmF0ZS8qICwgY2FudmFzICovKTtcclxuICAgIH0gY2F0Y2goZSkge1xyXG4gICAgICBjb25zb2xlLmVycm9yKCdJbnZhbGlkIGZpbGUgZm9yIHN0aWNrZXI6JywganNTdHJpbmcpO1xyXG4gICAgICByZXBseSgnZXJyb3InLCByZXFJZCwgZSk7XHJcbiAgICB9XHJcbiAgfSxcclxuICBkZXN0cm95OiBmdW5jdGlvbihyZXFJZDogbnVtYmVyKSB7XHJcbiAgICBpZighaXRlbXMuaGFzT3duUHJvcGVydHkocmVxSWQpKSB7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICBpdGVtc1tyZXFJZF0uZGVzdHJveSgpO1xyXG4gICAgZGVsZXRlIGl0ZW1zW3JlcUlkXTtcclxuICB9LFxyXG4gIHJlbmRlckZyYW1lOiBmdW5jdGlvbihyZXFJZDogbnVtYmVyLCBmcmFtZU5vOiBudW1iZXIsIGNsYW1wZWQ6IFVpbnQ4Q2xhbXBlZEFycmF5KSB7XHJcbiAgICAvL2NvbnNvbGUubG9nKCd3b3JrZXIgcmVuZGVyRnJhbWUnLCByZXFJZCwgZnJhbWVObywgY2xhbXBlZCk7XHJcbiAgICBpdGVtc1tyZXFJZF0ucmVuZGVyKGZyYW1lTm8sIGNsYW1wZWQpO1xyXG4gIH1cclxufTtcclxuXHJcbmZ1bmN0aW9uIGRlZmF1bHRSZXBseShtZXNzYWdlOiBhbnkpIHtcclxuICAvLyB5b3VyIGRlZmF1bHQgUFVCTElDIGZ1bmN0aW9uIGV4ZWN1dGVkIG9ubHkgd2hlbiBtYWluIHBhZ2UgY2FsbHMgdGhlIHF1ZXJ5YWJsZVdvcmtlci5wb3N0TWVzc2FnZSgpIG1ldGhvZCBkaXJlY3RseVxyXG4gIC8vIGRvIHNvbWV0aGluZ1xyXG59XHJcblxyXG4vKipcclxuICogUmV0dXJucyB0cnVlIHdoZW4gcnVuIGluIFdlYktpdCBkZXJpdmVkIGJyb3dzZXJzLlxyXG4gKiBUaGlzIGlzIHVzZWQgYXMgYSB3b3JrYXJvdW5kIGZvciBhIG1lbW9yeSBsZWFrIGluIFNhZmFyaSBjYXVzZWQgYnkgdXNpbmcgVHJhbnNmZXJhYmxlIG9iamVjdHMgdG9cclxuICogdHJhbnNmZXIgZGF0YSBiZXR3ZWVuIFdlYldvcmtlcnMgYW5kIHRoZSBtYWluIHRocmVhZC5cclxuICogaHR0cHM6Ly9naXRodWIuY29tL21hcGJveC9tYXBib3gtZ2wtanMvaXNzdWVzLzg3NzFcclxuICpcclxuICogVGhpcyBzaG91bGQgYmUgcmVtb3ZlZCBvbmNlIHRoZSB1bmRlcmx5aW5nIFNhZmFyaSBpc3N1ZSBpcyBmaXhlZC5cclxuICpcclxuICogQHByaXZhdGVcclxuICogQHBhcmFtIHNjb3BlIHtXaW5kb3dPcldvcmtlckdsb2JhbFNjb3BlfSBTaW5jZSB0aGlzIGZ1bmN0aW9uIGlzIHVzZWQgYm90aCBvbiB0aGUgbWFpbiB0aHJlYWQgYW5kIFdlYldvcmtlciBjb250ZXh0LFxyXG4gKiAgICAgIGxldCB0aGUgY2FsbGluZyBzY29wZSBwYXNzIGluIHRoZSBnbG9iYWwgc2NvcGUgb2JqZWN0LlxyXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn1cclxuICovXHJcbmxldCBfaXNTYWZhcmk6IGJvb2xlYW4gPSBudWxsO1xyXG5mdW5jdGlvbiBpc1NhZmFyaShzY29wZTogYW55KSB7XHJcbiAgaWYoX2lzU2FmYXJpID09PSBudWxsKSB7XHJcbiAgICBjb25zdCB1c2VyQWdlbnQgPSBzY29wZS5uYXZpZ2F0b3IgPyBzY29wZS5uYXZpZ2F0b3IudXNlckFnZW50IDogbnVsbDtcclxuICAgIF9pc1NhZmFyaSA9ICEhc2NvcGUuc2FmYXJpIHx8XHJcbiAgICAhISh1c2VyQWdlbnQgJiYgKC9cXGIoaVBhZHxpUGhvbmV8aVBvZClcXGIvLnRlc3QodXNlckFnZW50KSB8fCAoISF1c2VyQWdlbnQubWF0Y2goJ1NhZmFyaScpICYmICF1c2VyQWdlbnQubWF0Y2goJ0Nocm9tZScpKSkpO1xyXG4gIH1cclxuICByZXR1cm4gX2lzU2FmYXJpO1xyXG59XHJcblxyXG5mdW5jdGlvbiByZXBseSguLi5hcmdzOiBhbnlbXSkge1xyXG4gIGlmKGFyZ3VtZW50cy5sZW5ndGggPCAxKSB7IFxyXG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcigncmVwbHkgLSBub3QgZW5vdWdoIGFyZ3VtZW50cycpOyBcclxuICB9XHJcblxyXG4gIC8vaWYoYXJndW1lbnRzWzBdID09PSAnZnJhbWUnKSByZXR1cm47XHJcblxyXG4gIHZhciBhcmdzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAxKTtcclxuICBpZihpc1NhZmFyaShzZWxmKSkge1xyXG4gICAgcG9zdE1lc3NhZ2UoeyAncXVlcnlNZXRob2RMaXN0ZW5lcic6IGFyZ3VtZW50c1swXSwgJ3F1ZXJ5TWV0aG9kQXJndW1lbnRzJzogYXJncyB9KTtcclxuICB9IGVsc2Uge1xyXG4gICAgdmFyIHRyYW5zZmVyID0gW107XHJcbiAgICBmb3IodmFyIGkgPSAwOyBpIDwgYXJncy5sZW5ndGg7IGkrKykge1xyXG4gICAgICBpZihhcmdzW2ldIGluc3RhbmNlb2YgQXJyYXlCdWZmZXIpIHtcclxuICAgICAgICB0cmFuc2Zlci5wdXNoKGFyZ3NbaV0pO1xyXG4gICAgICB9XHJcbiAgXHJcbiAgICAgIGlmKGFyZ3NbaV0uYnVmZmVyICYmIGFyZ3NbaV0uYnVmZmVyIGluc3RhbmNlb2YgQXJyYXlCdWZmZXIpIHtcclxuICAgICAgICB0cmFuc2Zlci5wdXNoKGFyZ3NbaV0uYnVmZmVyKTtcclxuICAgICAgICAvL2FyZ3NbaV0gPSBhcmdzW2ldLmJ1ZmZlcjtcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHBvc3RNZXNzYWdlKHsgJ3F1ZXJ5TWV0aG9kTGlzdGVuZXInOiBhcmd1bWVudHNbMF0sICdxdWVyeU1ldGhvZEFyZ3VtZW50cyc6IGFyZ3MgfSwgdHJhbnNmZXIpO1xyXG4gIH1cclxuXHJcbiAgLy9wb3N0TWVzc2FnZSh7ICdxdWVyeU1ldGhvZExpc3RlbmVyJzogYXJndW1lbnRzWzBdLCAncXVlcnlNZXRob2RBcmd1bWVudHMnOiBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpIH0pO1xyXG4gIC8vY29uc29sZS5lcnJvcih0cmFuc2ZlciwgYXJncyk7XHJcbn1cclxuXHJcbm9ubWVzc2FnZSA9IGZ1bmN0aW9uKG9FdmVudCkge1xyXG4gIGlmKG9FdmVudC5kYXRhIGluc3RhbmNlb2YgT2JqZWN0ICYmIG9FdmVudC5kYXRhLmhhc093blByb3BlcnR5KCdxdWVyeU1ldGhvZCcpICYmIG9FdmVudC5kYXRhLmhhc093blByb3BlcnR5KCdxdWVyeU1ldGhvZEFyZ3VtZW50cycpKSB7XHJcbiAgICAvLyBAdHMtaWdub3JlXHJcbiAgICBxdWVyeWFibGVGdW5jdGlvbnNbb0V2ZW50LmRhdGEucXVlcnlNZXRob2RdLmFwcGx5KHNlbGYsIG9FdmVudC5kYXRhLnF1ZXJ5TWV0aG9kQXJndW1lbnRzKTtcclxuICB9IGVsc2Uge1xyXG4gICAgZGVmYXVsdFJlcGx5KG9FdmVudC5kYXRhKTtcclxuICB9XHJcbn07XHJcbiJdLCJzb3VyY2VSb290IjoiIn0=