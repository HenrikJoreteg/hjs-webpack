# hjs-webpack

[![npm version](https://badge.fury.io/js/hjs-webpack.svg)](https://badge.fury.io/js/hjs-webpack)

> Warning: If you are upgrading across major versions, please read the [release notes in the changelog](./CHANGELOG.md).

I really dislike setting up build scripts. Most of the time I want to do the exact same thing:

While developing:

  - easy to setup and run dev server
  - transpile ES6+, JSX, Stylus code
  - hotload (a.k.a. live reload) modules when changed

When ready to ship:

  - minify and bundle all the things
  - output minified, uniquely named static files into public directory
  - be able to generate customized static HTML file(s) used to deliver my JS app
  - be ready to just upload it all to something like [surge.sh](http://surge.sh/)
  - sometimes I want to pre-render all known HTML into static HTML files and have React take over once the clientside JS loads.

[webpack](http://webpack.github.io) can do most of those things pretty well out of the box. But, it sure is a pain to set it all up.

So, this is just a simplified, opinionated way to configure webpack for development and then build for production. That also supports easily generating more files.

If no one uses it but me, it will have still served its purpose.

A screencast showing how to use this module is here: http://learn.humanjavascript.com/react-ampersand/setting-up-webpack

## install

```
npm install hjs-webpack
```

### Optional dependencies

`hjs-webpack` relies on a number of optional dependencies to add functionality for things like CSS preprocessing, ES2015 transpiling, templates, and plugins. It doesn't make sense to specifiy all the loaders as `peerDependencies` since not every person will want every loader and missing `peerDependencies` cause commands like `npm ls` to error which isn't great.

So in order to get this additional functionality you should `npm install` the loaders and plugins you want `hjs-webpack` to use. If `hjs-webpack` detects that they are installed, then they will be used automatically without any further configuration.

Here's some more information about the available loaders and plugins and what they each do. You should install each that you want with `npm install --save-dev`.

#### CSS

*Note that all of the CSS loaders and plugins require [`css-loader`](https://www.npmjs.com/package/css-loader) [`postcss-loader`](https://www.npmjs.com/package/postcss-loader) [`style-loader`](https://www.npmjs.com/package/style-loader) to be installed.*

[`less-loader`](https://www.npmjs.com/package/less-loader) Require compiled less files. Extension: `less`.

[`stylus-loader`](https://www.npmjs.com/package/stylus-loader) Require compiled stylus files. Extension: `styl`.

[`sass-loader`](https://www.npmjs.com/package/sass-loader) Require compiled sass files using the regular or indented syntax. Extensions: `sass scss`.

[`yeticss`](https://www.npmjs.com/package/yeticss) A plugin to add the yeticss library as a `stylus` plugin.

[`autoprefixer`](https://www.npmjs.com/package/autoprefixer) A plugin to auto prefix all your CSS with the necessary vendor prefixes.

#### JS/JSX/JSON

[`babel-loader`](https://www.npmjs.com/package/babel-loader) Require transpiled JS with built-in support for ES2015 and JSX. Extensions: `js jsx babel`.

[`coffee-loader`](https://www.npmjs.com/package/coffee-loader) Require CoffeeScript. Extension: `coffee`.

[`cjsx-loader`](https://www.npmjs.com/package/cjsx-loader) Require CoffeeScript with support for JSX. `coffee-loader` must also be installed. Extension: `cjsx`.

[`awesome-typescript-loader`](https://www.npmjs.com/package/awesome-typescript-loader) Require TypeScript. Extension: `ts`.

[`livescript-loader`](https://www.npmjs.com/package/livescript-loader) Require LiveScript. Extension: `ls`.

#### Assets

[`url-loader`](https://www.npmjs.com/package/url-loader) Require assets that return data url if the size is less than the [`urlLoaderLimit`](#urlloaderlimit-optional-number-default-10000). Extensions: `jpg jpeg png gif svg otf eot svg ttf woff`.

[`worker-loader`](https://www.npmjs.com/package/worker-loader) This lets us more easily write code for WebWorkers. Once you `npm install worker-loader` you can write worker code using whatever other transpiler you're using and being able to `require` or `import` code from npm just like you would normally. If this is installed, simply name your file ending in `worker.js` for example `main.worker.js` or even just `worker.js` and it will be loaded as a worker and packaged up as a separate file when built. In addition, `worker-loader` supports inlining the code for workers and loading it as a data-uri as can be seen here: https://github.com/webpack/worker-loader/blob/master/createInlineWorker.js. To use this feature name your file `SOMETHING.thread.js` or just `thread.js` instead and it will be inlined if that feature is supported by the browser running your app (it will fallback to being loaded as a separate file otherwise).

#### Templates

[`pug-loader`](https://www.npmjs.com/package/pug-loader) Require pug files as compiled functions. Extension: `pug` (legacy `jade` also supported).

#### Development

[`visualizer-plugin`](https://github.com/chrisbateman/webpack-visualizer) A plugin to visualize and analyze your Webpack bundle to see which modules are taking up space and which might be duplicates.

## Usage

#### Step 1. install it into your project

```
npm install --save hjs-webpack
```

#### Step 2. create a webpack.config.js

Put it at the root of your project, a typical config looks something like this:

```js
var getConfig = require('hjs-webpack')


module.exports = getConfig({
  // entry point for the app
  in: 'src/app.js',

  // Name or full path of output directory
  // commonly named `www` or `public`. This
  // is where your fully static site should
  // end up for simple deployment.
  out: 'public',

  // This will destroy and re-create your
  // `out` folder before building so you always
  // get a fresh folder. Usually you want this
  // but since it's destructive we make it
  // false by default
  clearBeforeBuild: true
})

```

#### Step 3. configure `scripts` section of package.json

I usually add something like the following scripts:

```
"scripts": {
  "start": "hjs-dev-server",
  "build": "webpack",
  "deploy": "npm run build && surge -p public -d somedomain.com"
}
```

Assuming you've got some JS written that you've set as your `in` in the `webpack.config.js` you can run `npm start` and open a browser to `http://localhost:3000` and you everything should Just Work™.

When you're wanting to do a build, just run `npm run build`. The build will generate your files into `public`.

Now there's a static site in `public` that can be deployed to something like [Surge.sh](http://surge.sh), which I do by running `npm run deploy`.

#### Step 4. Dealing with styles

Since we're using webpack under the hood, this is done the "webpack way".

Basically you can `require` your styles as if they were JavaScript files.

Simply do this in your application code:

```
require('./path/to/your/css/main.css')
```

Be sure to include the extension: `.css` in your require statment. If you use `.styl` you can write [Stylus](https://learnboost.github.io/stylus/) seamlessly and at the top of your stylus files you've got access to [yeti.css](http://yeticss.com/) for easy styling.

Try creating a file called `main.styl` containing:

```css
@import 'yeticss'
```

Require it from your main application file (see `in` section below) and you should get some nice default styles.

**Note** in development mode these will be live-reloaded (hot loaded). In production, these will be extracted into their own files, including intelligent handling of referenced URLs within your stylesheets. Things like font-files and images will be extracted if they're over a certain size. You shouldn't have to worry about this too much. It should just work seamlessly.

#### Step 5. Dealing with images and static files

**Option #1: requiring files**

Webpack lets us do `var url = require('something.png')` from within our app code and `url` is something you can safely set as the `src` of an image tag, for example. When you build the project, it uses the [url-loader](https://github.com/webpack/url-loader) and will base64 encode and inline it if it's smaller than the [urlLoaderLimit](#urlloaderlimit-optional-number-default-10000) and hash and export it otherwise.

When you do this, webpack will hash the file and use that as a name. If you basically just want to require a file so webpack knows about it, the following syntax will copy the favicon to the `out` directory (at the root) but leave the name unchanged: `require('!!file?name=favicon.ico!./real/path/to/your/favicon.ico')`. The `!!` at the beginning will tell webpack to ignore other configured loaders so that your favicon won't get base64 encoded by the `url-loader`. See the webpack documentation about [loader order](https://webpack.github.io/docs/loaders.html#loader-order) for more info.

But, letting webpack handle images isn't always what you want to do. Sometimes you want just a simple folder of static assets and be able to reference them like you're used to. That's why there's another option:

**Option #2: just put 'em in your `out` directory**

You can also just put your assests in the `out` directory and tell hjs-webpack to ignore them by setting a glob pattern as the  `clearBeforeBuild` option.

Assume an `out` directory called `public` that looks like this:

```
public/
  some-other-generated-file.html
  index.html
  yourapp.1.1.1.css
  yourapp.1.1.1.js
  favicon.ico

  images/
    some-pic.png

```

Then, instead of setting `clearBeforeBuild: true` you can set it to a glob string like so: `clearBeforeBuild: '!(images|favicon.ico)'`.

Now when you build it'll clear everything that matches the glob pattern an nothing else.

In this case, it'd leave the `images` directory and your `favicon.ico` alone (more details in options section below).

**note** The development server will treat the `out` directory as the `contentBase` which means in this case the favicon would be available at `/favicon.ico` despite being in `public`.

## Examples

There are 3 example projects in the [/examples](https://github.com/HenrikJoreteg/hjs-webpack/tree/master/examples) directory with various config setups:

1. Only generating CSS/JS
2. Generating CSS/JS and using included HTML template
3. Pre-rendering app layout and the public homepage HTML with React as part of the build process

## Config options

The main export you get when you `require('hjs-webpack')` is simply a pre-configured `webpack.config.js`. You could take the result of that and add other plugins if you so chose, but shouldn't be necessary for most common tasks.

### `in`

This should just be the path to the file that serves as the main entry point of your application.

### `out`

Path to directory where we're going to put generated files.

### `clearBeforeBuild` (optional, boolean or glob string, default=false)

A boolean to specify whether to clear the `out` folder before building.

If you wish to only clear *some* of this directory you can also pass a [glob string](https://github.com/isaacs/node-glob#glob-primer). Globs are the file path matching strings you've probably seen in on the command line or in a `.gitigore` (i.e. `**/*.js*`).

The most common thing you'd probably want to do while using this module would be to exclude a directory from being cleared. The following example would clear out the `public` directory but leave the `public/images` and `public/static` folders intact if they exist.

```
getConfig({
  in: 'src/app.js',
  out: 'public',
  clearBeforeBuild: '!(images|static)'
})

```

So, just to be clear, everything that matches the glob string *within* the out folder will be deleted when building.

### `isDev` (optional, boolean, default=varies based on command)

A boolean to indicate whether or not everything is in production mode (minified, etc.) or development mode (everything hotloaded and unminified).

By default this value is `true` if the command you ran contains `hjs-dev-server` and `false` otherwise. The option exists here in case you need to override the default.

### `devtool` (optional, string, default='cheap-module-eval-source-map')

A webpack developer tool to enhance debugging. See [the webpack docs for more options](https://webpack.github.io/docs/configuration.html#devtool).

### `uglify` (optional, object)

Options passed directly to the [`UglifyJSPlugin`](https://webpack.github.io/docs/list-of-plugins.html#uglifyjsplugin). Only used if `isDev` is `false`. Default:

```js
{
  compress: { warnings: false },
  output: { comments: false },
  sourceMap: false
}
```

### `output.filename` (optional, string)

This is passed directly to `webpack`, so you can use all the [configuration options available there](https://github.com/webpack/docs/wiki/configuration#outputfilename).

By default a filename is created for you based on the following rules:

- If `isDev` is `true`, then the filename is `app.js`
- If `isDev` is `false`, then the filename `NAME.VERSION.js` where `NAME` and `VERSION` are pulled from your `package.json` file
- If `output.hash` is true, then instead of `VERSION` your filename will contain the `HASH` of the compiled file

### `output.cssFilename` (optional, string)

This is passed directly to the `extract-text-webpack-plugin`, so you can use all the [configuration options available there](https://github.com/webpack/extract-text-webpack-plugin#api). Note: this is only used if `isDev` is `true`, since in development mode the css bundle is inserted dynamically into the document by the [`style-loader`](https://github.com/webpack/style-loader).

By default a filename is created for you based on the following rules:

- If `isDev` is `true`, then the filename is `app.css`
- If `isDev` is `false`, then the filename `NAME.VERSION.css` where `NAME` and `VERSION` are pulled from your `package.json` file
- If `output.hash` is true, then instead of `VERSION` your filename will contain the `HASH` of the compiled file

### `output.hash` (optional, boolean, default is `false`)

This is used in conjunction with the `output.filename` and `output.cssFilename` options above, and is only used if `isDev` is `false`. If `hash` is `true` then the filenames of your JS and CSS files will contain the hash of the compiled file. This is useful to fingerprint your asset files so that they can be cached for as long as possible.

### `urlLoaderLimit` (optional, number, default: `10000`)

This is the default threshold to use for whether URLs referenced in stylesheets will be inlined or extracted during build (we're just pre-configuring the [url-loader](https://github.com/webpack/url-loader)).

### `devServer` (optional, object)

These options are passed through to the `hjs-dev-server` with a few defaults. Some of these options are passed directly to [`webpack-dev-middleware`](https://github.com/webpack/webpack-dev-middleware), see those docs for all available options.

```js
{
  port, // pulled from top level option "port"
  hostname, // // pulled from top level option "hostname"
  historyApiFallback: true,
  hot: true,
  compress: true, // enable express compression to faster index reload (default: false)
  // The following options are for webpack-dev-middleware
  noInfo: true,
  quiet: false,
  lazy: false,
  publicPath // pulled from top level option "output.publicPath"
}
```

### `https` (optional, boolean, default: `false`)

This is used to start `hjs-dev-server` with its self signed certificate, so you can load the application with an https url.  It also configures hot module replacement to also use https.

### `replace` (optional, object)

You can supply an object of require names with paths to the files you want that name to represent. This makes it easy to do things like swapping out config files based on build mode, etc.

Adding this to your config would mean that any time you did: `require('config')` within your application code, you'd end up with the file specified by the path.

```js
{
  'config': '/some/path/config.json'
}
```

### `html` (optional, can be boolean or function)

This option is `true` by default. This means, by default, we'll serve and generate a very basic HTML file that looks like this:

```html
<!doctype html>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=no"/>
<link rel="stylesheet" href="/package-name.1.0.0.css"/>
<body><div id="root"></div><script src="/package-name.1.0.0.js"></script></body>
```

Note the `<meta charset>` tag and mobile viewport settings are there by default.

The `<body>` followed by the main script tag is also intentional. The ordering ensures we don't have to wait for `DOMReady` in our clientside code, you can safely assume that *both* `document.body` and `document.head` will be available when your script executes.

If you just want to do JS and CSS and handle all the html yourself, simply add `html: false` to your config (see examples directory for example).

**using an `html` function to generate specific files**

This is where it gets interesting. Imagine pre-rendering all known structural content for a Native Web App to static files. Users get pixels on the screen immediately, your JS takes over when downloaded. If you're using React, this "taking over" can be completely seamless and invisible to the user. It's also possible with this approach to write an app that works entirely without JS. See the [prerendered-html-files example](https://github.com/HenrikJoreteg/hjs-webpack/tree/master/examples/prerendered-html-files).

Your function should produce an object.

Each key in the object is a filename, and its value is a string to be written to disc.

If you simply specify `html: true` it will do the following by default:

```js
html: function (context) {
  return {
    'index.html': context.defaultTemplate()
  }
}
```

So if you want to produce other files, you can do so by adding them to the returned object:

```js
html: function (context) {
  return {
    'index.html': context.defaultTemplate(),

    // if you build it entirely yourself it should be a complete HTML document
    // using whatever templating system you want
    'other.html': '<!DOCTYPE><body><h1>Hello World</h1></body>'
  }
}
```

**async version**

```js
html: function (context, callback) {
  // do whatever async stuff generate result object
  // and pass it to the callback instead
  db.fetchData(function (err, data) {
    callback(null, {
      'index.html': buildHTML(data),
      'other.html': doSomethingElse(data)
    })
  })
}
```

**The context argument**

Your `html` function will be called with a context object that contains the following:

1. `context.main`: the name of the generated JS file
2. `context.css`: the name of the generated CSS file. This only exists if `isDev` is `false`, since in development mode the css bundle is inserted dynamically into the document by the [`style-loader`](https://github.com/webpack/style-loader).
3. `context.defaultTemplate()` a convenience method you can call to generate the basic HTML shown above. This takes a few options too if you just want to make minor tweaks. If you want to do more, just don't use the default template, generate your own instead. The options are:
  - `{html: '<div id="my-container">Some custom markup</div>'}` This markup will be added inside the `<body>` tag. By default it adds a `<div id="root"></div>` as a mount target for React apps.
  - `{charset: 'utf-8'}` what charset to set
  - `{title: 'your app'}` sets `<title>`
  - `{head: 'any string'}` anything else you want to put in the `head`, other meta tags, or whatnot.
  - `{metaViewport: boolean|object}` set to false if you don't want the default viewport tag. Set to an object with `userScalable` true if you don't want to block user-zoom on mobile
  - `{publicPath: 'http://mycdn.com/'}`  (default `/`) pass in path that will prefix the generated css/js files in the template. Note, there is `output.publicPath` provided by webpack, but doesn't easily allow for switching based on envirnoment. In this method we've got access to `context.isDev` and can easily switch based on that.
  - `{metaTags: {}}` lets you easily add `<meta>` tags to the document head. Takes an object where the key is the `name` and the value is the `content`.
  - `{lang: 'en-US'}` sets the `lang` attribute on the `<html>` tag.
4. `context.isDev`: boolean specifying whether or not we're in dev mode.
5. `context.package`: the parsed `package.json` file as an object.
6. `context.stats`: the stats object returned by webpack. Of likely interest is `context.stats.hash` (a hash of current build). `context.stats.assets` is an array of all the assets that will be generated. This can be useful for generating cache manifests, etc. Overall, this is a big object that lists all the modules in your whole app. You likely won't need most of it, but it's all there in case you do. ([A sample can be found here](https://raw.githubusercontent.com/webpack/analyse/master/app/pages/upload/example.json)).


### `serveCustomHtmlInDev` (optional, boolean, default is `true`)

By default, if you supply an `html` function it will always be used, whether you're in development mode or not.

Set this option to `false` to only use your `html` function when building for production. Note, that `.isDev` is attached to the context object passed to the `html` function as described above, so alternately you could just use that value to branch your logic within that function. Using this option circumvents the custom `html` function entirely during development.

## Proxy

The dev server uses [http-proxy-middleware](https://www.npmjs.com/package/http-proxy-middleware) to optionally proxy requests to a separate, possibly external, backend server. Proxies can be specified with `devServer.proxy`. This can be a single proxy, or an array of proxies. The proxy context and options are passed directly to `http-proxy-middleware`.

```js
getConfig({
  in: 'src/app.js',
  out: 'public',
  clearBeforeBuild: true,

  // Use devServer.proxy to specify proxies
  devServer: {
    proxy: {
      context: "/api",
      options: {
        target: "http://localhost:3001",
        pathRewrite: {
          "^/api": ""
        }
      }
    }
  }
})
```

## Developing on multiple devices at once

If you're building an app that you want to look good on all devices it's nice to be able to run them all at once.

Hotloading makes this extremely nice and convenient.

If you're on a Mac, this is fairly simple. Just add a `hostname` option to your config like so:

```js
module.exports = getConfig({
  in: 'src/app.js',
  out: 'public',

  // set this to whatever your machine name is
  // plus `.local`
  // my machine is `loki` so I do:
  hostname: 'loki.local'
})
```

Now when you run the development instead of going to localhost open: `http://{{yourmachine}}.local:3000` on any device that's on your local network, they should all connect and all hotload your style and JS changes.

## Extending `hjs-webpack`

`hjs-webpack` is not designed to take all the same options as `webpack`. Instead it is designed to take the [config options](#config-options) listed above and return an object that is then consumed by `webpack`. That means that if you want to change/add/remove anything in the config, it is the same as manipulating any JavaScript object.

Here's an example where `hjs-webpack` is used to create the base `webpack` config, and then it is manipulated to add a new loader, plugin, and option.

```js
var webpack = require('webpack')
var getConfig = require('hjs-webpack')
var config = getConfig(myHjsWebpackOptions)

// Add xml-loader
config.module.rules.push({ test: /\.xml$/, use: ['xml-loader'] })

// Add webpack PrefetchPlugin
config.plugins.push(new webpack.PrefetchPlugin([context], request))

// Add a separate entry point for jQuery
config.resolve.alias = { jquery:'jquery/src/jquery.js' }
config.plugins.push(
  new webpack.ProvidePlugin({
    jQuery: 'jquery',
    $: 'jquery',
    'window.jQuery':'jquery'
  }),
  new webpack.optimize.CommonsChunkPlugin('vendors', 'vendors.js')
);
config.entry = {
  // Add entries for vendors
  vendors: ['jquery'],
  // Reassign previous single entry to main entry
  main: config.entry
};

// Export the newly manipulated config
module.exports = config
```



### Changing Babel config

Since `hjs-webpack` already has a babel loader, the easiest way to tweak Babel settings is to create a file at the root of your project called `.babelrc` that contains config settings. See [babelrc docs](https://babeljs.io/docs/usage/babelrc/) for more options.

There are some babel presets that work well with `hjs-webpack`. You can check out an example of using presets in the [examples directory](./examples). There's one with [hot reloading](./examples/assets-and-index-html/.babelrc) and one [without](/examples/just-assets-no-html/.babelrc). You'll need to install these presets just like any other dev dependencies.

Here's a quick example if you like copy/pasting:

```sh
npm install babel-preset-es2015 babel-preset-react babel-preset-react-hmre --save-dev
```

and then your `.babelrc`

```json
{
  "presets": ["es2015", "react"],
  "env": {
    "development": {
      "presets": ["react-hmre"]
    }
  }
}
```



## Credits

This is mostly just some add-ons to [webpack](http://webpack.github.io/) so most of the credit goes there.

If you're interested in building apps this way, watch the free section of the tutorials at http://learn.humanjavascript.com. It shows basic usage of this module. Also, you can follow me on twitter [@HenrikJoreteg](http://twitter.com/henrikjoreteg).

Big thanks to co-maintainer [@LukeKarrys](http://twitter.com/lukekarrys) for helping find/fix some really annoying bugs.

## Contributing/Forking

Beware that this is all highly opinionated and contains a lot of personal preferences. If you want to add or remove major things, feel free to open issues or send PRs, but you may just want to fork it.

## Changelog

See the [`CHANGELOG.md`](CHANGELOG.md)

## license

MIT
