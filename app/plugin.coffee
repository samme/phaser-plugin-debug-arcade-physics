###
  Debug Arcade Physics plugin v{!major!}.{!minor!}.{!maintenance!}.{!build!} for Phaser
###

"use strict"

{abs, max} = Math
{freeze, seal} = Object
{Bullet, Circle, Line, PARTICLE, Plugin, Point, Rectangle, SPRITE} = Phaser
{sign} = Phaser.Math
{ARCADE} = Phaser.Physics

Phaser.Plugin.DebugArcadePhysics = freeze class DebugArcadePhysics extends Phaser.Plugin

  # Constructor

  @addTo = (game) ->
    game.plugins.add this

  # Filters

  @exists = (obj) ->
    obj.exists

  @isAlive = (obj) ->
    obj.alive

  @isBullet = (obj) ->
    obj instanceof Bullet

  @isParticle = (obj) ->
    obj.type is PARTICLE

  @isSprite = (obj) ->
    obj.type is SPRITE

  @VERSION = "{!major!}.{!minor!}.{!maintenance!}.{!build!}"

  # Private

  TOO_BIG = 9999

  red    = "hsla(0  , 100%,  50%, 0.5)"
  coral  = "hsla(15 , 100%,  50%, 0.5)"
  orange = "hsla(30 , 100%,  50%, 0.5)"
  yellow = "hsla(60 , 100%,  50%, 0.5)"
  green  = "hsla(120, 100%,  50%, 0.5)"
  aqua   = "hsla(180, 100%,  50%, 0.5)"
  blue   = "hsla(210, 100%,  50%, 0.5)"
  indigo = "hsla(240, 100%,  50%, 0.5)"
  purple = "hsla(270, 100%,  50%, 0.5)"
  violet = "hsla(300, 100%,  50%, 0.5)"
  rose   = "hsla(330, 100%,  50%, 0.5)"
  white  = "hsla(0  ,   0%, 100%, 0.5)"
  gray   = "hsla(0  ,   0%,  50%, 0.5)"

  # Prototype

  colors: colors =
    acceleration: violet
    blocked:      coral
    body:         yellow
    bodyDisabled: gray
    center:       white
    delta:        indigo
    drag:         orange
    maxVelocity:  green
    speed:        blue
    touching:     red
    velocity:     aqua

  config: config = seal
    filter:             null
    lineWidth:          1
    on:                 yes
    renderAcceleration: yes
    renderBlocked:      yes
    renderBody:         yes
    renderBodyDisabled: yes
    renderCenter:       yes
    renderConfig:       no
    renderDrag:         yes
    renderMaxVelocity:  yes
    renderLegend:       yes
    renderSpeed:        yes
    renderTouching:     yes
    renderVelocity:     yes

  configKeys: freeze Object.keys(config)

  name: "Debug Arcade Physics Plugin"

  Object.defineProperty @prototype, "version",
    get: ->
      @constructor.VERSION

  # Hooks

  init: (settings) ->
    console.log "%s v%s", @name, @version
    @game.debug.arcade = @interface()
    @help()
    @configSet settings if settings
    return

  postRender: ->
    return unless @config.on
    @renderConfig() if @config.renderConfig
    @renderColors() if @config.renderLegend
    @renderAll()
    return

  # Helpers

  bodyColor: (body) ->
    {renderBlocked, renderBodyDisabled, renderTouching} = @config
    {blocked, enable, touching} = body
    colors[ switch
      when renderBodyDisabled and not enable        then "bodyDisabled"
      when renderTouching     and not touching.none then "touching"
      when renderBlocked      and (blocked.down     or
                                   blocked.up       or
                                   blocked.left     or
                                   blocked.right)   then "blocked"
      else                                               "body"
    ]

  _calculateDrag = new Point

  calculateDrag: (body, out = _calculateDrag) ->
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
        console.log name, val
      else
        console.warn "No such setting '#{name}'. Valid names are #{@configKeys}."
    this

  geom: (obj, color, fill = no) ->
    {debug}   = @game
    {context} = debug
    lineWidth = context
    context.lineWidth = @config.lineWidth
    debug.geom obj, color, fill
    context.lineWidth = lineWidth
    this

  help: ->
    console.log "Use `game.debug.arcade`: #{Object.keys(@game.debug.arcade).join ', '}"
    this

  helpConfig: ->
    console.log "Use `game.debug.arcade.configSet()`: #{@configKeys.join ', '}"
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
    line.setTo start.x, start.y, start.x + vector.x, start.y + vector.y

  placeLineXY: (line, start, vectorX, vectorY) ->
    line.setTo start.x, start.y, start.x + vectorX, start.y + vectorY

  placeRect: (rect, center, size) ->
    rect.resize(2 * size.x, 2 * size.y).centerOn(center.x, center.y)
    rect

  renderAcceleration: (body) ->
    @renderVector body.acceleration, body, colors.acceleration
    this

  renderAll: ->
    @renderObj @game.world
    this

  renderCenter: (body) ->
    {x, y} = body.center
    @game.debug.pixel ~~x, ~~y, colors.center
    this

  _circle = new Circle

  renderCircle: (radius, body, color) ->
    return this if radius < 1
    _circle.setTo body.center.x, body.center.y, 2 * radius
    @geom _circle, color
    this

  renderColors: (x = @game.debug.lineHeight, y = @game.debug.lineHeight) ->
    {debug} = @game
    debug.start x, y
    for name, val of @colors
      debug.currentColor = val
      debug.line name
    debug.stop()
    this

  renderConfig: (x = @game.debug.lineHeight, y = @game.debug.lineHeight) ->
    {debug} = @game
    debug.start x, y
    for name, val of @config
      debug.line "#{name}: #{val}"
    debug.stop()
    this

  renderDrag: (body) ->
    @renderVector @calculateDrag(body), body, colors.drag
    this

  renderMaxVelocity: (body) ->
    {maxVelocity} = body
    return this if maxVelocity.x > TOO_BIG or
                   maxVelocity.y > TOO_BIG
    @renderRect maxVelocity, body, colors.maxVelocity
    this

  renderObj: (obj) ->
    return this unless obj.exists

    {config} = this
    {filter} = config
    {body} = obj

    if obj.renderable      and
       body                and
       body.type is ARCADE and
       (body.enable or config.renderBodyDisabled)

      return this if filter and not filter(obj)

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
    @game.debug.body body.sprite, @bodyColor(body), no
    this

  _rect = new Rectangle

  renderRect: (vector, body, color) ->
    return this if vector.isZero()
    @placeRect _rect, body.center, vector
    @geom _rect, color
    this

  renderSpeed: (body) ->
    return this if body.speed < 1
    @renderCircle body.speed, body, colors.speed
    this

  _vector = new Line

  renderVector: (vector, body, color) ->
    return this if vector.isZero()
    @placeLine _vector, body.center, vector
    @geom _vector, color, no
    this

  renderVelocity: (body) ->
    @renderVector body.velocity, body, colors.velocity
    this

  show: ->
    @visible = yes
    this

  toggle: ->
    @config.on = not @config.on
    this

  toggleVisible: ->
    @visible = not @visible
    this

  # Interface (as `game.debug.arcade`)

  interface: ->
    freeze
      acceleration: @renderAcceleration.bind this
      body:         @renderBody        .bind this
      center:       @renderCenter      .bind this
      circle:       @renderCircle      .bind this
      config:       @config
      configSet:    @configSet         .bind this
      drag:         @renderDrag        .bind this
      help:         @help              .bind this
      helpConfig:   @helpConfig        .bind this
      hide:         @hide              .bind this
      maxVelocity:  @renderMaxVelocity .bind this
      obj:          @renderObj         .bind this
      off:          @off               .bind this
      on:           @on                .bind this
      rect:         @renderRect        .bind this
      show:         @show              .bind this
      speed:        @renderSpeed       .bind this
      vector:       @renderVector      .bind this
      velocity:     @renderVelocity    .bind this
      toggle:       @toggle            .bind this
