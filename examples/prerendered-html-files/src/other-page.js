import React from 'react'

class OtherPage extends React.Component {
  // quick and dirty internal nav handler
  onClick (e) {
    e.preventDefault()
    window.router.history.navigate('/')
  }
  render () {
    return (
      <div className='container'>
        <header role='banner'>
          <h1>Other page</h1>
        </header>
        <a href='/' onClick={this.onClick}>go to /</a>
      </div>
    )
  }
}

export default OtherPage
