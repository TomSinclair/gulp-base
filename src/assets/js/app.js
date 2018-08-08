// import Handlebars from 'handlebars';
import jquery from 'jquery';
import 'picturefill';

window.jQuery = jquery;
window.$ = jquery;

// set up a master object
var BP = window.BP || {},
  d = document,
  de = d.documentElement,
  w = window,
  h = d.getElementsByTagName('head')[0],
  s,
  a;

// test for HTML5 vs HTML4 support, cutting the mustard
BP.browserSpec =
  typeof d.querySelectorAll &&
  'addEventListener' in w &&
  w.history.pushState &&
  d.implementation.hasFeature(
    'http://www.w3.org/TR/SVG11/feature#BasicStructure',
    '1.1'
  )
    ? 'html5'
    : 'html4';

// test for touch support. Caution: this is dangerous: https://hacks.mozilla.org/2013/04/detecting-touch-its-the-why-not-the-how/
BP.touch =
  'ontouchstart' in w || (w.documentTouch && d instanceof DocumentTouch)
    ? true
    : false;

// testing for object fit support
BP.objectFit = 'objectFit' in de.style;

// expose BP
window.BP = BP;

// add class names
de.className = de.className.replace(/\bno-js\b/, 'js');
de.className = de.className.replace(
  /\bBP\b/,
  BP.browserSpec +
    (BP.touch ? ' touch' : ' no-touch') +
    (BP.objectFit ? ' objectFit' : ' no-objectFit')
);

// set up some objects within the master one, to hold my Helpers and behaviors
BP.Behaviors = {};
BP.Functions = {};
BP.activeBehaviors = {};
BP.Helpers = {
  win_w: function() {
    return window.innerWidth;
  },
  win_h: function() {
    return window.innerHeight || document.documentElement.clientHeight;
  },
  is_touch: false,
  is_ie: function() {
    if ($('html').hasClass('ie')) return true;
    else return false;
  },
  is_widescreen: function() {
    if (win_w >= 1280) return true;
    else return false;
  },
  is_desktop: function() {
    if (win_w >= 980 && win_w < 1280) return true;
    else return false;
  },
  is_tablet: function() {
    if (win_w >= 768 && win_w < 980) return true;
    else return false;
  },
  is_tabletPortrait: function() {
    if (win_w >= 640 && win_w < 768) return true;
    else return false;
  },
  is_mobile: function() {
    if (win_w < 640) return true;
    else return false;
  }
};

var win_w = BP.Helpers.win_w();
var win_h = BP.Helpers.win_h();

// set up and trigger looking for the behaviors on DOM ready
BP.onReady = function() {
  // go go go
  BP.Helpers.manageBehaviors();

  // listen for remove scroll requests, to combat iOS
  BP.Functions.disableTouchMove();
};

document.addEventListener('DOMContentLoaded', function() {
  BP.onReady();
});

$(window).on('resize', function() {
  win_w = BP.Helpers.win_w();
  win_h = BP.Helpers.win_h();
});

// make console.log safe
if (typeof console === 'undefined') {
  window.console = {
    log: function() {
      return;
    }
  };
}

// Set precompiled templates as Handlebars partials - Fixes "partial not found" error when calling partial within partial via JS
// Handlebars.partials = Handlebars.templates;

// IE11 forEach polyfill
if ('NodeList' in window && !NodeList.prototype.forEach) {
  NodeList.prototype.forEach = function(callback, thisArg) {
    thisArg = thisArg || window;
    for (var i = 0; i < this.length; i++) {
      callback.call(thisArg, this[i], i, this);
    }
  };
}

// IE11 closest polyfill
if (!Element.prototype.matches)
  Element.prototype.matches =
    Element.prototype.msMatchesSelector ||
    Element.prototype.webkitMatchesSelector;

if (!Element.prototype.closest)
  Element.prototype.closest = function(s) {
    var el = this;
    if (!document.documentElement.contains(el)) return null;
    do {
      if (el.matches(s)) return el;
      el = el.parentElement || el.parentNode;
    } while (el !== null && el.nodeType === 1);
    return null;
  };
