var webpack = require('webpack')
var isInstalled = require('./is-installed')

var baseLoaders = [
  'babel-plugin-react-transform',
  'react-transform-catch-errors',
  'react-transform-hmr',
  'redbox-react'
]

// First check if any but not all of the base loaders are installed
var someBaseLoadersInstalled = baseLoaders.some(isInstalled)
var allBaseLoadersInstalled = baseLoaders.every(isInstalled)

if (someBaseLoadersInstalled && !allBaseLoadersInstalled) {
  throw new Error('The following loaders must all be installed together: ' + baseLoaders.join(', '))
}

function load (config) {
  if (!allBaseLoadersInstalled) {
    config.devServer.hot = false
    return
  }

  // add hot loading clientside code
  config.entry.unshift(
    'webpack-hot-middleware/client'
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
