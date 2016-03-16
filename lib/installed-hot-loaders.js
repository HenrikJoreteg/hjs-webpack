var webpack = require('webpack')
var path = require('path')

function load (config) {
  // add hot loading clientside code
  config.entry.unshift(
    // Full path to webpack-hot-middleware so it works in npm2 and npm3
    path.join(path.dirname(require.resolve('webpack-hot-middleware')), 'client')
  )

  // add dev plugins
  config.plugins = config.plugins.concat([
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin()
  ])
}

module.exports = {
  load: load
}
