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

// Optional: configure

game.debug.arcade.configSet({
    filter:             null ,
    lineWidth:          1    ,
    on:                 true ,
    renderAcceleration: true ,
    renderBlocked:      true ,
    renderBody:         true ,
    renderBodyDisabled: true ,
    renderCenter:       true ,
    renderConfig:       false,
    renderDelta:        false,
    renderDrag:         true ,
    renderMaxVelocity:  true ,
    renderLegend:       true ,
    renderSpeed:        true ,
    renderTouching:     true ,
    renderVelocity:     true
}); // -> see console for values

// Example:
// Keep automatic rendering 'on' and choose:

game.debug.arcade.configSet({
    filter: function (obj){
        return obj.name === "player";
        // OR obj.parent.name === "asteroids"
        // OR obj.type === Phaser.PARTICLE
        // &c.
    }
});
```
