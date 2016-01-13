var webpack = require('webpack')
var isInstalled = require('./is-installed')

var baseLoaders = [
  'babel-plugin-react-transform',
  'react-transform-catch-errors',
  'react-transform-hmr',
  'redbox-react',
  'webpack-hot-middleware'
]

// First check if any but not all of the base loaders are installed
var someBaseLoadersInstalled = baseLoaders.some(isInstalled)
var allBaseLoadersInstalled = baseLoaders.every(isInstalled)

if (someBaseLoadersInstalled && !allBaseLoadersInstalled) {
  throw new Error('The following loaders must all be installed together: ' + baseLoaders.join(', '))
}

function findBabelLoader (config) {
  return Object.keys(config.module.loaders).find(function (i) {
    return config.module.loaders[i].loader === 'babel-loader'
  })[0]
}

function load (config) {
  if (!allBaseLoadersInstalled) {
    config.devServer.hot = false
    return
  }

  var index = findBabelLoader(config)

  config.module.loaders[index].query = {
    plugins: [
      ['react-transform', {
        transforms: [{
          transform: 'react-transform-hmr',
          imports: ['react'],
          locals: ['module']
        }, {
          transform: 'react-transform-catch-errors',
          imports: ['react', 'redbox-react']
        }]
      }]
    ]
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
