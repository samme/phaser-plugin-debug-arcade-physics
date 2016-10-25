
/*
  Debug Arcade Physics plugin v0.4.0.1 for Phaser
 */

(function() {
  "use strict";
  var ARCADE, Bullet, Circle, DebugArcadePhysics, Line, PARTICLE, Plugin, Point, Rectangle, SPRITE, abs, cos, degreeToRadiansFactor, freeze, max, seal, sign, sin,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  abs = Math.abs, cos = Math.cos, max = Math.max, sin = Math.sin;

  freeze = Object.freeze, seal = Object.seal;

  Bullet = Phaser.Bullet, Circle = Phaser.Circle, Line = Phaser.Line, PARTICLE = Phaser.PARTICLE, Plugin = Phaser.Plugin, Point = Phaser.Point, Rectangle = Phaser.Rectangle, SPRITE = Phaser.SPRITE;

  sign = Phaser.Math.sign;

  ARCADE = Phaser.Physics.ARCADE;

  degreeToRadiansFactor = Math.PI / 180;

  Phaser.Plugin.DebugArcadePhysics = freeze(DebugArcadePhysics = (function(superClass) {
    var TOO_BIG, _calculateDrag, _circle, _line, _offset, _rect, _rotation, _vector, aqua, blue, colors, config, coral, gold, gray, green, indigo, orange, purple, red, rose, violet, white, yellow;

    extend(DebugArcadePhysics, superClass);

    function DebugArcadePhysics() {
      return DebugArcadePhysics.__super__.constructor.apply(this, arguments);
    }

    DebugArcadePhysics.addTo = function(game) {
      return game.plugins.add(this);
    };

    DebugArcadePhysics.exists = function(obj) {
      return obj.exists;
    };

    DebugArcadePhysics.isAlive = function(obj) {
      return obj.alive;
    };

    DebugArcadePhysics.isBullet = function(obj) {
      return obj instanceof Bullet;
    };

    DebugArcadePhysics.isParticle = function(obj) {
      return obj.type === PARTICLE;
    };

    DebugArcadePhysics.isSprite = function(obj) {
      return obj.type === SPRITE;
    };

    DebugArcadePhysics.VERSION = "0.4.0.1";

    TOO_BIG = 9999;

    red = "hsla(0  , 100%,  50%, 0.5)";

    coral = "hsla(15 , 100%,  50%, 0.5)";

    orange = "hsla(30 , 100%,  50%, 0.5)";

    gold = "hsla(45 , 100%,  50%, 0.5)";

    yellow = "hsla(60 , 100%,  50%, 0.5)";

    green = "hsla(120, 100%,  50%, 0.5)";

    aqua = "hsla(180, 100%,  50%, 0.5)";

    blue = "hsla(210, 100%,  50%, 0.5)";

    indigo = "hsla(240, 100%,  50%, 0.5)";

    purple = "hsla(270, 100%,  50%, 0.5)";

    violet = "hsla(300, 100%,  50%, 0.5)";

    rose = "hsla(330, 100%,  50%, 0.5)";

    white = "hsla(0  ,   0%, 100%, 0.5)";

    gray = "hsla(0  ,   0%,  50%, 0.5)";

    DebugArcadePhysics.prototype.colors = colors = {
      acceleration: violet,
      blocked: coral,
      body: yellow,
      bodyDisabled: gray,
      center: white,
      drag: orange,
      maxVelocity: green,
      offset: yellow,
      rotation: yellow,
      speed: blue,
      touching: red,
      velocity: aqua
    };

    DebugArcadePhysics.prototype.config = config = seal({
      filter: null,
      lineWidth: 1,
      on: true,
      renderAcceleration: true,
      renderBlocked: true,
      renderBody: true,
      renderBodyDisabled: true,
      renderCenter: true,
      renderConfig: false,
      renderDrag: true,
      renderMaxVelocity: true,
      renderLegend: true,
      renderOffset: true,
      renderRotation: true,
      renderSpeed: true,
      renderTouching: true,
      renderVelocity: true
    });

    DebugArcadePhysics.prototype.configKeys = freeze(Object.keys(config));

    DebugArcadePhysics.prototype.name = "Debug Arcade Physics Plugin";

    Object.defineProperty(DebugArcadePhysics.prototype, "version", {
      get: function() {
        return this.constructor.VERSION;
      }
    });

    DebugArcadePhysics.prototype.init = function(settings) {
      console.log("%s v%s", this.name, this.version);
      this.game.debug.arcade = this["interface"]();
      this.help();
      if (settings) {
        this.configSet(settings);
      }
    };

    DebugArcadePhysics.prototype.postRender = function() {
      if (!this.config.on) {
        return;
      }
      if (this.config.renderConfig) {
        this.renderConfig();
      }
      if (this.config.renderLegend) {
        this.renderColors();
      }
      this.renderAll();
    };

    DebugArcadePhysics.prototype.bodyColor = function(body) {
      var blocked, enable, ref, renderBlocked, renderBodyDisabled, renderTouching, touching;
      ref = this.config, renderBlocked = ref.renderBlocked, renderBodyDisabled = ref.renderBodyDisabled, renderTouching = ref.renderTouching;
      blocked = body.blocked, enable = body.enable, touching = body.touching;
      return colors[(function() {
        switch (false) {
          case !(renderBodyDisabled && !enable):
            return "bodyDisabled";
          case !(renderTouching && !touching.none):
            return "touching";
          case !(renderBlocked && (blocked.down || blocked.up || blocked.left || blocked.right)):
            return "blocked";
          default:
            return "body";
        }
      })()];
    };

    _calculateDrag = new Point;

    DebugArcadePhysics.prototype.calculateDrag = function(body, out) {
      var drag, dx, dy, physicsElapsed, velocity, vx, vy;
      if (out == null) {
        out = _calculateDrag;
      }
      drag = body.drag, velocity = body.velocity;
      physicsElapsed = this.game.time.physicsElapsed;
      vx = velocity.x;
      vy = velocity.y;
      dx = drag.x * -sign(vx);
      dy = drag.y * -sign(vy);
      out.x = (abs(vx) - abs(dx * physicsElapsed)) > 0 ? dx : 0;
      out.y = (abs(vy) - abs(dy * physicsElapsed)) > 0 ? dy : 0;
      return out;
    };

    DebugArcadePhysics.prototype.configSet = function(settings) {
      var name, val;
      for (name in settings) {
        val = settings[name];
        if (name in this.config) {
          this.config[name] = val;
          console.log(name, val);
        } else {
          console.warn("No such setting '" + name + "'. Valid names are " + this.configKeys + ".");
        }
      }
      return this;
    };

    DebugArcadePhysics.prototype.geom = function(obj, color, fill, lineWidth) {
      var context, debug, savedLineWidth;
      if (fill == null) {
        fill = false;
      }
      if (lineWidth == null) {
        lineWidth = this.config.lineWidth;
      }
      debug = this.game.debug;
      context = debug.context;
      savedLineWidth = context.lineWidth;
      context.lineWidth = lineWidth;
      debug.geom(obj, color, fill);
      context.lineWidth = savedLineWidth;
      return this;
    };

    DebugArcadePhysics.prototype.help = function() {
      console.log("Use `game.debug.arcade`: " + (Object.keys(this.game.debug.arcade).join(', ')));
      return this;
    };

    DebugArcadePhysics.prototype.helpConfig = function() {
      console.log("Use `game.debug.arcade.configSet()`: " + (this.configKeys.join(', ')));
      return this;
    };

    DebugArcadePhysics.prototype.hide = function() {
      this.visible = false;
      return this;
    };

    DebugArcadePhysics.prototype.off = function() {
      this.config.on = false;
      return this;
    };

    DebugArcadePhysics.prototype.on = function() {
      this.config.on = true;
      return this;
    };

    DebugArcadePhysics.prototype.placeLine = function(line, start, end) {
      return this.placeLineXY(line, start.x, start.y, end.x, end.y);
    };

    DebugArcadePhysics.prototype.placeLineXY = function(line, startX, startY, endX, endY) {
      return line.setTo(startX, startY, endX, endY);
    };

    DebugArcadePhysics.prototype.placeRect = function(rect, center, size) {
      rect.resize(2 * size.x, 2 * size.y).centerOn(center.x, center.y);
      return rect;
    };

    DebugArcadePhysics.prototype.placeVector = function(line, start, vector) {
      return this.placeVectorXY(line, start.x, start.y, vector.x, vector.y);
    };

    DebugArcadePhysics.prototype.placeVectorXY = function(line, startX, startY, vectorX, vectorY) {
      return line.setTo(startX, startY, startX + vectorX, startY + vectorY);
    };

    DebugArcadePhysics.prototype.renderAcceleration = function(body) {
      this.renderVector(body.acceleration, body, colors.acceleration);
      return this;
    };

    DebugArcadePhysics.prototype.renderAll = function() {
      this.renderObj(this.game.world);
      return this;
    };

    DebugArcadePhysics.prototype.renderCenter = function(body) {
      var ref, x, y;
      ref = body.center, x = ref.x, y = ref.y;
      this.game.debug.pixel(~~x, ~~y, colors.center);
      return this;
    };

    _circle = new Circle;

    DebugArcadePhysics.prototype.renderCircle = function(radius, body, color) {
      if (radius < 1) {
        return this;
      }
      _circle.setTo(body.center.x, body.center.y, 2 * radius);
      this.geom(_circle, color);
      return this;
    };

    DebugArcadePhysics.prototype.renderColors = function(x, y) {
      var debug, name, ref, val;
      if (x == null) {
        x = this.game.debug.lineHeight;
      }
      if (y == null) {
        y = this.game.debug.lineHeight;
      }
      debug = this.game.debug;
      debug.start(x, y);
      ref = this.colors;
      for (name in ref) {
        val = ref[name];
        debug.currentColor = val;
        debug.line(name);
      }
      debug.stop();
      return this;
    };

    DebugArcadePhysics.prototype.renderConfig = function(x, y) {
      var debug, name, ref, val;
      if (x == null) {
        x = this.game.debug.lineHeight;
      }
      if (y == null) {
        y = this.game.debug.lineHeight;
      }
      debug = this.game.debug;
      debug.start(x, y);
      ref = this.config;
      for (name in ref) {
        val = ref[name];
        debug.line(name + ": " + val);
      }
      debug.stop();
      return this;
    };

    DebugArcadePhysics.prototype.renderDrag = function(body) {
      this.renderVector(this.calculateDrag(body), body, colors.drag);
      return this;
    };

    DebugArcadePhysics.prototype.renderMaxVelocity = function(body) {
      var maxVelocity;
      maxVelocity = body.maxVelocity;
      if (maxVelocity.x > TOO_BIG || maxVelocity.y > TOO_BIG) {
        return this;
      }
      this.renderRect(maxVelocity, body, colors.maxVelocity);
      return this;
    };

    DebugArcadePhysics.prototype.renderObj = function(obj) {
      var body, child, filter, i, len, ref;
      if (!obj.exists) {
        return this;
      }
      config = this.config;
      filter = config.filter;
      body = obj.body;
      if (obj.renderable && body && body.type === ARCADE && (body.enable || config.renderBodyDisabled)) {
        if (filter && !filter(obj)) {
          return this;
        }
        if (config.renderBody) {
          this.renderBody(body);
        }
        if (config.renderOffset) {
          this.renderOffset(body);
        }
        if (config.renderRotation) {
          this.renderRotation(body);
        }
        if (config.renderSpeed) {
          this.renderSpeed(body);
        }
        if (config.renderMaxVelocity) {
          this.renderMaxVelocity(body);
        }
        if (config.renderVelocity) {
          this.renderVelocity(body);
        }
        if (config.renderAcceleration) {
          this.renderAcceleration(body);
        }
        if (config.renderDrag) {
          this.renderDrag(body);
        }
        if (config.renderCenter) {
          this.renderCenter(body);
        }
      }
      ref = obj.children;
      for (i = 0, len = ref.length; i < len; i++) {
        child = ref[i];
        this.renderObj(child);
      }
      return this;
    };

    DebugArcadePhysics.prototype.renderBody = function(body) {
      this.game.debug.body(body.sprite, this.bodyColor(body), false);
      return this;
    };

    _line = new Line;

    DebugArcadePhysics.prototype.renderLine = function(startX, startY, endX, endY, color, width) {
      _line.set(startX, startY, endX, endY);
      this.geom(_line, color, false, width);
      return this;
    };

    _offset = new Line;

    DebugArcadePhysics.prototype.renderOffset = function(body) {
      this.placeVectorXY(_offset, body.position.x, body.position.y, -body.offset.x * body.sprite.scale.x, -body.offset.y * body.sprite.scale.y);
      this.geom(_offset, colors.offset, false);
      return this;
    };

    _rect = new Rectangle;

    DebugArcadePhysics.prototype.renderRect = function(vector, body, color) {
      if (vector.isZero()) {
        return this;
      }
      this.placeRect(_rect, body.center, vector);
      this.geom(_rect, color);
      return this;
    };

    _rotation = new Line;

    DebugArcadePhysics.prototype.renderRotation = function(body) {
      var halfHeight, halfWidth, ref, rotation, x, y;
      halfHeight = body.halfHeight, halfWidth = body.halfWidth, rotation = body.rotation;
      ref = body.center, x = ref.x, y = ref.y;
      rotation *= degreeToRadiansFactor;
      _rotation.setTo(x, y, x + halfWidth * cos(rotation), y + halfHeight * sin(rotation));
      this.geom(_rotation, colors.rotation);
      return this;
    };

    DebugArcadePhysics.prototype.renderSpeed = function(body) {
      if (body.speed < 1) {
        return this;
      }
      this.renderCircle(body.speed, body, colors.speed);
      return this;
    };

    _vector = new Line;

    DebugArcadePhysics.prototype.renderVector = function(vector, body, color) {
      if (vector.isZero()) {
        return this;
      }
      this.placeVector(_vector, body.center, vector);
      this.geom(_vector, color, false);
      return this;
    };

    DebugArcadePhysics.prototype.renderVelocity = function(body) {
      this.renderVector(body.velocity, body, colors.velocity);
      return this;
    };

    DebugArcadePhysics.prototype.show = function() {
      this.visible = true;
      return this;
    };

    DebugArcadePhysics.prototype.toggle = function() {
      this.config.on = !this.config.on;
      return this;
    };

    DebugArcadePhysics.prototype.toggleVisible = function() {
      this.visible = !this.visible;
      return this;
    };

    DebugArcadePhysics.prototype["interface"] = function() {
      return freeze({
        acceleration: this.renderAcceleration.bind(this),
        body: this.renderBody.bind(this),
        center: this.renderCenter.bind(this),
        circle: this.renderCircle.bind(this),
        config: this.config,
        configSet: this.configSet.bind(this),
        drag: this.renderDrag.bind(this),
        help: this.help.bind(this),
        helpConfig: this.helpConfig.bind(this),
        hide: this.hide.bind(this),
        maxVelocity: this.renderMaxVelocity.bind(this),
        obj: this.renderObj.bind(this),
        off: this.off.bind(this),
        on: this.on.bind(this),
        rect: this.renderRect.bind(this),
        show: this.show.bind(this),
        speed: this.renderSpeed.bind(this),
        vector: this.renderVector.bind(this),
        velocity: this.renderVelocity.bind(this),
        toggle: this.toggle.bind(this)
      });
    };

    return DebugArcadePhysics;

  })(Phaser.Plugin));

}).call(this);

