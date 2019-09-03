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
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/my-command.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/my-command.js":
/*!***************************!*\
  !*** ./src/my-command.js ***!
  \***************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var sketch__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! sketch */ "sketch");
/* harmony import */ var sketch__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(sketch__WEBPACK_IMPORTED_MODULE_0__);
 // documentation: https://developer.sketchapp.com/reference/api/

var Document = __webpack_require__(/*! sketch/dom */ "sketch/dom").Document;

var capHeightRatio = 0.713984375;
var capOffsetRatio = 0.5710278832;
var baselineOffsetRatio = 0.4289721168;
var lastLayerInGroupIsText = false;
var groupOffset = 0; // Run the plugin

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
  iterateLayers(layers);
});

var iterateLayers = function iterateLayers(layers) {
  layers.reverse();
  var i = 0;

  while (i < layers.length) {
    var layer = layers[i];

    if (i == layers.length - 1 && checkIfText(layer)) {
      lastLayerInGroupIsText = true;
      groupOffset = getBaselineOffset(layer);
    }

    place(layer);

    if (i == layers.length - 1 && !checkIfText(layer)) {
      lastLayerInGroupIsText = false;
      groupOffset = 0;
    }

    var isGroup = checkIfGroup(layer);

    if (isGroup) {
      iterateLayers(layer.layers);
      layer.adjustToFit();
    } else {}

    i++;
  }

  layers.reverse();
};

var roundToNearest = function roundToNearest(value, near) {
  if (value % near < near / 2) {
    return value + (near - value % near) - near;
  } else {
    return value + (near - value % near);
  }
};

var checkIfGroup = function checkIfGroup(layer) {
  return layer.type == "Group";
};

var checkIfText = function checkIfText(layer) {
  return layer.type == "Text";
};

var place = function place(layer) {
  var margin = getMargin(layer);
  var bottom = getBottom(layer);
  var position = bottom + margin;

  if (checkIfText(layer)) {
    position -= roundToNearest(getCaplineDiff(layer), 1);
    var bottomLayer = position + layer.frame.height;
    var baselineOffset = getBaselineOffset(layer);
    var baselinePos = bottomLayer - baselineOffset;
    var nearestBaseline = roundToNearest(baselinePos, 4);
    var baselineDiff = baselinePos - nearestBaseline;
    position -= baselineDiff;
  }

  layer.frame.y = position;
};

var getMargin = function getMargin(layer) {
  var layerName = layer.name;
  var marginString = layerName && layerName.split("[margin:") ? layerName.split("[margin:")[1] : undefined;
  marginString = marginString && marginString.split("]") ? marginString.split("]")[0] : undefined;
  return marginString ? Number(marginString) : 0;
};

var getBottom = function getBottom(layer) {
  var index = layer.index;
  var bottom = 0;

  if (index > 0) {
    var prevLayer = layer.parent.layers[index - 1];
    bottom = prevLayer.frame.y + prevLayer.frame.height;
    bottom -= getBaselineOffset(prevLayer);

    if (prevLayer.type == "Group") {
      bottom -= groupOffset;
    }
  }

  return checkIfTop(layer) ? 0 : bottom;
};

var getBaselineOffset = function getBaselineOffset(layer) {
  if (checkIfText(layer)) {
    var diff = getCapHeightDiff(layer);
    var baselineOffset = roundToNearest(diff * baselineOffsetRatio, 1); // Custom fixes

    if (layer.style.fontSize * 1.5 == layer.style.lineHeight) {
      baselineOffset += 1;
    } else if (layer.style.fontSize == 24 && layer.style.lineHeight == 32) {
      baselineOffset += 1;
    }

    return baselineOffset;
  } else {
    return 0;
  }
};

var getCapHeight = function getCapHeight(layer) {
  var fontSize = layer.style.fontSize;
  var capHeight = fontSize * capHeightRatio;
  return capHeight;
};

var getCapHeightDiff = function getCapHeightDiff(layer) {
  var lineHeight = layer.style.lineHeight;
  var capHeight = getCapHeight(layer);
  var diff = lineHeight - capHeight;
  return diff;
};

var getCaplineDiff = function getCaplineDiff(layer) {
  var diff = getCapHeightDiff(layer);
  var caplineDiff = diff * capOffsetRatio;
  return caplineDiff;
};

var checkIfTop = function checkIfTop(layer) {
  if (layer.name && layer.name.includes("[top]")) {
    return true;
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

/***/ }),

/***/ "sketch/dom":
/*!*****************************!*\
  !*** external "sketch/dom" ***!
  \*****************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("sketch/dom");

/***/ })

/******/ });
  if (key === 'default' && typeof exports === 'function') {
    exports(context);
  } else {
    exports[key](context);
  }
}
that['onRun'] = __skpm_run.bind(this, 'default')

//# sourceMappingURL=my-command.js.map