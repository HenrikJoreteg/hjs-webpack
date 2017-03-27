var HtmlPlugin = require('./html-plugin')
var pick = require('lodash.pick')
var isInstalled = require('./is-installed')

module.exports = function getBaseConfig (spec) {
  var baseConfig = {
    entry: [
      spec.entry
    ],
    output: {
      filename: spec.output.filename,
      path: spec.output.path,
      publicPath: spec.output.publicPath
    },
    resolve: {
      extensions: [
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
      rules: []
    }
  }

  var optionalBaseLoaders = [
    {
      pkg: 'worker-loader',
      config: {
        test: /(^|\.)worker\.js$/,
        exclude: /node_modules/,
        use: ['worker-loader']
      }
    },
    {
      pkg: 'worker-loader',
      config: {
        test: /(^|\.)thread\.js$/,
        exclude: /node_modules/,
        use: [
            { loader: 'worker-loader', options: { inline: true } }
        ]
      }
    },
    {
      pkg: 'babel-loader',
      config: {
        test: /\.(js|jsx|babel)$/,
        exclude: /node_modules/,
        use: ['babel-loader']
      }
    },
    {
      pkg: 'coffee-loader',
      config: {
        test: /\.coffee$/,
        use: ['coffee-loader']
      }
    },
    {
      pkg: 'cjsx-loader',
      config: {
        test: /\.cjsx$/,
        use: ['coffee-loader', 'cjsx-loader']
      }
    },
    {
      pkg: 'awesome-typescript-loader',
      config: {
        test: /\.(ts|tsx)$/,
        use: ['awesome-typescript-loader']
      }
    },
    {
      pkg: 'livescript-loader',
      config: {
        test: /\.ls$/,
        use: ['livescript-loader']
      }
    },
    {
      pkg: 'url-loader',
      config: {
        test: /\.otf(\?\S*)?$/,
        use: [{
          loader: 'url-loader',
          options: { limit: spec.urlLoaderLimit }
        }]
      }
    },
    {
      pkg: 'url-loader',
      config: {
        test: /\.eot(\?\S*)?$/,
        use: [{
          loader: 'url-loader',
          options: { limit: spec.urlLoaderLimit }
        }]
      }
    },
    {
      pkg: 'url-loader',
      config: {
        test: /\.svg(\?\S*)?$/,
        use: [{
          loader: 'url-loader',
          options: { mimetype: 'image/svg+xml', limit: spec.urlLoaderLimit }
        }]
      }
    },
    {
      pkg: 'url-loader',
      config: {
        test: /\.ttf(\?\S*)?$/,
        use: [{
          loader: 'url-loader',
          options: { mimetype: 'application/octet-stream', limit: spec.urlLoaderLimit }
        }]
      }
    },
    {
      pkg: 'url-loader',
      config: {
        test: /\.woff2?(\?\S*)?$/,
        use: [{
          loader: 'url-loader',
          options: { mimetype: 'application/font-woff', limit: spec.urlLoaderLimit }
        }]
      }
    },
    {
      pkg: 'url-loader',
      config: {
        test: /\.(jpe?g|png|gif)$/,
        use: [{
          loader: 'url-loader',
          options: { limit: spec.urlLoaderLimit }
        }]
      }
    },
    {
      pkg: 'jade-loader',
      config: {
        test: /\.jade$/,
        use: ['jade-loader']
      }
    },
    {
      pkg: 'pug-loader',
      config: {
        test: /\.(pug|jade)$/,
        use: ['pug-loader']
      }
    }
  ]

  // Add optional
  optionalBaseLoaders.forEach(function (item) {
    if (isInstalled(item.pkg)) {
      baseConfig.module.rules.push(item.config)
    }
  })

  return baseConfig
}
