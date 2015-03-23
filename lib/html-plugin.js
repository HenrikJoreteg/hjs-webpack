// helper for generating default HTML
function defaultHtml (data) {
  '<!doctype><script src="/' + data.main + '"></script>'
}

// Main export
function HJSPlugin(options) {
  this.config = options || {}
  this.filename = options.filename || 'index.html'
}

HJSPlugin.prototype.apply = function (compiler) {
  var self = this
  var htmlFunction = this.config.html;
  // let user pass `true` to use
  // the simple default
  if (htmlFunction === true) {
    htmlFunction = defaultHtml
  } else if (!htmlFunction) {
    return;
  }

  self.compiler = compiler

  compiler.plugin('emit', function(compiler, callback) {
    // store stats on self
    self.stats = compiler.getStats().toJson()

    htmlFunction(self.getAssets(), function (err, result) {
      if (err) throw err
      if (typeof result === 'string') {
        self.addHtmlAsset(compiler, self.filename, result)
        callback()
      } else if (typeof result === 'object') {
        for (var item in result) {
          self.addHtmlAsset(compiler, item, result[item])
        }
        callback()
      } else {
        throw new Error('Result from `html` callback must be a string or an object')
      }
    })
  })
}

// Oddly enough we have to pass in the compiler here
// it's changed from when it was stored on `this` previously
HJSPlugin.prototype.addHtmlAsset = function(compiler, name, src) {
  compiler.assets[name] = {
    source: function() {
      return src
    },
    size: function() {
      return src.length
    }
  }
}

HJSPlugin.prototype.getAssets = function () {
  var assets = this.assets = {}
  var compiler = this.compiler
  var value, chunk

  for (chunk in this.stats.assetsByChunkName) {
    value = this.stats.assetsByChunkName[chunk]

    // Webpack outputs an array for each chunk when using sourcemaps
    if (value instanceof Array) {
      // Is the main bundle seems like it's always the first
      value = value[0]
    }

    // use public path if passed in
    if (compiler.options.output.publicPath) {
      value = compiler.options.output.publicPath + value
    }

    assets[chunk] = value
  }

  return assets
}

module.exports = HJSPlugin
