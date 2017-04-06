var fs = require('fs')
var path = require('path')
var rimraf = require('rimraf')
var webpack = require('webpack')
var defaults = require('lodash.defaults')
var ExtractTextPlugin = require('extract-text-webpack-plugin')
var containsPath = require('contains-path')
var getBaseConfig = require('./lib/base-config')
var getPackage = require('./lib/get-package')
var installedStyleLoaders = require('./lib/installed-style-loaders')
var installedHotLoaders = require('./lib/installed-hot-loaders')
var isInstalled = require('./lib/is-installed')

// default to `true` if running `hjs-dev-server`
var isDev = (process.argv[1] || '').indexOf('hjs-dev-server') !== -1

module.exports = function (opts) {
  checkRequired(opts)
  var outputFolder = path.resolve(opts.out)
  var cwd = process.cwd()

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
    https: false,
    port: 3000,
    hostname: 'localhost',
    html: true,
    urlLoaderLimit: 10000,
    clearBeforeBuild: false,
    serveCustomHtmlInDev: true,
    devServer: {},
    uglify: defaults(opts.uglify || {}, {
      output: {
        comments: false
      }
    })
  })

  spec.package = getPackage(spec.package)

  if (!spec.output.filename) {
    spec.output.filename = spec.isDev ? 'app.js' : buildFilename(spec.package, spec.output.hash, 'js')
  }

  if (!spec.output.cssFilename) {
    spec.output.cssFilename = spec.isDev ? 'app.css' : buildFilename(spec.package, spec.output.hash, 'css')
  }

  var config = getBaseConfig(spec)

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
    // https://webpack.github.io/docs/configuration.html#devtool
    // https://github.com/HenrikJoreteg/hjs-webpack/issues/63
    // Supports original code (before transforms) with pretty good initial
    // build speed and good rebuild speed
    config.devtool = spec.devtool || 'cheap-module-eval-source-map'

    // Create our dev server config for use in bin/hjs-dev-server
    config.devServer = defaults(spec.devServer, {
      // For webpack-dev-middleware
      noInfo: true,
      quiet: false,
      lazy: false,
      publicPath: spec.output.publicPath,
      // Our own options for hjs-dev-server
      historyApiFallback: true,
      hot: true,
      contentBase: outputFolder,
      port: spec.port,
      https: spec.https,
      hostname: spec.hostname || spec.host
    })

    // Enable Webpack HMR unless explictly disabled
    if (config.devServer.hot) {
      installedHotLoaders.load(config)
    }

    // Add optional loaders
    installedStyleLoaders.forEach(function (item) {
      config.module.rules.push(item.dev)
    })

    // Add visualizer plugin
    if (isInstalled('webpack-visualizer-plugin')) {
      config.plugins.push(
        new (require('webpack-visualizer-plugin'))()
      )
    }
  } else {
    // clear out output folder if so configured
    if (spec.clearBeforeBuild) {
      // Throw error if trying to clear output directory but it contains the cwd
      // See https://github.com/HenrikJoreteg/hjs-webpack/issues/186
      if (containsPath(cwd, outputFolder)) {
        throw new Error('Cannot clear out directory since it contains the current working directory.\nTried to clear ' + outputFolder + ' from ' + cwd)
      }

      // allow passing a glob (limit to within folder though)
      if (typeof spec.clearBeforeBuild === 'string') {
        // create the output folder if it doesn't exist
        // just for convenience
        if (!fs.existsSync(outputFolder)) {
          fs.mkdirSync(outputFolder)
        }
        rimraf.sync(outputFolder + '/' + spec.clearBeforeBuild)
      } else {
        rimraf.sync(outputFolder)
        fs.mkdirSync(outputFolder)
      }
    }

    // minify in production
    config.plugins.push(
      new webpack.optimize.UglifyJsPlugin(spec.uglify),
      new ExtractTextPlugin({
        filename: spec.output.cssFilename,
        allChunks: true
      }),
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'production')
      })
    )

    // Add optional loaders
    installedStyleLoaders.forEach(function (item) {
      config.module.rules.push(item.production)
    })
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
