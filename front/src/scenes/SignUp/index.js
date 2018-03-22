import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { NotificationManager, NotificationContainer} from 'react-notifications';

import { fetchWrap } from '../../services/fetchWrap'
import Input from '../../components/input'
import Erreur from '../../components/erreur'

import 'react-notifications/lib/notifications.css';

class SignIn extends Component {

	constructor(props) {
		super(props)
		this.state = {
			login: '',
			password: '',
			firstName: '',
			lastName: '',
			email: '',
			isSignedIn: false,
			error: {},
			status: false
		}
		this.handleFormSubmit = this.handleFormSubmit.bind(this)
		this.handleInputChange = this.handleInputChange.bind(this)
	}

	handleFormSubmit(e) {
		var error = {}
		if (this.state.login.length === 0)
		error.login = ['Login field can\'t be empty']
		if (this.state.password.length === 0)
		error.password = ['Password field can\'t be empty']
		if (this.state.firstName.length === 0)
		error.firstName = ['Firstname field can\'t be empty']
		if (this.state.lastName.length === 0)
		error.lastName = ['Lastname field can\'t be empty']
		if (this.state.email.length === 0)
		error.email = ['Email field can\'t be empty']
		e.preventDefault();
		if ((Object.keys(this.state.error).length === 0 && Object.keys(error).length === 0) || this.state.status) {
			fetchWrap('/signup', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				credentials: 'include',
				body: JSON.stringify({
					login: this.state.login,
					firstName: this.state.firstName,
					lastName: this.state.lastName,
					email: this.state.email,
					password: this.state.password
				})
			})
			.then(() => {
				NotificationManager.success('Sign up successfull, now let\'s stream!!', 'Signed Up!', 5000, () => {});
				this.setState({
					isSignedIn: true
				})
			})
			.catch(error => {
				if (error)
				this.setState({ error, status: true })
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

	handleError(error) {
		// var tmp;
		// if (typeof error === 'string')
		// {
		// 	tmp = this.state.error
		// 	delete tmp[error]
		// }
		// else if (this.state.status === true)
		// tmp = Object.assign({}, error)
		// else
		// tmp = Object.assign({}, this.state.error, error)
		// this.setState({
		// 	error: tmp,
		// 	status: false
		// })
	}

	render() {
		if (this.state.isSignedIn) {
			return <Redirect to='/login' />
		}
		return (
			<div>
				<form className='inscription' onSubmit={this.handleFormSubmit}>
					<Input
						type='text'
						name='login'
						placeholder='Login'
						required
						validation={{
							minLen: 6,
							maxLen: 20,
							format: /^[a-z0-9]+$/gi,
							invalidClass: 'invalidInput',
							error: this.handleError
						}}
						trimOnBlur
						maxLen={20}
						onChange={this.handleInputChange}
						/>
					<br />
					<Input
						type='text'
						name='firstName'
						placeholder='Firstname'
						required
						validation={{
							minLen: 2,
							maxLen: 20,
							format: /^[a-z -]+$/gi,
							invalidClass: 'invalidInput',
							error: this.handleError
						}}
						maxLen={20}
						trimOnBlur
						onChange={this.handleInputChange}
						/>
					<br />
					<Input
						type='text'
						name='lastName'
						placeholder='Lastname'
						required
						validation={{
							minLen: 2,
							maxLen: 20,
							format: /^[a-z -]+$/gi,
							invalidClass: 'invalidInput',
							error: this.handleError
						}}
						maxLen={20}
						trimOnBlur
						onChange={this.handleInputChange}
						/>
					<br />
					<Input
						type='text'
						name='email'
						placeholder='Email'
						required
						validation={{
							minLen: 6,
							maxLen: 50,
							format: /^.+@.+\..+$/gi,
							invalidClass: 'invalidInput',
							error: this.handleError
						}}
						maxLen={50}
						trimOnBlur
						onChange={this.handleInputChange}
						/>
					<br />
					<Input
						type='password'
						name='password'
						placeholder='Password'
						required
						validation={{
							minLen: 6,
							maxLen: 50,
							invalidClass: 'invalidInput',
							error: this.handleError
						}}
						maxLen={50}
						onChange={this.handleInputChange}
						/>
					<br />
					<button type='submit'>Sign Up</button>
				</form>
				<Erreur error={this.state.error} />
				<NotificationContainer/>
			</div>
		)
	}
}

export default SignIn
