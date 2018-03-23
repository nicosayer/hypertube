import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux'

import { logMe } from '../../actions/me'
import { fetchWrap } from '../../services/fetchWrap'
import Input from '../../components/Input'
import Error from '../../components/Error'

import Auth42 from './OAuth/42'
import AuthFacebook from './OAuth/Facebook'
import AuthGoogle from './OAuth/Google'

class LogIn extends Component {

	constructor(props) {
		super(props)
		this.state = {
			login: '',
			password: '',
			error: {}
		}
		this.handleFormSubmit = this.handleFormSubmit.bind(this)
		this.handleInputChange = this.handleInputChange.bind(this)
		this.handleFormSubmit = this.handleFormSubmit.bind(this)
	}

	handleFormSubmit(event) {
		event.preventDefault()
		var error = {}
		if (!this.state.login) {
			error.login = ['Login field can\'t be empty']
		}
		if (!this.state.password) {
			error.password = ['Password field can\'t be empty']
		}
		if (Object.keys(error).length === 0) {
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
				//console.log(payload)
				this.props.dispatch(logMe(payload))
			})
			.catch(error => {
				if (error)
					this.setState({ error })
			})
		}
		else {
			this.setState({ error })
		}
	}

	handleInputChange(state, value) {
		this.setState({ [state]: value })
	}

	render() {

		return (
			<div className="formBox marginTop">
				<span className='fontBig block'>Log In</span>
				<Link to='/signup'>Create an account</Link>
				<form onSubmit={this.handleFormSubmit}>
					<Input
						type="text"
						name="login"
						placeholder="Login"
						onChange={this.handleInputChange}
						/>
					<br />
					<Input
						type="password"
						name="password"
						placeholder="Password"
						onChange={this.handleInputChange}
						/>
					<br />
					<Link to='/reset'>Forgot your password?</Link>
					<br />
					<input type='submit' value="Log in"/>
				</form>
				<Error error={this.state.error} />
				<Auth42 />
				<br/>
				<AuthFacebook />
				<br/>
				<AuthGoogle />
				<br/>
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
