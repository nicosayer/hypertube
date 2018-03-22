import React, { Component } from 'react'
import { Switch, Route } from 'react-router-dom'
import { Provider, connect } from 'react-redux'

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
				<Switch>
					<Route path="/signup" key='signup' component={SignUp} />
					<Route path="/reset" key='reset' component={ResetPassword} />
					<Route key='default' component={LogIn} />
				</Switch>
			</Provider>
		)
	}
}

function mapStateToProps(state) {
	const { isAuthenticated } = state.handleMe
	return ({
		isAuthenticated
	})
}

export default connect(mapStateToProps)(App)
