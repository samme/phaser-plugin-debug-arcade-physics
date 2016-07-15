
/*
  Debug Arcade Physics plugin v0.0.0.25 for Phaser
 */

(function() {
  "use strict";
  var ARCADE, Circle, DebugArcadePhysics, Line, Plugin, Point, Rectangle, abs, freeze, max, seal, sign,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  abs = Math.abs, max = Math.max;

  freeze = Object.freeze, seal = Object.seal;

  Circle = Phaser.Circle, Line = Phaser.Line, Plugin = Phaser.Plugin, Point = Phaser.Point, Rectangle = Phaser.Rectangle;

  sign = Phaser.Math.sign;

  ARCADE = Phaser.Physics.ARCADE;

  Phaser.Plugin.DebugArcadePhysics = freeze(DebugArcadePhysics = (function(superClass) {
    var _acceleration, _drag, _dragVector, _maxVelocity, _speed, _velocity, aqua, blue, colors, config, gray, green, indigo, orange, purple, red, version, white, yellow;

    extend(DebugArcadePhysics, superClass);

    function DebugArcadePhysics() {
      return DebugArcadePhysics.__super__.constructor.apply(this, arguments);
    }

    DebugArcadePhysics.addTo = function(game) {
      return game.plugins.add(this);
    };

    DebugArcadePhysics.version = version = "0.0.0.25";

    red = "hsla(0  , 100%,  50%, 0.5)";

    orange = "hsla(30 , 100%,  50%, 0.5)";

    yellow = "hsla(60 , 100%,  50%, 0.5)";

    green = "hsla(120, 100%,  50%, 0.5)";

    aqua = "hsla(180, 100%,  50%, 0.5)";

    blue = "hsla(210, 100%,  50%, 0.5)";

    indigo = "hsla(240, 100%,  50%, 0.5)";

    purple = "hsla(270, 100%,  50%, 0.5)";

    white = "hsla(0  ,   0%, 100%, 0.5)";

    gray = "hsla(0  ,   0%,  50%, 0.5)";

    DebugArcadePhysics.prototype.colors = colors = {
      acceleration: red,
      body: yellow,
      bodyDisabled: gray,
      center: white,
      drag: orange,
      maxVelocity: green,
      speed: blue,
      velocity: aqua
    };

    DebugArcadePhysics.prototype.config = config = seal({
      filter: null,
      lineWidth: 1,
      on: true,
      renderAcceleration: true,
      renderBody: true,
      renderCenter: true,
      renderDrag: true,
      renderMaxVelocity: true,
      renderLegend: true,
      renderSpeed: true,
      renderVelocity: true
    });

    DebugArcadePhysics.prototype.configKeys = freeze(Object.keys(config));

    DebugArcadePhysics.prototype.name = "Debug Arcade Physics Plugin";

    DebugArcadePhysics.prototype.version = version;

    DebugArcadePhysics.prototype.init = function() {
      var arcade;
      console.log("%s v%s", this.name, this.version);
      this.game.debug.arcade = arcade = this["interface"]();
      console.log("Use `game.debug.arcade`: " + (Object.keys(arcade)));
    };

    DebugArcadePhysics.prototype.postRender = function() {
      if (!this.config.on) {
        return;
      }
      if (this.config.renderLegend) {
        this.renderColors();
      }
      this.renderAll();
    };

    DebugArcadePhysics.prototype.calculateDrag = function(body, out) {
      var drag, dx, dy, physicsElapsed, velocity, vx, vy;
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
        } else {
          console.warn("No such setting '" + name + "'. Valid names are " + this.configKeys + ".");
        }
      }
      console.dir(this.config);
      return this;
    };

    DebugArcadePhysics.prototype.geom = function(obj, color, fill) {
      var context, debug, lineWidth;
      if (fill == null) {
        fill = false;
      }
      debug = this.game.debug;
      context = debug.context;
      lineWidth = context;
      context.lineWidth = this.config.lineWidth;
      debug.geom(obj, color, fill);
      context.lineWidth = lineWidth;
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

    DebugArcadePhysics.prototype.placeLine = function(line, start, vector) {
      line.start.copyFrom(start);
      line.end.copyFrom(start).add(vector.x, vector.y);
      return line;
    };

    DebugArcadePhysics.prototype.placeRect = function(rect, center, size) {
      rect.resize(2 * size.x, 2 * size.y).centerOn(center.x, center.y);
      return rect;
    };

    _acceleration = new Line;

    DebugArcadePhysics.prototype.renderAcceleration = function(body) {
      this.placeLine(_acceleration, body.center, body.acceleration);
      if (!_acceleration.empty) {
        this.geom(_acceleration, colors.acceleration);
      }
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

    DebugArcadePhysics.prototype.renderColors = function() {
      var debug, name, ref, val;
      debug = this.game.debug;
      debug.start(debug.lineHeight, debug.lineHeight);
      ref = this.colors;
      for (name in ref) {
        val = ref[name];
        debug.currentColor = val;
        debug.line(name);
      }
      debug.stop();
      return this;
    };

    _dragVector = new Point;

    _drag = new Line;

    DebugArcadePhysics.prototype.renderDrag = function(body) {
      this.calculateDrag(body, _dragVector);
      if (!_dragVector.isZero()) {
        this.placeLine(_drag, body.center, _dragVector);
        this.geom(_drag, colors.drag);
      }
      return this;
    };

    _maxVelocity = new Rectangle;

    DebugArcadePhysics.prototype.renderMaxVelocity = function(body) {
      var maxVelocity;
      maxVelocity = body.maxVelocity;
      if (maxVelocity.x > 1000 || maxVelocity.y > 1000) {
        return body;
      }
      this.placeRect(_maxVelocity, body.center, maxVelocity);
      this.geom(_maxVelocity, colors.maxVelocity);
      return this;
    };

    DebugArcadePhysics.prototype.renderObj = function(obj) {
      var body, child, filter, i, len, ref;
      if (!obj.exists) {
        return obj;
      }
      config = this.config;
      filter = config.filter;
      body = obj.body;
      if ((body != null ? body.type : void 0) === ARCADE && body.enable) {
        if (filter && !filter.call(this, obj)) {
          return body;
        }
        if (config.renderBody) {
          this.renderBody(body);
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
      this.game.debug.body(body.sprite, colors[body.enable ? "body" : "bodyDisabled"], false);
      return this;
    };

    _speed = new Circle;

    DebugArcadePhysics.prototype.renderSpeed = function(body) {
      if (body.speed < 1) {
        return body;
      }
      _speed.setTo(body.center.x, body.center.y, 2 * body.speed);
      this.geom(_speed, colors.speed);
      return this;
    };

    _velocity = new Line;

    DebugArcadePhysics.prototype.renderVelocity = function(body) {
      if (body.velocity.isZero()) {
        return body;
      }
      this.placeLine(_velocity, body.center, body.velocity);
      this.geom(_velocity, colors.velocity, false);
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

    DebugArcadePhysics.prototype["interface"] = function() {
      return freeze({
        acceleration: this.renderAcceleration.bind(this),
        body: this.renderBody.bind(this),
        center: this.renderCenter.bind(this),
        config: this.config,
        configSet: this.configSet.bind(this),
        drag: this.renderDrag.bind(this),
        hide: this.hide.bind(this),
        maxVelocity: this.renderMaxVelocity.bind(this),
        obj: this.renderObj.bind(this),
        off: this.off.bind(this),
        on: this.on.bind(this),
        show: this.show.bind(this),
        speed: this.renderSpeed.bind(this),
        velocity: this.renderVelocity.bind(this),
        toggle: this.toggle.bind(this)
      });
    };

    return DebugArcadePhysics;

  })(Phaser.Plugin));

}).call(this);

