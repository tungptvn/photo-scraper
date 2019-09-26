(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _isomorphicFetch = require('isomorphic-fetch');

var _isomorphicFetch2 = _interopRequireDefault(_isomorphicFetch);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Exif = function () {
  function Exif() {
    var _this = this;

    _classCallCheck(this, Exif);

    this.el = $('.Exif');
    this.el.on('click', '.Exif-close', function (e) {
      return _this.hide();
    });
  }

  _createClass(Exif, [{
    key: 'show',
    value: function show(url) {
      var _this2 = this;

      this.info(url).then(function (info) {
        _this2.el.addClass('show').find('tbody').html(_this2.rows(info));
      });
    }
  }, {
    key: 'hide',
    value: function hide() {
      this.el.removeClass('show');
    }
  }, {
    key: 'toggle',
    value: function toggle(url) {
      if (this.el.hasClass('show')) {
        this.hide();
      } else {
        this.show(url);
      }
    }
  }, {
    key: 'info',
    value: function info(url) {
      return (0, _isomorphicFetch2.default)(url + '&fm=json').then(function (res) {
        return res.json();
      });
    }
  }, {
    key: 'filter',
    value: function filter(info) {
      return [['Camera', info.TIFF.Model], ['Lens', info.Exif.LensModel], ['Focal Length', info.Exif.FocalLenIn35mmFilm], ['Aperture', info.Exif.FNumber], ['ISO', info.Exif.ISOSpeedRatings[0]]];
    }
  }, {
    key: 'rows',
    value: function rows(info) {
      return this.filter(info).map(function (row) {
        if (row[1] == null) return;
        return '\n        <tr>\n          <td>' + row[0] + '</td>\n          <td>' + row[1] + '</td>\n        </tr>\n      ';
      });
    }
  }]);

  return Exif;
}();

exports.default = Exif;

},{"isomorphic-fetch":9}],2:[function(require,module,exports){
'use strict';

var _lightbox = require('./lightbox');

var _lightbox2 = _interopRequireDefault(_lightbox);

var _exif = require('./exif');

var _exif2 = _interopRequireDefault(_exif);

var _yieldsK = require('yields-k');

var _yieldsK2 = _interopRequireDefault(_yieldsK);

require('./metrics');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var k = (0, _yieldsK2.default)(window);
var box = new _lightbox2.default($('.Lightbox')[0]);
var exif = new _exif2.default();

$('body').on('click', '[data-zoom]', function () {
  box.show($(this).data('zoom') || this.src);
});

$('.Post').on('click', 'img', function () {
  box.show(this.src);
});

k('e', function (e) {
  exif.toggle(box.src());
});

},{"./exif":1,"./lightbox":3,"./metrics":4,"yields-k":12}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _spin = require('./spin');

var _spin2 = _interopRequireDefault(_spin);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// TODO: write something with less suck,
// so many rely on old hacks, flexbox ftw,
// but this still sucks.

var opts = {
  lines: 17, // The number of lines to draw
  length: 2, // The length of each line
  width: 2, // The line thickness
  radius: 17, // The radius of the inner circle
  scale: 1, // Scales overall size of the spinner
  corners: 1, // Corner roundness (0..1)
  color: '#fff', // #rgb or #rrggbb or array of colors
  opacity: 0.05, // Opacity of the lines
  rotate: 0, // The rotation offset
  direction: 1, // 1: clockwise, -1: counterclockwise
  speed: 1, // Rounds per second
  trail: 58, // Afterglow percentage
  fps: 20, // Frames per second when using setTimeout() as a fallback for CSS
  zIndex: 2e9, // The z-index (defaults to 2000000000)
  className: 'spinner', // The CSS class to assign to the spinner
  top: '50%', // Top position relative to parent
  left: '50%', // Left position relative to parent
  shadow: false, // Whether to render a shadow
  hwaccel: false, // Whether to use hardware acceleration
  position: 'absolute' // Element positioning
};

var orientation = function orientation(img) {
  return img.width > img.height ? 'landscape' : 'portrait';
};

var Lightbox = function () {
  function Lightbox(el) {
    var _this = this;

    _classCallCheck(this, Lightbox);

    this.el = $(el);
    this.el.on('click', function (e) {
      return _this.hide();
    });
  }

  _createClass(Lightbox, [{
    key: 'show',
    value: function show(url) {
      if (!url) throw new Error('url required');

      var spinner = new _spin2.default(opts);
      var img = $('<img/>');
      var el = this.el;
      var spin;

      var id = setTimeout(function () {
        spin = spinner.spin().el;
        el.append(spin);
      }, 250);

      el.addClass('show').find('img').remove();

      img.on('load', function () {
        clearTimeout(id);

        if (spin) {
          spinner.stop();
          $(spin).remove();
        }

        img.attr('class', orientation(img[0]));
        el.append(img);
      });

      img.attr('src', url);
    }
  }, {
    key: 'hide',
    value: function hide() {
      this.el.removeClass('show');
    }
  }, {
    key: 'src',
    value: function src() {
      return this.el.find('img').attr('src');
    }
  }]);

  return Lightbox;
}();

exports.default = Lightbox;

},{"./spin":5}],4:[function(require,module,exports){
'use strict';

// Track image views

if (window.analytics) {
  $('.Images').on('click', 'img', function () {
    analytics.track('View Image', {
      collection: window.location.pathname.split('/').pop(),
      src: $(this).attr('src')
    });
  });
}

// Track exits via links

if (window.analytics) {
  $('body').on('click', 'a', function () {
    var txt = $(this).text();
    var url = this.href;

    // check for same origin
    var i = url.indexOf(window.location.hostname);

    // https:// or http://
    if (i == 8 || i == 7) {
      return;
    }

    // Track exit
    analytics.track('Exit', {
      href: url,
      link: txt
    });
  });
}

},{}],5:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
/**
 * Copyright (c) 2011-2014 Felix Gnass
 * Licensed under the MIT license
 * http://spin.js.org/
 *
 * Example:
    var opts = {
      lines: 12             // The number of lines to draw
    , length: 7             // The length of each line
    , width: 5              // The line thickness
    , radius: 10            // The radius of the inner circle
    , scale: 1.0            // Scales overall size of the spinner
    , corners: 1            // Roundness (0..1)
    , color: '#000'         // #rgb or #rrggbb
    , opacity: 1/4          // Opacity of the lines
    , rotate: 0             // Rotation offset
    , direction: 1          // 1: clockwise, -1: counterclockwise
    , speed: 1              // Rounds per second
    , trail: 100            // Afterglow percentage
    , fps: 20               // Frames per second when using setTimeout()
    , zIndex: 2e9           // Use a high z-index by default
    , className: 'spinner'  // CSS class to assign to the element
    , top: '50%'            // center vertically
    , left: '50%'           // center horizontally
    , shadow: false         // Whether to render a shadow
    , hwaccel: false        // Whether to use hardware acceleration (might be buggy)
    , position: 'absolute'  // Element positioning
    }
    var target = document.getElementById('foo')
    var spinner = new Spinner(opts).spin(target)
 */

var prefixes = ['webkit', 'Moz', 'ms', 'O'] /* Vendor prefixes */
,
    animations = {} /* Animation rules keyed by their name */
,
    useCssAnimations /* Whether to use CSS animations or setTimeout */
,
    sheet; /* A stylesheet to hold the @keyframe or VML rules. */

/**
 * Utility function to create elements. If no tag name is given,
 * a DIV is created. Optionally properties can be passed.
 */
function createEl(tag, prop) {
  var el = document.createElement(tag || 'div'),
      n;

  for (n in prop) {
    el[n] = prop[n];
  }return el;
}

/**
 * Appends children and returns the parent.
 */
function ins(parent /* child1, child2, ...*/) {
  for (var i = 1, n = arguments.length; i < n; i++) {
    parent.appendChild(arguments[i]);
  }

  return parent;
}

/**
 * Creates an opacity keyframe animation rule and returns its name.
 * Since most mobile Webkits have timing issues with animation-delay,
 * we create separate rules for each line/segment.
 */
function addAnimation(alpha, trail, i, lines) {
  var name = ['opacity', trail, ~~(alpha * 100), i, lines].join('-'),
      start = 0.01 + i / lines * 100,
      z = Math.max(1 - (1 - alpha) / trail * (100 - start), alpha),
      prefix = useCssAnimations.substring(0, useCssAnimations.indexOf('Animation')).toLowerCase(),
      pre = prefix && '-' + prefix + '-' || '';

  if (!animations[name]) {
    sheet.insertRule('@' + pre + 'keyframes ' + name + '{' + '0%{opacity:' + z + '}' + start + '%{opacity:' + alpha + '}' + (start + 0.01) + '%{opacity:1}' + (start + trail) % 100 + '%{opacity:' + alpha + '}' + '100%{opacity:' + z + '}' + '}', sheet.cssRules.length);

    animations[name] = 1;
  }

  return name;
}

/**
 * Tries various vendor prefixes and returns the first supported property.
 */
function vendor(el, prop) {
  var s = el.style,
      pp,
      i;

  prop = prop.charAt(0).toUpperCase() + prop.slice(1);
  if (s[prop] !== undefined) return prop;
  for (i = 0; i < prefixes.length; i++) {
    pp = prefixes[i] + prop;
    if (s[pp] !== undefined) return pp;
  }
}

/**
 * Sets multiple style properties at once.
 */
function css(el, prop) {
  for (var n in prop) {
    el.style[vendor(el, n) || n] = prop[n];
  }

  return el;
}

/**
 * Fills in default values.
 */
function merge(obj) {
  for (var i = 1; i < arguments.length; i++) {
    var def = arguments[i];
    for (var n in def) {
      if (obj[n] === undefined) obj[n] = def[n];
    }
  }
  return obj;
}

/**
 * Returns the line color from the given string or array.
 */
function getColor(color, idx) {
  return typeof color == 'string' ? color : color[idx % color.length];
}

// Built-in defaults

var defaults = {
  lines: 12 // The number of lines to draw
  , length: 7 // The length of each line
  , width: 5 // The line thickness
  , radius: 10 // The radius of the inner circle
  , scale: 1.0 // Scales overall size of the spinner
  , corners: 1 // Roundness (0..1)
  , color: '#000' // #rgb or #rrggbb
  , opacity: 1 / 4 // Opacity of the lines
  , rotate: 0 // Rotation offset
  , direction: 1 // 1: clockwise, -1: counterclockwise
  , speed: 1 // Rounds per second
  , trail: 100 // Afterglow percentage
  , fps: 20 // Frames per second when using setTimeout()
  , zIndex: 2e9 // Use a high z-index by default
  , className: 'spinner' // CSS class to assign to the element
  , top: '50%' // center vertically
  , left: '50%' // center horizontally
  , shadow: false // Whether to render a shadow
  , hwaccel: false // Whether to use hardware acceleration (might be buggy)
  , position: 'absolute' // Element positioning
};

/** The constructor */
function Spinner(o) {
  this.opts = merge(o || {}, Spinner.defaults, defaults);
}

// Global defaults that override the built-ins:
Spinner.defaults = {};

merge(Spinner.prototype, {
  /**
   * Adds the spinner to the given target element. If this instance is already
   * spinning, it is automatically removed from its previous target b calling
   * stop() internally.
   */
  spin: function spin(target) {
    this.stop();

    var self = this,
        o = self.opts,
        el = self.el = createEl(null, { className: o.className });

    css(el, {
      position: o.position,
      width: 0,
      zIndex: o.zIndex,
      left: o.left,
      top: o.top
    });

    if (target) {
      target.insertBefore(el, target.firstChild || null);
    }

    el.setAttribute('role', 'progressbar');
    self.lines(el, self.opts);

    if (!useCssAnimations) {
      // No CSS animation support, use setTimeout() instead
      var i = 0,
          start = (o.lines - 1) * (1 - o.direction) / 2,
          alpha,
          fps = o.fps,
          f = fps / o.speed,
          ostep = (1 - o.opacity) / (f * o.trail / 100),
          astep = f / o.lines;(function anim() {
        i++;
        for (var j = 0; j < o.lines; j++) {
          alpha = Math.max(1 - (i + (o.lines - j) * astep) % f * ostep, o.opacity);

          self.opacity(el, j * o.direction + start, alpha, o);
        }
        self.timeout = self.el && setTimeout(anim, ~~(1000 / fps));
      })();
    }
    return self;
  }

  /**
   * Stops and removes the Spinner.
   */
  , stop: function stop() {
    var el = this.el;
    if (el) {
      clearTimeout(this.timeout);
      if (el.parentNode) el.parentNode.removeChild(el);
      this.el = undefined;
    }
    return this;
  }

  /**
   * Internal method that draws the individual lines. Will be overwritten
   * in VML fallback mode below.
   */
  , lines: function lines(el, o) {
    var i = 0,
        start = (o.lines - 1) * (1 - o.direction) / 2,
        seg;

    function fill(color, shadow) {
      return css(createEl(), {
        position: 'absolute',
        width: o.scale * (o.length + o.width) + 'px',
        height: o.scale * o.width + 'px',
        background: color,
        boxShadow: shadow,
        transformOrigin: 'left',
        transform: 'rotate(' + ~~(360 / o.lines * i + o.rotate) + 'deg) translate(' + o.scale * o.radius + 'px' + ',0)',
        borderRadius: (o.corners * o.scale * o.width >> 1) + 'px'
      });
    }

    for (; i < o.lines; i++) {
      seg = css(createEl(), {
        position: 'absolute',
        top: 1 + ~(o.scale * o.width / 2) + 'px',
        transform: o.hwaccel ? 'translate3d(0,0,0)' : '',
        opacity: o.opacity,
        animation: useCssAnimations && addAnimation(o.opacity, o.trail, start + i * o.direction, o.lines) + ' ' + 1 / o.speed + 's linear infinite'
      });

      if (o.shadow) ins(seg, css(fill('#000', '0 0 4px #000'), { top: '2px' }));
      ins(el, ins(seg, fill(getColor(o.color, i), '0 0 1px rgba(0,0,0,.1)')));
    }
    return el;
  }

  /**
   * Internal method that adjusts the opacity of a single line.
   * Will be overwritten in VML fallback mode below.
   */
  , opacity: function opacity(el, i, val) {
    if (i < el.childNodes.length) el.childNodes[i].style.opacity = val;
  }

});

function initVML() {

  /* Utility function to create a VML tag */
  function vml(tag, attr) {
    return createEl('<' + tag + ' xmlns="urn:schemas-microsoft.com:vml" class="spin-vml">', attr);
  }

  // No CSS transforms but VML support, add a CSS rule for VML elements:
  sheet.addRule('.spin-vml', 'behavior:url(#default#VML)');

  Spinner.prototype.lines = function (el, o) {
    var r = o.scale * (o.length + o.width),
        s = o.scale * 2 * r;

    function grp() {
      return css(vml('group', {
        coordsize: s + ' ' + s,
        coordorigin: -r + ' ' + -r
      }), { width: s, height: s });
    }

    var margin = -(o.width + o.length) * o.scale * 2 + 'px',
        g = css(grp(), { position: 'absolute', top: margin, left: margin }),
        i;

    function seg(i, dx, filter) {
      ins(g, ins(css(grp(), { rotation: 360 / o.lines * i + 'deg', left: ~~dx }), ins(css(vml('roundrect', { arcsize: o.corners }), { width: r,
        height: o.scale * o.width,
        left: o.scale * o.radius,
        top: -o.scale * o.width >> 1,
        filter: filter
      }), vml('fill', { color: getColor(o.color, i), opacity: o.opacity }), vml('stroke', { opacity: 0 }) // transparent stroke to fix color bleeding upon opacity change
      )));
    }

    if (o.shadow) for (i = 1; i <= o.lines; i++) {
      seg(i, -2, 'progid:DXImageTransform.Microsoft.Blur(pixelradius=2,makeshadow=1,shadowopacity=.3)');
    }

    for (i = 1; i <= o.lines; i++) {
      seg(i);
    }return ins(el, g);
  };

  Spinner.prototype.opacity = function (el, i, val, o) {
    var c = el.firstChild;
    o = o.shadow && o.lines || 0;
    if (c && i + o < c.childNodes.length) {
      c = c.childNodes[i + o];c = c && c.firstChild;c = c && c.firstChild;
      if (c) c.opacity = val;
    }
  };
}

if (typeof document !== 'undefined') {
  sheet = function () {
    var el = createEl('style', { type: 'text/css' });
    ins(document.getElementsByTagName('head')[0], el);
    return el.sheet || el.styleSheet;
  }();

  var probe = css(createEl('group'), { behavior: 'url(#default#VML)' });

  if (!vendor(probe, 'transform') && probe.adj) initVML();else useCssAnimations = vendor(probe, 'animation');
}