/* jshint ignore:start */
(function() {
  var WebSocket = window.WebSocket || window.MozWebSocket;
  var br = window.brunch = (window.brunch || {});
  var ar = br['auto-reload'] = (br['auto-reload'] || {});
  if (!WebSocket || ar.disabled) return;
  if (window._ar) return;
  window._ar = true;

  var cacheBuster = function(url){
    var date = Math.round(Date.now() / 1000).toString();
    url = url.replace(/(\&|\\?)cacheBuster=\d*/, '');
    return url + (url.indexOf('?') >= 0 ? '&' : '?') +'cacheBuster=' + date;
  };

  var browser = navigator.userAgent.toLowerCase();
  var forceRepaint = ar.forceRepaint || browser.indexOf('chrome') > -1;

  var reloaders = {
    page: function(){
      window.location.reload(true);
    },

    stylesheet: function(){
      [].slice
        .call(document.querySelectorAll('link[rel=stylesheet]'))
        .filter(function(link) {
          var val = link.getAttribute('data-autoreload');
          return link.href && val != 'false';
        })
        .forEach(function(link) {
          link.href = cacheBuster(link.href);
        });

      // Hack to force page repaint after 25ms.
      if (forceRepaint) setTimeout(function() { document.body.offsetHeight; }, 25);
    },

    javascript: function(){
      var scripts = [].slice.call(document.querySelectorAll('script'));
      var textScripts = scripts.map(function(script) { return script.text }).filter(function(text) { return text.length > 0 });
      var srcScripts = scripts.filter(function(script) { return script.src });

      var loaded = 0;
      var all = srcScripts.length;
      var onLoad = function() {
        loaded = loaded + 1;
        if (loaded === all) {
          textScripts.forEach(function(script) { eval(script); });
        }
      }

      srcScripts
        .forEach(function(script) {
          var src = script.src;
          script.remove();
          var newScript = document.createElement('script');
          newScript.src = cacheBuster(src);
          newScript.async = true;
          newScript.onload = onLoad;
          document.head.appendChild(newScript);
        });
    }
  };
  var port = ar.port || 9485;
  var host = br.server || window.location.hostname || 'localhost';

  var connect = function(){
    var connection = new WebSocket('ws://' + host + ':' + port);
    connection.onmessage = function(event){
      if (ar.disabled) return;
      var message = event.data;
      var reloader = reloaders[message] || reloaders.page;
      reloader();
    };
    connection.onerror = function(){
      if (connection.readyState) connection.close();
    };
    connection.onclose = function(){
      window.setTimeout(connect, 1000);
    };
  };
  connect();
})();
/* jshint ignore:end */

