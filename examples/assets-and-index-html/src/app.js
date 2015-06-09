require('./styles.styl')
var React = require('react')
var andyetImgSrc = require('./andyet.svg')

var Hello = React.createClass({
  displayName: 'Hello',
  render: function () {
    return (
      <div className='container'>
        <header role='banner'>
          <h1>Assets + HTML Example</h1>
        </header>
        <p>Generates, base HTML, CSS, and JS on build</p>
        <img src={andyetImgSrc} style={{backgroundColor: 'black'}} />
      </div>
    )
  }
})

React.render(<Hello/>, document.body)