exports.default = Spinner;

},{}],6:[function(require,module,exports){
/**
 * Slice reference.
 */

var slice = [].slice;

/**
 * Bind `obj` to `fn`.
 *
 * @param {Object} obj
 * @param {Function|String} fn or string
 * @return {Function}
 * @api public
 */

module.exports = function(obj, fn){
  if ('string' == typeof fn) fn = obj[fn];
  if ('function' != typeof fn) throw new Error('bind() requires a function');
  var args = slice.call(arguments, 2);
  return function(){
    return fn.apply(obj, args.concat(slice.call(arguments)));
  }
};

},{}],7:[function(require,module,exports){
var bind = window.addEventListener ? 'addEventListener' : 'attachEvent',
    unbind = window.removeEventListener ? 'removeEventListener' : 'detachEvent',
    prefix = bind !== 'addEventListener' ? 'on' : '';

/**
 * Bind `el` event `type` to `fn`.
 *
 * @param {Element} el
 * @param {String} type
 * @param {Function} fn
 * @param {Boolean} capture
 * @return {Function}
 * @api public
 */

exports.bind = function(el, type, fn, capture){
  el[bind](prefix + type, fn, capture || false);
  return fn;
};

/**
 * Unbind `el` event `type`'s callback `fn`.
 *
 * @param {Element} el
 * @param {String} type
 * @param {Function} fn
 * @param {Boolean} capture
 * @return {Function}
 * @api public
 */

exports.unbind = function(el, type, fn, capture){
  el[unbind](prefix + type, fn, capture || false);
  return fn;
};
},{}],8:[function(require,module,exports){


module.exports = os();

function os() {
  var ua = navigator.userAgent;
  if (/mac/i.test(ua)) return 'mac';
  if (/win/i.test(ua)) return 'windows';
  if (/linux/i.test(ua)) return 'linux';
}

},{}],9:[function(require,module,exports){
// the whatwg-fetch polyfill installs the fetch() function
// on the global object (window or self)
//
// Return that as the export for use in Webpack, Browserify etc.
require('whatwg-fetch');
module.exports = self.fetch.bind(self);

},{"whatwg-fetch":10}],10:[function(require,module,exports){
(function(self) {
  'use strict';

  if (self.fetch) {
    return
  }

  var support = {
    searchParams: 'URLSearchParams' in self,
    iterable: 'Symbol' in self && 'iterator' in Symbol,
    blob: 'FileReader' in self && 'Blob' in self && (function() {
      try {
        new Blob()
        return true
      } catch(e) {
        return false
      }
    })(),
    formData: 'FormData' in self,
    arrayBuffer: 'ArrayBuffer' in self
  }

  function normalizeName(name) {
    if (typeof name !== 'string') {
      name = String(name)
    }
    if (/[^a-z0-9\-#$%&'*+.\^_`|~]/i.test(name)) {
      throw new TypeError('Invalid character in header field name')
    }
    return name.toLowerCase()
  }

  function normalizeValue(value) {
    if (typeof value !== 'string') {
      value = String(value)
    }
    return value
  }

  // Build a destructive iterator for the value list
  function iteratorFor(items) {
    var iterator = {
      next: function() {
        var value = items.shift()
        return {done: value === undefined, value: value}
      }
    }

    if (support.iterable) {
      iterator[Symbol.iterator] = function() {
        return iterator
      }
    }

    return iterator
  }

  function Headers(headers) {
    this.map = {}

    if (headers instanceof Headers) {
      headers.forEach(function(value, name) {
        this.append(name, value)
      }, this)

    } else if (headers) {
      Object.getOwnPropertyNames(headers).forEach(function(name) {
        this.append(name, headers[name])
      }, this)
    }
  }

  Headers.prototype.append = function(name, value) {
    name = normalizeName(name)
    value = normalizeValue(value)
    var list = this.map[name]
    if (!list) {
      list = []
      this.map[name] = list
    }
    list.push(value)
  }

  Headers.prototype['delete'] = function(name) {
    delete this.map[normalizeName(name)]
  }

  Headers.prototype.get = function(name) {
    var values = this.map[normalizeName(name)]
    return values ? values[0] : null
  }

  Headers.prototype.getAll = function(name) {
    return this.map[normalizeName(name)] || []
  }

  Headers.prototype.has = function(name) {
    return this.map.hasOwnProperty(normalizeName(name))
  }

  Headers.prototype.set = function(name, value) {
    this.map[normalizeName(name)] = [normalizeValue(value)]
  }

  Headers.prototype.forEach = function(callback, thisArg) {
    Object.getOwnPropertyNames(this.map).forEach(function(name) {
      this.map[name].forEach(function(value) {
        callback.call(thisArg, value, name, this)
      }, this)
    }, this)
  }

  Headers.prototype.keys = function() {
    var items = []
    this.forEach(function(value, name) { items.push(name) })
    return iteratorFor(items)
  }

  Headers.prototype.values = function() {
    var items = []
    this.forEach(function(value) { items.push(value) })
    return iteratorFor(items)
  }

  Headers.prototype.entries = function() {
    var items = []
    this.forEach(function(value, name) { items.push([name, value]) })
    return iteratorFor(items)
  }

  if (support.iterable) {
    Headers.prototype[Symbol.iterator] = Headers.prototype.entries
  }

  function consumed(body) {
    if (body.bodyUsed) {
      return Promise.reject(new TypeError('Already read'))
    }
    body.bodyUsed = true
  }

  function fileReaderReady(reader) {
    return new Promise(function(resolve, reject) {
      reader.onload = function() {
        resolve(reader.result)
      }
      reader.onerror = function() {
        reject(reader.error)
      }
    })
  }

  function readBlobAsArrayBuffer(blob) {
    var reader = new FileReader()
    reader.readAsArrayBuffer(blob)
    return fileReaderReady(reader)
  }

  function readBlobAsText(blob) {
    var reader = new FileReader()
    reader.readAsText(blob)
    return fileReaderReady(reader)
  }

  function Body() {
    this.bodyUsed = false

    this._initBody = function(body) {
      this._bodyInit = body
      if (typeof body === 'string') {
        this._bodyText = body
      } else if (support.blob && Blob.prototype.isPrototypeOf(body)) {
        this._bodyBlob = body
      } else if (support.formData && FormData.prototype.isPrototypeOf(body)) {
        this._bodyFormData = body
      } else if (support.searchParams && URLSearchParams.prototype.isPrototypeOf(body)) {
        this._bodyText = body.toString()
      } else if (!body) {
        this._bodyText = ''
      } else if (support.arrayBuffer && ArrayBuffer.prototype.isPrototypeOf(body)) {
        // Only support ArrayBuffers for POST method.
        // Receiving ArrayBuffers happens via Blobs, instead.
      } else {
        throw new Error('unsupported BodyInit type')
      }

      if (!this.headers.get('content-type')) {
        if (typeof body === 'string') {
          this.headers.set('content-type', 'text/plain;charset=UTF-8')
        } else if (this._bodyBlob && this._bodyBlob.type) {
          this.headers.set('content-type', this._bodyBlob.type)
        } else if (support.searchParams && URLSearchParams.prototype.isPrototypeOf(body)) {
          this.headers.set('content-type', 'application/x-www-form-urlencoded;charset=UTF-8')
        }
      }
    }

    if (support.blob) {
      this.blob = function() {
        var rejected = consumed(this)
        if (rejected) {
          return rejected
        }

        if (this._bodyBlob) {
          return Promise.resolve(this._bodyBlob)
        } else if (this._bodyFormData) {
          throw new Error('could not read FormData body as blob')
        } else {
          return Promise.resolve(new Blob([this._bodyText]))
        }
      }

      this.arrayBuffer = function() {
        return this.blob().then(readBlobAsArrayBuffer)
      }

      this.text = function() {
        var rejected = consumed(this)
        if (rejected) {
          return rejected
        }

        if (this._bodyBlob) {
          return readBlobAsText(this._bodyBlob)
        } else if (this._bodyFormData) {
          throw new Error('could not read FormData body as text')
        } else {
          return Promise.resolve(this._bodyText)
        }
      }
    } else {
      this.text = function() {
        var rejected = consumed(this)
        return rejected ? rejected : Promise.resolve(this._bodyText)
      }
    }

    if (support.formData) {
      this.formData = function() {
        return this.text().then(decode)
      }
    }

    this.json = function() {
      return this.text().then(JSON.parse)
    }

    return this
  }

  // HTTP methods whose capitalization should be normalized
  var methods = ['DELETE', 'GET', 'HEAD', 'OPTIONS', 'POST', 'PUT']

  function normalizeMethod(method) {
    var upcased = method.toUpperCase()
    return (methods.indexOf(upcased) > -1) ? upcased : method
  }

  function Request(input, options) {
    options = options || {}
    var body = options.body
    if (Request.prototype.isPrototypeOf(input)) {
      if (input.bodyUsed) {
        throw new TypeError('Already read')
      }
      this.url = input.url
      this.credentials = input.credentials
      if (!options.headers) {
        this.headers = new Headers(input.headers)
      }
      this.method = input.method
      this.mode = input.mode
      if (!body) {
        body = input._bodyInit
        input.bodyUsed = true
      }
    } else {
      this.url = input
    }

    this.credentials = options.credentials || this.credentials || 'omit'
    if (options.headers || !this.headers) {
      this.headers = new Headers(options.headers)
    }
    this.method = normalizeMethod(options.method || this.method || 'GET')
    this.mode = options.mode || this.mode || null
    this.referrer = null

    if ((this.method === 'GET' || this.method === 'HEAD') && body) {
      throw new TypeError('Body not allowed for GET or HEAD requests')
    }
    this._initBody(body)
  }

  Request.prototype.clone = function() {
    return new Request(this)
  }

  function decode(body) {
    var form = new FormData()
    body.trim().split('&').forEach(function(bytes) {
      if (bytes) {
        var split = bytes.split('=')
        var name = split.shift().replace(/\+/g, ' ')
        var value = split.join('=').replace(/\+/g, ' ')
        form.append(decodeURIComponent(name), decodeURIComponent(value))
      }
    })
    return form
  }

  function headers(xhr) {
    var head = new Headers()
    var pairs = (xhr.getAllResponseHeaders() || '').trim().split('\n')
    pairs.forEach(function(header) {
      var split = header.trim().split(':')
      var key = split.shift().trim()
      var value = split.join(':').trim()
      head.append(key, value)
    })
    return head
  }

  Body.call(Request.prototype)

  function Response(bodyInit, options) {
    if (!options) {
      options = {}
    }

    this.type = 'default'
    this.status = options.status
    this.ok = this.status >= 200 && this.status < 300
    this.statusText = options.statusText
    this.headers = options.headers instanceof Headers ? options.headers : new Headers(options.headers)
    this.url = options.url || ''
    this._initBody(bodyInit)
  }

  Body.call(Response.prototype)

  Response.prototype.clone = function() {
    return new Response(this._bodyInit, {
      status: this.status,
      statusText: this.statusText,
      headers: new Headers(this.headers),
      url: this.url
    })
  }

  Response.error = function() {
    var response = new Response(null, {status: 0, statusText: ''})
    response.type = 'error'
    return response
  }

  var redirectStatuses = [301, 302, 303, 307, 308]

  Response.redirect = function(url, status) {
    if (redirectStatuses.indexOf(status) === -1) {
      throw new RangeError('Invalid status code')
    }

    return new Response(null, {status: status, headers: {location: url}})
  }

  self.Headers = Headers
  self.Request = Request
  self.Response = Response

  self.fetch = function(input, init) {
    return new Promise(function(resolve, reject) {
      var request
      if (Request.prototype.isPrototypeOf(input) && !init) {
        request = input
      } else {
        request = new Request(input, init)
      }

      var xhr = new XMLHttpRequest()

      function responseURL() {
        if ('responseURL' in xhr) {
          return xhr.responseURL
        }

        // Avoid security warnings on getResponseHeader when not allowed by CORS
        if (/^X-Request-URL:/m.test(xhr.getAllResponseHeaders())) {
          return xhr.getResponseHeader('X-Request-URL')
        }

        return
      }

      xhr.onload = function() {
        var options = {
          status: xhr.status,
          statusText: xhr.statusText,
          headers: headers(xhr),
          url: responseURL()
        }
        var body = 'response' in xhr ? xhr.response : xhr.responseText
        resolve(new Response(body, options))
      }

      xhr.onerror = function() {
        reject(new TypeError('Network request failed'))
      }

      xhr.ontimeout = function() {
        reject(new TypeError('Network request failed'))
      }

      xhr.open(request.method, request.url, true)

      if (request.credentials === 'include') {
        xhr.withCredentials = true
      }

      if ('responseType' in xhr && support.blob) {
        xhr.responseType = 'blob'
      }

      request.headers.forEach(function(value, name) {
        xhr.setRequestHeader(name, value)
      })

      xhr.send(typeof request._bodyInit === 'undefined' ? null : request._bodyInit)
    })
  }
  self.fetch.polyfill = true
})(typeof self !== 'undefined' ? self : this);

},{}],11:[function(require,module,exports){

/**
 * dependencies
 */

var keycode = require('keycode');

/**
 * Export `sequence`
 */

module.exports = sequence;

/**
 * Create sequence fn with `keys`.
 * optional `ms` which defaults
 * to `500ms` and `fn`.
 *
 * Example:
 *
 *      seq = sequence('a b c', fn);
 *      el.addEventListener('keydown', seq);
 *
 * @param {String} keys
 * @param {Number} ms
 * @param {Function} fn
 * @return {Function}
 * @api public
 */

function sequence(keys, ms, fn){
  var codes = keys.split(/ +/).map(keycode)
    , clen = codes.length
    , seq = []
    , i = 0
    , prev;

  if (2 == arguments.length) {
    fn = ms;
    ms = 500;
  }

  return function(e){
    var code = codes[i++];
    if (42 != code && code != e.which) return reset();
    if (prev && new Date - prev > ms) return reset();
    var len = seq.push(e.which);
    prev = new Date;
    if (len != clen) return;
    reset();
    fn(e);
  };

  function reset(){
    prev = null;
    seq = [];
    i = 0;
  }
};

},{"keycode":14}],12:[function(require,module,exports){

/**
 * Module Dependencies.
 */

var event = require('event')
var proto = require('./proto')
var bind = require('bind');

/**
 * Create a new dispatcher with `el`.
 *
 * example:
 *
 *      var k = require('k')(window);
 *      k('shift + tab', function(){});
 *
 * @param {Element} el
 * @return {Function}
 * @api public
 */

module.exports = function(el){
  function k(e, fn){ k.handle(e, fn) };
  k._handle = bind(k, proto.handle);
  k._clear = bind(k, proto.clear);
  k._reset = bind(k, proto.reset);
  event.bind(el, 'keydown', k._handle, false);
  event.bind(el, 'keyup', k._handle, false);
  event.bind(el, 'keyup', k._clear, false);
  event.bind(el, 'focus', k._reset, false);
  for (var p in proto) k[p] = proto[p];
  k.listeners = [];
  k.active = 0;
  k.el = el;
  return k;
};

},{"./proto":13,"bind":6,"event":7}],13:[function(require,module,exports){

/**
 * Module Dependencies.
 */

var sequence = require('k-sequence');
var keycode = require('keycode');
var event = require('event');
var os = require('os');

/**
 * modifiers.
 */

var modifiers = {
  224: 'command',
  91: 'command',
  93: 'command',
  16: 'shift',
  17: 'ctrl',
  18: 'alt'
};

/**
 * Super key.
 * (must use subscript vs. dot notation to avoid issues with older browsers)
 */

exports['super'] = 'mac' == os
  ? 'command'
  : 'ctrl';

/**
 * Handle the given `KeyboardEvent` or bind
 * a new `keys` handler.
 *
 * @param {String|KeyboardEvent} e
 * @param {Function} fn
 * @api private
 */

exports.handle = function(e, fn){
  var ignore = this.ignore;
  var event = e.type;
  var code = e.which;

  // bind
  if (fn) return this.bind(e, fn);

  // modifiers
  var mod = modifiers[code];
  if ('keydown' == event && mod) {
    this['super'] = exports['super'] == mod;
    this[mod] = true;
    this.modifiers = true;
    this.active++;
    return;
  }

  // ignore
  if (ignore && ignore(e)) return;

  // listeners
  var all = this.listeners;

  // match
  for (var i = 0; i < all.length; ++i) {
    var invoke = true;
    var obj = all[i];
    var seq = obj.seq;
    var mods = obj.mods;
    var fn = seq || obj.fn;

    if (!seq && code != obj.code) continue;
    if (event != obj.event) continue;
    if (this.active != obj.mods.length) continue;

    for (var j = 0; j < mods.length; ++j) {
      if (!this[mods[j]]) {
        invoke = null;
        break;
      }
    }

    invoke && fn(e);
  }
};

/**
 * Destroy this `k` dispatcher instance.
 *
 * @api public
 */

exports.destroy = function(){
  event.unbind(this.el, 'keydown', this._handle);
  event.unbind(this.el, 'keyup', this._handle);
  event.unbind(this.el, 'keyup', this._clear);
  event.unbind(this.el, 'focus', this._clear);
  this.listeners = [];
};

/**
 * Unbind the given `keys` with optional `fn`.
 *
 * Example:
 *
 *      k.unbind('enter, tab', myListener); // unbind `myListener` from `enter, tab` keys
 *      k.unbind('enter, tab'); // unbind all `enter, tab` listeners
 *      k.unbind(); // unbind all listeners
 *
 * @param {String} keys
 * @param {Function} fn
 * @return {k}
 * @api public
 */

exports.unbind = function(keys, fn){
  var fns = this.listeners
  var len = fns.length;
  var all;

  // unbind all
  if (0 == arguments.length) {
    this.listeners = [];
    return this;
  }

  // parse
  all = parseKeys(keys);

  // unbind
  for (var i = 0; i < all.length; ++i) {
    for (var j = 0, obj; j < len; ++j) {
      obj = fns[j];
      if (!obj) continue;
      if (fn && obj.fn != fn) continue;
      if (obj.key != all[i].key) continue;
      if (!matches(obj, all[i])) continue;
      fns.splice(j--, 1);
    }
  }

  return this;
};

/**
 * Bind the given `keys` to `fn` with optional `event`
 *
 * Example:
 *
 *      k.bind('shift + tab, ctrl + a', function(e){});
 *
 * @param {String} event
 * @param {String} keys
 * @param {Function} fn
 * @return {k}
 * @api public
 */

exports.bind = function(event, keys, fn){
  var fns = this.listeners
  var len;
  var all;

  if (2 == arguments.length) {
    fn = keys;
    keys = event;
    event = 'keydown';
  }

  all = parseKeys(keys);
  len = all.length;

  for (var i = 0; i < len; ++i) {
    var obj = all[i];
    obj.seq = obj.seq && sequence(obj.key, fn);
    obj.event = event;
    obj.fn = fn;
    fns.push(obj);
  }

  return this;
};

/**
 * Bind keyup with `keys` and `fn`.
 *
 * @param {String} keys
 * @param {Function} fn
 * @return {k}
 * @api public
 */

exports.up = function(keys, fn){
  return this.bind('keyup', keys, fn);
};

/**
 * Bind keydown with `keys` and `fn`.
 *
 * @param {String} keys
 * @param {Function} fn
 * @return {k}
 * @api public
 */

exports.down = function(keys, fn){
  return this.bind('keydown', keys, fn);
};

/**
 * Clear all modifiers on `keyup`.
 *
 * @api private
 */

exports.clear = function(e){
  var code = e.keyCode || e.which;
  if (!(code in modifiers)) return;
  this.active--;
  this[modifiers[code]] = null;
  this.modifiers = this.command
    || this.shift
    || this.ctrl
    || this.alt;
};

/**
 * Clear all modifiers on `focus`.
 *
 * @api private
 */

exports.reset = function(e){
  this.active = 0;
  this.modifiers =
  this.command =
  this.shift =
  this.ctrl =
  this.alt = null;
};

/**
 * Ignore all input elements by default.
 *
 * @param {Event} e
 * @return {Boolean}
 * @api private
 */

exports.ignore = function(e){
  var el = e.target || e.srcElement;
  var name = el.tagName.toLowerCase();
  return 'textarea' == name
    || 'select' == name
    || 'input' == name;
};

/**
 * Parse the given `keys`.
 *
 * @param {String} keys
 * @return {Array}
 * @api private
 */

function parseKeys(keys){
  keys = keys.replace('super', exports['super']);

  var all = ',' != keys
    ? keys.split(/ *, */)
    : [','];

  var ret = [];
  for (var i = 0; i < all.length; ++i) {
    if ('' == all[i]) continue;
    var mods = all[i].split(/ *\+ */);
    var key = mods.pop() || ',';

    ret.push({
      seq: !! (~key.indexOf(' ') || ~key.indexOf('*')),
      code: keycode(key),
      mods: mods,
      key: key
    });
  }

  return ret;
}

/**
 * Check if the given `a` matches `b`.
 *
 * @param {Object} a
 * @param {Object} b
 * @return {Boolean}
 * @api private
 */

function matches(a, b){
  return 0 == b.mods.length || eql(a, b);
}

/**
 * Shallow eql util.
 *
 * TODO: move to yields/eql
 *
 * @param {Array} a
 * @param {Array} b
 * @return {Boolean}
 * @api private
 */

function eql(a, b){
  a = a.mods.sort().toString();
  b = b.mods.sort().toString();
  return a == b;
}

},{"event":7,"k-sequence":11,"keycode":14,"os":8}],14:[function(require,module,exports){

/**
 * map
 */

var map = {
    backspace: 8
  , command: 91
  , tab: 9
  , clear: 12
  , enter: 13
  , shift: 16
  , ctrl: 17
  , alt: 18
  , capslock: 20
  , escape: 27
  , esc: 27
  , space: 32
  , pageup: 33
  , pagedown: 34
  , end: 35
  , home: 36
  , left: 37
  , up: 38
  , right: 39
  , down: 40
  , del: 46
  , comma: 188
  , f1: 112
  , f2: 113
  , f3: 114
  , f4: 115
  , f5: 116
  , f6: 117
  , f7: 118
  , f8: 119
  , f9: 120
  , f10: 121
  , f11: 122
  , f12: 123
  , ',': 188
  , '.': 190
  , '/': 191
  , '`': 192
  , '-': 189
  , '=': 187
  , ';': 186
  , '[': 219
  , '\\': 220
  , ']': 221
  , '\'': 222
};

/**
 * find a keycode.
 *
 * @param {String} name
 * @return {Number}
 */

module.exports = function(name){
  return map[name.toLowerCase()] || name.toUpperCase().charCodeAt(0);
};

},{}]},{},[2])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJjbGllbnQvZXhpZi5qcyIsImNsaWVudC9pbmRleC5qcyIsImNsaWVudC9saWdodGJveC5qcyIsImNsaWVudC9tZXRyaWNzLmpzIiwiY2xpZW50L3NwaW4uanMiLCJub2RlX21vZHVsZXMvY29tcG9uZW50LWJpbmQvaW5kZXguanMiLCJub2RlX21vZHVsZXMvY29tcG9uZW50LWV2ZW50L2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL2NvbXBvbmVudC1vcy9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9pc29tb3JwaGljLWZldGNoL2ZldGNoLW5wbS1icm93c2VyaWZ5LmpzIiwibm9kZV9tb2R1bGVzL3doYXR3Zy1mZXRjaC9mZXRjaC5qcyIsIm5vZGVfbW9kdWxlcy95aWVsZHMtay1zZXF1ZW5jZS9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy95aWVsZHMtay9saWIvaW5kZXguanMiLCJub2RlX21vZHVsZXMveWllbGRzLWsvbGliL3Byb3RvLmpzIiwibm9kZV9tb2R1bGVzL3lpZWxkcy1rZXljb2RlL2luZGV4LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7QUNDQTs7Ozs7Ozs7SUFFcUIsSTtBQUNuQixrQkFBYztBQUFBOztBQUFBOztBQUNaLFNBQUssRUFBTCxHQUFVLEVBQUUsT0FBRixDQUFWO0FBQ0EsU0FBSyxFQUFMLENBQVEsRUFBUixDQUFXLE9BQVgsRUFBb0IsYUFBcEIsRUFBbUM7QUFBQSxhQUFLLE1BQUssSUFBTCxFQUFMO0FBQUEsS0FBbkM7QUFDRDs7Ozt5QkFFSSxHLEVBQUs7QUFBQTs7QUFDUixXQUFLLElBQUwsQ0FBVSxHQUFWLEVBQWUsSUFBZixDQUFvQixnQkFBUTtBQUMxQixlQUFLLEVBQUwsQ0FBUSxRQUFSLENBQWlCLE1BQWpCLEVBQ0csSUFESCxDQUNRLE9BRFIsRUFFRyxJQUZILENBRVEsT0FBSyxJQUFMLENBQVUsSUFBVixDQUZSO0FB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O0FBQ0E7O0FDVkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqYkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaFVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIlxuaW1wb3J0IGZldGNoIGZyb20gJ2lzb21vcnBoaWMtZmV0Y2gnXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEV4aWYge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLmVsID0gJCgnLkV4aWYnKVxuICAgIHRoaXMuZWwub24oJ2NsaWNrJywgJy5FeGlmLWNsb3NlJywgZSA9PiB0aGlzLmhpZGUoKSlcbiAgfVxuXG4gIHNob3codXJsKSB7XG4gICAgdGhpcy5pbmZvKHVybCkudGhlbihpbmZvID0+IHtcbiAgICAgIHRoaXMuZWwuYWRkQ2xhc3MoJ3Nob3cnKVxuICAgICAgICAuZmluZCgndGJvZHknKVxuICAgICAgICAuaHRtbCh0aGlzLnJvd3MoaW5mbykpXG4gICAgfSlcbiAgfVxuXG4gIGhpZGUoKSB7XG4gICAgdGhpcy5lbC5yZW1vdmVDbGFzcygnc2hvdycpXG4gIH1cblxuICB0b2dnbGUodXJsKSB7XG4gICAgaWYgKHRoaXMuZWwuaGFzQ2xhc3MoJ3Nob3cnKSkge1xuICAgICAgdGhpcy5oaWRlKClcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5zaG93KHVybClcbiAgICB9XG4gIH1cblxuICBpbmZvKHVybCkge1xuICAgIHJldHVybiBmZXRjaCh1cmwgKyAnJmZtPWpzb24nKVxuICAgICAgLnRoZW4ocmVzID0+IHJlcy5qc29uKCkpXG4gIH1cblxuICBmaWx0ZXIoaW5mbykge1xuICAgIHJldHVybiBbXG4gICAgICBbJ0NhbWVyYScsIGluZm8uVElGRi5Nb2RlbF0sXG4gICAgICBbJ0xlbnMnLCBpbmZvLkV4aWYuTGVuc01vZGVsXSxcbiAgICAgIFsnRm9jYWwgTGVuZ3RoJywgaW5mby5FeGlmLkZvY2FsTGVuSW4zNW1tRmlsbV0sXG4gICAgICBbJ0FwZXJ0dXJlJywgaW5mby5FeGlmLkZOdW1iZXJdLFxuICAgICAgWydJU08nLCBpbmZvLkV4aWYuSVNPU3BlZWRSYXRpbmdzWzBdXVxuICAgIF1cbiAgfVxuXG4gIHJvd3MoaW5mbykge1xuICAgIHJldHVybiB0aGlzLmZpbHRlcihpbmZvKS5tYXAocm93ID0+IHtcbiAgICAgIGlmIChyb3dbMV0gPT0gbnVsbCkgcmV0dXJuXG4gICAgICByZXR1cm4gYFxuICAgICAgICA8dHI+XG4gICAgICAgICAgPHRkPiR7cm93WzBdfTwvdGQ+XG4gICAgICAgICAgPHRkPiR7cm93WzFdfTwvdGQ+XG4gICAgICAgIDwvdHI+XG4gICAgICBgXG4gICAgfSlcbiAgfVxufSIsIlxuaW1wb3J0IExpZ2h0Ym94IGZyb20gJy4vbGlnaHRib3gnXG5pbXBvcnQgRXhpZiBmcm9tICcuL2V4aWYnXG5pbXBvcnQga2V5cyBmcm9tICd5aWVsZHMtaydcbmltcG9ydCAnLi9tZXRyaWNzJ1xuXG5jb25zdCBrID0ga2V5cyh3aW5kb3cpXG5jb25zdCBib3ggPSBuZXcgTGlnaHRib3goJCgnLkxpZ2h0Ym94JylbMF0pXG5jb25zdCBleGlmID0gbmV3IEV4aWZcblxuJCgnYm9keScpLm9uKCdjbGljaycsICdbZGF0YS16b29tXScsIGZ1bmN0aW9uKCl7XG4gIGJveC5zaG93KCQodGhpcykuZGF0YSgnem9vbScpIHx8IHRoaXMuc3JjKVxufSlcblxuJCgnLlBvc3QnKS5vbignY2xpY2snLCAnaW1nJywgZnVuY3Rpb24oKXtcbiAgYm94LnNob3codGhpcy5zcmMpXG59KVxuXG5rKCdlJywgZSA9PiB7IGV4aWYudG9nZ2xlKGJveC5zcmMoKSkgfSkiLCJcbmltcG9ydCBTcGlubmVyIGZyb20gJy4vc3BpbidcblxuLy8gVE9ETzogd3JpdGUgc29tZXRoaW5nIHdpdGggbGVzcyBzdWNrLFxuLy8gc28gbWFueSByZWx5IG9uIG9sZCBoYWNrcywgZmxleGJveCBmdHcsXG4vLyBidXQgdGhpcyBzdGlsbCBzdWNrcy5cblxuY29uc3Qgb3B0cyA9IHtcbiAgbGluZXM6IDE3LCAvLyBUaGUgbnVtYmVyIG9mIGxpbmVzIHRvIGRyYXdcbiAgbGVuZ3RoOiAyLCAvLyBUaGUgbGVuZ3RoIG9mIGVhY2ggbGluZVxuICB3aWR0aDogMiwgLy8gVGhlIGxpbmUgdGhpY2tuZXNzXG4gIHJhZGl1czogMTcsIC8vIFRoZSByYWRpdXMgb2YgdGhlIGlubmVyIGNpcmNsZVxuICBzY2FsZTogMSwgLy8gU2NhbGVzIG92ZXJhbGwgc2l6ZSBvZiB0aGUgc3Bpbm5lclxuICBjb3JuZXJzOiAxLCAvLyBDb3JuZXIgcm91bmRuZXNzICgwLi4xKVxuICBjb2xvcjogJyNmZmYnLCAvLyAjcmdiIG9yICNycmdnYmIgb3IgYXJyYXkgb2YgY29sb3JzXG4gIG9wYWNpdHk6IDAuMDUsIC8vIE9wYWNpdHkgb2YgdGhlIGxpbmVzXG4gIHJvdGF0ZTogMCwgLy8gVGhlIHJvdGF0aW9uIG9mZnNldFxuICBkaXJlY3Rpb246IDEsIC8vIDE6IGNsb2Nrd2lzZSwgLTE6IGNvdW50ZXJjbG9ja3dpc2VcbiAgc3BlZWQ6IDEsIC8vIFJvdW5kcyBwZXIgc2Vjb25kXG4gIHRyYWlsOiA1OCwgLy8gQWZ0ZXJnbG93IHBlcmNlbnRhZ2VcbiAgZnBzOiAyMCwgLy8gRnJhbWVzIHBlciBzZWNvbmQgd2hlbiB1c2luZyBzZXRUaW1lb3V0KCkgYXMgYSBmYWxsYmFjayBmb3IgQ1NTXG4gIHpJbmRleDogMmU5LCAvLyBUaGUgei1pbmRleCAoZGVmYXVsdHMgdG8gMjAwMDAwMDAwMClcbiAgY2xhc3NOYW1lOiAnc3Bpbm5lcicsIC8vIFRoZSBDU1MgY2xhc3MgdG8gYXNzaWduIHRvIHRoZSBzcGlubmVyXG4gIHRvcDogJzUwJScsIC8vIFRvcCBwb3NpdGlvbiByZWxhdGl2ZSB0byBwYXJlbnRcbiAgbGVmdDogJzUwJScsIC8vIExlZnQgcG9zaXRpb24gcmVsYXRpdmUgdG8gcGFyZW50XG4gIHNoYWRvdzogZmFsc2UsIC8vIFdoZXRoZXIgdG8gcmVuZGVyIGEgc2hhZG93XG4gIGh3YWNjZWw6IGZhbHNlLCAvLyBXaGV0aGVyIHRvIHVzZSBoYXJkd2FyZSBhY2NlbGVyYXRpb25cbiAgcG9zaXRpb246ICdhYnNvbHV0ZScgLy8gRWxlbWVudCBwb3NpdGlvbmluZ1xufVxuXG5jb25zdCBvcmllbnRhdGlvbiA9IChpbWcpID0+XG4gIGltZy53aWR0aCA+IGltZy5oZWlnaHRcbiAgICA/ICdsYW5kc2NhcGUnXG4gICAgOiAncG9ydHJhaXQnXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIExpZ2h0Ym94IHtcbiAgY29uc3RydWN0b3IoZWwpIHtcbiAgICB0aGlzLmVsID0gJChlbClcbiAgICB0aGlzLmVsLm9uKCdjbGljaycsIGUgPT4gdGhpcy5oaWRlKCkpXG4gIH1cblxuICBzaG93KHVybCkge1xuICAgIGlmICghdXJsKSB0aHJvdyBuZXcgRXJyb3IoJ3VybCByZXF1aXJlZCcpXG5cbiAgICBjb25zdCBzcGlubmVyID0gbmV3IFNwaW5uZXIob3B0cylcbiAgICBjb25zdCBpbWcgPSAkKCc8aW1nLz4nKVxuICAgIGNvbnN0IGVsID0gdGhpcy5lbFxuICAgIHZhciBzcGluXG5cbiAgICBjb25zdCBpZCA9IHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgc3BpbiA9IHNwaW5uZXIuc3BpbigpLmVsXG4gICAgICBlbC5hcHBlbmQoc3BpbilcbiAgICB9LCAyNTApXG5cbiAgICBlbC5hZGRDbGFzcygnc2hvdycpLmZpbmQoJ2ltZycpLnJlbW92ZSgpXG5cbiAgICBpbWcub24oJ2xvYWQnLCAoKSA9PiB7XG4gICAgICBjbGVhclRpbWVvdXQoaWQpXG5cbiAgICAgIGlmIChzcGluKSB7XG4gICAgICAgIHNwaW5uZXIuc3RvcCgpXG4gICAgICAgICQoc3BpbikucmVtb3ZlKClcbiAgICAgIH1cblxuICAgICAgaW1nLmF0dHIoJ2NsYXNzJywgb3JpZW50YXRpb24oaW1nWzBdKSlcbiAgICAgIGVsLmFwcGVuZChpbWcpXG4gICAgfSlcblxuICAgIGltZy5hdHRyKCdzcmMnLCB1cmwpXG5cbiAgfVxuXG4gIGhpZGUoKSB7XG4gICAgdGhpcy5lbC5yZW1vdmVDbGFzcygnc2hvdycpXG4gIH1cblxuICBzcmMoKSB7XG4gICAgcmV0dXJuIHRoaXMuZWwuZmluZCgnaW1nJykuYXR0cignc3JjJylcbiAgfVxufVxuIiwiXG4vLyBUcmFjayBpbWFnZSB2aWV3c1xuXG5pZiAod2luZG93LmFuYWx5dGljcykge1xuICAkKCcuSW1hZ2VzJykub24oJ2NsaWNrJywgJ2ltZycsIGZ1bmN0aW9uKCl7XG4gICAgYW5hbHl0aWNzLnRyYWNrKCdWaWV3IEltYWdlJywge1xuICAgICAgY29sbGVjdGlvbjogd2luZG93LmxvY2F0aW9uLnBhdGhuYW1lLnNwbGl0KCcvJykucG9wKCksXG4gICAgICBzcmM6ICQodGhpcykuYXR0cignc3JjJylcbiAgICB9KVxuICB9KVxufVxuXG4vLyBUcmFjayBleGl0cyB2aWEgbGlua3NcblxuaWYgKHdpbmRvdy5hbmFseXRpY3MpIHtcbiAgJCgnYm9keScpLm9uKCdjbGljaycsICdhJywgZnVuY3Rpb24oKXtcbiAgICBjb25zdCB0eHQgPSAkKHRoaXMpLnRleHQoKVxuICAgIGNvbnN0IHVybCA9IHRoaXMuaHJlZlxuXG4gICAgLy8gY2hlY2sgZm9yIHNhbWUgb3JpZ2luXG4gICAgY29uc3QgaSA9IHVybC5pbmRleE9mKHdpbmRvdy5sb2NhdGlvbi5ob3N0bmFtZSlcblxuICAgIC8vIGh0dHBzOi8vIG9yIGh0dHA6Ly9cbiAgICBpZiAoaSA9PSA4IHx8IGkgPT0gNykge1xuICAgICAgcmV0dXJuXG4gICAgfVxuXG4gICAgLy8gVHJhY2sgZXhpdFxuICAgIGFuYWx5dGljcy50cmFjaygnRXhpdCcsIHtcbiAgICAgIGhyZWY6IHVybCxcbiAgICAgIGxpbms6IHR4dFxuICAgIH0pXG4gIH0pXG59XG4iLCIvKipcbiAqIENvcHlyaWdodCAoYykgMjAxMS0yMDE0IEZlbGl4IEduYXNzXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2VcbiAqIGh0dHA6Ly9zcGluLmpzLm9yZy9cbiAqXG4gKiBFeGFtcGxlOlxuICAgIHZhciBvcHRzID0ge1xuICAgICAgbGluZXM6IDEyICAgICAgICAgICAgIC8vIFRoZSBudW1iZXIgb2YgbGluZXMgdG8gZHJhd1xuICAgICwgbGVuZ3RoOiA3ICAgICAgICAgICAgIC8vIFRoZSBsZW5ndGggb2YgZWFjaCBsaW5lXG4gICAgLCB3aWR0aDogNSAgICAgICAgICAgICAgLy8gVGhlIGxpbmUgdGhpY2tuZXNzXG4gICAgLCByYWRpdXM6IDEwICAgICAgICAgICAgLy8gVGhlIHJhZGl1cyBvZiB0aGUgaW5uZXIgY2lyY2xlXG4gICAgLCBzY2FsZTogMS4wICAgICAgICAgICAgLy8gU2NhbGVzIG92ZXJhbGwgc2l6ZSBvZiB0aGUgc3Bpbm5lclxuICAgICwgY29ybmVyczogMSAgICAgICAgICAgIC8vIFJvdW5kbmVzcyAoMC4uMSlcbiAgICAsIGNvbG9yOiAnIzAwMCcgICAgICAgICAvLyAjcmdiIG9yICNycmdnYmJcbiAgICAsIG9wYWNpdHk6IDEvNCAgICAgICAgICAvLyBPcGFjaXR5IG9mIHRoZSBsaW5lc1xuICAgICwgcm90YXRlOiAwICAgICAgICAgICAgIC8vIFJvdGF0aW9uIG9mZnNldFxuICAgICwgZGlyZWN0aW9uOiAxICAgICAgICAgIC8vIDE6IGNsb2Nrd2lzZSwgLTE6IGNvdW50ZXJjbG9ja3dpc2VcbiAgICAsIHNwZWVkOiAxICAgICAgICAgICAgICAvLyBSb3VuZHMgcGVyIHNlY29uZFxuICAgICwgdHJhaWw6IDEwMCAgICAgICAgICAgIC8vIEFmdGVyZ2xvdyBwZXJjZW50YWdlXG4gICAgLCBmcHM6IDIwICAgICAgICAgICAgICAgLy8gRnJhbWVzIHBlciBzZWNvbmQgd2hlbiB1c2luZyBzZXRUaW1lb3V0KClcbiAgICAsIHpJbmRleDogMmU5ICAgICAgICAgICAvLyBVc2UgYSBoaWdoIHotaW5kZXggYnkgZGVmYXVsdFxuICAgICwgY2xhc3NOYW1lOiAnc3Bpbm5lcicgIC8vIENTUyBjbGFzcyB0byBhc3NpZ24gdG8gdGhlIGVsZW1lbnRcbiAgICAsIHRvcDogJzUwJScgICAgICAgICAgICAvLyBjZW50ZXIgdmVydGljYWxseVxuICAgICwgbGVmdDogJzUwJScgICAgICAgICAgIC8vIGNlbnRlciBob3Jpem9udGFsbHlcbiAgICAsIHNoYWRvdzogZmFsc2UgICAgICAgICAvLyBXaGV0aGVyIHRvIHJlbmRlciBhIHNoYWRvd1xuICAgICwgaHdhY2NlbDogZmFsc2UgICAgICAgIC8vIFdoZXRoZXIgdG8gdXNlIGhhcmR3YXJlIGFjY2VsZXJhdGlvbiAobWlnaHQgYmUgYnVnZ3kpXG4gICAgLCBwb3NpdGlvbjogJ2Fic29sdXRlJyAgLy8gRWxlbWVudCBwb3NpdGlvbmluZ1xuICAgIH1cbiAgICB2YXIgdGFyZ2V0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2ZvbycpXG4gICAgdmFyIHNwaW5uZXIgPSBuZXcgU3Bpbm5lcihvcHRzKS5zcGluKHRhcmdldClcbiAqL1xuXG4gIHZhciBwcmVmaXhlcyA9IFsnd2Via2l0JywgJ01veicsICdtcycsICdPJ10gLyogVmVuZG9yIHByZWZpeGVzICovXG4gICAgLCBhbmltYXRpb25zID0ge30gLyogQW5pbWF0aW9uIHJ1bGVzIGtleWVkIGJ5IHRoZWlyIG5hbWUgKi9cbiAgICAsIHVzZUNzc0FuaW1hdGlvbnMgLyogV2hldGhlciB0byB1c2UgQ1NTIGFuaW1hdGlvbnMgb3Igc2V0VGltZW91dCAqL1xuICAgICwgc2hlZXQgLyogQSBzdHlsZXNoZWV0IHRvIGhvbGQgdGhlIEBrZXlmcmFtZSBvciBWTUwgcnVsZXMuICovXG5cbiAgLyoqXG4gICAqIFV0aWxpdHkgZnVuY3Rpb24gdG8gY3JlYXRlIGVsZW1lbnRzLiBJZiBubyB0YWcgbmFtZSBpcyBnaXZlbixcbiAgICogYSBESVYgaXMgY3JlYXRlZC4gT3B0aW9uYWxseSBwcm9wZXJ0aWVzIGNhbiBiZSBwYXNzZWQuXG4gICAqL1xuICBmdW5jdGlvbiBjcmVhdGVFbCAodGFnLCBwcm9wKSB7XG4gICAgdmFyIGVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCh0YWcgfHwgJ2RpdicpXG4gICAgICAsIG5cblxuICAgIGZvciAobiBpbiBwcm9wKSBlbFtuXSA9IHByb3Bbbl1cbiAgICByZXR1cm4gZWxcbiAgfVxuXG4gIC8qKlxuICAgKiBBcHBlbmRzIGNoaWxkcmVuIGFuZCByZXR1cm5zIHRoZSBwYXJlbnQuXG4gICAqL1xuICBmdW5jdGlvbiBpbnMgKHBhcmVudCAvKiBjaGlsZDEsIGNoaWxkMiwgLi4uKi8pIHtcbiAgICBmb3IgKHZhciBpID0gMSwgbiA9IGFyZ3VtZW50cy5sZW5ndGg7IGkgPCBuOyBpKyspIHtcbiAgICAgIHBhcmVudC5hcHBlbmRDaGlsZChhcmd1bWVudHNbaV0pXG4gICAgfVxuXG4gICAgcmV0dXJuIHBhcmVudFxuICB9XG5cbiAgLyoqXG4gICAqIENyZWF0ZXMgYW4gb3BhY2l0eSBrZXlmcmFtZSBhbmltYXRpb24gcnVsZSBhbmQgcmV0dXJucyBpdHMgbmFtZS5cbiAgICogU2luY2UgbW9zdCBtb2JpbGUgV2Via2l0cyBoYXZlIHRpbWluZyBpc3N1ZXMgd2l0aCBhbmltYXRpb24tZGVsYXksXG4gICAqIHdlIGNyZWF0ZSBzZXBhcmF0ZSBydWxlcyBmb3IgZWFjaCBsaW5lL3NlZ21lbnQuXG4gICAqL1xuICBmdW5jdGlvbiBhZGRBbmltYXRpb24gKGFscGhhLCB0cmFpbCwgaSwgbGluZXMpIHtcbiAgICB2YXIgbmFtZSA9IFsnb3BhY2l0eScsIHRyYWlsLCB+fihhbHBoYSAqIDEwMCksIGksIGxpbmVzXS5qb2luKCctJylcbiAgICAgICwgc3RhcnQgPSAwLjAxICsgaS9saW5lcyAqIDEwMFxuICAgICAgLCB6ID0gTWF0aC5tYXgoMSAtICgxLWFscGhhKSAvIHRyYWlsICogKDEwMC1zdGFydCksIGFscGhhKVxuICAgICAgLCBwcmVmaXggPSB1c2VDc3NBbmltYXRpb25zLnN1YnN0cmluZygwLCB1c2VDc3NBbmltYXRpb25zLmluZGV4T2YoJ0FuaW1hdGlvbicpKS50b0xvd2VyQ2FzZSgpXG4gICAgICAsIHByZSA9IHByZWZpeCAmJiAnLScgKyBwcmVmaXggKyAnLScgfHwgJydcblxuICAgIGlmICghYW5pbWF0aW9uc1tuYW1lXSkge1xuICAgICAgc2hlZXQuaW5zZXJ0UnVsZShcbiAgICAgICAgJ0AnICsgcHJlICsgJ2tleWZyYW1lcyAnICsgbmFtZSArICd7JyArXG4gICAgICAgICcwJXtvcGFjaXR5OicgKyB6ICsgJ30nICtcbiAgICAgICAgc3RhcnQgKyAnJXtvcGFjaXR5OicgKyBhbHBoYSArICd9JyArXG4gICAgICAgIChzdGFydCswLjAxKSArICcle29wYWNpdHk6MX0nICtcbiAgICAgICAgKHN0YXJ0K3RyYWlsKSAlIDEwMCArICcle29wYWNpdHk6JyArIGFscGhhICsgJ30nICtcbiAgICAgICAgJzEwMCV7b3BhY2l0eTonICsgeiArICd9JyArXG4gICAgICAgICd9Jywgc2hlZXQuY3NzUnVsZXMubGVuZ3RoKVxuXG4gICAgICBhbmltYXRpb25zW25hbWVdID0gMVxuICAgIH1cblxuICAgIHJldHVybiBuYW1lXG4gIH1cblxuICAvKipcbiAgICogVHJpZXMgdmFyaW91cyB2ZW5kb3IgcHJlZml4ZXMgYW5kIHJldHVybnMgdGhlIGZpcnN0IHN1cHBvcnRlZCBwcm9wZXJ0eS5cbiAgICovXG4gIGZ1bmN0aW9uIHZlbmRvciAoZWwsIHByb3ApIHtcbiAgICB2YXIgcyA9IGVsLnN0eWxlXG4gICAgICAsIHBwXG4gICAgICAsIGlcblxuICAgIHByb3AgPSBwcm9wLmNoYXJBdCgwKS50b1VwcGVyQ2FzZSgpICsgcHJvcC5zbGljZSgxKVxuICAgIGlmIChzW3Byb3BdICE9PSB1bmRlZmluZWQpIHJldHVybiBwcm9wXG4gICAgZm9yIChpID0gMDsgaSA8IHByZWZpeGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBwcCA9IHByZWZpeGVzW2ldK3Byb3BcbiAgICAgIGlmIChzW3BwXSAhPT0gdW5kZWZpbmVkKSByZXR1cm4gcHBcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogU2V0cyBtdWx0aXBsZSBzdHlsZSBwcm9wZXJ0aWVzIGF0IG9uY2UuXG4gICAqL1xuICBmdW5jdGlvbiBjc3MgKGVsLCBwcm9wKSB7XG4gICAgZm9yICh2YXIgbiBpbiBwcm9wKSB7XG4gICAgICBlbC5zdHlsZVt2ZW5kb3IoZWwsIG4pIHx8IG5dID0gcHJvcFtuXVxuICAgIH1cblxuICAgIHJldHVybiBlbFxuICB9XG5cbiAgLyoqXG4gICAqIEZpbGxzIGluIGRlZmF1bHQgdmFsdWVzLlxuICAgKi9cbiAgZnVuY3Rpb24gbWVyZ2UgKG9iaikge1xuICAgIGZvciAodmFyIGkgPSAxOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIgZGVmID0gYXJndW1lbnRzW2ldXG4gICAgICBmb3IgKHZhciBuIGluIGRlZikge1xuICAgICAgICBpZiAob2JqW25dID09PSB1bmRlZmluZWQpIG9ialtuXSA9IGRlZltuXVxuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gb2JqXG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyB0aGUgbGluZSBjb2xvciBmcm9tIHRoZSBnaXZlbiBzdHJpbmcgb3IgYXJyYXkuXG4gICAqL1xuICBmdW5jdGlvbiBnZXRDb2xvciAoY29sb3IsIGlkeCkge1xuICAgIHJldHVybiB0eXBlb2YgY29sb3IgPT0gJ3N0cmluZycgPyBjb2xvciA6IGNvbG9yW2lkeCAlIGNvbG9yLmxlbmd0aF1cbiAgfVxuXG4gIC8vIEJ1aWx0LWluIGRlZmF1bHRzXG5cbiAgdmFyIGRlZmF1bHRzID0ge1xuICAgIGxpbmVzOiAxMiAgICAgICAgICAgICAvLyBUaGUgbnVtYmVyIG9mIGxpbmVzIHRvIGRyYXdcbiAgLCBsZW5ndGg6IDcgICAgICAgICAgICAgLy8gVGhlIGxlbmd0aCBvZiBlYWNoIGxpbmVcbiAgLCB3aWR0aDogNSAgICAgICAgICAgICAgLy8gVGhlIGxpbmUgdGhpY2tuZXNzXG4gICwgcmFkaXVzOiAxMCAgICAgICAgICAgIC8vIFRoZSByYWRpdXMgb2YgdGhlIGlubmVyIGNpcmNsZVxuICAsIHNjYWxlOiAxLjAgICAgICAgICAgICAvLyBTY2FsZXMgb3ZlcmFsbCBzaXplIG9mIHRoZSBzcGlubmVyXG4gICwgY29ybmVyczogMSAgICAgICAgICAgIC8vIFJvdW5kbmVzcyAoMC4uMSlcbiAgLCBjb2xvcjogJyMwMDAnICAgICAgICAgLy8gI3JnYiBvciAjcnJnZ2JiXG4gICwgb3BhY2l0eTogMS80ICAgICAgICAgIC8vIE9wYWNpdHkgb2YgdGhlIGxpbmVzXG4gICwgcm90YXRlOiAwICAgICAgICAgICAgIC8vIFJvdGF0aW9uIG9mZnNldFxuICAsIGRpcmVjdGlvbjogMSAgICAgICAgICAvLyAxOiBjbG9ja3dpc2UsIC0xOiBjb3VudGVyY2xvY2t3aXNlXG4gICwgc3BlZWQ6IDEgICAgICAgICAgICAgIC8vIFJvdW5kcyBwZXIgc2Vjb25kXG4gICwgdHJhaWw6IDEwMCAgICAgICAgICAgIC8vIEFmdGVyZ2xvdyBwZXJjZW50YWdlXG4gICwgZnBzOiAyMCAgICAgICAgICAgICAgIC8vIEZyYW1lcyBwZXIgc2Vjb25kIHdoZW4gdXNpbmcgc2V0VGltZW91dCgpXG4gICwgekluZGV4OiAyZTkgICAgICAgICAgIC8vIFVzZSBhIGhpZ2ggei1pbmRleCBieSBkZWZhdWx0XG4gICwgY2xhc3NOYW1lOiAnc3Bpbm5lcicgIC8vIENTUyBjbGFzcyB0byBhc3NpZ24gdG8gdGhlIGVsZW1lbnRcbiAgLCB0b3A6ICc1MCUnICAgICAgICAgICAgLy8gY2VudGVyIHZlcnRpY2FsbHlcbiAgLCBsZWZ0OiAnNTAlJyAgICAgICAgICAgLy8gY2VudGVyIGhvcml6b250YWxseVxuICAsIHNoYWRvdzogZmFsc2UgICAgICAgICAvLyBXaGV0aGVyIHRvIHJlbmRlciBhIHNoYWRvd1xuICAsIGh3YWNjZWw6IGZhbHNlICAgICAgICAvLyBXaGV0aGVyIHRvIHVzZSBoYXJkd2FyZSBhY2NlbGVyYXRpb24gKG1pZ2h0IGJlIGJ1Z2d5KVxuICAsIHBvc2l0aW9uOiAnYWJzb2x1dGUnICAvLyBFbGVtZW50IHBvc2l0aW9uaW5nXG4gIH1cblxuICAvKiogVGhlIGNvbnN0cnVjdG9yICovXG4gIGZ1bmN0aW9uIFNwaW5uZXIgKG8pIHtcbiAgICB0aGlzLm9wdHMgPSBtZXJnZShvIHx8IHt9LCBTcGlubmVyLmRlZmF1bHRzLCBkZWZhdWx0cylcbiAgfVxuXG4gIC8vIEdsb2JhbCBkZWZhdWx0cyB0aGF0IG92ZXJyaWRlIHRoZSBidWlsdC1pbnM6XG4gIFNwaW5uZXIuZGVmYXVsdHMgPSB7fVxuXG4gIG1lcmdlKFNwaW5uZXIucHJvdG90eXBlLCB7XG4gICAgLyoqXG4gICAgICogQWRkcyB0aGUgc3Bpbm5lciB0byB0aGUgZ2l2ZW4gdGFyZ2V0IGVsZW1lbnQuIElmIHRoaXMgaW5zdGFuY2UgaXMgYWxyZWFkeVxuICAgICAqIHNwaW5uaW5nLCBpdCBpcyBhdXRvbWF0aWNhbGx5IHJlbW92ZWQgZnJvbSBpdHMgcHJldmlvdXMgdGFyZ2V0IGIgY2FsbGluZ1xuICAgICAqIHN0b3AoKSBpbnRlcm5hbGx5LlxuICAgICAqL1xuICAgIHNwaW46IGZ1bmN0aW9uICh0YXJnZXQpIHtcbiAgICAgIHRoaXMuc3RvcCgpXG5cbiAgICAgIHZhciBzZWxmID0gdGhpc1xuICAgICAgICAsIG8gPSBzZWxmLm9wdHNcbiAgICAgICAgLCBlbCA9IHNlbGYuZWwgPSBjcmVhdGVFbChudWxsLCB7Y2xhc3NOYW1lOiBvLmNsYXNzTmFtZX0pXG5cbiAgICAgIGNzcyhlbCwge1xuICAgICAgICBwb3NpdGlvbjogby5wb3NpdGlvblxuICAgICAgLCB3aWR0aDogMFxuICAgICAgLCB6SW5kZXg6IG8uekluZGV4XG4gICAgICAsIGxlZnQ6IG8ubGVmdFxuICAgICAgLCB0b3A6IG8udG9wXG4gICAgICB9KVxuXG4gICAgICBpZiAodGFyZ2V0KSB7XG4gICAgICAgIHRhcmdldC5pbnNlcnRCZWZvcmUoZWwsIHRhcmdldC5maXJzdENoaWxkIHx8IG51bGwpXG4gICAgICB9XG5cbiAgICAgIGVsLnNldEF0dHJpYnV0ZSgncm9sZScsICdwcm9ncmVzc2JhcicpXG4gICAgICBzZWxmLmxpbmVzKGVsLCBzZWxmLm9wdHMpXG5cbiAgICAgIGlmICghdXNlQ3NzQW5pbWF0aW9ucykge1xuICAgICAgICAvLyBObyBDU1MgYW5pbWF0aW9uIHN1cHBvcnQsIHVzZSBzZXRUaW1lb3V0KCkgaW5zdGVhZFxuICAgICAgICB2YXIgaSA9IDBcbiAgICAgICAgICAsIHN0YXJ0ID0gKG8ubGluZXMgLSAxKSAqICgxIC0gby5kaXJlY3Rpb24pIC8gMlxuICAgICAgICAgICwgYWxwaGFcbiAgICAgICAgICAsIGZwcyA9IG8uZnBzXG4gICAgICAgICAgLCBmID0gZnBzIC8gby5zcGVlZFxuICAgICAgICAgICwgb3N0ZXAgPSAoMSAtIG8ub3BhY2l0eSkgLyAoZiAqIG8udHJhaWwgLyAxMDApXG4gICAgICAgICAgLCBhc3RlcCA9IGYgLyBvLmxpbmVzXG5cbiAgICAgICAgOyhmdW5jdGlvbiBhbmltICgpIHtcbiAgICAgICAgICBpKytcbiAgICAgICAgICBmb3IgKHZhciBqID0gMDsgaiA8IG8ubGluZXM7IGorKykge1xuICAgICAgICAgICAgYWxwaGEgPSBNYXRoLm1heCgxIC0gKGkgKyAoby5saW5lcyAtIGopICogYXN0ZXApICUgZiAqIG9zdGVwLCBvLm9wYWNpdHkpXG5cbiAgICAgICAgICAgIHNlbGYub3BhY2l0eShlbCwgaiAqIG8uZGlyZWN0aW9uICsgc3RhcnQsIGFscGhhLCBvKVxuICAgICAgICAgIH1cbiAgICAgICAgICBzZWxmLnRpbWVvdXQgPSBzZWxmLmVsICYmIHNldFRpbWVvdXQoYW5pbSwgfn4oMTAwMCAvIGZwcykpXG4gICAgICAgIH0pKClcbiAgICAgIH1cbiAgICAgIHJldHVybiBzZWxmXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogU3RvcHMgYW5kIHJlbW92ZXMgdGhlIFNwaW5uZXIuXG4gICAgICovXG4gICwgc3RvcDogZnVuY3Rpb24gKCkge1xuICAgICAgdmFyIGVsID0gdGhpcy5lbFxuICAgICAgaWYgKGVsKSB7XG4gICAgICAgIGNsZWFyVGltZW91dCh0aGlzLnRpbWVvdXQpXG4gICAgICAgIGlmIChlbC5wYXJlbnROb2RlKSBlbC5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKGVsKVxuICAgICAgICB0aGlzLmVsID0gdW5kZWZpbmVkXG4gICAgICB9XG4gICAgICByZXR1cm4gdGhpc1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEludGVybmFsIG1ldGhvZCB0aGF0IGRyYXdzIHRoZSBpbmRpdmlkdWFsIGxpbmVzLiBXaWxsIGJlIG92ZXJ3cml0dGVuXG4gICAgICogaW4gVk1MIGZhbGxiYWNrIG1vZGUgYmVsb3cuXG4gICAgICovXG4gICwgbGluZXM6IGZ1bmN0aW9uIChlbCwgbykge1xuICAgICAgdmFyIGkgPSAwXG4gICAgICAgICwgc3RhcnQgPSAoby5saW5lcyAtIDEpICogKDEgLSBvLmRpcmVjdGlvbikgLyAyXG4gICAgICAgICwgc2VnXG5cbiAgICAgIGZ1bmN0aW9uIGZpbGwgKGNvbG9yLCBzaGFkb3cpIHtcbiAgICAgICAgcmV0dXJuIGNzcyhjcmVhdGVFbCgpLCB7XG4gICAgICAgICAgcG9zaXRpb246ICdhYnNvbHV0ZSdcbiAgICAgICAgLCB3aWR0aDogby5zY2FsZSAqIChvLmxlbmd0aCArIG8ud2lkdGgpICsgJ3B4J1xuICAgICAgICAsIGhlaWdodDogby5zY2FsZSAqIG8ud2lkdGggKyAncHgnXG4gICAgICAgICwgYmFja2dyb3VuZDogY29sb3JcbiAgICAgICAgLCBib3hTaGFkb3c6IHNoYWRvd1xuICAgICAgICAsIHRyYW5zZm9ybU9yaWdpbjogJ2xlZnQnXG4gICAgICAgICwgdHJhbnNmb3JtOiAncm90YXRlKCcgKyB+figzNjAvby5saW5lcyppICsgby5yb3RhdGUpICsgJ2RlZykgdHJhbnNsYXRlKCcgKyBvLnNjYWxlKm8ucmFkaXVzICsgJ3B4JyArICcsMCknXG4gICAgICAgICwgYm9yZGVyUmFkaXVzOiAoby5jb3JuZXJzICogby5zY2FsZSAqIG8ud2lkdGggPj4gMSkgKyAncHgnXG4gICAgICAgIH0pXG4gICAgICB9XG5cbiAgICAgIGZvciAoOyBpIDwgby5saW5lczsgaSsrKSB7XG4gICAgICAgIHNlZyA9IGNzcyhjcmVhdGVFbCgpLCB7XG4gICAgICAgICAgcG9zaXRpb246ICdhYnNvbHV0ZSdcbiAgICAgICAgLCB0b3A6IDEgKyB+KG8uc2NhbGUgKiBvLndpZHRoIC8gMikgKyAncHgnXG4gICAgICAgICwgdHJhbnNmb3JtOiBvLmh3YWNjZWwgPyAndHJhbnNsYXRlM2QoMCwwLDApJyA6ICcnXG4gICAgICAgICwgb3BhY2l0eTogby5vcGFjaXR5XG4gICAgICAgICwgYW5pbWF0aW9uOiB1c2VDc3NBbmltYXRpb25zICYmIGFkZEFuaW1hdGlvbihvLm9wYWNpdHksIG8udHJhaWwsIHN0YXJ0ICsgaSAqIG8uZGlyZWN0aW9uLCBvLmxpbmVzKSArICcgJyArIDEgLyBvLnNwZWVkICsgJ3MgbGluZWFyIGluZmluaXRlJ1xuICAgICAgICB9KVxuXG4gICAgICAgIGlmIChvLnNoYWRvdykgaW5zKHNlZywgY3NzKGZpbGwoJyMwMDAnLCAnMCAwIDRweCAjMDAwJyksIHt0b3A6ICcycHgnfSkpXG4gICAgICAgIGlucyhlbCwgaW5zKHNlZywgZmlsbChnZXRDb2xvcihvLmNvbG9yLCBpKSwgJzAgMCAxcHggcmdiYSgwLDAsMCwuMSknKSkpXG4gICAgICB9XG4gICAgICByZXR1cm4gZWxcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBJbnRlcm5hbCBtZXRob2QgdGhhdCBhZGp1c3RzIHRoZSBvcGFjaXR5IG9mIGEgc2luZ2xlIGxpbmUuXG4gICAgICogV2lsbCBiZSBvdmVyd3JpdHRlbiBpbiBWTUwgZmFsbGJhY2sgbW9kZSBiZWxvdy5cbiAgICAgKi9cbiAgLCBvcGFjaXR5OiBmdW5jdGlvbiAoZWwsIGksIHZhbCkge1xuICAgICAgaWYgKGkgPCBlbC5jaGlsZE5vZGVzLmxlbmd0aCkgZWwuY2hpbGROb2Rlc1tpXS5zdHlsZS5vcGFjaXR5ID0gdmFsXG4gICAgfVxuXG4gIH0pXG5cblxuICBmdW5jdGlvbiBpbml0Vk1MICgpIHtcblxuICAgIC8qIFV0aWxpdHkgZnVuY3Rpb24gdG8gY3JlYXRlIGEgVk1MIHRhZyAqL1xuICAgIGZ1bmN0aW9uIHZtbCAodGFnLCBhdHRyKSB7XG4gICAgICByZXR1cm4gY3JlYXRlRWwoJzwnICsgdGFnICsgJyB4bWxucz1cInVybjpzY2hlbWFzLW1pY3Jvc29mdC5jb206dm1sXCIgY2xhc3M9XCJzcGluLXZtbFwiPicsIGF0dHIpXG4gICAgfVxuXG4gICAgLy8gTm8gQ1NTIHRyYW5zZm9ybXMgYnV0IFZNTCBzdXBwb3J0LCBhZGQgYSBDU1MgcnVsZSBmb3IgVk1MIGVsZW1lbnRzOlxuICAgIHNoZWV0LmFkZFJ1bGUoJy5zcGluLXZtbCcsICdiZWhhdmlvcjp1cmwoI2RlZmF1bHQjVk1MKScpXG5cbiAgICBTcGlubmVyLnByb3RvdHlwZS5saW5lcyA9IGZ1bmN0aW9uIChlbCwgbykge1xuICAgICAgdmFyIHIgPSBvLnNjYWxlICogKG8ubGVuZ3RoICsgby53aWR0aClcbiAgICAgICAgLCBzID0gby5zY2FsZSAqIDIgKiByXG5cbiAgICAgIGZ1bmN0aW9uIGdycCAoKSB7XG4gICAgICAgIHJldHVybiBjc3MoXG4gICAgICAgICAgdm1sKCdncm91cCcsIHtcbiAgICAgICAgICAgIGNvb3Jkc2l6ZTogcyArICcgJyArIHNcbiAgICAgICAgICAsIGNvb3Jkb3JpZ2luOiAtciArICcgJyArIC1yXG4gICAgICAgICAgfSlcbiAgICAgICAgLCB7IHdpZHRoOiBzLCBoZWlnaHQ6IHMgfVxuICAgICAgICApXG4gICAgICB9XG5cbiAgICAgIHZhciBtYXJnaW4gPSAtKG8ud2lkdGggKyBvLmxlbmd0aCkgKiBvLnNjYWxlICogMiArICdweCdcbiAgICAgICAgLCBnID0gY3NzKGdycCgpLCB7cG9zaXRpb246ICdhYnNvbHV0ZScsIHRvcDogbWFyZ2luLCBsZWZ0OiBtYXJnaW59KVxuICAgICAgICAsIGlcblxuICAgICAgZnVuY3Rpb24gc2VnIChpLCBkeCwgZmlsdGVyKSB7XG4gICAgICAgIGlucyhcbiAgICAgICAgICBnXG4gICAgICAgICwgaW5zKFxuICAgICAgICAgICAgY3NzKGdycCgpLCB7cm90YXRpb246IDM2MCAvIG8ubGluZXMgKiBpICsgJ2RlZycsIGxlZnQ6IH5+ZHh9KVxuICAgICAgICAgICwgaW5zKFxuICAgICAgICAgICAgICBjc3MoXG4gICAgICAgICAgICAgICAgdm1sKCdyb3VuZHJlY3QnLCB7YXJjc2l6ZTogby5jb3JuZXJzfSlcbiAgICAgICAgICAgICAgLCB7IHdpZHRoOiByXG4gICAgICAgICAgICAgICAgLCBoZWlnaHQ6IG8uc2NhbGUgKiBvLndpZHRoXG4gICAgICAgICAgICAgICAgLCBsZWZ0OiBvLnNjYWxlICogby5yYWRpdXNcbiAgICAgICAgICAgICAgICAsIHRvcDogLW8uc2NhbGUgKiBvLndpZHRoID4+IDFcbiAgICAgICAgICAgICAgICAsIGZpbHRlcjogZmlsdGVyXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICApXG4gICAgICAgICAgICAsIHZtbCgnZmlsbCcsIHtjb2xvcjogZ2V0Q29sb3Ioby5jb2xvciwgaSksIG9wYWNpdHk6IG8ub3BhY2l0eX0pXG4gICAgICAgICAgICAsIHZtbCgnc3Ryb2tlJywge29wYWNpdHk6IDB9KSAvLyB0cmFuc3BhcmVudCBzdHJva2UgdG8gZml4IGNvbG9yIGJsZWVkaW5nIHVwb24gb3BhY2l0eSBjaGFuZ2VcbiAgICAgICAgICAgIClcbiAgICAgICAgICApXG4gICAgICAgIClcbiAgICAgIH1cblxuICAgICAgaWYgKG8uc2hhZG93KVxuICAgICAgICBmb3IgKGkgPSAxOyBpIDw9IG8ubGluZXM7IGkrKykge1xuICAgICAgICAgIHNlZyhpLCAtMiwgJ3Byb2dpZDpEWEltYWdlVHJhbnNmb3JtLk1pY3Jvc29mdC5CbHVyKHBpeGVscmFkaXVzPTIsbWFrZXNoYWRvdz0xLHNoYWRvd29wYWNpdHk9LjMpJylcbiAgICAgICAgfVxuXG4gICAgICBmb3IgKGkgPSAxOyBpIDw9IG8ubGluZXM7IGkrKykgc2VnKGkpXG4gICAgICByZXR1cm4gaW5zKGVsLCBnKVxuICAgIH1cblxuICAgIFNwaW5uZXIucHJvdG90eXBlLm9wYWNpdHkgPSBmdW5jdGlvbiAoZWwsIGksIHZhbCwgbykge1xuICAgICAgdmFyIGMgPSBlbC5maXJzdENoaWxkXG4gICAgICBvID0gby5zaGFkb3cgJiYgby5saW5lcyB8fCAwXG4gICAgICBpZiAoYyAmJiBpICsgbyA8IGMuY2hpbGROb2Rlcy5sZW5ndGgpIHtcbiAgICAgICAgYyA9IGMuY2hpbGROb2Rlc1tpICsgb107IGMgPSBjICYmIGMuZmlyc3RDaGlsZDsgYyA9IGMgJiYgYy5maXJzdENoaWxkXG4gICAgICAgIGlmIChjKSBjLm9wYWNpdHkgPSB2YWxcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBpZiAodHlwZW9mIGRvY3VtZW50ICE9PSAndW5kZWZpbmVkJykge1xuICAgIHNoZWV0ID0gKGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciBlbCA9IGNyZWF0ZUVsKCdzdHlsZScsIHt0eXBlIDogJ3RleHQvY3NzJ30pXG4gICAgICBpbnMoZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ2hlYWQnKVswXSwgZWwpXG4gICAgICByZXR1cm4gZWwuc2hlZXQgfHwgZWwuc3R5bGVTaGVldFxuICAgIH0oKSlcblxuICAgIHZhciBwcm9iZSA9IGNzcyhjcmVhdGVFbCgnZ3JvdXAnKSwge2JlaGF2aW9yOiAndXJsKCNkZWZhdWx0I1ZNTCknfSlcblxuICAgIGlmICghdmVuZG9yKHByb2JlLCAndHJhbnNmb3JtJykgJiYgcHJvYmUuYWRqKSBpbml0Vk1MKClcbiAgICBlbHNlIHVzZUNzc0FuaW1hdGlvbnMgPSB2ZW5kb3IocHJvYmUsICdhbmltYXRpb24nKVxuICB9XG5cbmV4cG9ydCBkZWZhdWx0IFNwaW5uZXIiLCIvKipcbiAqIFNsaWNlIHJlZmVyZW5jZS5cbiAqL1xuXG52YXIgc2xpY2UgPSBbXS5zbGljZTtcblxuLyoqXG4gKiBCaW5kIGBvYmpgIHRvIGBmbmAuXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IG9ialxuICogQHBhcmFtIHtGdW5jdGlvbnxTdHJpbmd9IGZuIG9yIHN0cmluZ1xuICogQHJldHVybiB7RnVuY3Rpb259XG4gKiBAYXBpIHB1YmxpY1xuICovXG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24ob2JqLCBmbil7XG4gIGlmICgnc3RyaW5nJyA9PSB0eXBlb2YgZm4pIGZuID0gb2JqW2ZuXTtcbiAgaWYgKCdmdW5jdGlvbicgIT0gdHlwZW9mIGZuKSB0aHJvdyBuZXcgRXJyb3IoJ2JpbmQoKSByZXF1aXJlcyBhIGZ1bmN0aW9uJyk7XG4gIHZhciBhcmdzID0gc2xpY2UuY2FsbChhcmd1bWVudHMsIDIpO1xuICByZXR1cm4gZnVuY3Rpb24oKXtcbiAgICByZXR1cm4gZm4uYXBwbHkob2JqLCBhcmdzLmNvbmNhdChzbGljZS5jYWxsKGFyZ3VtZW50cykpKTtcbiAgfVxufTtcbiIsInZhciBiaW5kID0gd2luZG93LmFkZEV2ZW50TGlzdGVuZXIgPyAnYWRkRXZlbnRMaXN0ZW5lcicgOiAnYXR0YWNoRXZlbnQnLFxuICAgIHVuYmluZCA9IHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyID8gJ3JlbW92ZUV2ZW50TGlzdGVuZXInIDogJ2RldGFjaEV2ZW50JyxcbiAgICBwcmVmaXggPSBiaW5kICE9PSAnYWRkRXZlbnRMaXN0ZW5lcicgPyAnb24nIDogJyc7XG5cbi8qKlxuICogQmluZCBgZWxgIGV2ZW50IGB0eXBlYCB0byBgZm5gLlxuICpcbiAqIEBwYXJhbSB7RWxlbWVudH0gZWxcbiAqIEBwYXJhbSB7U3RyaW5nfSB0eXBlXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmblxuICogQHBhcmFtIHtCb29sZWFufSBjYXB0dXJlXG4gKiBAcmV0dXJuIHtGdW5jdGlvbn1cbiAqIEBhcGkgcHVibGljXG4gKi9cblxuZXhwb3J0cy5iaW5kID0gZnVuY3Rpb24oZWwsIHR5cGUsIGZuLCBjYXB0dXJlKXtcbiAgZWxbYmluZF0ocHJlZml4ICsgdHlwZSwgZm4sIGNhcHR1cmUgfHwgZmFsc2UpO1xuICByZXR1cm4gZm47XG59O1xuXG4vKipcbiAqIFVuYmluZCBgZWxgIGV2ZW50IGB0eXBlYCdzIGNhbGxiYWNrIGBmbmAuXG4gKlxuICogQHBhcmFtIHtFbGVtZW50fSBlbFxuICogQHBhcmFtIHtTdHJpbmd9IHR5cGVcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZuXG4gKiBAcGFyYW0ge0Jvb2xlYW59IGNhcHR1cmVcbiAqIEByZXR1cm4ge0Z1bmN0aW9ufVxuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5leHBvcnRzLnVuYmluZCA9IGZ1bmN0aW9uKGVsLCB0eXBlLCBmbiwgY2FwdHVyZSl7XG4gIGVsW3VuYmluZF0ocHJlZml4ICsgdHlwZSwgZm4sIGNhcHR1cmUgfHwgZmFsc2UpO1xuICByZXR1cm4gZm47XG59OyIsIlxuXG5tb2R1bGUuZXhwb3J0cyA9IG9zKCk7XG5cbmZ1bmN0aW9uIG9zKCkge1xuICB2YXIgdWEgPSBuYXZpZ2F0b3IudXNlckFnZW50O1xuICBpZiAoL21hYy9pLnRlc3QodWEpKSByZXR1cm4gJ21hYyc7XG4gIGlmICgvd2luL2kudGVzdCh1YSkpIHJldHVybiAnd2luZG93cyc7XG4gIGlmICgvbGludXgvaS50ZXN0KHVhKSkgcmV0dXJuICdsaW51eCc7XG59XG4iLCIvLyB0aGUgd2hhdHdnLWZldGNoIHBvbHlmaWxsIGluc3RhbGxzIHRoZSBmZXRjaCgpIGZ1bmN0aW9uXG4vLyBvbiB0aGUgZ2xvYmFsIG9iamVjdCAod2luZG93IG9yIHNlbGYpXG4vL1xuLy8gUmV0dXJuIHRoYXQgYXMgdGhlIGV4cG9ydCBmb3IgdXNlIGluIFdlYnBhY2ssIEJyb3dzZXJpZnkgZXRjLlxucmVxdWlyZSgnd2hhdHdnLWZldGNoJyk7XG5tb2R1bGUuZXhwb3J0cyA9IHNlbGYuZmV0Y2guYmluZChzZWxmKTtcbiIsIihmdW5jdGlvbihzZWxmKSB7XG4gICd1c2Ugc3RyaWN0JztcblxuICBpZiAoc2VsZi5mZXRjaCkge1xuICAgIHJldHVyblxuICB9XG5cbiAgdmFyIHN1cHBvcnQgPSB7XG4gICAgc2VhcmNoUGFyYW1zOiAnVVJMU2VhcmNoUGFyYW1zJyBpbiBzZWxmLFxuICAgIGl0ZXJhYmxlOiAnU3ltYm9sJyBpbiBzZWxmICYmICdpdGVyYXRvcicgaW4gU3ltYm9sLFxuICAgIGJsb2I6ICdGaWxlUmVhZGVyJyBpbiBzZWxmICYmICdCbG9iJyBpbiBzZWxmICYmIChmdW5jdGlvbigpIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIG5ldyBCbG9iKClcbiAgICAgICAgcmV0dXJuIHRydWVcbiAgICAgIH0gY2F0Y2goZSkge1xuICAgICAgICByZXR1cm4gZmFsc2VcbiAgICAgIH1cbiAgICB9KSgpLFxuICAgIGZvcm1EYXRhOiAnRm9ybURhdGEnIGluIHNlbGYsXG4gICAgYXJyYXlCdWZmZXI6ICdBcnJheUJ1ZmZlcicgaW4gc2VsZlxuICB9XG5cbiAgZnVuY3Rpb24gbm9ybWFsaXplTmFtZShuYW1lKSB7XG4gICAgaWYgKHR5cGVvZiBuYW1lICE9PSAnc3RyaW5nJykge1xuICAgICAgbmFtZSA9IFN0cmluZyhuYW1lKVxuICAgIH1cbiAgICBpZiAoL1teYS16MC05XFwtIyQlJicqKy5cXF5fYHx+XS9pLnRlc3QobmFtZSkpIHtcbiAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ0ludmFsaWQgY2hhcmFjdGVyIGluIGhlYWRlciBmaWVsZCBuYW1lJylcbiAgICB9XG4gICAgcmV0dXJuIG5hbWUudG9Mb3dlckNhc2UoKVxuICB9XG5cbiAgZnVuY3Rpb24gbm9ybWFsaXplVmFsdWUodmFsdWUpIHtcbiAgICBpZiAodHlwZW9mIHZhbHVlICE9PSAnc3RyaW5nJykge1xuICAgICAgdmFsdWUgPSBTdHJpbmcodmFsdWUpXG4gICAgfVxuICAgIHJldHVybiB2YWx1ZVxuICB9XG5cbiAgLy8gQnVpbGQgYSBkZXN0cnVjdGl2ZSBpdGVyYXRvciBmb3IgdGhlIHZhbHVlIGxpc3RcbiAgZnVuY3Rpb24gaXRlcmF0b3JGb3IoaXRlbXMpIHtcbiAgICB2YXIgaXRlcmF0b3IgPSB7XG4gICAgICBuZXh0OiBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIHZhbHVlID0gaXRlbXMuc2hpZnQoKVxuICAgICAgICByZXR1cm4ge2RvbmU6IHZhbHVlID09PSB1bmRlZmluZWQsIHZhbHVlOiB2YWx1ZX1cbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoc3VwcG9ydC5pdGVyYWJsZSkge1xuICAgICAgaXRlcmF0b3JbU3ltYm9sLml0ZXJhdG9yXSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gaXRlcmF0b3JcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gaXRlcmF0b3JcbiAgfVxuXG4gIGZ1bmN0aW9uIEhlYWRlcnMoaGVhZGVycykge1xuICAgIHRoaXMubWFwID0ge31cblxuICAgIGlmIChoZWFkZXJzIGluc3RhbmNlb2YgSGVhZGVycykge1xuICAgICAgaGVhZGVycy5mb3JFYWNoKGZ1bmN0aW9uKHZhbHVlLCBuYW1lKSB7XG4gICAgICAgIHRoaXMuYXBwZW5kKG5hbWUsIHZhbHVlKVxuICAgICAgfSwgdGhpcylcblxuICAgIH0gZWxzZSBpZiAoaGVhZGVycykge1xuICAgICAgT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXMoaGVhZGVycykuZm9yRWFjaChmdW5jdGlvbihuYW1lKSB7XG4gICAgICAgIHRoaXMuYXBwZW5kKG5hbWUsIGhlYWRlcnNbbmFtZV0pXG4gICAgICB9LCB0aGlzKVxuICAgIH1cbiAgfVxuXG4gIEhlYWRlcnMucHJvdG90eXBlLmFwcGVuZCA9IGZ1bmN0aW9uKG5hbWUsIHZhbHVlKSB7XG4gICAgbmFtZSA9IG5vcm1hbGl6ZU5hbWUobmFtZSlcbiAgICB2YWx1ZSA9IG5vcm1hbGl6ZVZhbHVlKHZhbHVlKVxuICAgIHZhciBsaXN0ID0gdGhpcy5tYXBbbmFtZV1cbiAgICBpZiAoIWxpc3QpIHtcbiAgICAgIGxpc3QgPSBbXVxuICAgICAgdGhpcy5tYXBbbmFtZV0gPSBsaXN0XG4gICAgfVxuICAgIGxpc3QucHVzaCh2YWx1ZSlcbiAgfVxuXG4gIEhlYWRlcnMucHJvdG90eXBlWydkZWxldGUnXSA9IGZ1bmN0aW9uKG5hbWUpIHtcbiAgICBkZWxldGUgdGhpcy5tYXBbbm9ybWFsaXplTmFtZShuYW1lKV1cbiAgfVxuXG4gIEhlYWRlcnMucHJvdG90eXBlLmdldCA9IGZ1bmN0aW9uKG5hbWUpIHtcbiAgICB2YXIgdmFsdWVzID0gdGhpcy5tYXBbbm9ybWFsaXplTmFtZShuYW1lKV1cbiAgICByZXR1cm4gdmFsdWVzID8gdmFsdWVzWzBdIDogbnVsbFxuICB9XG5cbiAgSGVhZGVycy5wcm90b3R5cGUuZ2V0QWxsID0gZnVuY3Rpb24obmFtZSkge1xuICAgIHJldHVybiB0aGlzLm1hcFtub3JtYWxpemVOYW1lKG5hbWUpXSB8fCBbXVxuICB9XG5cbiAgSGVhZGVycy5wcm90b3R5cGUuaGFzID0gZnVuY3Rpb24obmFtZSkge1xuICAgIHJldHVybiB0aGlzLm1hcC5oYXNPd25Qcm9wZXJ0eShub3JtYWxpemVOYW1lKG5hbWUpKVxuICB9XG5cbiAgSGVhZGVycy5wcm90b3R5cGUuc2V0ID0gZnVuY3Rpb24obmFtZSwgdmFsdWUpIHtcbiAgICB0aGlzLm1hcFtub3JtYWxpemVOYW1lKG5hbWUpXSA9IFtub3JtYWxpemVWYWx1ZSh2YWx1ZSldXG4gIH1cblxuICBIZWFkZXJzLnByb3RvdHlwZS5mb3JFYWNoID0gZnVuY3Rpb24oY2FsbGJhY2ssIHRoaXNBcmcpIHtcbiAgICBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyh0aGlzLm1hcCkuZm9yRWFjaChmdW5jdGlvbihuYW1lKSB7XG4gICAgICB0aGlzLm1hcFtuYW1lXS5mb3JFYWNoKGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICAgIGNhbGxiYWNrLmNhbGwodGhpc0FyZywgdmFsdWUsIG5hbWUsIHRoaXMpXG4gICAgICB9LCB0aGlzKVxuICAgIH0sIHRoaXMpXG4gIH1cblxuICBIZWFkZXJzLnByb3RvdHlwZS5rZXlzID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIGl0ZW1zID0gW11cbiAgICB0aGlzLmZvckVhY2goZnVuY3Rpb24odmFsdWUsIG5hbWUpIHsgaXRlbXMucHVzaChuYW1lKSB9KVxuICAgIHJldHVybiBpdGVyYXRvckZvcihpdGVtcylcbiAgfVxuXG4gIEhlYWRlcnMucHJvdG90eXBlLnZhbHVlcyA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBpdGVtcyA9IFtdXG4gICAgdGhpcy5mb3JFYWNoKGZ1bmN0aW9uKHZhbHVlKSB7IGl0ZW1zLnB1c2godmFsdWUpIH0pXG4gICAgcmV0dXJuIGl0ZXJhdG9yRm9yKGl0ZW1zKVxuICB9XG5cbiAgSGVhZGVycy5wcm90b3R5cGUuZW50cmllcyA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBpdGVtcyA9IFtdXG4gICAgdGhpcy5mb3JFYWNoKGZ1bmN0aW9uKHZhbHVlLCBuYW1lKSB7IGl0ZW1zLnB1c2goW25hbWUsIHZhbHVlXSkgfSlcbiAgICByZXR1cm4gaXRlcmF0b3JGb3IoaXRlbXMpXG4gIH1cblxuICBpZiAoc3VwcG9ydC5pdGVyYWJsZSkge1xuICAgIEhlYWRlcnMucHJvdG90eXBlW1N5bWJvbC5pdGVyYXRvcl0gPSBIZWFkZXJzLnByb3RvdHlwZS5lbnRyaWVzXG4gIH1cblxuICBmdW5jdGlvbiBjb25zdW1lZChib2R5KSB7XG4gICAgaWYgKGJvZHkuYm9keVVzZWQpIHtcbiAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdChuZXcgVHlwZUVycm9yKCdBbHJlYWR5IHJlYWQnKSlcbiAgICB9XG4gICAgYm9keS5ib2R5VXNlZCA9IHRydWVcbiAgfVxuXG4gIGZ1bmN0aW9uIGZpbGVSZWFkZXJSZWFkeShyZWFkZXIpIHtcbiAgICByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICByZWFkZXIub25sb2FkID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHJlc29sdmUocmVhZGVyLnJlc3VsdClcbiAgICAgIH1cbiAgICAgIHJlYWRlci5vbmVycm9yID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHJlamVjdChyZWFkZXIuZXJyb3IpXG4gICAgICB9XG4gICAgfSlcbiAgfVxuXG4gIGZ1bmN0aW9uIHJlYWRCbG9iQXNBcnJheUJ1ZmZlcihibG9iKSB7XG4gICAgdmFyIHJlYWRlciA9IG5ldyBGaWxlUmVhZGVyKClcbiAgICByZWFkZXIucmVhZEFzQXJyYXlCdWZmZXIoYmxvYilcbiAgICByZXR1cm4gZmlsZVJlYWRlclJlYWR5KHJlYWRlcilcbiAgfVxuXG4gIGZ1bmN0aW9uIHJlYWRCbG9iQXNUZXh0KGJsb2IpIHtcbiAgICB2YXIgcmVhZGVyID0gbmV3IEZpbGVSZWFkZXIoKVxuICAgIHJlYWRlci5yZWFkQXNUZXh0KGJsb2IpXG4gICAgcmV0dXJuIGZpbGVSZWFkZXJSZWFkeShyZWFkZXIpXG4gIH1cblxuICBmdW5jdGlvbiBCb2R5KCkge1xuICAgIHRoaXMuYm9keVVzZWQgPSBmYWxzZVxuXG4gICAgdGhpcy5faW5pdEJvZHkgPSBmdW5jdGlvbihib2R5KSB7XG4gICAgICB0aGlzLl9ib2R5SW5pdCA9IGJvZHlcbiAgICAgIGlmICh0eXBlb2YgYm9keSA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgdGhpcy5fYm9keVRleHQgPSBib2R5XG4gICAgICB9IGVsc2UgaWYgKHN1cHBvcnQuYmxvYiAmJiBCbG9iLnByb3RvdHlwZS5pc1Byb3RvdHlwZU9mKGJvZHkpKSB7XG4gICAgICAgIHRoaXMuX2JvZHlCbG9iID0gYm9keVxuICAgICAgfSBlbHNlIGlmIChzdXBwb3J0LmZvcm1EYXRhICYmIEZvcm1EYXRhLnByb3RvdHlwZS5pc1Byb3RvdHlwZU9mKGJvZHkpKSB7XG4gICAgICAgIHRoaXMuX2JvZHlGb3JtRGF0YSA9IGJvZHlcbiAgICAgIH0gZWxzZSBpZiAoc3VwcG9ydC5zZWFyY2hQYXJhbXMgJiYgVVJMU2VhcmNoUGFyYW1zLnByb3RvdHlwZS5pc1Byb3RvdHlwZU9mKGJvZHkpKSB7XG4gICAgICAgIHRoaXMuX2JvZHlUZXh0ID0gYm9keS50b1N0cmluZygpXG4gICAgICB9IGVsc2UgaWYgKCFib2R5KSB7XG4gICAgICAgIHRoaXMuX2JvZHlUZXh0ID0gJydcbiAgICAgIH0gZWxzZSBpZiAoc3VwcG9ydC5hcnJheUJ1ZmZlciAmJiBBcnJheUJ1ZmZlci5wcm90b3R5cGUuaXNQcm90b3R5cGVPZihib2R5KSkge1xuICAgICAgICAvLyBPbmx5IHN1cHBvcnQgQXJyYXlCdWZmZXJzIGZvciBQT1NUIG1ldGhvZC5cbiAgICAgICAgLy8gUmVjZWl2aW5nIEFycmF5QnVmZmVycyBoYXBwZW5zIHZpYSBCbG9icywgaW5zdGVhZC5cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcigndW5zdXBwb3J0ZWQgQm9keUluaXQgdHlwZScpXG4gICAgICB9XG5cbiAgICAgIGlmICghdGhpcy5oZWFkZXJzLmdldCgnY29udGVudC10eXBlJykpIHtcbiAgICAgICAgaWYgKHR5cGVvZiBib2R5ID09PSAnc3RyaW5nJykge1xuICAgICAgICAgIHRoaXMuaGVhZGVycy5zZXQoJ2NvbnRlbnQtdHlwZScsICd0ZXh0L3BsYWluO2NoYXJzZXQ9VVRGLTgnKVxuICAgICAgICB9IGVsc2UgaWYgKHRoaXMuX2JvZHlCbG9iICYmIHRoaXMuX2JvZHlCbG9iLnR5cGUpIHtcbiAgICAgICAgICB0aGlzLmhlYWRlcnMuc2V0KCdjb250ZW50LXR5cGUnLCB0aGlzLl9ib2R5QmxvYi50eXBlKVxuICAgICAgICB9IGVsc2UgaWYgKHN1cHBvcnQuc2VhcmNoUGFyYW1zICYmIFVSTFNlYXJjaFBhcmFtcy5wcm90b3R5cGUuaXNQcm90b3R5cGVPZihib2R5KSkge1xuICAgICAgICAgIHRoaXMuaGVhZGVycy5zZXQoJ2NvbnRlbnQtdHlwZScsICdhcHBsaWNhdGlvbi94LXd3dy1mb3JtLXVybGVuY29kZWQ7Y2hhcnNldD1VVEYtOCcpXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoc3VwcG9ydC5ibG9iKSB7XG4gICAgICB0aGlzLmJsb2IgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIHJlamVjdGVkID0gY29uc3VtZWQodGhpcylcbiAgICAgICAgaWYgKHJlamVjdGVkKSB7XG4gICAgICAgICAgcmV0dXJuIHJlamVjdGVkXG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5fYm9keUJsb2IpIHtcbiAgICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKHRoaXMuX2JvZHlCbG9iKVxuICAgICAgICB9IGVsc2UgaWYgKHRoaXMuX2JvZHlGb3JtRGF0YSkge1xuICAgICAgICAgIHRocm93IG5ldyBFcnJvcignY291bGQgbm90IHJlYWQgRm9ybURhdGEgYm9keSBhcyBibG9iJylcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKG5ldyBCbG9iKFt0aGlzLl9ib2R5VGV4dF0pKVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHRoaXMuYXJyYXlCdWZmZXIgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuYmxvYigpLnRoZW4ocmVhZEJsb2JBc0FycmF5QnVmZmVyKVxuICAgICAgfVxuXG4gICAgICB0aGlzLnRleHQgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIHJlamVjdGVkID0gY29uc3VtZWQodGhpcylcbiAgICAgICAgaWYgKHJlamVjdGVkKSB7XG4gICAgICAgICAgcmV0dXJuIHJlamVjdGVkXG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5fYm9keUJsb2IpIHtcbiAgICAgICAgICByZXR1cm4gcmVhZEJsb2JBc1RleHQodGhpcy5fYm9keUJsb2IpXG4gICAgICAgIH0gZWxzZSBpZiAodGhpcy5fYm9keUZvcm1EYXRhKSB7XG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdjb3VsZCBub3QgcmVhZCBGb3JtRGF0YSBib2R5IGFzIHRleHQnKVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUodGhpcy5fYm9keVRleHQpXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy50ZXh0ID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciByZWplY3RlZCA9IGNvbnN1bWVkKHRoaXMpXG4gICAgICAgIHJldHVybiByZWplY3RlZCA/IHJlamVjdGVkIDogUHJvbWlzZS5yZXNvbHZlKHRoaXMuX2JvZHlUZXh0KVxuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChzdXBwb3J0LmZvcm1EYXRhKSB7XG4gICAgICB0aGlzLmZvcm1EYXRhID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnRleHQoKS50aGVuKGRlY29kZSlcbiAgICAgIH1cbiAgICB9XG5cbiAgICB0aGlzLmpzb24gPSBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiB0aGlzLnRleHQoKS50aGVuKEpTT04ucGFyc2UpXG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXNcbiAgfVxuXG4gIC8vIEhUVFAgbWV0aG9kcyB3aG9zZSBjYXBpdGFsaXphdGlvbiBzaG91bGQgYmUgbm9ybWFsaXplZFxuICB2YXIgbWV0aG9kcyA9IFsnREVMRVRFJywgJ0dFVCcsICdIRUFEJywgJ09QVElPTlMnLCAnUE9TVCcsICdQVVQnXVxuXG4gIGZ1bmN0aW9uIG5vcm1hbGl6ZU1ldGhvZChtZXRob2QpIHtcbiAgICB2YXIgdXBjYXNlZCA9IG1ldGhvZC50b1VwcGVyQ2FzZSgpXG4gICAgcmV0dXJuIChtZXRob2RzLmluZGV4T2YodXBjYXNlZCkgPiAtMSkgPyB1cGNhc2VkIDogbWV0aG9kXG4gIH1cblxuICBmdW5jdGlvbiBSZXF1ZXN0KGlucHV0LCBvcHRpb25zKSB7XG4gICAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge31cbiAgICB2YXIgYm9keSA9IG9wdGlvbnMuYm9keVxuICAgIGlmIChSZXF1ZXN0LnByb3RvdHlwZS5pc1Byb3RvdHlwZU9mKGlucHV0KSkge1xuICAgICAgaWYgKGlucHV0LmJvZHlVc2VkKSB7XG4gICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ0FscmVhZHkgcmVhZCcpXG4gICAgICB9XG4gICAgICB0aGlzLnVybCA9IGlucHV0LnVybFxuICAgICAgdGhpcy5jcmVkZW50aWFscyA9IGlucHV0LmNyZWRlbnRpYWxzXG4gICAgICBpZiAoIW9wdGlvbnMuaGVhZGVycykge1xuICAgICAgICB0aGlzLmhlYWRlcnMgPSBuZXcgSGVhZGVycyhpbnB1dC5oZWFkZXJzKVxuICAgICAgfVxuICAgICAgdGhpcy5tZXRob2QgPSBpbnB1dC5tZXRob2RcbiAgICAgIHRoaXMubW9kZSA9IGlucHV0Lm1vZGVcbiAgICAgIGlmICghYm9keSkge1xuICAgICAgICBib2R5ID0gaW5wdXQuX2JvZHlJbml0XG4gICAgICAgIGlucHV0LmJvZHlVc2VkID0gdHJ1ZVxuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnVybCA9IGlucHV0XG4gICAgfVxuXG4gICAgdGhpcy5jcmVkZW50aWFscyA9IG9wdGlvbnMuY3JlZGVudGlhbHMgfHwgdGhpcy5jcmVkZW50aWFscyB8fCAnb21pdCdcbiAgICBpZiAob3B0aW9ucy5oZWFkZXJzIHx8ICF0aGlzLmhlYWRlcnMpIHtcbiAgICAgIHRoaXMuaGVhZGVycyA9IG5ldyBIZWFkZXJzKG9wdGlvbnMuaGVhZGVycylcbiAgICB9XG4gICAgdGhpcy5tZXRob2QgPSBub3JtYWxpemVNZXRob2Qob3B0aW9ucy5tZXRob2QgfHwgdGhpcy5tZXRob2QgfHwgJ0dFVCcpXG4gICAgdGhpcy5tb2RlID0gb3B0aW9ucy5tb2RlIHx8IHRoaXMubW9kZSB8fCBudWxsXG4gICAgdGhpcy5yZWZlcnJlciA9IG51bGxcblxuICAgIGlmICgodGhpcy5tZXRob2QgPT09ICdHRVQnIHx8IHRoaXMubWV0aG9kID09PSAnSEVBRCcpICYmIGJvZHkpIHtcbiAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ0JvZHkgbm90IGFsbG93ZWQgZm9yIEdFVCBvciBIRUFEIHJlcXVlc3RzJylcbiAgICB9XG4gICAgdGhpcy5faW5pdEJvZHkoYm9keSlcbiAgfVxuXG4gIFJlcXVlc3QucHJvdG90eXBlLmNsb25lID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIG5ldyBSZXF1ZXN0KHRoaXMpXG4gIH1cblxuICBmdW5jdGlvbiBkZWNvZGUoYm9keSkge1xuICAgIHZhciBmb3JtID0gbmV3IEZvcm1EYXRhKClcbiAgICBib2R5LnRyaW0oKS5zcGxpdCgnJicpLmZvckVhY2goZnVuY3Rpb24oYnl0ZXMpIHtcbiAgICAgIGlmIChieXRlcykge1xuICAgICAgICB2YXIgc3BsaXQgPSBieXRlcy5zcGxpdCgnPScpXG4gICAgICAgIHZhciBuYW1lID0gc3BsaXQuc2hpZnQoKS5yZXBsYWNlKC9cXCsvZywgJyAnKVxuICAgICAgICB2YXIgdmFsdWUgPSBzcGxpdC5qb2luKCc9JykucmVwbGFjZSgvXFwrL2csICcgJylcbiAgICAgICAgZm9ybS5hcHBlbmQoZGVjb2RlVVJJQ29tcG9uZW50KG5hbWUpLCBkZWNvZGVVUklDb21wb25lbnQodmFsdWUpKVxuICAgICAgfVxuICAgIH0pXG4gICAgcmV0dXJuIGZvcm1cbiAgfVxuXG4gIGZ1bmN0aW9uIGhlYWRlcnMoeGhyKSB7XG4gICAgdmFyIGhlYWQgPSBuZXcgSGVhZGVycygpXG4gICAgdmFyIHBhaXJzID0gKHhoci5nZXRBbGxSZXNwb25zZUhlYWRlcnMoKSB8fCAnJykudHJpbSgpLnNwbGl0KCdcXG4nKVxuICAgIHBhaXJzLmZvckVhY2goZnVuY3Rpb24oaGVhZGVyKSB7XG4gICAgICB2YXIgc3BsaXQgPSBoZWFkZXIudHJpbSgpLnNwbGl0KCc6JylcbiAgICAgIHZhciBrZXkgPSBzcGxpdC5zaGlmdCgpLnRyaW0oKVxuICAgICAgdmFyIHZhbHVlID0gc3BsaXQuam9pbignOicpLnRyaW0oKVxuICAgICAgaGVhZC5hcHBlbmQoa2V5LCB2YWx1ZSlcbiAgICB9KVxuICAgIHJldHVybiBoZWFkXG4gIH1cblxuICBCb2R5LmNhbGwoUmVxdWVzdC5wcm90b3R5cGUpXG5cbiAgZnVuY3Rpb24gUmVzcG9uc2UoYm9keUluaXQsIG9wdGlvbnMpIHtcbiAgICBpZiAoIW9wdGlvbnMpIHtcbiAgICAgIG9wdGlvbnMgPSB7fVxuICAgIH1cblxuICAgIHRoaXMudHlwZSA9ICdkZWZhdWx0J1xuICAgIHRoaXMuc3RhdHVzID0gb3B0aW9ucy5zdGF0dXNcbiAgICB0aGlzLm9rID0gdGhpcy5zdGF0dXMgPj0gMjAwICYmIHRoaXMuc3RhdHVzIDwgMzAwXG4gICAgdGhpcy5zdGF0dXNUZXh0ID0gb3B0aW9ucy5zdGF0dXNUZXh0XG4gICAgdGhpcy5oZWFkZXJzID0gb3B0aW9ucy5oZWFkZXJzIGluc3RhbmNlb2YgSGVhZGVycyA/IG9wdGlvbnMuaGVhZGVycyA6IG5ldyBIZWFkZXJzKG9wdGlvbnMuaGVhZGVycylcbiAgICB0aGlzLnVybCA9IG9wdGlvbnMudXJsIHx8ICcnXG4gICAgdGhpcy5faW5pdEJvZHkoYm9keUluaXQpXG4gIH1cblxuICBCb2R5LmNhbGwoUmVzcG9uc2UucHJvdG90eXBlKVxuXG4gIFJlc3BvbnNlLnByb3RvdHlwZS5jbG9uZSA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBuZXcgUmVzcG9uc2UodGhpcy5fYm9keUluaXQsIHtcbiAgICAgIHN0YXR1czogdGhpcy5zdGF0dXMsXG4gICAgICBzdGF0dXNUZXh0OiB0aGlzLnN0YXR1c1RleHQsXG4gICAgICBoZWFkZXJzOiBuZXcgSGVhZGVycyh0aGlzLmhlYWRlcnMpLFxuICAgICAgdXJsOiB0aGlzLnVybFxuICAgIH0pXG4gIH1cblxuICBSZXNwb25zZS5lcnJvciA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciByZXNwb25zZSA9IG5ldyBSZXNwb25zZShudWxsLCB7c3RhdHVzOiAwLCBzdGF0dXNUZXh0OiAnJ30pXG4gICAgcmVzcG9uc2UudHlwZSA9ICdlcnJvcidcbiAgICByZXR1cm4gcmVzcG9uc2VcbiAgfVxuXG4gIHZhciByZWRpcmVjdFN0YXR1c2VzID0gWzMwMSwgMzAyLCAzMDMsIDMwNywgMzA4XVxuXG4gIFJlc3BvbnNlLnJlZGlyZWN0ID0gZnVuY3Rpb24odXJsLCBzdGF0dXMpIHtcbiAgICBpZiAocmVkaXJlY3RTdGF0dXNlcy5pbmRleE9mKHN0YXR1cykgPT09IC0xKSB7XG4gICAgICB0aHJvdyBuZXcgUmFuZ2VFcnJvcignSW52YWxpZCBzdGF0dXMgY29kZScpXG4gICAgfVxuXG4gICAgcmV0dXJuIG5ldyBSZXNwb25zZShudWxsLCB7c3RhdHVzOiBzdGF0dXMsIGhlYWRlcnM6IHtsb2NhdGlvbjogdXJsfX0pXG4gIH1cblxuICBzZWxmLkhlYWRlcnMgPSBIZWFkZXJzXG4gIHNlbGYuUmVxdWVzdCA9IFJlcXVlc3RcbiAgc2VsZi5SZXNwb25zZSA9IFJlc3BvbnNlXG5cbiAgc2VsZi5mZXRjaCA9IGZ1bmN0aW9uKGlucHV0LCBpbml0KSB7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgdmFyIHJlcXVlc3RcbiAgICAgIGlmIChSZXF1ZXN0LnByb3RvdHlwZS5pc1Byb3RvdHlwZU9mKGlucHV0KSAmJiAhaW5pdCkge1xuICAgICAgICByZXF1ZXN0ID0gaW5wdXRcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJlcXVlc3QgPSBuZXcgUmVxdWVzdChpbnB1dCwgaW5pdClcbiAgICAgIH1cblxuICAgICAgdmFyIHhociA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpXG5cbiAgICAgIGZ1bmN0aW9uIHJlc3BvbnNlVVJMKCkge1xuICAgICAgICBpZiAoJ3Jlc3BvbnNlVVJMJyBpbiB4aHIpIHtcbiAgICAgICAgICByZXR1cm4geGhyLnJlc3BvbnNlVVJMXG4gICAgICAgIH1cblxuICAgICAgICAvLyBBdm9pZCBzZWN1cml0eSB3YXJuaW5ncyBvbiBnZXRSZXNwb25zZUhlYWRlciB3aGVuIG5vdCBhbGxvd2VkIGJ5IENPUlNcbiAgICAgICAgaWYgKC9eWC1SZXF1ZXN0LVVSTDovbS50ZXN0KHhoci5nZXRBbGxSZXNwb25zZUhlYWRlcnMoKSkpIHtcbiAgICAgICAgICByZXR1cm4geGhyLmdldFJlc3BvbnNlSGVhZGVyKCdYLVJlcXVlc3QtVVJMJylcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVyblxuICAgICAgfVxuXG4gICAgICB4aHIub25sb2FkID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBvcHRpb25zID0ge1xuICAgICAgICAgIHN0YXR1czogeGhyLnN0YXR1cyxcbiAgICAgICAgICBzdGF0dXNUZXh0OiB4aHIuc3RhdHVzVGV4dCxcbiAgICAgICAgICBoZWFkZXJzOiBoZWFkZXJzKHhociksXG4gICAgICAgICAgdXJsOiByZXNwb25zZVVSTCgpXG4gICAgICAgIH1cbiAgICAgICAgdmFyIGJvZHkgPSAncmVzcG9uc2UnIGluIHhociA/IHhoci5yZXNwb25zZSA6IHhoci5yZXNwb25zZVRleHRcbiAgICAgICAgcmVzb2x2ZShuZXcgUmVzcG9uc2UoYm9keSwgb3B0aW9ucykpXG4gICAgICB9XG5cbiAgICAgIHhoci5vbmVycm9yID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHJlamVjdChuZXcgVHlwZUVycm9yKCdOZXR3b3JrIHJlcXVlc3QgZmFpbGVkJykpXG4gICAgICB9XG5cbiAgICAgIHhoci5vbnRpbWVvdXQgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgcmVqZWN0KG5ldyBUeXBlRXJyb3IoJ05ldHdvcmsgcmVxdWVzdCBmYWlsZWQnKSlcbiAgICAgIH1cblxuICAgICAgeGhyLm9wZW4ocmVxdWVzdC5tZXRob2QsIHJlcXVlc3QudXJsLCB0cnVlKVxuXG4gICAgICBpZiAocmVxdWVzdC5jcmVkZW50aWFscyA9PT0gJ2luY2x1ZGUnKSB7XG4gICAgICAgIHhoci53aXRoQ3JlZGVudGlhbHMgPSB0cnVlXG4gICAgICB9XG5cbiAgICAgIGlmICgncmVzcG9uc2VUeXBlJyBpbiB4aHIgJiYgc3VwcG9ydC5ibG9iKSB7XG4gICAgICAgIHhoci5yZXNwb25zZVR5cGUgPSAnYmxvYidcbiAgICAgIH1cblxuICAgICAgcmVxdWVzdC5oZWFkZXJzLmZvckVhY2goZnVuY3Rpb24odmFsdWUsIG5hbWUpIHtcbiAgICAgICAgeGhyLnNldFJlcXVlc3RIZWFkZXIobmFtZSwgdmFsdWUpXG4gICAgICB9KVxuXG4gICAgICB4aHIuc2VuZCh0eXBlb2YgcmVxdWVzdC5fYm9keUluaXQgPT09ICd1bmRlZmluZWQnID8gbnVsbCA6IHJlcXVlc3QuX2JvZHlJbml0KVxuICAgIH0pXG4gIH1cbiAgc2VsZi5mZXRjaC5wb2x5ZmlsbCA9IHRydWVcbn0pKHR5cGVvZiBzZWxmICE9PSAndW5kZWZpbmVkJyA/IHNlbGYgOiB0aGlzKTtcbiIsIlxuLyoqXG4gKiBkZXBlbmRlbmNpZXNcbiAqL1xuXG52YXIga2V5Y29kZSA9IHJlcXVpcmUoJ2tleWNvZGUnKTtcblxuLyoqXG4gKiBFeHBvcnQgYHNlcXVlbmNlYFxuICovXG5cbm1vZHVsZS5leHBvcnRzID0gc2VxdWVuY2U7XG5cbi8qKlxuICogQ3JlYXRlIHNlcXVlbmNlIGZuIHdpdGggYGtleXNgLlxuICogb3B0aW9uYWwgYG1zYCB3aGljaCBkZWZhdWx0c1xuICogdG8gYDUwMG1zYCBhbmQgYGZuYC5cbiAqXG4gKiBFeGFtcGxlOlxuICpcbiAqICAgICAgc2VxID0gc2VxdWVuY2UoJ2EgYiBjJywgZm4pO1xuICogICAgICBlbC5hZGRFdmVudExpc3RlbmVyKCdrZXlkb3duJywgc2VxKTtcbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30ga2V5c1xuICogQHBhcmFtIHtOdW1iZXJ9IG1zXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmblxuICogQHJldHVybiB7RnVuY3Rpb259XG4gKiBAYXBpIHB1YmxpY1xuICovXG5cbmZ1bmN0aW9uIHNlcXVlbmNlKGtleXMsIG1zLCBmbil7XG4gIHZhciBjb2RlcyA9IGtleXMuc3BsaXQoLyArLykubWFwKGtleWNvZGUpXG4gICAgLCBjbGVuID0gY29kZXMubGVuZ3RoXG4gICAgLCBzZXEgPSBbXVxuICAgICwgaSA9IDBcbiAgICAsIHByZXY7XG5cbiAgaWYgKDIgPT0gYXJndW1lbnRzLmxlbmd0aCkge1xuICAgIGZuID0gbXM7XG4gICAgbXMgPSA1MDA7XG4gIH1cblxuICByZXR1cm4gZnVuY3Rpb24oZSl7XG4gICAgdmFyIGNvZGUgPSBjb2Rlc1tpKytdO1xuICAgIGlmICg0MiAhPSBjb2RlICYmIGNvZGUgIT0gZS53aGljaCkgcmV0dXJuIHJlc2V0KCk7XG4gICAgaWYgKHByZXYgJiYgbmV3IERhdGUgLSBwcmV2ID4gbXMpIHJldHVybiByZXNldCgpO1xuICAgIHZhciBsZW4gPSBzZXEucHVzaChlLndoaWNoKTtcbiAgICBwcmV2ID0gbmV3IERhdGU7XG4gICAgaWYgKGxlbiAhPSBjbGVuKSByZXR1cm47XG4gICAgcmVzZXQoKTtcbiAgICBmbihlKTtcbiAgfTtcblxuICBmdW5jdGlvbiByZXNldCgpe1xuICAgIHByZXYgPSBudWxsO1xuICAgIHNlcSA9IFtdO1xuICAgIGkgPSAwO1xuICB9XG59O1xuIiwiXG4vKipcbiAqIE1vZHVsZSBEZXBlbmRlbmNpZXMuXG4gKi9cblxudmFyIGV2ZW50ID0gcmVxdWlyZSgnZXZlbnQnKVxudmFyIHByb3RvID0gcmVxdWlyZSgnLi9wcm90bycpXG52YXIgYmluZCA9IHJlcXVpcmUoJ2JpbmQnKTtcblxuLyoqXG4gKiBDcmVhdGUgYSBuZXcgZGlzcGF0Y2hlciB3aXRoIGBlbGAuXG4gKlxuICogZXhhbXBsZTpcbiAqXG4gKiAgICAgIHZhciBrID0gcmVxdWlyZSgnaycpKHdpbmRvdyk7XG4gKiAgICAgIGsoJ3NoaWZ0ICsgdGFiJywgZnVuY3Rpb24oKXt9KTtcbiAqXG4gKiBAcGFyYW0ge0VsZW1lbnR9IGVsXG4gKiBAcmV0dXJuIHtGdW5jdGlvbn1cbiAqIEBhcGkgcHVibGljXG4gKi9cblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihlbCl7XG4gIGZ1bmN0aW9uIGsoZSwgZm4peyBrLmhhbmRsZShlLCBmbikgfTtcbiAgay5faGFuZGxlID0gYmluZChrLCBwcm90by5oYW5kbGUpO1xuICBrLl9jbGVhciA9IGJpbmQoaywgcHJvdG8uY2xlYXIpO1xuICBrLl9yZXNldCA9IGJpbmQoaywgcHJvdG8ucmVzZXQpO1xuICBldmVudC5iaW5kKGVsLCAna2V5ZG93bicsIGsuX2hhbmRsZSwgZmFsc2UpO1xuICBldmVudC5iaW5kKGVsLCAna2V5dXAnLCBrLl9oYW5kbGUsIGZhbHNlKTtcbiAgZXZlbnQuYmluZChlbCwgJ2tleXVwJywgay5fY2xlYXIsIGZhbHNlKTtcbiAgZXZlbnQuYmluZChlbCwgJ2ZvY3VzJywgay5fcmVzZXQsIGZhbHNlKTtcbiAgZm9yICh2YXIgcCBpbiBwcm90bykga1twXSA9IHByb3RvW3BdO1xuICBrLmxpc3RlbmVycyA9IFtdO1xuICBrLmFjdGl2ZSA9IDA7XG4gIGsuZWwgPSBlbDtcbiAgcmV0dXJuIGs7XG59O1xuIiwiXG4vKipcbiAqIE1vZHVsZSBEZXBlbmRlbmNpZXMuXG4gKi9cblxudmFyIHNlcXVlbmNlID0gcmVxdWlyZSgnay1zZXF1ZW5jZScpO1xudmFyIGtleWNvZGUgPSByZXF1aXJlKCdrZXljb2RlJyk7XG52YXIgZXZlbnQgPSByZXF1aXJlKCdldmVudCcpO1xudmFyIG9zID0gcmVxdWlyZSgnb3MnKTtcblxuLyoqXG4gKiBtb2RpZmllcnMuXG4gKi9cblxudmFyIG1vZGlmaWVycyA9IHtcbiAgMjI0OiAnY29tbWFuZCcsXG4gIDkxOiAnY29tbWFuZCcsXG4gIDkzOiAnY29tbWFuZCcsXG4gIDE2OiAnc2hpZnQnLFxuICAxNzogJ2N0cmwnLFxuICAxODogJ2FsdCdcbn07XG5cbi8qKlxuICogU3VwZXIga2V5LlxuICogKG11c3QgdXNlIHN1YnNjcmlwdCB2cy4gZG90IG5vdGF0aW9uIHRvIGF2b2lkIGlzc3VlcyB3aXRoIG9sZGVyIGJyb3dzZXJzKVxuICovXG5cbmV4cG9ydHNbJ3N1cGVyJ10gPSAnbWFjJyA9PSBvc1xuICA/ICdjb21tYW5kJ1xuICA6ICdjdHJsJztcblxuLyoqXG4gKiBIYW5kbGUgdGhlIGdpdmVuIGBLZXlib2FyZEV2ZW50YCBvciBiaW5kXG4gKiBhIG5ldyBga2V5c2AgaGFuZGxlci5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ3xLZXlib2FyZEV2ZW50fSBlXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmblxuICogQGFwaSBwcml2YXRlXG4gKi9cblxuZXhwb3J0cy5oYW5kbGUgPSBmdW5jdGlvbihlLCBmbil7XG4gIHZhciBpZ25vcmUgPSB0aGlzLmlnbm9yZTtcbiAgdmFyIGV2ZW50ID0gZS50eXBlO1xuICB2YXIgY29kZSA9IGUud2hpY2g7XG5cbiAgLy8gYmluZFxuICBpZiAoZm4pIHJldHVybiB0aGlzLmJpbmQoZSwgZm4pO1xuXG4gIC8vIG1vZGlmaWVyc1xuICB2YXIgbW9kID0gbW9kaWZpZXJzW2NvZGVdO1xuICBpZiAoJ2tleWRvd24nID09IGV2ZW50ICYmIG1vZCkge1xuICAgIHRoaXNbJ3N1cGVyJ10gPSBleHBvcnRzWydzdXBlciddID09IG1vZDtcbiAgICB0aGlzW21vZF0gPSB0cnVlO1xuICAgIHRoaXMubW9kaWZpZXJzID0gdHJ1ZTtcbiAgICB0aGlzLmFjdGl2ZSsrO1xuICAgIHJldHVybjtcbiAgfVxuXG4gIC8vIGlnbm9yZVxuICBpZiAoaWdub3JlICYmIGlnbm9yZShlKSkgcmV0dXJuO1xuXG4gIC8vIGxpc3RlbmVyc1xuICB2YXIgYWxsID0gdGhpcy5saXN0ZW5lcnM7XG5cbiAgLy8gbWF0Y2hcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBhbGwubGVuZ3RoOyArK2kpIHtcbiAgICB2YXIgaW52b2tlID0gdHJ1ZTtcbiAgICB2YXIgb2JqID0gYWxsW2ldO1xuICAgIHZhciBzZXEgPSBvYmouc2VxO1xuICAgIHZhciBtb2RzID0gb2JqLm1vZHM7XG4gICAgdmFyIGZuID0gc2VxIHx8IG9iai5mbjtcblxuICAgIGlmICghc2VxICYmIGNvZGUgIT0gb2JqLmNvZGUpIGNvbnRpbnVlO1xuICAgIGlmIChldmVudCAhPSBvYmouZXZlbnQpIGNvbnRpbnVlO1xuICAgIGlmICh0aGlzLmFjdGl2ZSAhPSBvYmoubW9kcy5sZW5ndGgpIGNvbnRpbnVlO1xuXG4gICAgZm9yICh2YXIgaiA9IDA7IGogPCBtb2RzLmxlbmd0aDsgKytqKSB7XG4gICAgICBpZiAoIXRoaXNbbW9kc1tqXV0pIHtcbiAgICAgICAgaW52b2tlID0gbnVsbDtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaW52b2tlICYmIGZuKGUpO1xuICB9XG59O1xuXG4vKipcbiAqIERlc3Ryb3kgdGhpcyBga2AgZGlzcGF0Y2hlciBpbnN0YW5jZS5cbiAqXG4gKiBAYXBpIHB1YmxpY1xuICovXG5cbmV4cG9ydHMuZGVzdHJveSA9IGZ1bmN0aW9uKCl7XG4gIGV2ZW50LnVuYmluZCh0aGlzLmVsLCAna2V5ZG93bicsIHRoaXMuX2hhbmRsZSk7XG4gIGV2ZW50LnVuYmluZCh0aGlzLmVsLCAna2V5dXAnLCB0aGlzLl9oYW5kbGUpO1xuICBldmVudC51bmJpbmQodGhpcy5lbCwgJ2tleXVwJywgdGhpcy5fY2xlYXIpO1xuICBldmVudC51bmJpbmQodGhpcy5lbCwgJ2ZvY3VzJywgdGhpcy5fY2xlYXIpO1xuICB0aGlzLmxpc3RlbmVycyA9IFtdO1xufTtcblxuLyoqXG4gKiBVbmJpbmQgdGhlIGdpdmVuIGBrZXlzYCB3aXRoIG9wdGlvbmFsIGBmbmAuXG4gKlxuICogRXhhbXBsZTpcbiAqXG4gKiAgICAgIGsudW5iaW5kKCdlbnRlciwgdGFiJywgbXlMaXN0ZW5lcik7IC8vIHVuYmluZCBgbXlMaXN0ZW5lcmAgZnJvbSBgZW50ZXIsIHRhYmAga2V5c1xuICogICAgICBrLnVuYmluZCgnZW50ZXIsIHRhYicpOyAvLyB1bmJpbmQgYWxsIGBlbnRlciwgdGFiYCBsaXN0ZW5lcnNcbiAqICAgICAgay51bmJpbmQoKTsgLy8gdW5iaW5kIGFsbCBsaXN0ZW5lcnNcbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30ga2V5c1xuICogQHBhcmFtIHtGdW5jdGlvbn0gZm5cbiAqIEByZXR1cm4ge2t9XG4gKiBAYXBpIHB1YmxpY1xuICovXG5cbmV4cG9ydHMudW5iaW5kID0gZnVuY3Rpb24oa2V5cywgZm4pe1xuICB2YXIgZm5zID0gdGhpcy5saXN0ZW5lcnNcbiAgdmFyIGxlbiA9IGZucy5sZW5ndGg7XG4gIHZhciBhbGw7XG5cbiAgLy8gdW5iaW5kIGFsbFxuICBpZiAoMCA9PSBhcmd1bWVudHMubGVuZ3RoKSB7XG4gICAgdGhpcy5saXN0ZW5lcnMgPSBbXTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIC8vIHBhcnNlXG4gIGFsbCA9IHBhcnNlS2V5cyhrZXlzKTtcblxuICAvLyB1bmJpbmRcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBhbGwubGVuZ3RoOyArK2kpIHtcbiAgICBmb3IgKHZhciBqID0gMCwgb2JqOyBqIDwgbGVuOyArK2opIHtcbiAgICAgIG9iaiA9IGZuc1tqXTtcbiAgICAgIGlmICghb2JqKSBjb250aW51ZTtcbiAgICAgIGlmIChmbiAmJiBvYmouZm4gIT0gZm4pIGNvbnRpbnVlO1xuICAgICAgaWYgKG9iai5rZXkgIT0gYWxsW2ldLmtleSkgY29udGludWU7XG4gICAgICBpZiAoIW1hdGNoZXMob2JqLCBhbGxbaV0pKSBjb250aW51ZTtcbiAgICAgIGZucy5zcGxpY2Uoai0tLCAxKTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gdGhpcztcbn07XG5cbi8qKlxuICogQmluZCB0aGUgZ2l2ZW4gYGtleXNgIHRvIGBmbmAgd2l0aCBvcHRpb25hbCBgZXZlbnRgXG4gKlxuICogRXhhbXBsZTpcbiAqXG4gKiAgICAgIGsuYmluZCgnc2hpZnQgKyB0YWIsIGN0cmwgKyBhJywgZnVuY3Rpb24oZSl7fSk7XG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IGV2ZW50XG4gKiBAcGFyYW0ge1N0cmluZ30ga2V5c1xuICogQHBhcmFtIHtGdW5jdGlvbn0gZm5cbiAqIEByZXR1cm4ge2t9XG4gKiBAYXBpIHB1YmxpY1xuICovXG5cbmV4cG9ydHMuYmluZCA9IGZ1bmN0aW9uKGV2ZW50LCBrZXlzLCBmbil7XG4gIHZhciBmbnMgPSB0aGlzLmxpc3RlbmVyc1xuICB2YXIgbGVuO1xuICB2YXIgYWxsO1xuXG4gIGlmICgyID09IGFyZ3VtZW50cy5sZW5ndGgpIHtcbiAgICBmbiA9IGtleXM7XG4gICAga2V5cyA9IGV2ZW50O1xuICAgIGV2ZW50ID0gJ2tleWRvd24nO1xuICB9XG5cbiAgYWxsID0gcGFyc2VLZXlzKGtleXMpO1xuICBsZW4gPSBhbGwubGVuZ3RoO1xuXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuOyArK2kpIHtcbiAgICB2YXIgb2JqID0gYWxsW2ldO1xuICAgIG9iai5zZXEgPSBvYmouc2VxICYmIHNlcXVlbmNlKG9iai5rZXksIGZuKTtcbiAgICBvYmouZXZlbnQgPSBldmVudDtcbiAgICBvYmouZm4gPSBmbjtcbiAgICBmbnMucHVzaChvYmopO1xuICB9XG5cbiAgcmV0dXJuIHRoaXM7XG59O1xuXG4vKipcbiAqIEJpbmQga2V5dXAgd2l0aCBga2V5c2AgYW5kIGBmbmAuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IGtleXNcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZuXG4gKiBAcmV0dXJuIHtrfVxuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5leHBvcnRzLnVwID0gZnVuY3Rpb24oa2V5cywgZm4pe1xuICByZXR1cm4gdGhpcy5iaW5kKCdrZXl1cCcsIGtleXMsIGZuKTtcbn07XG5cbi8qKlxuICogQmluZCBrZXlkb3duIHdpdGggYGtleXNgIGFuZCBgZm5gLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBrZXlzXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmblxuICogQHJldHVybiB7a31cbiAqIEBhcGkgcHVibGljXG4gKi9cblxuZXhwb3J0cy5kb3duID0gZnVuY3Rpb24oa2V5cywgZm4pe1xuICByZXR1cm4gdGhpcy5iaW5kKCdrZXlkb3duJywga2V5cywgZm4pO1xufTtcblxuLyoqXG4gKiBDbGVhciBhbGwgbW9kaWZpZXJzIG9uIGBrZXl1cGAuXG4gKlxuICogQGFwaSBwcml2YXRlXG4gKi9cblxuZXhwb3J0cy5jbGVhciA9IGZ1bmN0aW9uKGUpe1xuICB2YXIgY29kZSA9IGUua2V5Q29kZSB8fCBlLndoaWNoO1xuICBpZiAoIShjb2RlIGluIG1vZGlmaWVycykpIHJldHVybjtcbiAgdGhpcy5hY3RpdmUtLTtcbiAgdGhpc1ttb2RpZmllcnNbY29kZV1dID0gbnVsbDtcbiAgdGhpcy5tb2RpZmllcnMgPSB0aGlzLmNvbW1hbmRcbiAgICB8fCB0aGlzLnNoaWZ0XG4gICAgfHwgdGhpcy5jdHJsXG4gICAgfHwgdGhpcy5hbHQ7XG59O1xuXG4vKipcbiAqIENsZWFyIGFsbCBtb2RpZmllcnMgb24gYGZvY3VzYC5cbiAqXG4gKiBAYXBpIHByaXZhdGVcbiAqL1xuXG5leHBvcnRzLnJlc2V0ID0gZnVuY3Rpb24oZSl7XG4gIHRoaXMuYWN0aXZlID0gMDtcbiAgdGhpcy5tb2RpZmllcnMgPVxuICB0aGlzLmNvbW1hbmQgPVxuICB0aGlzLnNoaWZ0ID1cbiAgdGhpcy5jdHJsID1cbiAgdGhpcy5hbHQgPSBudWxsO1xufTtcblxuLyoqXG4gKiBJZ25vcmUgYWxsIGlucHV0IGVsZW1lbnRzIGJ5IGRlZmF1bHQuXG4gKlxuICogQHBhcmFtIHtFdmVudH0gZVxuICogQHJldHVybiB7Qm9vbGVhbn1cbiAqIEBhcGkgcHJpdmF0ZVxuICovXG5cbmV4cG9ydHMuaWdub3JlID0gZnVuY3Rpb24oZSl7XG4gIHZhciBlbCA9IGUudGFyZ2V0IHx8IGUuc3JjRWxlbWVudDtcbiAgdmFyIG5hbWUgPSBlbC50YWdOYW1lLnRvTG93ZXJDYXNlKCk7XG4gIHJldHVybiAndGV4dGFyZWEnID09IG5hbWVcbiAgICB8fCAnc2VsZWN0JyA9PSBuYW1lXG4gICAgfHwgJ2lucHV0JyA9PSBuYW1lO1xufTtcblxuLyoqXG4gKiBQYXJzZSB0aGUgZ2l2ZW4gYGtleXNgLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBrZXlzXG4gKiBAcmV0dXJuIHtBcnJheX1cbiAqIEBhcGkgcHJpdmF0ZVxuICovXG5cbmZ1bmN0aW9uIHBhcnNlS2V5cyhrZXlzKXtcbiAga2V5cyA9IGtleXMucmVwbGFjZSgnc3VwZXInLCBleHBvcnRzWydzdXBlciddKTtcblxuICB2YXIgYWxsID0gJywnICE9IGtleXNcbiAgICA/IGtleXMuc3BsaXQoLyAqLCAqLylcbiAgICA6IFsnLCddO1xuXG4gIHZhciByZXQgPSBbXTtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBhbGwubGVuZ3RoOyArK2kpIHtcbiAgICBpZiAoJycgPT0gYWxsW2ldKSBjb250aW51ZTtcbiAgICB2YXIgbW9kcyA9IGFsbFtpXS5zcGxpdCgvICpcXCsgKi8pO1xuICAgIHZhciBrZXkgPSBtb2RzLnBvcCgpIHx8ICcsJztcblxuICAgIHJldC5wdXNoKHtcbiAgICAgIHNlcTogISEgKH5rZXkuaW5kZXhPZignICcpIHx8IH5rZXkuaW5kZXhPZignKicpKSxcbiAgICAgIGNvZGU6IGtleWNvZGUoa2V5KSxcbiAgICAgIG1vZHM6IG1vZHMsXG4gICAgICBrZXk6IGtleVxuICAgIH0pO1xuICB9XG5cbiAgcmV0dXJuIHJldDtcbn1cblxuLyoqXG4gKiBDaGVjayBpZiB0aGUgZ2l2ZW4gYGFgIG1hdGNoZXMgYGJgLlxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBhXG4gKiBAcGFyYW0ge09iamVjdH0gYlxuICogQHJldHVybiB7Qm9vbGVhbn1cbiAqIEBhcGkgcHJpdmF0ZVxuICovXG5cbmZ1bmN0aW9uIG1hdGNoZXMoYSwgYil7XG4gIHJldHVybiAwID09IGIubW9kcy5sZW5ndGggfHwgZXFsKGEsIGIpO1xufVxuXG4vKipcbiAqIFNoYWxsb3cgZXFsIHV0aWwuXG4gKlxuICogVE9ETzogbW92ZSB0byB5aWVsZHMvZXFsXG4gKlxuICogQHBhcmFtIHtBcnJheX0gYVxuICogQHBhcmFtIHtBcnJheX0gYlxuICogQHJldHVybiB7Qm9vbGVhbn1cbiAqIEBhcGkgcHJpdmF0ZVxuICovXG5cbmZ1bmN0aW9uIGVxbChhLCBiKXtcbiAgYSA9IGEubW9kcy5zb3J0KCkudG9TdHJpbmcoKTtcbiAgYiA9IGIubW9kcy5zb3J0KCkudG9TdHJpbmcoKTtcbiAgcmV0dXJuIGEgPT0gYjtcbn1cbiIsIlxuLyoqXG4gKiBtYXBcbiAqL1xuXG52YXIgbWFwID0ge1xuICAgIGJhY2tzcGFjZTogOFxuICAsIGNvbW1hbmQ6IDkxXG4gICwgdGFiOiA5XG4gICwgY2xlYXI6IDEyXG4gICwgZW50ZXI6IDEzXG4gICwgc2hpZnQ6IDE2XG4gICwgY3RybDogMTdcbiAgLCBhbHQ6IDE4XG4gICwgY2Fwc2xvY2s6IDIwXG4gICwgZXNjYXBlOiAyN1xuICAsIGVzYzogMjdcbiAgLCBzcGFjZTogMzJcbiAgLCBwYWdldXA6IDMzXG4gICwgcGFnZWRvd246IDM0XG4gICwgZW5kOiAzNVxuICAsIGhvbWU6IDM2XG4gICwgbGVmdDogMzdcbiAgLCB1cDogMzhcbiAgLCByaWdodDogMzlcbiAgLCBkb3duOiA0MFxuICAsIGRlbDogNDZcbiAgLCBjb21tYTogMTg4XG4gICwgZjE6IDExMlxuICAsIGYyOiAxMTNcbiAgLCBmMzogMTE0XG4gICwgZjQ6IDExNVxuICAsIGY1OiAxMTZcbiAgLCBmNjogMTE3XG4gICwgZjc6IDExOFxuICAsIGY4OiAxMTlcbiAgLCBmOTogMTIwXG4gICwgZjEwOiAxMjFcbiAgLCBmMTE6IDEyMlxuICAsIGYxMjogMTIzXG4gICwgJywnOiAxODhcbiAgLCAnLic6IDE5MFxuICAsICcvJzogMTkxXG4gICwgJ2AnOiAxOTJcbiAgLCAnLSc6IDE4OVxuICAsICc9JzogMTg3XG4gICwgJzsnOiAxODZcbiAgLCAnWyc6IDIxOVxuICAsICdcXFxcJzogMjIwXG4gICwgJ10nOiAyMjFcbiAgLCAnXFwnJzogMjIyXG59O1xuXG4vKipcbiAqIGZpbmQgYSBrZXljb2RlLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBuYW1lXG4gKiBAcmV0dXJuIHtOdW1iZXJ9XG4gKi9cblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihuYW1lKXtcbiAgcmV0dXJuIG1hcFtuYW1lLnRvTG93ZXJDYXNlKCldIHx8IG5hbWUudG9VcHBlckNhc2UoKS5jaGFyQ29kZUF0KDApO1xufTtcbiJdfQ==
