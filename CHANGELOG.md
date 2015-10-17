## Changelog

- 3.0.0
  - Remove `peerDependencies` and make them optional. See the [optional dependencies](README.md#optional-dependencies) section in the README for new installation instructions. [#26](https://github.com/HenrikJoreteg/hjs-webpack/issues/26) [#80](https://github.com/HenrikJoreteg/hjs-webpack/pull/80)

- 2.14.1
  - Only use react-hot-loader if specified by devServer `hot` option

- 2.14.0
  - Add https support

- 2.13.2
  - Pin dependencies (setup Greekeeper.io)

- 2.13.1
  - Replace `autoprefixer-core` with `autoprefixer`
  - Update `examples/` dependencies

- 2.13.0
  - use cheap-module-eval-source-map devtool in dev [#63](https://github.com/HenrikJoreteg/hjs-webpack/issues/63)
  - remove noerrors plugin and for react-hot-loader@^1.3.0 [#62](https://github.com/HenrikJoreteg/hjs-webpack/issues/62)

- 2.12.4
  - Update `extract-text-webpack-plugin` and other dependencies
  - Get `npm test` passing for `standard` linting

- 2.12.3
  - Add `react` to peer deps

- 2.12.2
  - Fix `react-hot-loader` is installed check

- 2.12.1
  - Don't assume `process.argv[1]` exists. This can happen if running via `node -p`, thanks [@eins78](http://github.com/eins78).

- 2.12.0
  - Don't force install of React or React Hot-Loader only use them and other optional installs if installed. Thanks [@FWeinb](http://github.com/FWeinb)

- 2.11.0
  - Add ability to pass `metaTags` object as a `defaultTempate` option for easily adding `<meta>` tags.

- 2.10.0
  - Add `sass-loader` for `.scss` and ``sass` files

- 2.9.0
  - Allow globs for `clearBeforeBuild`.
  - Expose webpack `stats` object to context
  - Expose parsed `package.json` object to `html` function context argument.
  - Set `out` folder as `contentBase` for the dev server.

- 2.8.1
  - Fix typo in `examples/just-assets-no-html/README.md`
  - add documentation for relative links in html

- 2.8.0
  - add `serveCustomHtmlInDev` as an explicit option
  - properly document new option and `isDev` in html function

- 2.7.0
  - Expose `isDev` flag to `html` function context
  - Document `replace` option in readme.

- 2.6.1
  - Fix less filename test when in production mode
  - Add documentation about using html function's css context and cssFilename in production mode

- 2.6.0
  - Allow `devServer` options to be passed in

- 2.5.0
  - Use passed in `urlLoaderLimit`
  - Add default url loader for images

- 2.4.0 Resolve `.jsx` extension

- 2.3.0 configure `isDev` default automatically based on whether the command used contains `webpack-dev-server` or not (still respects explicitly configured, so not a breaking change)
  - add `clearBeforeBuild` option to clear build folder first.
  - both the above changes allow an app to share configs because you're not having to clear the build dir, or set environment variables two different ways for different platforms (a.k.a. better windows support).
  - doc fixes/improvements

- 2.2.2 use `process.cwd()` over `process.env.PWD` to find root.

- 2.2.1 include `json-loader` by default.

- 2.2.0 use `autoprefixer-core` and `postcss-loader` to add autoprefixing to all configured style loaders
  - don't resolve .styl extensions

- 2.1.0 pre-configure `.jade` and `.less` loaders as optional installs.
  - add option for `urlLoaderLimit`

- 2.0.0 instead of including our own pre-configured dev server: `hjs-dev-server` you can now just use `webpack-dev-server` in your npm `scripts` and it gets configured via `devServer` property of config.
  - much more complete documentation
  - support for passing options to `defaultTemplate()` function
  - simplified/unified configuration
  - support for setting global `hostname` (see above)
  - now includes main babel package by default
  - add warnings/instructions about npm `3.x.x`'s handling of peer dependencies