
/*
  Debug Arcade Physics plugin v0.5.0 (1) for Phaser
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
    var TOO_BIG, _calculateDrag, _circle, _line, _offset, _rect, _rotation, aqua, blue, colors, coral, gold, gray, green, indigo, orange, purple, red, rose, violet, white, yellow;

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

    DebugArcadePhysics.isNotBullet = function(obj) {
      return !obj instanceof Bullet;
    };

    DebugArcadePhysics.isNotParticle = function(obj) {
      return obj.type !== PARTICLE;
    };

    DebugArcadePhysics.isNotSprite = function(obj) {
      return obj.type !== SPRITE;
    };

    DebugArcadePhysics.isParticle = function(obj) {
      return obj.type === PARTICLE;
    };

    DebugArcadePhysics.isSprite = function(obj) {
      return obj.type === SPRITE;
    };

    DebugArcadePhysics.VERSION = "0.5.0.1";

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

    DebugArcadePhysics.prototype.config = seal({
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

    DebugArcadePhysics.prototype.configKeys = freeze(Object.keys(DebugArcadePhysics.prototype.config));

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
      return colors[renderBodyDisabled && !enable ? "bodyDisabled" : renderTouching && !touching.none ? "touching" : renderBlocked && (blocked.down || blocked.up || blocked.left || blocked.right) ? "blocked" : "body"];
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
          console.warn("No such setting '" + name + "'. Use " + (this.configKeys.join(', ')) + ".");
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
      var camera, ref, x, y;
      ref = body.center, x = ref.x, y = ref.y;
      camera = this.game.camera;
      this.game.debug.pixel(~~(x - camera.x), ~~(y - camera.y), colors.center);
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
        x = 10;
      }
      if (y == null) {
        y = x;
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
        x = 10;
      }
      if (y == null) {
        y = x;
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
      var body, child, config, filter, i, len, ref;
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
      _line.setTo(startX, startY, endX, endY);
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
      this.renderVectorXY(halfWidth * cos(rotation), halfHeight * sin(rotation), body, colors.rotation);
      return this;
    };

    DebugArcadePhysics.prototype.renderSpeed = function(body) {
      if (body.speed < 1) {
        return this;
      }
      this.renderCircle(body.speed, body, colors.speed);
      return this;
    };

    DebugArcadePhysics.prototype.renderVector = function(vector, body, color) {
      if (vector.isZero()) {
        return this;
      }
      this.renderVectorXY(vector.x, vector.y, body, color);
      return this;
    };

    DebugArcadePhysics.prototype.renderVectorXY = function(vectorX, vectorY, body, color) {
      var ref, x, y;
      if (vectorX === 0 && vectorY === 0) {
        return this;
      }
      ref = body.center, x = ref.x, y = ref.y;
      this.renderLine(x, y, x + vectorX, y + vectorY, color);
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
        offset: this.renderOffset.bind(this),
        on: this.on.bind(this),
        rect: this.renderRect.bind(this),
        rotation: this.renderRotation.bind(this),
        show: this.show.bind(this),
        speed: this.renderSpeed.bind(this),
        vector: this.renderVector.bind(this),
        vectorXY: this.renderVectorXY.bind(this),
        velocity: this.renderVelocity.bind(this),
        toggle: this.toggle.bind(this)
      });
    };

    return DebugArcadePhysics;

  })(Phaser.Plugin));

}).call(this);

