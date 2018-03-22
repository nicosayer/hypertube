import React, { Component } from 'react'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import { Provider } from 'react-redux'

import LogIn from './scenes/LogIn'
import SignUp from './scenes/SignUp'
import ResetPassword from './scenes/LogIn/ResetPassword'

import './style.css'

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
						<Route exact path="/" component={LogIn} />
						<Route path="/signup" component={SignUp} />
						<Route path="/reset" component={ResetPassword} />
					</main>
				</Router>
			</Provider>
		)
	}
}

export default App
