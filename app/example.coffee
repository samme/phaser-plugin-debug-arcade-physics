###
  http://phaser.io/examples/v2/arcade-physics/asteroids-movement
###

sprite = undefined
cursors = undefined
bullet = undefined
bullets = undefined
bulletTime = 0
asteroids = undefined
{min, SQRT1_2} = Math
{ADD} = Phaser.blendModes
{mixin} = Phaser.Utils

class Asteroid extends Phaser.Sprite

  constructor: (game, x, y, key, frame, group) ->
    x   ||= game.world.randomX
    y   ||= game.world.randomY
    key  ?= "asteroid#{game.rnd.between 1, 3}"
    super game, x, y, key, frame, group
    @anchor.setTo 0.5
    @name = "asteroid"
    size = min @width, @height
    @scale.setTo @mass = game.rnd.realInRange(0.5, 2)
    offset = size * 0.5 * (1 - SQRT1_2)
    size *= SQRT1_2
    game.physics.arcade.enable this
    @body.setSize size, size, offset, offset
    mixin
      bounce:
        x: 1
        y: 1
      friction:
        x: 0
        y: 0
      velocity:
        x: game.rnd.between(-50, 50)
        y: game.rnd.between(-50, 50)
      , @body
    this

  explode: ->
    @body.enable = no
    @blendMode = ADD
    @game.add.tween(this).to(alpha: 0).start().onComplete.add @kill, this
    @game.add.tween(@scale).to(x: 0, y: 0).start()

  update: ->
    @rotation += Math.PI / 300
    @game.world.wrap this
    return

init = ->
  game.debug.font = "16px monospace"
  game.debug.lineHeight = 20
  game.plugins.add Phaser.Plugin.DebugArcadePhysics
  game.scale.scaleMode = Phaser.ScaleManager.NO_SCALE # SHOW_ALL
  return

preload = ->
  game.load.image 'space',     'asteroids/deep-space.jpg'
  game.load.image 'asteroid1', 'asteroids/asteroid1.png'
  game.load.image 'asteroid2', 'asteroids/asteroid2.png'
  game.load.image 'asteroid3', 'asteroids/asteroid3.png'
  game.load.image 'bullet',    'asteroids/bullets.png'
  game.load.image 'ship',      'asteroids/ship.png'
  return

create = ->
  #  This will run in Canvas mode, so let's gain a little speed and display
  game.renderer.clearBeforeRender = false
  game.renderer.roundPixels = true

  #  We need arcade physics
  game.physics.startSystem Phaser.Physics.ARCADE

  #  A spacey background
  space = game.add.tileSprite 0, 0, game.width, game.height, 'space'

  #  Our ships bullets
  bullets = game.add.group()
  bullets.enableBody = true
  bullets.physicsBodyType = Phaser.Physics.ARCADE
  #  All 10 of them
  bullets.createMultiple 10, 'bullet'
  bullets.setAll 'alpha', 0.75
  bullets.setAll 'anchor.x', 0.5
  bullets.setAll 'anchor.y', 0.5
  bullets.setAll 'blendMode', ADD

  #  Our player ship
  sprite = game.add.sprite(300, 300, 'ship')
  sprite.anchor.set 0.5
  #  and its physics settings
  game.physics.enable sprite, Phaser.Physics.ARCADE
  sprite.body.bounce.setTo 1
  sprite.body.drag.set 25
  sprite.body.friction.setTo 0
  sprite.body.maxVelocity.set 100

  # Asteroids
  asteroids = game.add.group game.world, "asteroids", no, yes
  asteroids.classType = Asteroid
  asteroids.createMultiple 5, null, null, yes

  #  Game input
  cursors = game.input.keyboard.createCursorKeys()
  game.input.keyboard.addKeyCapture [ Phaser.Keyboard.SPACEBAR ]
  return

update = ->
  if cursors.up.isDown
    game.physics.arcade.accelerationFromRotation sprite.rotation, 100, sprite.body.acceleration
  else
    sprite.body.acceleration.set 0

  if cursors.left.isDown       then sprite.body.angularVelocity = -100
  else if cursors.right.isDown then sprite.body.angularVelocity = 100
  else                              sprite.body.angularVelocity = 0

  fireBullet() if game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)

  game.physics.arcade.collide asteroids
  game.physics.arcade.collide asteroids, sprite
  game.physics.arcade.overlap asteroids, bullets, (a, b) -> a.explode()

  screenWrap sprite
  bullets.forEachExists screenWrap, this
  return

fireBullet = ->
  if game.time.now > bulletTime
    bullet = bullets.getFirstExists(false)
    if bullet
      bullet.reset sprite.body.x + 16, sprite.body.y + 16
      bullet.lifespan = 2000
      bullet.rotation = sprite.rotation
      game.physics.arcade.velocityFromRotation sprite.rotation, 250, bullet.body.velocity
      bulletTime = game.time.now + 100
  return

screenWrap = (sprite) ->
  if sprite.x < 0                then sprite.x = game.width
  else if sprite.x > game.width  then sprite.x = 0
  if sprite.y < 0                then sprite.y = game.height
  else if sprite.y > game.height then sprite.y = 0
  return

render = ->

@game = new (Phaser.Game)(960, 480, Phaser.CANVAS, 'phaser-example',
  init: init
  preload: preload
  create: create
  update: update
  render: render)
