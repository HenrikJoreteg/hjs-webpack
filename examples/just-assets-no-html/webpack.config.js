var getConfig = require('hjs-webpack')
var isDev = process.env.NODE_ENV !== 'production'

module.exports = getConfig({
  in: 'src/app.js',
  out: 'public',
  isDev: isDev,
  html: false,
  clearBeforeBuild: true,
  devServer: {
    hot: false,
    contentBase: __dirname
  }
})
