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
      pkg: 'babel-loader',
      config: {
        test: /(\.js$)|(\.jsx$)/,
        exclude: /node_modules/,
        loaders: ['babel-loader']
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
        test: /\.(otf|eot|svg|ttf|woff)/,
        loader: 'url-loader?limit=' + spec.urlLoaderLimit
      }
    },
    {
      pkg: 'url-loader',
      config: {
        test: /\.(jpe?g|png|gif)/,
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