;(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.jade = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

/**
 * Merge two attribute objects giving precedence
 * to values in object `b`. Classes are special-cased
 * allowing for arrays and merging/joining appropriately
 * resulting in a string.
 *
 * @param {Object} a
 * @param {Object} b
 * @return {Object} a
 * @api private
 */

exports.merge = function merge(a, b) {
  if (arguments.length === 1) {
    var attrs = a[0];
    for (var i = 1; i < a.length; i++) {
      attrs = merge(attrs, a[i]);
    }
    return attrs;
  }
  var ac = a['class'];
  var bc = b['class'];

  if (ac || bc) {
    ac = ac || [];
    bc = bc || [];
    if (!Array.isArray(ac)) ac = [ac];
    if (!Array.isArray(bc)) bc = [bc];
    a['class'] = ac.concat(bc).filter(nulls);
  }

  for (var key in b) {
    if (key != 'class') {
      a[key] = b[key];
    }
  }

  return a;
};

/**
 * Filter null `val`s.
 *
 * @param {*} val
 * @return {Boolean}
 * @api private
 */

function nulls(val) {
  return val != null && val !== '';
}

/**
 * join array as classes.
 *
 * @param {*} val
 * @return {String}
 */
exports.joinClasses = joinClasses;
function joinClasses(val) {
  return (Array.isArray(val) ? val.map(joinClasses) :
    (val && typeof val === 'object') ? Object.keys(val).filter(function (key) { return val[key]; }) :
    [val]).filter(nulls).join(' ');
}

/**
 * Render the given classes.
 *
 * @param {Array} classes
 * @param {Array.<Boolean>} escaped
 * @return {String}
 */
exports.cls = function cls(classes, escaped) {
  var buf = [];
  for (var i = 0; i < classes.length; i++) {
    if (escaped && escaped[i]) {
      buf.push(exports.escape(joinClasses([classes[i]])));
    } else {
      buf.push(joinClasses(classes[i]));
    }
  }
  var text = joinClasses(buf);
  if (text.length) {
    return ' class="' + text + '"';
  } else {
    return '';
  }
};


exports.style = function (val) {
  if (val && typeof val === 'object') {
    return Object.keys(val).map(function (style) {
      return style + ':' + val[style];
    }).join(';');
  } else {
    return val;
  }
};
/**
 * Render the given attribute.
 *
 * @param {String} key
 * @param {String} val
 * @param {Boolean} escaped
 * @param {Boolean} terse
 * @return {String}
 */
exports.attr = function attr(key, val, escaped, terse) {
  if (key === 'style') {
    val = exports.style(val);
  }
  if ('boolean' == typeof val || null == val) {
    if (val) {
      return ' ' + (terse ? key : key + '="' + key + '"');
    } else {
      return '';
    }
  } else if (0 == key.indexOf('data') && 'string' != typeof val) {
    if (JSON.stringify(val).indexOf('&') !== -1) {
      console.warn('Since Jade 2.0.0, ampersands (`&`) in data attributes ' +
                   'will be escaped to `&amp;`');
    };
    if (val && typeof val.toISOString === 'function') {
      console.warn('Jade will eliminate the double quotes around dates in ' +
                   'ISO form after 2.0.0');
    }
    return ' ' + key + "='" + JSON.stringify(val).replace(/'/g, '&apos;') + "'";
  } else if (escaped) {
    if (val && typeof val.toISOString === 'function') {
      console.warn('Jade will stringify dates in ISO form after 2.0.0');
    }
    return ' ' + key + '="' + exports.escape(val) + '"';
  } else {
    if (val && typeof val.toISOString === 'function') {
      console.warn('Jade will stringify dates in ISO form after 2.0.0');
    }
    return ' ' + key + '="' + val + '"';
  }
};

/**
 * Render the given attributes object.
 *
 * @param {Object} obj
 * @param {Object} escaped
 * @return {String}
 */
exports.attrs = function attrs(obj, terse){
  var buf = [];

  var keys = Object.keys(obj);

  if (keys.length) {
    for (var i = 0; i < keys.length; ++i) {
      var key = keys[i]
        , val = obj[key];

      if ('class' == key) {
        if (val = joinClasses(val)) {
          buf.push(' ' + key + '="' + val + '"');
        }
      } else {
        buf.push(exports.attr(key, val, false, terse));
      }
    }
  }

  return buf.join('');
};

/**
 * Escape the given string of `html`.
 *
 * @param {String} html
 * @return {String}
 * @api private
 */

var jade_encode_html_rules = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;'
};
var jade_match_html = /[&<>"]/g;

function jade_encode_char(c) {
  return jade_encode_html_rules[c] || c;
}

exports.escape = jade_escape;
function jade_escape(html){
  var result = String(html).replace(jade_match_html, jade_encode_char);
  if (result === '' + html) return html;
  else return result;
};

/**
 * Re-throw the given `err` in context to the
 * the jade in `filename` at the given `lineno`.
 *
 * @param {Error} err
 * @param {String} filename
 * @param {String} lineno
 * @api private
 */

exports.rethrow = function rethrow(err, filename, lineno, str){
  if (!(err instanceof Error)) throw err;
  if ((typeof window != 'undefined' || !filename) && !str) {
    err.message += ' on line ' + lineno;
    throw err;
  }
  try {
    str = str || require('fs').readFileSync(filename, 'utf8')
  } catch (ex) {
    rethrow(err, null, lineno)
  }
  var context = 3
    , lines = str.split('\n')
    , start = Math.max(lineno - context, 0)
    , end = Math.min(lines.length, lineno + context);

  // Error context
  var context = lines.slice(start, end).map(function(line, i){
    var curr = i + start + 1;
    return (curr == lineno ? '  > ' : '    ')
      + curr
      + '| '
      + line;
  }).join('\n');

  // Alter exception message
  err.path = filename;
  err.message = (filename || 'Jade') + ':' + lineno
    + '\n' + context + '\n\n' + err.message;
  throw err;
};

exports.DebugItem = function DebugItem(lineno, filename) {
  this.lineno = lineno;
  this.filename = filename;
}

},{"fs":2}],2:[function(require,module,exports){

},{}]},{},[1])(1)
});
