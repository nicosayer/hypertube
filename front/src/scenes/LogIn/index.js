import React, { Component } from 'react';
import { Redirect, Link } from 'react-router-dom';
import { connect } from 'react-redux'
import { logMe} from '../../actions/me'
import { fetchWrap } from '../../services/fetchWrap'
import Input from '../../components/input'
import Erreur from '../../components/erreur'

import Auth42 from './OAuth/42'
import AuthFacebook from './OAuth/Facebook'
import AuthGoogle from './OAuth/Google'

class LogIn extends Component {

	constructor(props) {
		super(props)
		this.state = {
			login: '',
			password: '',
			error: {},
			status: false
		}
	}

	handleFormSubmit = event => {
		event.preventDefault()
		var error = {}
		if (this.state.login.length === 0)
		error.login = ["Login field can't be empty"]
		if (this.state.password.length === 0)
		error.password = ["Password field can't be empty"]
		if ((Object.keys(this.state.error).length === 0 && Object.keys(error).length === 0) || this.state.status) {
			fetchWrap('/login', {
				method: 'POST',
				credentials: 'include',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					login: this.state.login,
					password: this.state.password
				})
			})
			.then(payload => {
				this.props.dispatch(logMe(payload))
			})
			.catch(error => {
				if (error)
				this.setState({ error })
			})
		}
		else if (Object.keys(this.state.error).length === 0 || this.state.status) {
			this.setState({ error })
		}
	}

	handleInputChange(state, value) {
		this.setState({
			[state]: value
		})
	}

	handleError = error => {
		var tmp;
		if (typeof error === "string") {
			tmp = this.state.error
			delete tmp[error]
		}
		else {
			tmp = Object.assign({}, this.state.error, error)
		}
		this.setState({
			error: tmp,
			status: false
		})
	}

	render() {
		if (this.props.isAuthenticated) {
			return <Redirect to="/" />
		}

		return (
			<div>
				<form onSubmit={this.handleFormSubmit} >
					<Input
						type="text"
						name="login"
						placeholder="Login"
						validation={[6]}
						error={this.handleError}
						onChange={this.handleInputChange}
						/><br />
					<Input
						type="password"
						name="password"
						placeholder="Password"
						error={this.handleError}
						validation={[6,"[0-9]","[a-zA-Z]"]}
						onChange={this.handleInputChange}
						/><br />
					<button type="submit">Log in</button>
				</form>
				<Link to='/reset'>Forgot your password?</Link>
				<Erreur error={this.state.error} />
				<Auth42 /><br/>
				<AuthFacebook /><br/>
				<AuthGoogle /><br/>
			</div>
		)
	}
}

function mapStateToProps(state) {
	const { isAuthenticated } = state.handleMe
	return ({
		isAuthenticated
	})
}

export default connect(mapStateToProps)(LogIn)
