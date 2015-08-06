import React from 'react';
import {Navigation, TransitionHook} from 'react-router';

function getStilrCSSObj() {
  const autoprefixer = require('autoprefixer-core');
  const postcss = require('postcss');
  const stilr = require('stilr');
  return {
    stilrCSS: postcss(autoprefixer()).process(stilr.render()).css
  };
}

const StylesheetHotLoad = React.createClass({
  displayName: 'StylesheetHotLoad',
  mixins: [Navigation, TransitionHook],
  getInitialState() {
    return {
      stilrCSS: ''
    }
  },
  routerWillLeave() {
    // TODO: I couldn't figure out how to get the stilr CSS object after the
    // transition is done, so I'm doing a hacky setTimeout here
    setTimeout(() => {
      this.setState(getStilrCSSObj());
    }, 50);
  },
  componentDidMount() {
    this.setState(getStilrCSSObj());
  },
  render() {
    return (
      <div>
        <style>
          this.state.stilrCSS
        </style>
        {this.props.children}
      </div>
    );
  }
});

module.exports = StylesheetHotLoad;
