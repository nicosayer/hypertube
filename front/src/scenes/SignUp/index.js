import React, { Component } from 'react';
import { Redirect, Link } from 'react-router-dom';
import { NotificationManager, NotificationContainer} from 'react-notifications';

import { fetchWrap } from '../../services/fetchWrap'
import Input from '../../components/Input'
import Erreur from '../../components/Erreur'

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
			errors: {}
		}
		this.handleFormSubmit = this.handleFormSubmit.bind(this)
		this.handleFormSubmit = this.handleFormSubmit.bind(this)
		this.handleInputChange = this.handleInputChange.bind(this)
	}

	handleFormSubmit(event) {
		console.log(this.state.errors)
		event.preventDefault();
		var errors = {}
		if (this.state.login.length === 0)
		errors.login = ['Login field can\'t be empty']
		if (this.state.password.length === 0)
		errors.password = ['Password field can\'t be empty']
		if (this.state.firstName.length === 0)
		errors.firstName = ['Firstname field can\'t be empty']
		if (this.state.lastName.length === 0) {
			errors.lastName = ['Lastname field can\'t be empty']
		}
		if (this.state.email.length === 0)
		errors.email = ['Email field can\'t be empty']
		if ((Object.keys(this.state.errors).length === 0 && Object.keys(errors).length === 0)) {
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
			.catch(errors => {
				if (errors)
				this.setState({
					errors
				})
			})
		}
		else if (Object.keys(this.state.errors).length === 0 || this.state.status) {
			this.setState({ errors })
		}
	}

	handleInputChange(state, value) {
		this.setState({
			[state]: value
		})
	}

	handleInputError = (name, errors) => {
		var tmp = [];
		for (var error in errors) {
			console.log(error, errors[error])
			switch(error) {
				case 'minLen':
				tmp.push(name + ' Trop court');
				break;
				case 'maxLen':
				tmp.push(name + ' Trop long');
				break;
				case 'format':
				tmp.push(name + ' Mauvais format');
				break;
			}
		}
		this.setState({
			errors: {
				...this.state.errors,
				[name]: tmp
			}
		})
	}

	render() {
		if (this.state.isSignedIn) {
			return <Redirect to='/login' />
		}
		return (
			<div>
				<Link to='/'>You already have an account ?</Link>
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
							handleValidation: this.handleInputError
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
							handleValidation: this.handleInputError
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
							handleValidation: this.handleInputError
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
							handleValidation: this.handleInputError
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
							handleValidation: this.handleInputError
						}}
						maxLen={50}
						onChange={this.handleInputChange}
						/>
					<br />
					<input type='submit' value='Signup'/>
				</form>
				<Erreur errors={this.state.errors} />
				<NotificationContainer/>
			</div>
		)
	}
}

export default SignIn
