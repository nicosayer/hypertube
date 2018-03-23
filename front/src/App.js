import React, { Component } from 'react'
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import { Provider, connect } from 'react-redux'

import Home from './scenes/Home'
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
				<BrowserRouter>
					<Switch>
						{
							this.props.isAuthenticated ?
								<Route key='home' component={Home} />
							:
							[
								<Route path='/signup' key='signup' component={SignUp} />,
								<Route path='/reset' key='reset' component={ResetPassword} />,
								<Route key='login' component={LogIn} />
							]
						}
					</Switch>
				</BrowserRouter>
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
