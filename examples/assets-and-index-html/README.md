Simple, catch-all HTML file configuration.

Setting `html: true` as follows in your `webpack.config.js`

Makes it serve a catchall HTML file

```
var getConfig = require('hjs-webpack')
var isDev = process.env.NODE_ENV !== 'production'

module.exports = getConfig({
  in: './app.js',
  out: 'public',
  isDev: isDev,
  html: true
})
```

As long as your `isDev` is true styles and JS will also be hotloaded if possible. Try running `npm start` in this folder then opening localhost:3000/something.html

Running `npm run build` will produce a `public` directory with just minified JS, CSS, and a basic `index.html` file that references the built assets.
