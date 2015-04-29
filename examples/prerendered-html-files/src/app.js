require('./styles.styl')
var React = require('react')
var AmpRouter = require('ampersand-router')
var HomePage = require('./home-page')
var OtherPage = require('./other-page')

var Router = AmpRouter.extend({
  routes: {
    '': 'home',
    'other': 'other'
  },

  home: function () {
    React.render(<HomePage/>, document.body)
  },

  other: function () {
    React.render(<OtherPage/>, document.body)
  }
})

var router = new Router()
window.router = router
router.history.start()
