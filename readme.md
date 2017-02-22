![Screenshot](https://samme.github.io/phaser-plugin-debug-arcade-physics/screenshot.png)

[Demo](https://samme.github.io/phaser-plugin-debug-arcade-physics/)

Install
-------

If not using `npm` or `bower`, add [DebugArcadePhysics.js](dist/DebugArcadePhysics.js) after `phaser.js`.

Use 🚀
---

```javascript
game.plugins.add(Phaser.Plugin.DebugArcadePhysics);

// Draw every physics body

game.debug.arcade.on()

// Draw none

game.debug.arcade.off()

// Draw one

game.debug.arcade.renderObj( player );

// Draw one property of one body

game.debug.arcade.renderVelocity( player );

// Optional: configure

game.debug.arcade.configSet({ // default values:
    filter:                    null ,
    lineWidth:                 1    ,
    on:                        true ,
    renderAcceleration:        true ,
    renderAngularAcceleration: true ,
    renderAngularDrag:         true ,
    renderAngularVelocity:     true ,
    renderBlocked:             true ,
    renderBody:                true ,
    renderBodyDisabled:        true ,
    renderCenter:              true ,
    renderConfig:              false,
    renderDrag:                true ,
    renderLegend:              true ,
    renderMaxVelocity:         true ,
    renderOffset:              true ,
    renderRotation:            true ,
    renderSpeed:               true ,
    renderTouching:            true ,
    renderVelocity:            true ,
}); // -> see console for values

// Or configure during initialization:

game.plugins.add(Phaser.Plugin.DebugArcadePhysics, {
    on: true
});

// Example:
// Keep automatic rendering 'on' but limit to certain objects:

game.debug.arcade.configSet({
    filter: function (obj){
        return obj.name === "player";
    }
});

// Some filters are included:
// - exists
// - isAlive
// - isBullet
// - isNotBullet
// - isNotParticle
// - isNotSprite
// - isParticle
// - isSprite

// Example:

game.debug.arcade.configSet({
    filter: Phaser.Plugin.DebugArcadePhysics.isBullet
});
```
