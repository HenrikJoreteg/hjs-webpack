require('./styles.styl')

import React from 'react'
import {render} from 'react-dom'
import AmpRouter from 'ampersand-router'
import HomePage from './home-page'
import OtherPage from './other-page'

const Router = AmpRouter.extend({
  routes: {
    '': 'home',
    'other': 'other'
  },

  home: function () {
    render(<HomePage />, document.getElementById('root'))
  },

  other: function () {
    render(<OtherPage />, document.getElementById('root'))
  }
})

let router = new Router()
window.router = router
router.history.start()
