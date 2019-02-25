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
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/js/index.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./node_modules/yall-js/src/yall.mjs":
/*!*******************************************!*\
  !*** ./node_modules/yall-js/src/yall.mjs ***!
  \*******************************************/
/*! exports provided: default */
/***/ (function(__webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/**\n * yall.js version 2.2.2\n * Yet Another Lazy loader\n **/\n\n// The eponymous function\nfunction yall (userOptions) {\n  // Environmental stuff. Stores feature support information, as well as other\n  // stuff yall needs to refer to during operation.\n  const env = {\n    intersectionObserverSupport: \"IntersectionObserver\" in window && \"IntersectionObserverEntry\" in window && \"intersectionRatio\" in window.IntersectionObserverEntry.prototype,\n    mutationObserverSupport: \"MutationObserver\" in window,\n    idleCallbackSupport: \"requestIdleCallback\" in window,\n    eventsToBind: [\n      [document, \"scroll\"],\n      [document, \"touchmove\"],\n      [window, \"resize\"],\n      [window, \"orientationchange\"]\n    ]\n  };\n\n  // Default options, merged with user options.\n  const options = {\n    lazyClass: \"lazy\",\n    lazyBackgroundClass: \"lazy-bg\",\n    lazyBackgroundLoaded: \"lazy-bg-loaded\",\n    throttleTime: 200,\n    idlyLoad: false,\n    idleLoadTimeout: 100,\n    threshold: 200,\n    observeChanges: false,\n    observeRootSelector: \"body\",\n    mutationObserverOptions: {\n      childList: true,\n      subtree: true\n    },\n    ...userOptions\n  };\n\n  // CSS selector for all the lazy little elements.\n  const selectorString = `img.${options.lazyClass},video.${options.lazyClass},iframe.${options.lazyClass},.${options.lazyBackgroundClass}`;\n\n  // Options that get passed to requestIdleCallback\n  const idleCallbackOptions = {\n    timeout: options.idleLoadTimeout\n  };\n\n  // This small abstraction saves a few bytes.\n  const sliceCall = arr => [].slice.call(arr);\n\n  // This function handles the lazy loading of elements. It's kicked off by the\n  // scroll handlers/intersection observers further down.\n  const yallLoad = element => {\n    // Lazy load <img> elements\n    if (element.tagName === \"IMG\") {\n      let parentElement = element.parentNode;\n\n      // Is the parent element a <picture>?\n      if (parentElement.tagName === \"PICTURE\") {\n        sliceCall(parentElement.querySelectorAll(\"source\")).forEach(source => yallFlipDataAttrs(source));\n      }\n\n      yallFlipDataAttrs(element);\n    }\n\n    // Lazy load <video> elements\n    if (element.tagName === \"VIDEO\") {\n      sliceCall(element.querySelectorAll(\"source\")).forEach(source => yallFlipDataAttrs(source));\n\n      // We didn't need this before, but with the addition of lazy loading\n      // `poster` images, we need to run the flip attributes function on the\n      // video element itself so we can trigger lazy loading behavior on those.\n      yallFlipDataAttrs(element);\n\n      if (element.autoplay === true) {\n        element.load();\n      }\n    }\n\n    // Lazy load <iframe> elements\n    if (element.tagName === \"IFRAME\") {\n      yallFlipDataAttrs(element);\n    }\n\n    // Lazy load CSS background images\n    if (element.classList.contains(options.lazyBackgroundClass)) {\n      element.classList.remove(options.lazyBackgroundClass);\n      element.classList.add(options.lazyBackgroundLoaded);\n    }\n  };\n\n  // Added because there was a number of patterns like this peppered throughout\n  // the code. This just flips necessary data- attrs on an element\n  const yallFlipDataAttrs = element => {\n    // Do `srcset` first. Doing `src` first can cause loading of additional\n    // assets on Safari (and possibly other webkit browsers).\n    if (element.getAttribute(\"data-srcset\") !== null) {\n      element.setAttribute(\"srcset\", element.getAttribute(\"data-srcset\"));\n    }\n\n    if (element.getAttribute(\"data-src\") !== null) {\n      element.setAttribute(\"src\", element.getAttribute(\"data-src\"));\n    }\n\n    if (element.getAttribute(\"data-poster\") !== null) {\n      element.setAttribute(\"poster\", element.getAttribute(\"data-poster\"));\n    }\n  };\n\n  // When intersection observer is unavailable, this function is bound to scroll\n  // (and other) event handlers to load images the \"old\" way.\n  const yallBack = function() {\n    let active = false;\n\n    if (active === false && lazyElements.length > 0) {\n      active = true;\n\n      setTimeout(() => {\n        lazyElements.forEach(lazyElement => {\n          if (lazyElement.getBoundingClientRect().top <= (window.innerHeight + options.threshold) && lazyElement.getBoundingClientRect().bottom >= -(options.threshold) && getComputedStyle(lazyElement).display !== \"none\") {\n            if (options.idlyLoad === true && env.idleCallbackSupport === true) {\n              requestIdleCallback(() => {\n                yallLoad(lazyElement);\n              }, idleCallbackOptions);\n            } else {\n              yallLoad(lazyElement);\n            }\n\n            lazyElement.classList.remove(options.lazyClass);\n            lazyElements = lazyElements.filter(element => element !== lazyElement);\n          }\n        });\n\n        active = false;\n\n        if (lazyElements.length === 0 && options.observeChanges === false) {\n          env.eventsToBind.forEach(eventPair => eventPair[0].removeEventListener(eventPair[1], yallBack));\n        }\n      }, options.throttleTime);\n    }\n  };\n\n  let lazyElements = sliceCall(document.querySelectorAll(selectorString));\n\n  if (env.intersectionObserverSupport === true) {\n    var intersectionListener = new IntersectionObserver((entries, observer) => {\n      entries.forEach(entry => {\n        if (entry.isIntersecting === true || entry.intersectionRatio > 0) {\n          let element = entry.target;\n\n          if (options.idlyLoad === true && env.idleCallbackSupport === true) {\n            requestIdleCallback(() => yallLoad(element), idleCallbackOptions);\n          } else {\n            yallLoad(element);\n          }\n\n          element.classList.remove(options.lazyClass);\n          observer.unobserve(element);\n          lazyElements = lazyElements.filter(lazyElement => lazyElement !== element);\n        }\n      });\n    }, {\n      rootMargin: `${options.threshold}px 0%`\n    });\n\n    lazyElements.forEach(lazyElement => intersectionListener.observe(lazyElement));\n  } else {\n    env.eventsToBind.forEach(eventPair => eventPair[0].addEventListener(eventPair[1], yallBack));\n    yallBack();\n  }\n\n  if (env.mutationObserverSupport === true && options.observeChanges === true) {\n    new MutationObserver(mutations => mutations.forEach(() => {\n      sliceCall(document.querySelectorAll(selectorString)).forEach(newElement => {\n        if (lazyElements.indexOf(newElement) === -1) {\n          lazyElements.push(newElement);\n\n          if (env.intersectionObserverSupport === true) {\n            intersectionListener.observe(newElement);\n          } else {\n            yallBack();\n          }\n        }\n      });\n    })).observe(document.querySelector(options.observeRootSelector), options.mutationObserverOptions);\n  }\n}\n\n/* harmony default export */ __webpack_exports__[\"default\"] = (yall);\n\n\n//# sourceURL=webpack:///./node_modules/yall-js/src/yall.mjs?");

/***/ }),

/***/ "./src/js/index.js":
/*!*************************!*\
  !*** ./src/js/index.js ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const yall = __webpack_require__(/*! yall-js */ \"./node_modules/yall-js/src/yall.mjs\");\n\ndocument.addEventListener(\"DOMContentLoaded\", () => {\n  yall.default();\n});\n\n//# sourceURL=webpack:///./src/js/index.js?");

/***/ })

/******/ });