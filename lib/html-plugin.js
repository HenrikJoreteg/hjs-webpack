// helper for generating default HTML
function defaultHtml (data) {
  var result = ['<!doctype html>']
  result.push('<meta charset="utf-8"/>')
  if (data.css) {
    result.push('<link rel="stylesheet" href="/' + data.css + '"/>')
  }
  result.push('<body>')
  result.push('<script src="/' + data.main + '"></script>')
  result.push('</body>')
  return result.join('')
}

// Main export
function HJSPlugin (options) {
  this.config = options || {}
  this.filename = options.filename || 'index.html'
}

HJSPlugin.prototype.apply = function (compiler) {
  var self = this
  var htmlFunction = this.config.html
  // let user pass `true` to use
  // the simple default
  if (htmlFunction === true) {
    htmlFunction = defaultHtml
  } else if (!htmlFunction) {
    return
  }

  self.compiler = compiler

  compiler.plugin('emit', function (compiler, callback) {
    // store stats on self
    self.stats = compiler.getStats().toJson()
    var assets = self.getAssets()

    // attach default template renderer
    // this is useful if you want default
    // html but want to create multiple or
    // differently named HTML files
    assets.defaultTemplate = function () {
      return defaultHtml(assets)
    }

    // if this is dev, stop here
    if (self.config.isDev) {
      self.addAssets(compiler, {
        'index.html': assets.defaultTemplate()
      })
      return callback()
    }

    // handle both sync and async versions
    if (htmlFunction.length === 2) {
      htmlFunction(assets, function (err, result) {
        if (err) throw err
        self.addAssets(compiler, result)
        delete assets.defaultTemplate
        callback()
      })
    } else {
      self.addAssets(compiler, htmlFunction(assets))
      delete assets.defaultTemplate
      callback()
    }
  })
}

// Oddly enough we have to pass in the compiler here
// it's changed from when it was stored on `this` previously
HJSPlugin.prototype.addAssets = function (compiler, data) {
  var dataType = typeof data
  var pages
  // if it's a string, we assume it's an html
  // string for the index file
  if (dataType === 'string') {
    pages = {}
    pages[this.filename] = data
  } else if (dataType === 'object') {
    pages = data
  } else {
    throw new Error('Result from `html` callback must be a string or an object')
  }

  for (var name in pages) {
    compiler.assets[name] = (function (asset) {
      return {
        source: function () {
          return asset
        },
        size: function () {
          return asset.length
        }
      }
    }(pages[name]))
  }
}

HJSPlugin.prototype.getAssets = function () {
  var assets = this.assets = {}
  var value, chunk

  for (chunk in this.stats.assetsByChunkName) {
    value = this.stats.assetsByChunkName[chunk]

    // Webpack outputs an array for each chunk when using sourcemaps
    if (value instanceof Array) {
      // if we've got a CSS file add it here
      if (chunk === 'main' && value.length === 2) {
        assets.css = value[1]
      }

      // Is the main bundle seems like it's always the first
      value = value[0]
    }

    assets[chunk] = value
  }

  return assets
}

module.exports = HJSPlugin
