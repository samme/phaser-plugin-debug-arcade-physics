###
  http://phaser.io/examples/v2/arcade-physics/asteroids-movement
###

sprite = undefined
cursors = undefined
bullet = undefined
bullets = undefined
bulletTime = 0
asteroids = undefined
font = "16px Consolas, Menlo, monospace"

{min, SQRT1_2} = Math
{ADD} = Phaser.blendModes
{Quadratic, Sinusoidal} = Phaser.Easing
{MINUTE, SECOND} = Phaser.Timer
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
  game.debug.font = font
  game.debug.lineHeight = 20

  #  This will run in Canvas mode, so let's gain a little speed and display
  game.renderer.clearBeforeRender = false
  game.renderer.roundPixels = true

  game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL

  unless game.debug.arcade
    game.plugins.add Phaser.Plugin.DebugArcadePhysics
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

  #  A spacey background
  space = game.world.space = game.add.tileSprite 0, 0, game.width, game.height, 'space'
  space.tilePosition.set game.world.randomX, game.world.randomY

  if game.renderType is Phaser.WEBGL
    game.add.tween(space.tileScale).to {x: 2, y: 2},
      1 * MINUTE, Sinusoidal.InOut, yes, 0, 1e6, yes

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
  {keyboard} = game.input
  cursors = keyboard.createCursorKeys()
  keyboard.addKeyCapture [ Phaser.Keyboard.SPACEBAR ]

  for key, fun of {
    D:    toggleDim
    F: -> if game.stepping then game.disableStep() else game.enableStep()
    R: -> game.state.restart()
    S: -> game.step()
    T:    game.debug.arcade.toggle
    V:    toggleVisible
  }
    keyboard.addKey(Phaser.Keyboard[ key ]).onDown.add fun

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
  game.debug.text "(T)oggle /
                   (D)im /
                   in(V)isible /
                   (F)reeze /
                   (S)tep 1 frame /
                   (R)estart •
                   Plugin v#{Phaser.Plugin.DebugArcadePhysics.VERSION} •
                   Phaser v#{Phaser.VERSION}",
                   10, 465, null, "12px Consolas, Menlo, monospace"

toggleDim = ->
  onOrOff = not game.world.space.visible
  game.world.space.visible = onOrOff
  game.renderer.clearBeforeRender = not onOrOff
  return

toggleVisible = ->
  visible = game.world.alpha isnt 1
  game.world.alpha = +visible
  game.renderer.clearBeforeRender = not visible
  return

@game = new (Phaser.Game)(960, 480, Phaser.CANVAS, 'phaser-example',
  init: init
  preload: preload
  create: create
  update: update
  render: render)
