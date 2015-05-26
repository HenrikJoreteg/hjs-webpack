Simple, catch-all HTML file configuration.

By default, hjs-webpack will create and serve a catchall HTML file that references your assets.

```
var getConfig = require('hjs-webpack')

module.exports = getConfig({
  in: './app.js',
  out: 'public',
  clearBeforeBuild: true
})
```

Try running `npm start` in this folder then opening localhost:3000/something and you'll still see the same HTML response.

Running `npm run build` will produce a `public` directory with just minified JS, CSS, and a basic `index.html` file that references the built assets.
