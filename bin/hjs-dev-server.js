#!/usr/bin/env node

// Based on
// https://github.com/gaearon/react-transform-boilerplate/blob/master/devServer.js

var path = require('path')
var express = require('express')
var webpack = require('webpack')

var configFile = process.argv[2]
var config
try {
  config = require(path.join(process.cwd(), configFile))
} catch (e) {
  console.error(e.stack)
  console.error(
    'Failed to load webpack config, please use like this\n' +
    'hjs-dev-server.js webpack.config.js\n'
  )
  process.exit(1)
}

var serverConfig = config.devServer

var app = express()
var compiler = webpack(config)

app.use(require('webpack-dev-middleware')(compiler, {
  noInfo: true,
  publicPath: config.output.publicPath
}))

app.use(require('webpack-hot-middleware')(compiler))

app.listen(serverConfig.port, serverConfig.host, function (err) {
  if (err) {
    console.log(err)
    return
  }

  console.log('Listening at http://' + serverConfig.host + ':' + serverConfig.port)
})
