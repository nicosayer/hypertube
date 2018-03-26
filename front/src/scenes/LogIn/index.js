import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux'

import { logMe } from '../../actions/me'
import { fetchWrap } from '../../services/fetchWrap'

import Auth42 from './OAuth/42'
import AuthFacebook from './OAuth/Facebook'
import AuthGoogle from './OAuth/Google'

import Input from '../../components/Input'
import Tooltip from '../../components/Tooltip/';

const errors = require('../../errors.json');

class LogIn extends Component {

	constructor(props) {
		super(props)
		this.state = {
			login: '',
			password: '',
			error: []
		}
		this.handleFormSubmit = this.handleFormSubmit.bind(this);
		this.handleInputChange = this.handleInputChange.bind(this);
		this.handleInputValidation = this.handleInputValidation.bind(this);
	}

	handleFormSubmit(event) {
		if (event) {
			event.preventDefault()
		}
		var error = this.state.error;
		if (!this.state.login && !error.includes('login')) {
			error.push('login');
		}
		if (!this.state.password && !error.includes('password')) {
			error.push('password');
		}
		if (!error.length) {
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
				console.log(error);
				if (error) {
					this.setState({ error })
				}
			})
		}
		else {
			this.setState({ error })
		}
	}

	handleInputChange(state, value) {
		this.setState({ [state]: value })
	}

	handleInputValidation(name, error) {
		var tmp = this.state.error;
		tmp.splice(tmp.indexOf(name), 1);
		this.setState({ error: tmp });
	}

	render() {

		return (
			<div className='formBox'>
				<span className='lignBottom fontBig block'>Log In</span>
				<form onSubmit={this.handleFormSubmit}>
					<Input
						type='text'
						name='login'
						placeholder='Login or email'
						validation={{
							handleValidation: this.handleInputValidation,
							validateOnChange: true
						}}
						maxLen={50}
						onChange={this.handleInputChange}
						/>
					<Tooltip text={errors.login.login} visible={this.state.error.includes('login') ? true : false}/>
					<br />
					<Input
						type='password'
						name='password'
						placeholder='Password'
						validation={{
							handleValidation: this.handleInputValidation,
							validateOnChange: true
						}}
						maxLen={50}
						onChange={this.handleInputChange}
						/>
					<Tooltip text={errors.login.password} visible={this.state.error.includes('password') ? true : false}/>
					<br />
					<div className='block fontSmall'>
						<Link to='/reset'>Forgot your password?</Link>
					</div>
					<input className='spaceTop' type='submit' value='Log in'/>
				</form>
				<div className='spaceTop block'>
				<Auth42 />
				</div>
				<div className='spaceTop block'>
				<AuthFacebook />
				</div>
				<div className='spaceTop block'>
				<AuthGoogle />
				</div>
				<div className='lignTop block fontSmall'>
					<Link to='/signup'>You want to create an account ?</Link>
				</div>
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
