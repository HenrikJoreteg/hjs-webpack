var webpack = require('webpack')
var path = require('path')
var isInstalled = require('./is-installed')

var baseLoaders = [
  'redbox-react',
  'babel-preset-react'
]

// First check if any but not all of the base loaders are installed
var someBaseLoadersInstalled = baseLoaders.some(isInstalled)
var allBaseLoadersInstalled = baseLoaders.every(isInstalled)

if (someBaseLoadersInstalled && !allBaseLoadersInstalled) {
  throw new Error('`' + baseLoaders.join(' ') + '` must all be installed together')
}

function load (config) {
  if (!allBaseLoadersInstalled) {
    config.devServer.hot = false
    return
  }

  // add hot loading clientside code
  config.entry.unshift(
    // Full path to webpack-hot-middleware so it works in npm2 and npm3
    path.join(path.dirname(require.resolve('webpack-hot-middleware')), 'client')
  )

  // add dev plugins
  config.plugins = config.plugins.concat([
    new webpack.HotModuleReplacementPlugin()
  ])
}

module.exports = {
  load: load
}
