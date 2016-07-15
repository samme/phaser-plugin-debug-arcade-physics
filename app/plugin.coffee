###
  Debug Arcade Physics plugin v{!major!}.{!minor!}.{!maintenance!}.{!build!} for Phaser
###

"use strict"

{abs, max} = Math
{freeze, seal} = Object
{Circle, Line, Plugin, Point, Rectangle} = Phaser
{sign} = Phaser.Math
{ARCADE} = Phaser.Physics

Phaser.Plugin.DebugArcadePhysics = freeze class DebugArcadePhysics extends Phaser.Plugin

  @addTo = (game) ->
    game.plugins.add this

  @version = version = "{!major!}.{!minor!}.{!maintenance!}.{!build!}"

  red    = "hsla(0  , 100%,  50%, 0.5)"
  orange = "hsla(30 , 100%,  50%, 0.5)"
  yellow = "hsla(60 , 100%,  50%, 0.5)"
  green  = "hsla(120, 100%,  50%, 0.5)"
  aqua   = "hsla(180, 100%,  50%, 0.5)"
  blue   = "hsla(210, 100%,  50%, 0.5)"
  indigo = "hsla(240, 100%,  50%, 0.5)"
  purple = "hsla(270, 100%,  50%, 0.5)"
  white  = "hsla(0  ,   0%, 100%, 0.5)"
  gray   = "hsla(0  ,   0%,  50%, 0.5)"

  colors: colors =
    acceleration: red
    body:         yellow
    bodyDisabled: gray
    center:       white
    drag:         orange
    maxVelocity:  green
    speed:        blue
    velocity:     aqua

  config: config = seal
    filter:             null # TODO
    lineWidth:          1    # TODO for Lines
    on:                 yes
    renderAcceleration: yes
    renderBody:         yes
    renderCenter:       yes
    renderDrag:         yes
    renderMaxVelocity:  yes
    renderLegend:       yes
    renderSpeed:        yes
    renderVelocity:     yes

  configKeys: freeze Object.keys(config)

  name: "Debug Arcade Physics Plugin"
  version: version

  # Hooks

  init: ->
    console.log "%s v%s", @name, @version
    @game.debug.arcade = arcade = @interface()
    console.log "Use `game.debug.arcade`: #{Object.keys(arcade)}"
    return

  postRender: ->
    return unless @config.on
    @renderColors() if @config.renderLegend
    @renderAll()
    return

  # Helpers

  calculateDrag: (body, out) ->
    {drag, velocity} = body
    {physicsElapsed} = @game.time
    vx = velocity.x
    vy = velocity.y
    dx = drag.x * -sign(vx)
    dy = drag.y * -sign(vy)
    out.x = if (abs(vx) - abs(dx * physicsElapsed)) > 0 then dx else 0
    out.y = if (abs(vy) - abs(dy * physicsElapsed)) > 0 then dy else 0
    out

  configSet: (settings) ->
    for name, val of settings
      if name of @config
        @config[name] = val
      else
        console.warn "No such setting '#{name}'. Valid names are #{@configKeys}."
    console.dir @config
    this

  geom: (obj, color, fill = no) ->
    {debug}   = @game
    {context} = debug
    lineWidth = context
    context.lineWidth = @config.lineWidth
    debug.geom obj, color, fill
    context.lineWidth = lineWidth
    this

  hide: ->
    @visible = no
    this

  off: ->
    @config.on = no
    this

  on: ->
    @config.on = yes
    this

  placeLine: (line, start, vector) ->
    line.start.copyFrom start
    line.end.copyFrom(start).add vector.x, vector.y
    line

  placeRect: (rect, center, size) ->
    rect.resize(2 * size.x, 2 * size.y).centerOn(center.x, center.y)
    rect

  _acceleration = new Line

  renderAcceleration: (body) ->
    @placeLine _acceleration, body.center, body.acceleration
    @geom _acceleration, colors.acceleration unless _acceleration.empty
    this

  renderAll: ->
    @renderObj @game.world
    this

  renderCenter: (body) ->
    {x, y} = body.center
    @game.debug.pixel ~~x, ~~y, colors.center
    this

  renderColors: ->
    {debug} = @game
    debug.start debug.lineHeight, debug.lineHeight
    for name, val of @colors
      debug.currentColor = val
      debug.line name
    debug.stop()
    this

  _dragVector = new Point
  _drag = new Line

  renderDrag: (body) ->
    @calculateDrag body, _dragVector
    unless _dragVector.isZero()
      @placeLine _drag, body.center, _dragVector
      @geom _drag, colors.drag
    this

  _maxVelocity = new Rectangle

  renderMaxVelocity: (body) ->
    {maxVelocity} = body
    return body if maxVelocity.x > 1000 or
                   maxVelocity.y > 1000
    @placeRect _maxVelocity, body.center, maxVelocity
    @geom _maxVelocity, colors.maxVelocity
    this

  renderObj: (obj) ->
    return obj unless obj.exists
    {config} = this
    {filter} = config
    {body} = obj
    if body?.type is ARCADE and body.enable
      return body if filter and not filter.call(this, obj)
      @renderBody         body if config.renderBody
      @renderSpeed        body if config.renderSpeed
      @renderMaxVelocity  body if config.renderMaxVelocity
      @renderVelocity     body if config.renderVelocity
      @renderAcceleration body if config.renderAcceleration
      @renderDrag         body if config.renderDrag
      @renderCenter       body if config.renderCenter
    for child in obj.children
      @renderObj child
    this

  renderBody: (body) ->
    @game.debug.body body.sprite, colors[if body.enable then "body" else "bodyDisabled"], no
    this

  _speed = new Circle

  renderSpeed: (body) ->
    return body if body.speed < 1
    _speed.setTo body.center.x, body.center.y, 2 * body.speed
    @geom _speed, colors.speed
    this

  _velocity = new Line

  renderVelocity: (body) ->
    return body if body.velocity.isZero()
    @placeLine(_velocity, body.center, body.velocity)
    @geom _velocity, colors.velocity, no
    this

  show: ->
    @visible = yes
    this

  toggle: ->
    @config.on = not @config.on
    this

  # Interface

  interface: ->
    freeze
      acceleration: @renderAcceleration.bind this
      body:         @renderBody        .bind this
      center:       @renderCenter      .bind this
      config:       @config
      configSet:    @configSet         .bind this
      drag:         @renderDrag        .bind this
      hide:         @hide              .bind this
      maxVelocity:  @renderMaxVelocity .bind this
      obj:          @renderObj         .bind this
      off:          @off               .bind this
      on:           @on                .bind this
      show:         @show              .bind this
      speed:        @renderSpeed       .bind this
      velocity:     @renderVelocity    .bind this
      toggle:       @toggle            .bind this
