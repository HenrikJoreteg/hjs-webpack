var yeticss = require('yeticss')
var autoPrefixer = require('autoprefixer-stylus')
var HtmlPlugin = require('./html-plugin')

module.exports = function getBaseConfig (spec) {
  return {
    entry: [
      spec.entry
    ],
    output: spec.output,
    resolve: {
      extensions: [
        '',
        '.js',
        '.json',
        '.styl'
      ]
    },
    plugins: [
      new HtmlPlugin({
        html: spec.html
      })
    ],
    module: {
      loaders: [
        {
          test: /(\.js$)|(\.jsx$)/,
          exclude: /node_modules/,
          loaders: [
            'babel-loader'
          ]
        },
        {
          test: /\.json$/,
          loaders: ['json']
        },
        {
          test: /\.(otf|eot|svg|ttf|woff)/,
          loader: 'url-loader'
        }
      ]
    },
    stylus: {
      use: [yeticss(), autoPrefixer()]
    }
  }
}
