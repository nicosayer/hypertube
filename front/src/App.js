import React, { Component } from 'react'
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import { Provider, connect } from 'react-redux'
import {NotificationContainer} from 'react-notifications';

import Home from './scenes/Home/'
import LogIn from './scenes/Connect/LogIn'
import SignUp from './scenes/Connect/SignUp'
import ResetPassword from './scenes/Connect/LogIn/ResetPassword'

import './style.css'
import 'react-notifications/lib/notifications.css';

class App extends Component {

	render() {
		return (
			<Provider store={this.props.store}>
				<BrowserRouter>
					<div>
						<NotificationContainer/>
						<Switch>
							{
								this.props.isAuthenticated ?
								[
									<Route key='home' component={Home} />
								]
								:
								[
									<Route exact path='/signup' key='signup' component={SignUp} />,
									<Route exact path='/reset' key='reset' component={ResetPassword} />,
									<Route key='login' component={LogIn} />
								]
							}
						</Switch>
					</div>
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
