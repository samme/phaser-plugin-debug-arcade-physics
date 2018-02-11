###
  http://phaser.io/examples/v2/arcade-physics/asteroids-movement
###

game = undefined
ship = undefined
cursors = undefined
bullet = undefined
bullets = undefined
bulletTime = 0
asteroids = undefined
font = "16px Consolas, Menlo, monospace"
gui = undefined

{dat, Phaser} = this
{min, SQRT1_2} = Math
{ADD} = Phaser.blendModes
{mixin} = Phaser.Utils

class Asteroid extends Phaser.Sprite

  constructor: (_game, x, y, key, frame, group) ->
    x ||= _game.world.randomX
    y ||= _game.world.randomY
    key ?= "asteroid#{_game.rnd.between 1, 3}"

    super _game, x, y, key, frame, group

    @anchor.setTo 0.5
    @name = "asteroid"
    size = min @width, @height
    @scale.setTo @mass = game.rnd.realInRange 1, 2
    offset = size * 0.5 * (1 - SQRT1_2)
    size *= SQRT1_2

    _game.physics.arcade.enable this
    @body.setSize size, size, offset, offset

    mixin
      angularVelocity: 30
      bounce:
        x: 1
        y: 1
      friction:
        x: 0
        y: 0
      velocity:
        x: _game.rnd.between -50, 50
        y: _game.rnd.between -50, 50
      , @body

    this

  explode: ->
    @body.enable = no
    @blendMode = ADD
    @game.add.tween(this).to(alpha: 0).start().onComplete.add @kill, this
    @game.add.tween(@scale).to(x: 0, y: 0).start()
    return

  update: ->
    @game.world.wrap this
    return

init = ->
  game.debug.font = font
  game.debug.lineHeight = 20

  unless game.debug.arcade
    game.plugins.add Phaser.Plugin.DebugArcadePhysics

  return

preload = ->
  game.load.path = "example/assets/"
  game.load.image "space",     "deep-space.jpg"
  game.load.image "asteroid1", "asteroid1.png"
  game.load.image "asteroid2", "asteroid2.png"
  game.load.image "asteroid3", "asteroid3.png"
  game.load.image "bullet",    "bullets.png"
  game.load.image "ship",      "ship.png"
  return

create = ->
  {world} = game
  {view} = game.camera

  #  A spacey background
  space = world.space = game.add.tileSprite 0, 0, view.width, view.height, "space"
  space.fixedToCamera = yes

  #  Our ships bullets
  bullets = game.add.group()
  bullets.enableBody = true
  #  All 10 of them
  bullets.createMultiple 10, "bullet"
  bullets.setAll "alpha", 0.75
  bullets.setAll "anchor.x", 0.5
  bullets.setAll "anchor.y", 0.5
  bullets.setAll "blendMode", ADD

  #  Our player ship
  ship = game.add.sprite world.centerX, world.centerY, "ship"
  ship.anchor.set 0.5

  #  and its physics settings
  game.physics.enable ship, Phaser.Physics.ARCADE
  ship.body.angularDrag = 30
  ship.body.bounce.setTo 1
  ship.body.drag.set 10
  ship.body.friction.setTo 0
  ship.body.maxVelocity.set 100

  # Asteroids
  asteroids = game.add.group world, "asteroids", no, yes
  asteroids.classType = Asteroid
  asteroids.createMultiple Math.ceil(game.width * game.height / 1e5), null, null, yes

  #  Game input
  {keyboard} = game.input
  cursors = keyboard.createCursorKeys()
  keyboard.addKeyCapture [ Phaser.Keyboard.SPACEBAR ]

  for key, fun of {
    D:    toggleDim
    F:    toggleStep
    R: -> game.state.restart()
    S: -> game.step()
    T:    game.debug.arcade.toggle
    V:    toggleVisible
  }
    keyboard.addKey(Phaser.Keyboard[ key ]).onDown.add fun

  createGui()

  return

update = ->
  {arcade} = game.physics

  arcade.collide asteroids
  arcade.collide asteroids, ship
  arcade.overlap asteroids, bullets, (asteroid) -> asteroid.explode()

  {body} = ship

  if cursors.up.isDown
    arcade.accelerationFromRotation ship.rotation, 100, body.acceleration
  else
    body.acceleration.set 0

  if      cursors.left.isDown  then body.angularAcceleration = -90
  else if cursors.right.isDown then body.angularAcceleration =  90
  else                              body.angularAcceleration =   0

  fireBullet() if game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)

  screenWrap ship
  bullets.forEachExists screenWrap, this
  return

fireBullet = ->
  if game.time.now > bulletTime
    bullet = bullets.getFirstExists(false)
    if bullet
      bullet.reset ship.body.x + 16, ship.body.y + 16
      bullet.lifespan = 2000
      bullet.rotation = ship.rotation
      game.physics.arcade.velocityFromRotation ship.rotation, 250, bullet.body.velocity
      bulletTime = game.time.now + 100
  return

screenWrap = (sprite) ->
  {world} = game

  if      sprite.x < 0            then sprite.x = world.width
  else if sprite.x > world.width  then sprite.x = 0
  if      sprite.y < 0            then sprite.y = world.height
  else if sprite.y > world.height then sprite.y = 0

  return

render = ->
  game.debug.text "(T)oggle
                   (R)estart •
                   Plugin v#{Phaser.Plugin.DebugArcadePhysics.VERSION} •
                   Phaser v#{Phaser.VERSION}",
                   320, 20, null, game.debug.font

toggleDim = ->
  visible = not game.world.space.visible
  game.world.space.visible = visible
  return

toggleStep = ->
  if game.stepping then game.disableStep() else game.enableStep()
  return

toggleVisible = ->
  visible = game.world.alpha isnt 1
  game.world.alpha = +visible
  return

shutdown = ->
  gui.destroy()
  return

addGuiKey = (_gui, obj, key) ->
  switch key
    when "lineWidth"
      _gui.add(obj, key, 0, 10, 1).listen()
    else
      _gui.add(obj, key).listen()

  return

createGui = ->
  {arcade} = game.debug
  {config} = arcade

  gui = new dat.GUI width: 400

  gameF = gui.addFolder "game"
  pluginF = gui.addFolder "game.debug.arcade"
  configF = gui.addFolder "game.debug.arcade.config"
  worldF = gui.addFolder "world"
  bgF = gui.addFolder "background"

  for key in ["off", "on", "toggle"]
    pluginF.add arcade, key

  for key, val of config
    addGuiKey(configF, config, key) if val?

  gameF.add game, "enableStep"
  gameF.add game, "disableStep"
  gameF.add game, "step"

  bgF.add(game.world.space, "visible").listen()

  worldF.add(game.world, "alpha", 0, 1, 0.1).listen()

  gui

game = new Phaser.Game
  width: "100%"
  height: "100%"
  renderer: Phaser.CANVAS
  parent: "phaser-example"
  scaleMode: Phaser.ScaleManager.NO_SCALE
  state:
    create: create
    init: init
    preload: preload
    render: render
    shutdown: shutdown
    update: update
