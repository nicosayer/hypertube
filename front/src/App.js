import React, { Component } from 'react'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import { Provider } from 'react-redux'
import Home from './scenes/Home'
import LogIn from './scenes/LogIn'

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  render() {
    return (
      <Provider store={this.props.store}>
        <Router>
          <main>
            <Route exact path="/" component={Home} />
            <Route path="/connexion" component={LogIn} />
          </main>
        </Router>
      </Provider>
    )
  }
}

export default App
