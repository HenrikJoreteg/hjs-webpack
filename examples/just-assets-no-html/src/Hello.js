import React from 'react'

class Hello extends React.Component {
  render () {
    return (
      <div className='container'>
        <header role='banner'>
          <h1>Assets Only Example</h1>
        </header>
        <p>During dev, we just need <em>something</em> to include the script tag:</p>
        <p><code>&lt;script src=&quot;/app.js&quot;&gt;&lt;/script&gt;</code></p>
        <p>Building only generates CSS and JS.</p>
      </div>
    )
  }
}

export default Hello
