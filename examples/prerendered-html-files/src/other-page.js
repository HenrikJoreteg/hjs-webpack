var React = require('react')

module.exports = React.createClass({
  displayName: 'OtherPage',
  // quick and dirty internal nav handler
  onClick: function (e) {
    e.preventDefault()
    window.router.history.navigate('/')
  },
  render: function () {
    return (
      <div className='container'>
        <header role='banner'>
          <h1>Other page</h1>
        </header>
        <a href='/' onClick={this.onClick}>go to /</a>
      </div>
    )
  }
})
