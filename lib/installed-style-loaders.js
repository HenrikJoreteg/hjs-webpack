var ExtractTextPlugin = require('extract-text-webpack-plugin')
var isInstalled = require('./is-installed')

var installedLoaders = []
var baseLoaders = ['style-loader', 'css-loader', 'postcss-loader']
var baseConfig = {
  dev: {
    test: /\.css$/,
    loader: 'style-loader!css-loader!postcss-loader'
  },
  production: {
    test: /\.css$/,
    loader: ExtractTextPlugin.extract('style-loader', 'css-loader!postcss-loader')
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
        loader: 'style-loader!css-loader!postcss-loader!stylus-loader'
      },
      production: {
        test: /\.styl$/,
        loader: ExtractTextPlugin.extract('style-loader', 'css-loader!postcss-loader!stylus-loader')
      }
    }
  },
  {
    pkg: 'less-loader',
    config: {
      dev: {
        test: /\.less$/,
        loader: 'style-loader!css-loader!postcss-loader!less-loader'
      },
      production: {
        test: /\.less$/,
        loader: ExtractTextPlugin.extract('style-loader', 'css-loader!postcss-loader!less-loader')
      }
    }
  },
  {
    pkg: 'sass-loader',
    config: {
      dev: {
        test: /\.scss$/,
        loader: 'style-loader!css-loader!postcss-loader!sass-loader'
      },
      production: {
        test: /\.scss$/,
        loader: ExtractTextPlugin.extract('style-loader', 'css-loader!postcss-loader!sass-loader')
      }
    }
  },
  {
    pkg: 'sass-loader',
    config: {
      dev: {
        test: /\.sass$/,
        loader: 'style-loader!css-loader!postcss-loader!sass-loader?indentedSyntax'
      },
      production: {
        test: /\.sass$/,
        loader: ExtractTextPlugin.extract('style-loader', 'css-loader!postcss-loader!sass-loader?indentedSyntax')
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

styleLoaders.forEach(function (loader) {
  if (isInstalled(loader.pkg)) {
    if (allBaseLoadersInstalled) {
      installedLoaders.push(loader.config)
    } else {
      throw new Error('The loader ' + loader.pkg + ' needs the following loaders to be installed: ' + baseLoaders.join(', '))
    }
  }
})

module.exports = installedLoaders
