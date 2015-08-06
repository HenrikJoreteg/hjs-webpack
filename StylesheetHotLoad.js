'use strict';

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };

var _React = require('react');

var _React2 = _interopRequireWildcard(_React);

var _Navigation$TransitionHook = require('react-router');

function getStilrCSSObj() {
  var autoprefixer = require('autoprefixer-core');
  var postcss = require('postcss');
  var stilr = require('stilr');
  return {
    stilrCSS: postcss(autoprefixer()).process(stilr.render()).css
  };
}

var StylesheetHotLoad = _React2['default'].createClass({
  displayName: 'StylesheetHotLoad',
  mixins: [_Navigation$TransitionHook.Navigation, _Navigation$TransitionHook.TransitionHook],
  getInitialState: function getInitialState() {
    return {
      stilrCSS: ''
    };
  },
  routerWillLeave: function routerWillLeave() {
    var _this = this;

    // TODO: I couldn't figure out how to get the stilr CSS object after the
    // transition is done, so I'm doing a hacky setTimeout here
    setTimeout(function () {
      _this.setState(getStilrCSSObj());
    }, 50);
  },
  componentDidMount: function componentDidMount() {
    this.setState(getStilrCSSObj());
  },
  render: function render() {
    return _React2['default'].createElement(
      'div',
      null,
      _React2['default'].createElement(
        'style',
        null,
        'this.state.stilrCSS'
      ),
      this.props.children
    );
  }
});

module.exports = StylesheetHotLoad;

