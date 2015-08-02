import React from 'react';
import {Navigation, TransitionHook} from 'react-router';

function getStilrCSSObj() {
  if (process.env.NODE_ENV !== 'production') {
    const autoprefixer = require('autoprefixer-core');
    const postcss = require('postcss');
    const stilr = require('stilr');
    return {
      stilrCSS: postcss(autoprefixer()).process(stilr.render()).css
    };
  }

  return {
    stilrCSS: "This shouldn't show up in production!"
  };
}

const StylesheetHotLoad = React.createClass({
  displayName: 'StylesheetHotLoad',
  mixins: [Navigation, TransitionHook],
  getInitialState() {
    if (process.env.NODE_ENV !== 'production') {
      return {
        stilrCSS: ''
      };
    }
  },
  routerWillLeave() {
    if (process.env.NODE_ENV !== 'production') {
      // TODO: I couldn't figure out how to get the stilr CSS object after the
      // transition is done, so I'm doing a hacky setTimeout here
      setTimeout(() => {
        this.setState(getStilrCSSObj());
      }, 50);
    }
  },
  componentDidMount() {
    if (process.env.NODE_ENV !== 'production') {
      this.setState(getStilrCSSObj());
    }
  },
  render() {
    return (
      <div>
        <style>
          {process.env.NODE_ENV !== 'production' ? this.state.stilrCSS : ''}
        </style>
        {this.props.children}
      </div>
    );
  }
});

module.exports = StylesheetHotLoad;
