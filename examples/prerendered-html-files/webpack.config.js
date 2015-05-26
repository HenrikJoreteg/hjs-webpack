// this lets us require files with JSX/ES6 in them
require('babel/register')

// require React and our two React components
var React = require('react')
var HomePage = require('./src/home-page')
var OtherPage = require('./src/other-page')

// our hjs-webpack, of course
var getConfig = require('hjs-webpack')

module.exports = getConfig({
  in: 'src/app.js',
  out: 'public',
  clearBeforeBuild: true,
  html: function (data) {
    // use React's `renderToString` method to return an HTML string from our
    // components (dynamic values can be passed into `createElement` too)
    var homePageHtmlString = React.renderToString(React.createElement(HomePage))
    var otherPageHtmlString = React.renderToString(React.createElement(OtherPage))

    return {
      'index.html': data.defaultTemplate({html: homePageHtmlString}),
      'other/index.html': data.defaultTemplate({html: otherPageHtmlString})

      // here we might also create an app manifest.json
      // app-manifest.json: JSON.stringify(something)

      // or perhaps an appcache manifest
      // cache.manifest: buildSomeString()
    }
  }
})
