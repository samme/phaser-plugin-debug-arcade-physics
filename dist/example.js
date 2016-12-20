
/*
  http://phaser.io/examples/v2/arcade-physics/asteroids-movement
 */

(function() {
  var ADD, Asteroid, FOLLOW_TOPDOWN, MINUTE, Quadratic, SECOND, SQRT1_2, Sinusoidal, asteroids, bullet, bulletTime, bullets, create, cursors, fireBullet, font, init, min, mixin, preload, ref, ref1, render, screenWrap, sprite, toggleDim, toggleStep, toggleVisible, update,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  sprite = void 0;

  cursors = void 0;

  bullet = void 0;

  bullets = void 0;

  bulletTime = 0;

  asteroids = void 0;

  font = "16px Consolas, Menlo, monospace";

  min = Math.min, SQRT1_2 = Math.SQRT1_2;

  ADD = Phaser.blendModes.ADD;

  FOLLOW_TOPDOWN = Phaser.Camera.FOLLOW_TOPDOWN;

  ref = Phaser.Easing, Quadratic = ref.Quadratic, Sinusoidal = ref.Sinusoidal;

  ref1 = Phaser.Timer, MINUTE = ref1.MINUTE, SECOND = ref1.SECOND;

  mixin = Phaser.Utils.mixin;

  Asteroid = (function(superClass) {
    extend(Asteroid, superClass);

    function Asteroid(game, x, y, key, frame, group) {
      var offset, size;
      x || (x = game.world.randomX);
      y || (y = game.world.randomY);
      if (key == null) {
        key = "asteroid" + (game.rnd.between(1, 3));
      }
      Asteroid.__super__.constructor.call(this, game, x, y, key, frame, group);
      this.anchor.setTo(0.5);
      this.name = "asteroid";
      size = min(this.width, this.height);
      this.scale.setTo(this.mass = game.rnd.realInRange(0.5, 2));
      offset = size * 0.5 * (1 - SQRT1_2);
      size *= SQRT1_2;
      game.physics.arcade.enable(this);
      this.body.setSize(size, size, offset, offset);
      mixin({
        bounce: {
          x: 1,
          y: 1
        },
        friction: {
          x: 0,
          y: 0
        },
        velocity: {
          x: game.rnd.between(-50, 50),
          y: game.rnd.between(-50, 50)
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
      return this.game.add.tween(this.scale).to({
        x: 0,
        y: 0
      }).start();
    };

    Asteroid.prototype.update = function() {
      this.rotation += Math.PI / 300;
      this.game.world.wrap(this);
    };

    return Asteroid;

  })(Phaser.Sprite);

  init = function() {
    game.debug.font = font;
    game.debug.lineHeight = 20;
    game.renderer.clearBeforeRender = false;
    game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    if (!game.debug.arcade) {
      game.plugins.add(Phaser.Plugin.DebugArcadePhysics);
    }
  };

  preload = function() {
    game.load.image('space', 'asteroids/deep-space.jpg');
    game.load.image('asteroid1', 'asteroids/asteroid1.png');
    game.load.image('asteroid2', 'asteroids/asteroid2.png');
    game.load.image('asteroid3', 'asteroids/asteroid3.png');
    game.load.image('bullet', 'asteroids/bullets.png');
    game.load.image('ship', 'asteroids/ship.png');
  };

  create = function() {
    var fun, key, keyboard, ref2, space, view, world;
    world = game.world;
    view = game.camera.view;
    space = world.space = game.add.tileSprite(0, 0, view.width, view.height, 'space');
    space.fixedToCamera = true;
    bullets = game.add.group();
    bullets.enableBody = true;
    bullets.physicsBodyType = Phaser.Physics.ARCADE;
    bullets.createMultiple(10, 'bullet');
    bullets.setAll('alpha', 0.75);
    bullets.setAll('anchor.x', 0.5);
    bullets.setAll('anchor.y', 0.5);
    bullets.setAll('blendMode', ADD);
    sprite = game.add.sprite(300, 300, 'ship');
    sprite.anchor.set(0.5);
    game.physics.enable(sprite, Phaser.Physics.ARCADE);
    sprite.body.bounce.setTo(1);
    sprite.body.drag.set(25);
    sprite.body.friction.setTo(0);
    sprite.body.maxVelocity.set(100);
    asteroids = game.add.group(world, "asteroids", false, true);
    asteroids.classType = Asteroid;
    asteroids.createMultiple(5, null, null, true);
    keyboard = game.input.keyboard;
    cursors = keyboard.createCursorKeys();
    keyboard.addKeyCapture([Phaser.Keyboard.SPACEBAR]);
    ref2 = {
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
    for (key in ref2) {
      fun = ref2[key];
      keyboard.addKey(Phaser.Keyboard[key]).onDown.add(fun);
    }
  };

  update = function() {
    game.physics.arcade.collide(asteroids);
    game.physics.arcade.collide(asteroids, sprite);
    game.physics.arcade.overlap(asteroids, bullets, function(a, b) {
      return a.explode();
    });
    if (cursors.up.isDown) {
      game.physics.arcade.accelerationFromRotation(sprite.rotation, 100, sprite.body.acceleration);
    } else {
      sprite.body.acceleration.set(0);
    }
    if (cursors.left.isDown) {
      sprite.body.angularVelocity = -100;
    } else if (cursors.right.isDown) {
      sprite.body.angularVelocity = 100;
    } else {
      sprite.body.angularVelocity = 0;
    }
    if (game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)) {
      fireBullet();
    }
    screenWrap(sprite);
    bullets.forEachExists(screenWrap, this);
  };

  fireBullet = function() {
    if (game.time.now > bulletTime) {
      bullet = bullets.getFirstExists(false);
      if (bullet) {
        bullet.reset(sprite.body.x + 16, sprite.body.y + 16);
        bullet.lifespan = 2000;
        bullet.rotation = sprite.rotation;
        game.physics.arcade.velocityFromRotation(sprite.rotation, 250, bullet.body.velocity);
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
    return game.debug.text("(T)oggle / (D)im / in(V)isible / (F)reeze / (S)tep 1 frame / (R)estart • Plugin v" + Phaser.Plugin.DebugArcadePhysics.VERSION + " • Phaser v" + Phaser.VERSION, 10, 465, null, "12px Consolas, Menlo, monospace");
  };

  toggleDim = function() {
    var onOrOff;
    onOrOff = !game.world.space.visible;
    game.world.space.visible = onOrOff;
    game.renderer.clearBeforeRender = !onOrOff;
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
    game.renderer.clearBeforeRender = !visible;
  };

  this.game = new Phaser.Game(960, 480, Phaser.CANVAS, 'phaser-example', {
    init: init,
    preload: preload,
    create: create,
    update: update,
    render: render
  });

}).call(this);

