#hjs-webpack

I really dislike setting up build scripts. Most of the time I want to do the exact same thing:

While developing:

  - easy to setup and run dev server
  - transpile ES6+, JSX, Stylus code
  - hotload (a.k.a. live reload) modules when changed

When ready to ship:

  - minify and bundle all the things
  - output minfied, uniquely named static files into public directory
  - be able to generate/customized static HTML file(s) used to deliver my JS app
  - be ready to just upload it all to something like [surge.sh](http://surge.sh/)
  - sometimes I want to pre-render all known HTML into static HTML files and have React take over once the clientside JS loads.

[webpack](http://webpack.github.io) and the [webpack-dev-server](http://webpack.github.io/docs/webpack-dev-server.html) can do most of those things pretty well out of the box. But, it sure is a pain to set it all up.

So, this is just a simplified, opinionated way to configure webpack for development and then build for production. That also supports easily generating more files.

If no one uses it but me, it will have still served its purpose.

A screencast showing how to use this module is here: http://learn.humanjavascript.com/react-ampersand/setting-up-webpack

## install

```
npm install hjs-webpack
```

**note about `peerDependencies`**

hjs-webpack specifies many of its dependencies as `peerDependencies` in order to let you decide which version of, say, babel or React that you want to use in your project without us specifying that directly for you.

In npm `3.x.x` `peerDependencies` will no longer be installed by default.

When this happens, you'll want to run the following to install the related dependencies as well.

Included here for your copy/paste enjoyment:

```
npm i --save autoprefixer-core babel babel-loader css-loader json-loader postcss-loader react-hot-loader style-loader stylus-loader url-loader webpack-dev-server yeticss
```

## usage

**Step 1. install it into your project**

```
npm install --save hjs-webpack
```

**Step 2. create a webpack.config.js**

Put it at the root of your project, a typical config looks something like this:

```js
var getConfig = require('hjs-webpack')
var env = process.env.NODE_ENV || 'development'


module.exports = getConfig({
  // a boolean specifying whether to minify, output files, etc
  isDev: env === 'development',

  // entry point for the app
  in: 'src/app.js',

  // Name or full path of output directory
  // commonly named `www` or `public`. This
  // is where your fully static site should
  // end up for simple deployment.
  out: 'public'
})

```

**Step 3. configure `scripts` section of package.json**

I usually add something like the following scripts:

```
"scripts": {
  "start": "webpack-dev-server",
  "prebuild": "rm -rf public && mkdir public",
  "build": "NODE_ENV=production webpack",
  "deploy": "npm run build && surge -p public -d somedomain.com"
}
```

Assuming you've got some JS written that you've set as your `in` in the `webpack.config.js` you can run `npm start` and open a browser to `http://localhost:3000` and you everything should Just Work™.

When you're wanting to do a build, just run `npm run build`. The `prebuild` script should clear and re-create a folder called `public` (you'll have to tweak this a bit if you're on windows). The build will generate your files into `public`.

Now there's a static site in `public` that can be deployed to something like [Surge.sh](http://surge.sh) or [DivShot](http://divshot.com), which I do by running `npm run deploy`.

**Step 4. Dealing with styles**

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

**note** in devlopment mode these will be live-reloaded (hot loaded) in production, these will be extracted into their own files, including intelligent handling of referenced URLs within your stylesheets. Things like font-files will be extracted if they're over a certain size. You shouldn't have to worry about this too much, it should just work seamlessly.

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

### `isDev`

A boolean to indicate whether or not everything is in production mode (minified, etc.) or development mode (everything hotloaded and unminified).

### `output.filename` (optional, string)

This is passed directly to `webpack`, so you can use all the [configuration options available there](https://github.com/webpack/docs/wiki/configuration#outputfilename).

By default a filename is created for you based on the following rules:

- If `isDev` is `true`, then the filename is `app.js`
- If `isDev` is `false`, then the filename `NAME.VERSION.js` where `NAME` and `VERSION` are pulled from your `package.json` file
- If `output.hash` is true, then instead of `VERSION` your filename will contain the `HASH` of the compiled file

### `output.cssFilename` (optional, string)

This is passed directly to the `extract-text-webpack-plugin`, so you can use all the [configuration options available there](https://github.com/webpack/extract-text-webpack-plugin#api).

By default a filename is created for you based on the following rules:

- If `isDev` is `true`, then the filename is `app.css`
- If `isDev` is `false`, then the filename `NAME.VERSION.css` where `NAME` and `VERSION` are pulled from your `package.json` file
- If `output.hash` is true, then instead of `VERSION` your filename will contain the `HASH` of the compiled file

### `output.hash` (optional, boolean, default is `false`)

This is used in conjunction with the `output.filename` and `output.cssFilename` options above, and is only used if `isDev` is `false`. If `hash` is `true` then the filenames of your JS and CSS files will contain the hash of the compiled file. This is useful to fingerprint your asset files so that they can be cached for as long as possible.

Note that as per the suggestion [in the webpack docs](https://github.com/webpack/docs/wiki/configuration#output), the `OccurenceOrderPlugin` is already used so you will get consistent ordering of modules.

### `urlLoaderLimit` (optional, number, default: `10000`)

This is the default threshold to use for whether urls referenced in stylesheets will be inlined or extracted during build (we're just pre-configuring the [url-loader](https://github.com/webpack/url-loader)).

### `html` (optional, can be boolean or function)

This option is `true` by default. This means, by default, we'll serve and generate a very basic HTML file that looks like this:

```html
<!doctype html>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=no"/>
<link rel="stylesheet" href="/assets-and-index-html.1.0.0.css"/>
<body></body>
<script src="/app.js"></script>
```

Note the `<meta charset>` tag and mobile viewport settings are there by default.

The empty `<body>` followed by the main script tag is also intentional. The ordering ensures we don't have to wait for `DOMReady` in our clientside code, you can safely assume that *both* `document.body` and `document.head` will be available when your script executes.

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

So if you want to produce other files, you can do so just by adding them to the returned object:

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
2. `context.css`: the name of the generated CSS file
3. `context.defaultTemplate()` a convenience method you can call to generate the basic HTML shown above. This takes a few options too if you just want to make minor tweaks. If you want to do more, just don't use the default template, generate your own instead. The options are:
  - `{html: 'your string}` and it'll add it to the <body>
  - `{charset: 'utf-16'}
  - `{title: 'your app'}` sets `<title>`
  - `{head: 'any string'}` anything else you want to put in the `head`, other meta tags, or whatnot.
  - `{metaViewport: false}` set to false if you don't want the default viewport tag

## Developing on multiple devices at once

If you're building an app that you want to look good on all devices it's nice to be able to run them all at once.

Hotloading makes this extremely nice and convenient.

If you're on a mac, this is fairly simple. Just add a `hostname` option to your config like so:

```js
module.exports = getConfig({
  isDev: env === 'development',
  in: 'src/app.js',
  out: 'public',

  // set this to whatever your machine name is
  // plus `.local`
  // my machine is `loki` so I do:
  hostname: 'loki.local'
})
```

Now when you run the development instead of going to localhost open: `http://{{yourmachine}}.local:3000` on any device that's on your local network, they should all connect and all hotload your style and JS changes.

## other loaders

There's a few loaders configured, but not automatically installed:

**less**

`require('styles.less')` and npm install `less-loader`

**jade**

`require('template.jade')` and npm install `jade-loader`

## credits

This is mostly just some add-ons to [webpack](http://webpack.github.io/) so most of the credit goes there.

If you're interested in building apps this way, watch the free section of the tutorials at http://learn.humanjavascript.com it shows basic usage of this module. Also, you can follow me on twitter [@HenrikJoreteg](http://twitter.com/henrikjoreteg).

Big thanks to co-maintainer [@LukeKarrys](http://twitter.com/lukekarrys) for helping find/fix some really annoying bugs.

## Contributing/Forking

Beware that this is all highly opinionated and contains a lot of personal preferences. If you want to add or remove major things, feel free to open issues or send PRs, but you may just want to fork it.

## Changelog

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

## license

MIT
