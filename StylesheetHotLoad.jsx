import autoprefixer from 'autoprefixer-core';
import postcss from 'postcss';
import React from 'react';
import {Router, Route, Link, Navigation, TransitionHook} from 'react-router';
import stilr from 'stilr';

function getStilrCSSObj() {
  return {
    stilrCSS: postcss(autoprefixer()).process(stilr.render()).css
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
