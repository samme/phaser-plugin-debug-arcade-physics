![Screenshot](https://github.com/samme/phaser-plugin-debug-arcade-physics/screenshot.png)

# Phaser Debug Arcade Physics Plugin 🚀

Draws properties of Arcade Physics bodies.
[Demo](https://github.com/samme/phaser-plugin-debug-arcade-physics/)

    game.plugins.add(Phaser.Plugin.DebugArcadePhysics);

    // Draw every physics body

    game.debug.arcade.on()

    // Draw none

    game.debug.arcade.off()

    // Draw one

    game.debug.arcade.renderObj( player );

    // Optional: configure

    game.debug.arcade.configSet({
        filter:             null,
        lineWidth:          1   ,
        on:                 yes ,
        renderAcceleration: yes ,
        renderBody:         yes ,
        renderCenter:       yes ,
        renderDrag:         yes ,
        renderMaxVelocity:  yes ,
        renderLegend:       yes ,
        renderSpeed:        yes ,
        renderVelocity:     yes
    }); // -> see console for values
