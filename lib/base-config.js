var HtmlPlugin = require('./html-plugin')
var pick = require('lodash.pick')
var isInstalled = require('./is-installed')

module.exports = function getBaseConfig (spec) {
  var baseConfig = {
    entry: [
      spec.entry
    ],
    output: spec.output,
    resolve: {
      extensions: [
        '',
        '.js',
        '.jsx',
        '.json'
      ]
    },
    plugins: [
      new HtmlPlugin(pick(spec, [
        'html',
        'isDev',
        'serveCustomHtmlInDev',
        'package'
      ]))
    ],
    module: {
      loaders: []
    }
  }

  var optionalBaseLoaders = [
    {
      pkg: 'worker-loader',
      config: {
        test: /(^|\.)worker\.js$/,
        exclude: /node_modules/,
        loaders: ['worker-loader']
      }
    },
    {
      pkg: 'worker-loader',
      config: {
        test: /(^|\.)thread\.js$/,
        exclude: /node_modules/,
        loaders: ['worker-loader?inline']
      }
    },
    {
      pkg: 'babel-loader',
      config: {
        test: /\.(js|jsx|babel)$/,
        exclude: /node_modules/,
        loaders: ['babel-loader']
      }
    },
    {
      pkg: 'coffee-loader',
      config: {
        test: /\.coffee$/,
        loaders: ['coffee-loader']
      }
    },
    {
      pkg: 'cjsx-loader',
      config: {
        test: /\.cjsx$/,
        loaders: ['coffee-loader', 'cjsx-loader']
      }
    },
    {
      pkg: 'awesome-typescript-loader',
      config: {
        test: /\.ts$/,
        loaders: ['awesome-typescript-loader']
      }
    },
    {
      pkg: 'livescript-loader',
      config: {
        test: /\.ls$/,
        loaders: ['livescript-loader']
      }
    },
    {
      pkg: 'json-loader',
      config: {
        test: /\.json$/,
        loaders: ['json']
      }
    },
    {
      pkg: 'url-loader',
      config: {
        test: /\.(otf|eot|svg|ttf|woff)$/,
        loader: 'url-loader?limit=' + spec.urlLoaderLimit
      }
    },
    {
      pkg: 'url-loader',
      config: {
        test: /\.(jpe?g|png|gif|svg)$/,
        loader: 'url-loader?limit=' + spec.urlLoaderLimit
      }
    },
    {
      pkg: 'jade-loader',
      config: {
        test: /\.jade$/,
        loaders: ['jade']
      }
    }
  ]

  // Add optional loaders
  optionalBaseLoaders.forEach(function (item) {
    if (isInstalled(item.pkg)) {
      baseConfig.module.loaders.push(item.config)
    }
  })

  // Add optional plugins
  if (isInstalled('yeticss')) {
    baseConfig.stylus = {
      use: [require('yeticss')()]
    }
  }

  if (isInstalled('autoprefixer')) {
    baseConfig.postcss = [require('autoprefixer')()]
  }

  return baseConfig
}
