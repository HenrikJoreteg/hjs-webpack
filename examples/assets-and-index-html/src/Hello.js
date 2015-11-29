import React from 'react'
const andyetImgSrc = require('./andyet.png')

class Hello extends React.Component {
  render () {
    return (
      <div className='container'>
        <header role='banner'>
          <h1>Assets + HTML Example</h1>
        </header>
        <p>Generates, base HTML, CSS, and JS on build</p>
        <img src={andyetImgSrc} style={{backgroundColor: '#e6eaed'}} />
      </div>
    )
  }
}

export default Hello
