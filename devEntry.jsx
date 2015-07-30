import App from '../../src/App';

import autoprefixer from 'autoprefixer-core';
import postcss from 'postcss';
import React from 'react';
import stilr from 'stilr';

const stylesheetElem = document.createElement('style');
document.head.appendChild(stylesheetElem);

function resetStylesheet() {
  stylesheetElem.textContent =
    postcss(autoprefixer()).process(stilr.render()).css;
}

class StylesheetReloadingApp extends React.Component {
  componentDidMount() {
    resetStylesheet();
  }
  componentDidUpdate() {
    resetStylesheet();
  }
  render() {
    return <App />;
  }
}

React.render(<StylesheetReloadingApp />, document.body);
