module.exports =
  files:
    javascripts:
      joinTo:
        'DebugArcadePhysics.js': 'app/plugin.coffee',
        'example.js':            'app/example.coffee'
  modules:
    definition: no
    wrapper: no
  npm:
    enabled: no
  overrides:
    production:
      optimize: no
  paths:
    public: 'dist'
  plugins:
    coffeescript:
      bare: no
    version:
      fileRegExp: /\.(js|html)$/
  sourceMaps: no
