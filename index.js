var fs = require('fs')
var path = require('path')
var rimraf = require('rimraf')
var webpack = require('webpack')
var defaults = require('lodash.defaults')
var ExtractTextPlugin = require('extract-text-webpack-plugin')
var getBaseConfig = require('./lib/base-config')
var getPackage = require('./lib/get-package')

// figure out if we're running `webpack` or `webpack-dev-server`
// we'll use this as the default for `isDev`
var isDev = process.argv[1].indexOf('webpack-dev-server') !== -1

module.exports = function (opts) {
  checkRequired(opts)
  var outputFolder = path.resolve(opts.out)

  // add in our defaults
  var spec = defaults(opts, {
    entry: path.resolve(opts.in),
    output: defaults(opts.output || {}, {
      path: outputFolder + '/',
      filename: null,
      cssFilename: null,
      hash: false,
      publicPath: '/'
    }),
    configFile: null,
    isDev: isDev,
    package: null,
    replace: null,
    port: process.env.PORT || 3000,
    hostname: 'localhost',
    html: true,
    urlLoaderLimit: 10000,
    clearBeforeBuild: false
  })

  spec.package = getPackage(spec.package)

  if (!spec.output.filename) {
    spec.output.filename = spec.isDev ? 'app.js' : buildFilename(spec.package, spec.output.hash, 'js')
  }

  if (!spec.output.cssFilename) {
    spec.output.cssFilename = spec.isDev ? 'app.css' : buildFilename(spec.package, spec.output.hash, 'css')
  }

  var config = getBaseConfig(spec)

  // re-attach original spec items so they can be accessed from dev-server script
  config.spec = spec

  // check for any module replacements
  if (spec.replace) {
    for (var item in spec.replace) {
      // allow for simple strings
      if (typeof item === 'string') {
        var regex = new RegExp('^' + item + '$')
      }
      var newResource = spec.replace[item]
      if (typeof newResource === 'string') {
        newResource = path.resolve(newResource)
      }
      config.plugins.push(new webpack.NormalModuleReplacementPlugin(regex, newResource))
    }
  }

  // check for any module definitions
  if (spec.define) {
    config.plugins.push(new webpack.DefinePlugin(spec.define))
  }

  // dev specific stuff
  if (spec.isDev) {
    // debugging option
    config.devtool = 'eval'

    // add dev server and hotloading clientside code
    config.entry.unshift(
      'webpack-dev-server/client?http://' + spec.hostname + ':' + spec.port,
      'webpack/hot/only-dev-server'
    )

    config.devServer = {
      port: spec.port,
      info: false,
      historyApiFallback: true,
      host: spec.hostname,
      // For some reason simply setting this doesn't seem to be enough
      // which is why we also do the manual entry above and the
      // manual adding of the hot module replacment plugin below
      hot: true
    }

    // add dev plugins
    config.plugins = config.plugins.concat([
      new webpack.HotModuleReplacementPlugin(),
      new webpack.NoErrorsPlugin()
    ])

    // add react-hot as module loader
    config.module.loaders[0].loaders.unshift('react-hot')

    config.module.loaders.push(
      {
        test: /\.css$/,
        loader: 'style-loader!css-loader!postcss-loader'
      },
      {
        test: /\.styl$/,
        loader: 'style-loader!css-loader!postcss-loader!stylus-loader'
      },
      {
        test: /\.less$/,
        loader: 'style-loader!css-loader!postcss-loader!less-loader'
      }
    )

  } else {
    // clear out output folder if so configured
    if (spec.clearBeforeBuild) {
      rimraf.sync(outputFolder)
      fs.mkdirSync(outputFolder)
    }

    // minify in production
    config.plugins.push(
      new webpack.optimize.DedupePlugin(),
      new webpack.optimize.OccurenceOrderPlugin(true),
      new webpack.optimize.UglifyJsPlugin({
        compress: {
          warnings: false
        },
        output: {
          comments: false
        },
        sourceMap: false
      }),
      new ExtractTextPlugin(config.output.cssFilename, {
        allChunks: true
      }),
      new webpack.DefinePlugin({
        'process.env': {NODE_ENV: JSON.stringify('production')}
      })
    )

    // extract in production
    config.module.loaders.push(
      {
        test: /\.css$/,
        loader: ExtractTextPlugin.extract('style-loader', 'css-loader!postcss-loader')
      },
      {
        test: /\.styl$/,
        loader: ExtractTextPlugin.extract('style-loader', 'css-loader!postcss-loader!stylus-loader')
      },
      {
        test: /\.less/,
        loader: ExtractTextPlugin.extract('style-loader', 'css-loader!postcss-loader!less-loader')
      }
    )
  }

  return config
}

function buildFilename (pack, hash, ext) {
  return [
    pack.name,
    // extract-text-plugin uses [contenthash] and webpack uses [hash]
    hash ? (ext === 'css' ? '[contenthash]' : '[hash]') : pack.version,
    ext || 'js'
  ].join('.')
}

function checkRequired (opts) {
  var props = ['out', 'in']
  if (!opts || !props.every(function (prop) { return opts.hasOwnProperty(prop) })) {
    throw new Error('Must pass in options object with `in` and `out` properties')
  }
}
