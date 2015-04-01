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

[webpack](http://webpack.github.io) and the [webpack-dev-server](http://webpack.github.io/docs/webpack-dev-server.html) can do all these things quite well. But, it sure is a pain to set it all up.

So, this is just a simplified, opinionated way to configure webpack for development and then build for production. If no one uses it but me, it will have still served its purpose.

## install

```
npm install hjs-webpack
```

## usage

Inside your `webpack.config.js`:

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

## running dev server

This package includes an executable `hjs-dev-server`. If you've installed `hjs-webpack` in your app and if you've set up your config as above, you can run a dev server with the included executable by setting up the `scripts` section of your `package.json` something like:

```json
{
  "name": "your-awesome-app",
  "scripts": {
    "start": "hjs-dev-server",
    "build": "NODE_ENV=production webpack",
    "deploy": "npm run build && surge -p public"
  },
  "dependencies": {
    "webpack": "*",
    "hjs-webpack": "*",
    "surge": "*"
  }
}

```

## license

MIT
