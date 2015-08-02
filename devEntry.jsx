import App from '../../src/App';

import React from 'react';

React.render(<App />, document.body);

if (module.hot) {
  module.hot.accept();
}
