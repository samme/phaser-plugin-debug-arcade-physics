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
gui = undefined

{min, SQRT1_2} = Math
{ADD} = Phaser.blendModes
{Quadratic, Sinusoidal} = Phaser.Easing
{MINUTE, SECOND} = Phaser.Timer
{mixin} = Phaser.Utils

class Asteroid extends Phaser.Sprite

  constructor: (game, x, y, key, frame, group) ->
    x ||= game.world.randomX
    y ||= game.world.randomY
    key ?= "asteroid#{game.rnd.between 1, 3}"

    super game, x, y, key, frame, group

    @anchor.setTo 0.5
    @name = "asteroid"
    size = min @width, @height
    @scale.setTo @mass = game.rnd.realInRange 1, 2
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
    return

  update: ->
    @rotation += Math.PI / 300
    @game.world.wrap this
    return

init = ->
  game.debug.font = font
  game.debug.lineHeight = 20

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
  {world} = game
  {view} = game.camera

  #  A spacey background
  space = world.space = game.add.tileSprite 0, 0, view.width, view.height, 'space'
  space.fixedToCamera = yes

  #  Our ships bullets
  bullets = game.add.group()
  bullets.enableBody = true
  #  All 10 of them
  bullets.createMultiple 10, 'bullet'
  bullets.setAll 'alpha', 0.75
  bullets.setAll 'anchor.x', 0.5
  bullets.setAll 'anchor.y', 0.5
  bullets.setAll 'blendMode', ADD

  #  Our player ship
  sprite = game.add.sprite 300, 300, 'ship'
  sprite.anchor.set 0.5
  #  and its physics settings
  game.physics.enable sprite, Phaser.Physics.ARCADE
  sprite.body.bounce.setTo 1
  sprite.body.drag.set 10
  sprite.body.friction.setTo 0
  sprite.body.maxVelocity.set 100

  # Asteroids
  asteroids = game.add.group world, "asteroids", no, yes
  asteroids.classType = Asteroid
  asteroids.createMultiple 5, null, null, yes

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
  game.physics.arcade.collide asteroids
  game.physics.arcade.collide asteroids, sprite
  game.physics.arcade.overlap asteroids, bullets, (a, b) -> a.explode()

  if cursors.up.isDown
    game.physics.arcade.accelerationFromRotation sprite.rotation, 100, sprite.body.acceleration
  else
    sprite.body.acceleration.set 0

  if      cursors.left.isDown  then sprite.body.angularVelocity = -90
  else if cursors.right.isDown then sprite.body.angularVelocity =  90
  else                              sprite.body.angularVelocity =   0

  fireBullet() if game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)

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
                   5, 470, null, "9px Consolas, Menlo, monospace"

toggleDim = ->
  onOrOff = not game.world.space.visible
  game.world.space.visible = onOrOff
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
  {DebugArcadePhysics} = Phaser.Plugin

  console.log key, obj[key]

  switch key
    when "lineWidth"
      _gui.add(obj, key, 0, 10, 1).listen()
    else
      _gui.add(obj, key).listen()

  return

createGui = ->
  {config} = game.debug.arcade

  gui = new dat.GUI width: 400

  configF = gui.addFolder "game.debug.arcade.config"
  gameF = gui.addFolder "game"
  worldF = gui.addFolder "world"
  bgF = gui.addFolder "background"

  for key, val of config
    addGuiKey(configF, config, key) if val?

  gameF.add game, "enableStep"
  gameF.add game, "disableStep"
  gameF.add game, "step"

  bgF.add(game.world.space, "visible").listen()

  worldF.add(game.world, "alpha", 0, 1, 0.1).listen()

  gui

@game = new Phaser.Game
  width: 960
  height: 480
  renderer: Phaser.CANVAS
  parent: 'phaser-example'
  scaleMode: Phaser.ScaleManager.SHOW_ALL
  state:
    create: create
    init: init
    preload: preload
    render: render
    shutdown: shutdown
    update: update
