import React, { Component } from 'react';
import { Redirect, Link } from 'react-router-dom';
import { connect } from 'react-redux'

import { logMe } from '../../actions/me'
import { fetchWrap } from '../../services/fetchWrap'
import Input from '../../components/Input'
import Erreur from '../../components/Erreur'

import Auth42 from './components/OAuth/42'
import AuthFacebook from './components/OAuth/Facebook'
import AuthGoogle from './components/OAuth/Google'

class LogIn extends Component {

	constructor(props) {
		super(props)
		this.state = {
			login: '',
			password: '',
			errors: {},
			status: false
		}
		this.handleFormSubmit = this.handleFormSubmit.bind(this)
		this.handleInputChange = this.handleInputChange.bind(this)
		this.handleFormSubmit = this.handleFormSubmit.bind(this)
	}

	handleFormSubmit(event) {
		event.preventDefault()
		if (Object.keys(this.state.errors).length === 0 || this.state.status) {
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
			.catch(errors => {
				if (errors)
				this.setState({ errors })
			})
		}
	}

	handleInputChange(state, value) {
		this.setState({ [state]: value })
	}

	render() {
		if (this.props.isAuthenticated) {
			return <Redirect to="/" />
		}

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
				<Erreur errors={this.state.errors} />
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
