require('./styles.styl');

import React from 'react';
import {render} from 'react-dom';
import AmpRouter from 'ampersand-router';
import HomePage from './home-page';
import OtherPage from './other-page';

const Router = AmpRouter.extend({
  routes: {
    '': 'home',
    'other': 'other'
  },

  home: function () {
    render(<HomePage/>, document.body);
  },

  other: function () {
    render(<OtherPage/>, document.body);
  }
});

let router = new Router();
window.router = router;
router.history.start();
