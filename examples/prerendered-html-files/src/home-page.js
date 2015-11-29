import React from 'react'

class HomePage extends React.Component {
  // quick and dirty internal nav handler
  onClick (e) {
    e.preventDefault()
    window.router.history.navigate('/other')
  }
  render () {
    return (
      <div className='container'>
        <header role='banner'>
          <h1>Pre-rendering example</h1>
        </header>
        <a href='/other' onClick={this.onClick}>go to /other</a>
        <p>Note that navigating between these two pages also works <em><strong>with JS off</strong></em></p>
        <p>During dev things are handled by catchall/generated/live-reloaded dev-server</p>
        <p>During <strong>build</strong> homepage and layout are pre-rendered.</p>
      </div>
    )
  }
}

export default HomePage
