## Changelog

### 9.1.0
  - Update examples to confirm with new linting rules ([#333](https://github.com/HenrikJoreteg/hjs-webpack/pull/333))
  - Add support for using different NODE_ENV values than `production` in production build
  ([#332](https://github.com/HenrikJoreteg/hjs-webpack/pull/332))
  - Add CORS headers to response on static files served by dev server
  ([#242](https://github.com/HenrikJoreteg/hjs-webpack/pull/242))
  - Add support for using `postcss.config.js` to configure PostCSS
  ([#327](https://github.com/HenrikJoreteg/hjs-webpack/pull/327))

### 9.0.0
  - Add support for webpack 2. Although there are no differences in the API, this version requires you
  to migrate to webpack@^2.2.1. You will also have to update your loader dependencies to their newest majors
  as well, as many of them have come out with webpack 2 support.
  If you have extended the configuration created by `hjs-webpack`, you will have to migrate those changes as
  well. Please have a look at the [official migration guide](https://webpack.js.org/guides/migrating/) for
  advice on how to do this.

### 8.4.3
  - Do not replace all environment variables in production [#296](https://github.com/HenrikJoreteg/hjs-webpack/issues/296)

### 8.4.2
  - Change how default name and version are specified for [#255](https://github.com/HenrikJoreteg/hjs-webpack/issues/255)

### 8.4.1
  - Add `compression` to dependencies [#291](https://github.com/HenrikJoreteg/hjs-webpack/issues/291)

### 8.4.0
  - Add `compression` option to dev server [#240](https://github.com/HenrikJoreteg/hjs-webpack/issues/240)
  - Add `pug-loader` to work with `.pug` files (and be backward compatible with `.jade` files) [#271](https://github.com/HenrikJoreteg/hjs-webpack/issues/271)
  - Add option to set `devtool` when `isDev` is true [#276](https://github.com/HenrikJoreteg/hjs-webpack/issues/276)
  - Use a default `package.name` and `package.version` so it doesn't error without them [#255](https://github.com/HenrikJoreteg/hjs-webpack/issues/255)

### 8.3.0
  - Add support for `webpack-visualizer-plugin` [#190](https://github.com/HenrikJoreteg/hjs-webpack/issues/190)
  - Throw error if trying to clear a directory containing the current working directory [#186](https://github.com/HenrikJoreteg/hjs-webpack/issues/186)
  - Allow setting uglifyjs options from config [#81](https://github.com/HenrikJoreteg/hjs-webpack/issues/81)

### 8.2.0
  - Add file extension `.tsx` to typescript loader [#223](https://github.com/HenrikJoreteg/hjs-webpack/pull/223)
  - Update `http-proxy-middleware` [#216](https://github.com/HenrikJoreteg/hjs-webpack/pull/216)

### 8.1.0
  - Add support for dev server proxies with `http-proxy-middleware` [#198](https://github.com/HenrikJoreteg/hjs-webpack/pull/198)

### 8.0.0
  Since hot module reloading can be done in many different forms (see [this blog post](https://medium.com/@dan_abramov/hot-reloading-in-react-1140438583bf#.r3jfruhdm) and [this PR](https://github.com/reactjs/redux/pull/1455/files) for more info), `hjs-webpack` no longer looks at which loaders/plugins you have installed to determine if HMR should be turned on or off, and instead only looks at the config option `devServer.hot` to determine if the HMR entry path and plugins should be added to the config.

  By default, HMR has always been set to `true`, but previously if you didn't have a specific set of plugins installed `hjs-webpack` would set it to `false`. This is no longer the case, and is the reason why this is a major update. **If you are not using HMR, then you now need to set `devServer.hot = false` in your config to turn it off.**

### 7.3.2
  - Update `webpack-hot-middleware` to `^2.8.1`

### 7.3.1
  - Update dependencies, and pin `webpack-hot-middleware` to `2.7.1` for now to avoid [this issue](https://github.com/glenjamin/webpack-hot-middleware/issues/80)

### 7.3.0
  - Add option for enabling zoom on mobile devices [#176](https://github.com/HenrikJoreteg/hjs-webpack/issues/176)
  - Move `<script>` inside body tag [#177](https://github.com/HenrikJoreteg/hjs-webpack/issues/177)

### 7.2.1
  - Fix HMR when using npm2 [#161](https://github.com/HenrikJoreteg/hjs-webpack/issues/161)

### 7.2.0
  - Add `https` option to dev server [#159](https://github.com/HenrikJoreteg/hjs-webpack/issues/159)

### 7.1.0
  - Add `lang` option to default html template [#151](https://github.com/HenrikJoreteg/hjs-webpack/issues/151)

### 7.0.0
  The hot module loader changed from [react-hot-loader](https://github.com/gaearon/react-hot-loader) to [babel-blugin-react-transform](https://github.com/gaearon/babel-plugin-react-transform). This is a breaking change and means you need to upgrade your installation when trying to use the newest version of hjs-webpack.

  If you want to continue to use hot reloading make sure to add this preset to your project's `devDependencies` to your project:

  ```bash
  npm i --save-dev babel-preset-react-hmre
  ```

  You can then remove `webpack-dev-server` by running:

  ```bash
  npm uninstall --save-dev webpack-dev-server
  ```

  And add the following to your `.babelrc` file:

  ```json
  {
    "env": {
      "development": {
        "presets": ["react-hmre"]
      }
    }
  }
  ```

  Then finally, in the `scripts` section of your `package.json` you should change `webpack-dev-server` to `hjs-dev-server`.

### 6.1.0
  - Add `react-hot-loader` to `coffee-loader`

### 6.0.0
  - Change font loaders to match query strings and separate all font loaders into separate loader entries. This should now work out of the box with projects like [`bootstrap-webpack`](https://github.com/bline/bootstrap-webpack) and [`font-awesome-webpack`](https://github.com/gowravshekar/font-awesome-webpack). This is a breaking change because existing modifications to font loaders in a user's `webpack.config.js` may clash with the new font loaders. See [#115](https://github.com/HenrikJoreteg/hjs-webpack/issues/115) for more info.

### 5.2.0
  - Use `url-loader` for `.woff2` files

### 5.1.0
  - Add worker-loader

### 5.0.1
  - Update dependencies

### 5.0.0
  - Make `defaultTemplate` render `<div id="root"></div>` into the body by default as a mount point for React. See [#89](https://github.com/HenrikJoreteg/hjs-webpack/issues/89) for reasoning.

### 4.0.0
  - Remove `relative` option from template in lieu of a more flexible `publicPath` option.

### 3.1.0
  - Add support for the following loaders: `coffee cjsx typescript livescript`.

### 3.0.0
  - Remove `peerDependencies` and make them optional. See the [optional dependencies](README.md#optional-dependencies) section in the README for new installation instructions. [#26](https://github.com/HenrikJoreteg/hjs-webpack/issues/26) [#80](https://github.com/HenrikJoreteg/hjs-webpack/pull/80)

### 2.14.1
  - Only use react-hot-loader if specified by devServer `hot` option

### 2.14.0
  - Add https support

### 2.13.2
  - Pin dependencies (setup Greekeeper.io)

### 2.13.1
  - Replace `autoprefixer-core` with `autoprefixer`
  - Update `examples/` dependencies

### 2.13.0
  - use cheap-module-eval-source-map devtool in dev [#63](https://github.com/HenrikJoreteg/hjs-webpack/issues/63)
  - remove noerrors plugin and for react-hot-loader@^1.3.0 [#62](https://github.com/HenrikJoreteg/hjs-webpack/issues/62)

### 2.12.4
  - Update `extract-text-webpack-plugin` and other dependencies
  - Get `npm test` passing for `standard` linting

### 2.12.3
  - Add `react` to peer deps

### 2.12.2
  - Fix `react-hot-loader` is installed check

### 2.12.1
  - Don't assume `process.argv[1]` exists. This can happen if running via `node -p`, thanks [@eins78](http://github.com/eins78).

### 2.12.0
  - Don't force install of React or React Hot-Loader only use them and other optional installs if installed. Thanks [@FWeinb](http://github.com/FWeinb)

### 2.11.0
  - Add ability to pass `metaTags` object as a `defaultTempate` option for easily adding `<meta>` tags.

### 2.10.0
  - Add `sass-loader` for `.scss` and ``sass` files

### 2.9.0
  - Allow globs for `clearBeforeBuild`.
  - Expose webpack `stats` object to context
  - Expose parsed `package.json` object to `html` function context argument.
  - Set `out` folder as `contentBase` for the dev server.

### 2.8.1
  - Fix typo in `examples/just-assets-no-html/README.md`
  - add documentation for relative links in html

### 2.8.0
  - add `serveCustomHtmlInDev` as an explicit option
  - properly document new option and `isDev` in html function

### 2.7.0
  - Expose `isDev` flag to `html` function context
  - Document `replace` option in readme.

### 2.6.1
  - Fix less filename test when in production mode
  - Add documentation about using html function's css context and cssFilename in production mode

### 2.6.0
  - Allow `devServer` options to be passed in

### 2.5.0
  - Use passed in `urlLoaderLimit`
  - Add default url loader for images

### 2.4.0
  - Resolve `.jsx` extension

### 2.3.0
  - configure `isDev` default automatically based on whether the command used contains `webpack-dev-server` or not (still respects explicitly configured, so not a breaking change)
  - add `clearBeforeBuild` option to clear build folder first.
  - both the above changes allow an app to share configs because you're not having to clear the build dir, or set environment variables two different ways for different platforms (a.k.a. better windows support).
  - doc fixes/improvements

### 2.2.2
  - use `process.cwd()` over `process.env.PWD` to find root.

### 2.2.1
  - include `json-loader` by default.

### 2.2.0
  - use `autoprefixer-core` and `postcss-loader` to add autoprefixing to all configured style loaders
  - don't resolve .styl extensions

### 2.1.0
  - pre-configure `.jade` and `.less` loaders as optional installs.
  - add option for `urlLoaderLimit`

### 2.0.0
  - instead of including our own pre-configured dev server: `hjs-dev-server` you can now just use `webpack-dev-server` in your npm `scripts` and it gets configured via `devServer` property of config.
  - much more complete documentation
  - support for passing options to `defaultTemplate()` function
  - simplified/unified configuration
  - support for setting global `hostname` (see above)
  - now includes main babel package by default
  - add warnings/instructions about npm `3.x.x`'s handling of peer dependencies
