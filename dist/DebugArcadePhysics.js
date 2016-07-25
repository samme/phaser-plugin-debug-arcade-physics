
/*
  Debug Arcade Physics plugin v0.1.0.1 for Phaser
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
    var TOO_BIG, _acceleration, _delta, _drag, _dragVector, _maxVelocity, _speed, _velocity, aqua, blue, colors, config, gray, green, indigo, orange, purple, red, rose, rust, version, violet, white, yellow;

    extend(DebugArcadePhysics, superClass);

    function DebugArcadePhysics() {
      return DebugArcadePhysics.__super__.constructor.apply(this, arguments);
    }

    DebugArcadePhysics.addTo = function(game) {
      return game.plugins.add(this);
    };

    DebugArcadePhysics.version = version = "0.1.0.1";

    TOO_BIG = 10000;

    red = "hsla(0  , 100%,  50%, 0.5)";

    rust = "hsla(15 , 100%,  50%, 0.5)";

    orange = "hsla(30 , 100%,  50%, 0.5)";

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
      blocked: rust,
      body: yellow,
      bodyDisabled: gray,
      center: white,
      delta: indigo,
      drag: orange,
      maxVelocity: green,
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
      renderDelta: false,
      renderDrag: true,
      renderMaxVelocity: true,
      renderLegend: true,
      renderSpeed: true,
      renderTouching: true,
      renderVelocity: true
    });

    DebugArcadePhysics.prototype.configKeys = freeze(Object.keys(config));

    DebugArcadePhysics.prototype.name = "Debug Arcade Physics Plugin";

    DebugArcadePhysics.prototype.version = version;

    DebugArcadePhysics.prototype.init = function() {
      console.log("%s v%s", this.name, this.version);
      this.game.debug.arcade = this["interface"]();
      this.help();
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
          console.log(name, val);
        } else {
          console.warn("No such setting '" + name + "'. Valid names are " + this.configKeys + ".");
        }
      }
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

    DebugArcadePhysics.prototype.placeLine = function(line, start, vector) {
      return line.setTo(start.x, start.y, start.x + vector.x, start.y + vector.y);
    };

    DebugArcadePhysics.prototype.placeLineXY = function(line, start, vectorX, vectorY) {
      return line.setTo(start.x, start.y, start.x + vectorX, start.y + vectorY);
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
      if (maxVelocity.x >= TOO_BIG || maxVelocity.y >= TOO_BIG) {
        return this;
      }
      this.placeRect(_maxVelocity, body.center, maxVelocity);
      this.geom(_maxVelocity, colors.maxVelocity);
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
        if (config.renderDelta) {
          this.renderDelta(body);
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

    _delta = new Line;

    DebugArcadePhysics.prototype.renderDelta = function(body) {
      var x, y;
      x = body._dx;
      y = body._dy;
      if ((0 === x && x === y)) {
        return this;
      }
      this.placeLineXY(_delta, body.center, x, y);
      this.geom(_velocity, colors.delta, false);
      return this;
    };

    _speed = new Circle;

    DebugArcadePhysics.prototype.renderSpeed = function(body) {
      if (body.speed < 1) {
        return this;
      }
      _speed.setTo(body.center.x, body.center.y, 2 * body.speed);
      this.geom(_speed, colors.speed);
      return this;
    };

    _velocity = new Line;

    DebugArcadePhysics.prototype.renderVelocity = function(body) {
      if (body.velocity.isZero()) {
        return this;
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

    DebugArcadePhysics.prototype.toggleVisible = function() {
      this.visible = !this.visible;
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
        help: this.help.bind(this),
        helpConfig: this.helpConfig.bind(this),
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

