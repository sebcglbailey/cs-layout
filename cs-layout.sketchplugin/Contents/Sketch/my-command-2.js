var that = this;
function __skpm_run (key, context) {
  that.context = context;

var exports =
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
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/my-command-2.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/my-command-2.js":
/*!*****************************!*\
  !*** ./src/my-command-2.js ***!
  \*****************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var sketch__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! sketch */ "sketch");
/* harmony import */ var sketch__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(sketch__WEBPACK_IMPORTED_MODULE_0__);

var bottom = 0,
    margin = 0;
var lastLayerIsText = false;
var baselineOffset = 0;
var capHeightRatio = 0.7;
var baselineOffsetRatio = 0.17;
var capHeightOffsetRatio = 0.13; // Run the plugin

/* harmony default export */ __webpack_exports__["default"] = (function (context) {
  var doc = sketch__WEBPACK_IMPORTED_MODULE_0___default.a.fromNative(context.document);
  var layers = doc ? doc.selectedLayers : null;
  layers = layers ? layers.layers : null; // is the seletion an artboard?

  var isArtboard = layers && layers[0] && layers[0].type && layers[0].type == "Artboard" ? true : false;

  if (!isArtboard) {
    sketch__WEBPACK_IMPORTED_MODULE_0___default.a.UI.message("Please select an artboard");
    return;
  } // get the artboards layers


  var artboard = layers[0];
  layers = artboard.layers;
  iterateLayers(layers); // artboard.adjustToFit()
}); // iterate over given array of layers

var iterateLayers = function iterateLayers(layers) {
  layers.reverse();
  var i = 0;

  while (i < layers.length) {
    var layer = layers[i];
    setMargin(layer);
    checkIfTop(layer);
    place(layer);
    var isGroup = checkIfGroup(layer);

    if (isGroup) {
      setDefaults();
      var groupLayers = layer.layers;
      iterateLayers(groupLayers);
      layer.adjustToFit();
    }

    if (checkIfText(layer)) {
      lastLayerIsText = true;
    } else if (checkIfGroup(layer)) {
      lastLayerIsText = lastLayerIsText;
    } else {
      lastLayerIsText = false;
    }

    setBottom(layer, lastLayerIsText);
    i++;
  }

  layers.reverse();
};

var roundToNearest = function roundToNearest(value, near) {
  if (value % near < 1) {
    return value + (near - value % near) - near;
  } else {
    return value + (near - value % near);
  }
}; // setting the margin value


var setMargin = function setMargin(layer) {
  margin = getMargin(layer.name);
};

var getMargin = function getMargin(name) {
  var marginString = name.split("[margin:")[1];
  marginString = marginString ? marginString.split("]")[0] : null;
  return Number(marginString) ? Number(marginString) : 0;
}; // setting the bottom value


var setBottom = function setBottom(layer, isText) {
  bottom = layer.frame.y + layer.frame.height;

  if (checkIfText(layer)) {
    var capHeightOffset = getCapHeightOffset(layer);
    var fontSize = layer.style.fontSize;
    var capHeight = fontSize * capHeightRatio;
    var baseline = capHeightOffset + capHeight;
    baselineOffset = layer.style.lineHeight - Math.round(baseline);
  } else if (isText) {
    baselineOffset = baselineOffset;
  } else {
    bottom = layer.frame.y + layer.frame.height;
    baselineOffset = 0;
  }
};

var getCapHeightOffset = function getCapHeightOffset(layer) {
  var offset;
  var fontSize = layer.style.fontSize;
  var lineHeight = layer.style.lineHeight;
  var diff = lineHeight - fontSize;

  if (diff % 2 == 0) {
    offset = diff / 2;
  } else {
    offset = (diff + 1) / 2;
  }

  offset += fontSize * capHeightOffsetRatio;
  return offset;
}; // place the layer based on current position and margin


var place = function place(layer) {
  var position = bottom + margin;

  if (layer.type == "Text") {
    position -= getCapHeightOffset(layer);
  }

  layer.frame.y = Math.round(position) - baselineOffset;

  if (layer.type == "Text") {
    var capHeightOffset = getCapHeightOffset(layer);
    var fontSize = layer.style.fontSize;
    var capHeight = fontSize * capHeightRatio;
    var _position = layer.frame.y;
    var baseline = layer.frame.y + capHeightOffset + capHeight;

    if (baseline % 4 < 1.2) {
      layer.frame.y = Math.round(_position - baseline % 4);
    } else {
      layer.frame.y = Math.round(_position + (4 - baseline % 4));
    }
  }

  baselineOffset = 0;
}; // check if the layer is a group


var checkIfGroup = function checkIfGroup(layer) {
  return layer.type == "Group";
};

var checkIfText = function checkIfText(layer) {
  return layer.type == "Text";
}; // reset the position and margin to default (0)


var setDefaults = function setDefaults() {
  bottom = 0;
  margin = 0;
}; // checks to see if the layer has is stuck to the top of its group


var checkIfTop = function checkIfTop(layer) {
  if (layer.name && layer.name.includes("[top]")) {
    bottom = 0;
    baselineOffset = 0;
  }
};

/***/ }),

/***/ "sketch":
/*!*************************!*\
  !*** external "sketch" ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("sketch");

/***/ })

/******/ });
  if (key === 'default' && typeof exports === 'function') {
    exports(context);
  } else {
    exports[key](context);
  }
}
that['onRun'] = __skpm_run.bind(this, 'default')

//# sourceMappingURL=my-command-2.js.map