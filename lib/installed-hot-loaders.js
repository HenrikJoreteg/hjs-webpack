var webpack = require('webpack')
var path = require('path')
var isInstalled = require('./is-installed')

var baseLoaders = [
  'babel-plugin-react-transform',
  'react-transform-catch-errors',
  'react-transform-hmr',
  'redbox-react'
]

var preset = 'babel-preset-react-hmre'

// First check if any but not all of the base loaders are installed
var someBaseLoadersInstalled = baseLoaders.some(isInstalled)
var allBaseLoadersInstalled = baseLoaders.every(isInstalled)
var presetInstalled = isInstalled(preset)

if (someBaseLoadersInstalled && !allBaseLoadersInstalled && !presetInstalled) {
  throw new Error('`' + baseLoaders.join(' ') + '` must all be installed together or `' + preset + '` must be installed')
}

function load (config) {
  if (!allBaseLoadersInstalled && !presetInstalled) {
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
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin()
  ])
}

module.exports = {
  load: load
}
