Here we generate multiple static HTML files.

This can be especially interesting if used to pre-render known HTML with React.

```js
var getConfig = require('hjs-webpack')

module.exports = getConfig({
  in: './app.js',
  out: 'public',
  clearBeforeBuild: true,
  html: function (data) {
    // here we return an object where each key is a file to be generated
    return {
      '200.html': data.defaultTemplate(),
      'index.html': [
        '<html>',
          '<head>',
            '<link href="' + data.css + '" rel="stylesheet" type="text/css" />',
          '</head>',
          '<body>',
            '<h1>Home Page</h1>',
            '<script src="' + data.main + '"></script>',
          '</body>',
        '</html>'
      ].join('')
    }
  }
})
```

**note** it can also be asynchronous and these can be anything (not just HTML strings)

```js
html: function (data, cb) {
  cb(err, {
    'index.html': '<...>',
    'something.html': '<...>',
    'cache.manifest': '...'
  })
}
```

## Start in dev mode

This just runs the `start` script in the `scripts` section of `package.json`.

```
npm start
```

In development, this doesn't get used. Instead during dev it just generates a simple default HTML page that includes the assets and is hotloaded, etc.

## Build to static

This just runs the `build` script in the `scripts` section of `package.json`.

```
npm run build
```

Running `npm run build` will produce a `public` directory with just minified JS, CSS, and a each of the files specified by the HTML callback.
