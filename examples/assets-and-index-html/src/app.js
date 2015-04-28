var styles = require('./styles.styl')
var React = require('react')

console.log(document.head)

var Hello = React.createClass({
  render: function () {
    return (
      <div className='container'>
        <header role='banner'>
          <h1>Assets + HTML Example</h1>
        </header>
        <p>Generates, base HTML, CSS, and JS on build</p>
      </div>
    )
  }
})

React.render(<Hello/>, document.body)
