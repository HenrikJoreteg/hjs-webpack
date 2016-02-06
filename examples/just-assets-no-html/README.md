Simple, no-html configuration

All you have to do is serve HTML *somehow* that includes the following script tag.

```html
<script src="/app.js"></script>
```

As long as your `isDev` is true styles and JS should still be hotloaded if possible. Try running `npm start` in this folder then opening `http://localhost:3000/bring-your-own.html` it will serve the `bring-your-own.html` file since it's in the folder here, but running `npm run build` will produce a `public` directory with just minified JS and CSS assets.

Note that this example has hot module replacement turned off. To turn it on, set `devServer.hot = true` in the webpack config, npm install `babel-preset-react-hmre`, and add this to the `.babelrc`.

```
"env": {
  "development": {
    "presets": ["react-hmre"]
  }
}
```
