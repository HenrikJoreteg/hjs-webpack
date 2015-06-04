var yeticss = require('yeticss')
var autoPrefixer = require('autoprefixer-core')
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
        '.jsx',
        '.json'
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
          loader: 'url-loader?limit=' + spec.urlLoaderLimit
        },
        {
          test: /\.(jpe?g|png|gif)/,
          loader: 'url-loader?limit=' + spec.urlLoaderLimit
        },
        {
          test: /\.jade$/,
          loaders: ['jade']
        }
      ]
    },
    stylus: {
      use: [yeticss()]
    },
    postcss: [autoPrefixer()]
  }
}
