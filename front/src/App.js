import React, { Component } from 'react'
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import { Provider, connect } from 'react-redux'
import {NotificationContainer} from 'react-notifications';

import Profile from './scenes/Home/Profile'
import Video from './scenes/Home/Video'
import Search from './scenes/Home/Search'
import Movie from './scenes/Lib/Movie'
import TV from './scenes/Lib/TV'
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
									<Route exact path='/profile' key='profile' component={Profile} />,
									<Route exact path='/search' key='search' component={Search} />,
									<Route key='movie' path='/movie/:id([0-9].*)' component={Movie} />,
									<Route key='tv' path='/tv/:id([0-9].*)' component={TV} />,
									<Route key='video' component={Video} />
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
