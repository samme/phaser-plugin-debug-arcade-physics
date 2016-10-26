![Screenshot](https://samme.github.io/phaser-plugin-debug-arcade-physics/screenshot.png)

# Phaser Debug Arcade Physics Plugin 🚀

Draws properties of Arcade Physics bodies.
[Demo](https://samme.github.io/phaser-plugin-debug-arcade-physics/)

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
    filter:             null ,
    lineWidth:          1    ,
    on:                 true ,
    renderAcceleration: true ,
    renderBlocked:      true ,
    renderBody:         true ,
    renderBodyDisabled: true ,
    renderCenter:       true ,
    renderConfig:       false,
    renderDrag:         true ,
    renderMaxVelocity:  true ,
    renderLegend:       true ,
    renderOffset:       true ,
    renderRotation:     true ,
    renderSpeed:        true ,
    renderTouching:     true ,
    renderVelocity:     true
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
// - isBullet
// - isParticle
// - isSprite

// Example:

game.debug.arcade.configSet({
    filter: Phaser.Plugin.DebugArcadePhysics.isBullet
});
```
