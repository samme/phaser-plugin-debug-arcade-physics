
/*
  http://phaser.io/examples/v2/arcade-physics/asteroids-movement
 */

(function() {
  var ADD, Asteroid, Phaser, SQRT1_2, addGuiKey, asteroids, bullet, bulletTime, bullets, create, createGui, cursors, dat, fireBullet, font, game, gui, init, min, mixin, preload, ref, render, screenWrap, ship, shutdown, toggleDim, toggleStep, toggleVisible, update,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  game = void 0;

  ship = void 0;

  cursors = void 0;

  bullet = void 0;

  bullets = void 0;

  bulletTime = 0;

  asteroids = void 0;

  font = "16px Consolas, Menlo, monospace";

  gui = void 0;

  ref = this, dat = ref.dat, Phaser = ref.Phaser;

  min = Math.min, SQRT1_2 = Math.SQRT1_2;

  ADD = Phaser.blendModes.ADD;

  mixin = Phaser.Utils.mixin;

  Asteroid = (function(superClass) {
    extend(Asteroid, superClass);

    function Asteroid(_game, x, y, key, frame, group) {
      var offset, size;
      x || (x = _game.world.randomX);
      y || (y = _game.world.randomY);
      if (key == null) {
        key = "asteroid" + (_game.rnd.between(1, 3));
      }
      Asteroid.__super__.constructor.call(this, _game, x, y, key, frame, group);
      this.anchor.setTo(0.5);
      this.name = "asteroid";
      size = min(this.width, this.height);
      this.scale.setTo(this.mass = game.rnd.realInRange(1, 2));
      offset = size * 0.5 * (1 - SQRT1_2);
      size *= SQRT1_2;
      _game.physics.arcade.enable(this);
      this.body.setSize(size, size, offset, offset);
      mixin({
        angularVelocity: 30,
        bounce: {
          x: 1,
          y: 1
        },
        friction: {
          x: 0,
          y: 0
        },
        velocity: {
          x: _game.rnd.between(-50, 50),
          y: _game.rnd.between(-50, 50)
        }
      }, this.body);
      this;
    }

    Asteroid.prototype.explode = function() {
      this.body.enable = false;
      this.blendMode = ADD;
      this.game.add.tween(this).to({
        alpha: 0
      }).start().onComplete.add(this.kill, this);
      this.game.add.tween(this.scale).to({
        x: 0,
        y: 0
      }).start();
    };

    Asteroid.prototype.update = function() {
      this.game.world.wrap(this);
    };

    return Asteroid;

  })(Phaser.Sprite);

  init = function() {
    game.debug.font = font;
    game.debug.lineHeight = 20;
    if (!game.debug.arcade) {
      game.plugins.add(Phaser.Plugin.DebugArcadePhysics);
    }
  };

  preload = function() {
    game.load.image("space", "asteroids/deep-space.jpg");
    game.load.image("asteroid1", "asteroids/asteroid1.png");
    game.load.image("asteroid2", "asteroids/asteroid2.png");
    game.load.image("asteroid3", "asteroids/asteroid3.png");
    game.load.image("bullet", "asteroids/bullets.png");
    game.load.image("ship", "asteroids/ship.png");
  };

  create = function() {
    var fun, key, keyboard, ref1, space, view, world;
    world = game.world;
    view = game.camera.view;
    space = world.space = game.add.tileSprite(0, 0, view.width, view.height, "space");
    space.fixedToCamera = true;
    bullets = game.add.group();
    bullets.enableBody = true;
    bullets.createMultiple(10, "bullet");
    bullets.setAll("alpha", 0.75);
    bullets.setAll("anchor.x", 0.5);
    bullets.setAll("anchor.y", 0.5);
    bullets.setAll("blendMode", ADD);
    ship = game.add.sprite(300, 300, "ship");
    ship.anchor.set(0.5);
    game.physics.enable(ship, Phaser.Physics.ARCADE);
    ship.body.angularDrag = 30;
    ship.body.bounce.setTo(1);
    ship.body.drag.set(10);
    ship.body.friction.setTo(0);
    ship.body.maxVelocity.set(100);
    asteroids = game.add.group(world, "asteroids", false, true);
    asteroids.classType = Asteroid;
    asteroids.createMultiple(5, null, null, true);
    keyboard = game.input.keyboard;
    cursors = keyboard.createCursorKeys();
    keyboard.addKeyCapture([Phaser.Keyboard.SPACEBAR]);
    ref1 = {
      D: toggleDim,
      F: toggleStep,
      R: function() {
        return game.state.restart();
      },
      S: function() {
        return game.step();
      },
      T: game.debug.arcade.toggle,
      V: toggleVisible
    };
    for (key in ref1) {
      fun = ref1[key];
      keyboard.addKey(Phaser.Keyboard[key]).onDown.add(fun);
    }
    createGui();
  };

  update = function() {
    var arcade, body;
    arcade = game.physics.arcade;
    arcade.collide(asteroids);
    arcade.collide(asteroids, ship);
    arcade.overlap(asteroids, bullets, function(asteroid) {
      return asteroid.explode();
    });
    body = ship.body;
    if (cursors.up.isDown) {
      arcade.accelerationFromRotation(ship.rotation, 100, body.acceleration);
    } else {
      body.acceleration.set(0);
    }
    if (cursors.left.isDown) {
      body.angularAcceleration = -90;
    } else if (cursors.right.isDown) {
      body.angularAcceleration = 90;
    } else {
      body.angularAcceleration = 0;
    }
    if (game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)) {
      fireBullet();
    }
    screenWrap(ship);
    bullets.forEachExists(screenWrap, this);
  };

  fireBullet = function() {
    if (game.time.now > bulletTime) {
      bullet = bullets.getFirstExists(false);
      if (bullet) {
        bullet.reset(ship.body.x + 16, ship.body.y + 16);
        bullet.lifespan = 2000;
        bullet.rotation = ship.rotation;
        game.physics.arcade.velocityFromRotation(ship.rotation, 250, bullet.body.velocity);
        bulletTime = game.time.now + 100;
      }
    }
  };

  screenWrap = function(sprite) {
    var world;
    world = game.world;
    if (sprite.x < 0) {
      sprite.x = world.width;
    } else if (sprite.x > world.width) {
      sprite.x = 0;
    }
    if (sprite.y < 0) {
      sprite.y = world.height;
    } else if (sprite.y > world.height) {
      sprite.y = 0;
    }
  };

  render = function() {
    return game.debug.text("(T)oggle (R)estart • Plugin v" + Phaser.Plugin.DebugArcadePhysics.VERSION + " • Phaser v" + Phaser.VERSION, 5, 470, null, "9px Consolas, Menlo, monospace");
  };

  toggleDim = function() {
    var visible;
    visible = !game.world.space.visible;
    game.world.space.visible = visible;
  };

  toggleStep = function() {
    if (game.stepping) {
      game.disableStep();
    } else {
      game.enableStep();
    }
  };

  toggleVisible = function() {
    var visible;
    visible = game.world.alpha !== 1;
    game.world.alpha = +visible;
  };

  shutdown = function() {
    gui.destroy();
  };

  addGuiKey = function(_gui, obj, key) {
    switch (key) {
      case "lineWidth":
        _gui.add(obj, key, 0, 10, 1).listen();
        break;
      default:
        _gui.add(obj, key).listen();
    }
  };

  createGui = function() {
    var bgF, config, configF, gameF, key, val, worldF;
    config = game.debug.arcade.config;
    gui = new dat.GUI({
      width: 400
    });
    configF = gui.addFolder("game.debug.arcade.config");
    gameF = gui.addFolder("game");
    worldF = gui.addFolder("world");
    bgF = gui.addFolder("background");
    for (key in config) {
      val = config[key];
      if (val != null) {
        addGuiKey(configF, config, key);
      }
    }
    gameF.add(game, "enableStep");
    gameF.add(game, "disableStep");
    gameF.add(game, "step");
    bgF.add(game.world.space, "visible").listen();
    worldF.add(game.world, "alpha", 0, 1, 0.1).listen();
    return gui;
  };

  game = new Phaser.Game({
    width: 960,
    height: 480,
    renderer: Phaser.CANVAS,
    parent: "phaser-example",
    scaleMode: Phaser.ScaleManager.SHOW_ALL,
    state: {
      create: create,
      init: init,
      preload: preload,
      render: render,
      shutdown: shutdown,
      update: update
    }
  });

}).call(this);

