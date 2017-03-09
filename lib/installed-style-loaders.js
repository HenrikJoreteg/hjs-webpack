var ExtractTextPlugin = require('extract-text-webpack-plugin')
var isInstalled = require('./is-installed')

var hasAutoprefixer = isInstalled('autoprefixer')
var hasYeti = isInstalled('yeticss')

var postcssLoaderWithPlugins = {
  loader: 'postcss-loader',
  options: {
    plugins: hasAutoprefixer ? [require('autoprefixer')] : []
  }
}

var stylusLoaderWithPlugins = {
  loader: 'stylus-loader',
  options: {
    use: hasYeti ? [require('yeticss')()] : []
  }
}

var installedLoaders = []
var baseLoaders = ['style-loader', 'css-loader', 'postcss-loader']
var baseConfig = {
  dev: {
    test: /\.css$/,
    use: ['style-loader', 'css-loader', postcssLoaderWithPlugins]
  },
  production: {
    test: /\.css$/,
    use: ExtractTextPlugin.extract({
      fallback: 'style-loader',
      use: ['css-loader', postcssLoaderWithPlugins]
    })
  }
}

// All optional loader plugins are listed here
// `pkg` is the npm name of the loaders
// `config` contains a webpack loader config for development and production

var styleLoaders = [
  {
    pkg: 'stylus-loader',
    config: {
      dev: {
        test: /\.styl$/,
        use: ['style-loader', 'css-loader', postcssLoaderWithPlugins, stylusLoaderWithPlugins]
      },
      production: {
        test: /\.styl$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: ['css-loader', postcssLoaderWithPlugins, stylusLoaderWithPlugins]
        })
      }
    }
  },
  {
    pkg: 'less-loader',
    config: {
      dev: {
        test: /\.less$/,
        use: ['style-loader', 'css-loader', postcssLoaderWithPlugins, 'less-loader']
      },
      production: {
        test: /\.less$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: ['css-loader', postcssLoaderWithPlugins, 'less-loader']
        })
      }
    }
  },
  {
    pkg: 'sass-loader',
    config: {
      dev: {
        test: /\.scss$/,
        use: ['style-loader', 'css-loader', postcssLoaderWithPlugins, 'sass-loader']
      },
      production: {
        test: /\.scss$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: ['css-loader', postcssLoaderWithPlugins, 'sass-loader']
        })
      }
    }
  },
  {
    pkg: 'sass-loader',
    config: {
      dev: {
        test: /\.sass$/,
        use: [
          'style-loader', 'css-loader', postcssLoaderWithPlugins,
            { loader: 'sass-loader', options: { indentedSyntax: true } }
        ]
      },
      production: {
        test: /\.sass$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            'css-loader', postcssLoaderWithPlugins,
                { loader: 'sass-loader', options: { indentedSyntax: true } }
          ]
        })
      }
    }
  }
]

// First check if any but not all of the base loaders are installed
var someBaseLoadersInstalled = baseLoaders.some(isInstalled)
var allBaseLoadersInstalled = baseLoaders.every(isInstalled)

if (someBaseLoadersInstalled && !allBaseLoadersInstalled) {
  throw new Error('The following loaders must all be installed together: ' + baseLoaders.join(', '))
} else {
  installedLoaders.push(baseConfig)
}

styleLoaders
    .filter(function (loader) { return isInstalled(loader.pkg) })
    .forEach(function (loader) {
      if (allBaseLoadersInstalled) {
        installedLoaders.push(loader.config)
      } else {
        throw new Error('The loader ' + loader.pkg + ' needs the following loaders to be installed: ' + baseLoaders.join(', '))
      }
    })

module.exports = installedLoaders
