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
		this.handleInputValidation = this.handleInputValidation.bind(this);
		this.handleFormSubmit = this.handleFormSubmit.bind(this);
		this.handleFormSubmit = this.handleFormSubmit.bind(this);
		this.handleInputChange = this.handleInputChange.bind(this);
	}

	handleFormSubmit(event) {
		event.preventDefault();
		var errors = {}
		if (!this.state.login) {
			errors.login = ['Login field can\'t be empty']
		}
		if (!this.state.password) {
			errors.password = ['Password field can\'t be empty']
		}
		if (!this.state.firstName) {
			errors.firstName = ['Firstname field can\'t be empty']
		}
		if (!this.state.lastName) {
			errors.lastName = ['Lastname field can\'t be empty']
		}
		if (!this.state.email) {
			errors.email = ['Email field can\'t be empty']
		}
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
				this.setState({ isSignedIn: true })
			})
			.catch(errors => {
				if (errors)
				this.setState({ errors })
			})
		}
		else {
			errors = Object.assign(errors, this.state.errors);
			this.setState({ errors })
		}
	}

	handleInputChange(state, value) {
		this.setState({
			[state]: value
		})
	}

	handleInputValidation(name, errors) {
		var tmp = [];
		for (var error in errors) {
			switch(error) {
				case 'minLen':
				tmp.push(name + ' is too short');
				break;
				case 'maxLen':
				tmp.push(name + ' is too long');
				break;
				case 'format':
				tmp.push(name + ' is in the wrong format');
				break;
				default:
			}
		}
		errors = this.state.errors;
		if (tmp[0]) {
			errors[name] = tmp;
		}
		else {
			delete errors[name];
		}
		this.setState({errors});
	}

	render() {
		if (this.state.isSignedIn) {
			return <Redirect to='/login' />
		}
		return (
			<div className='formBox marginTop'>
				<span className='fontBig block'>Sign up</span>
				<Link to={{pathname: '/'}}>You already have an account ?</Link>
				<form onSubmit={this.handleFormSubmit}>
					<Input
						type='text'
						name='login'
						placeholder='Login'
						required
						className={this.state.errors.login ? 'invalidInput' : null}
						validation={{
							minLen: 6,
							maxLen: 20,
							format: /^[a-z0-9]+$/gi,
							invalidClass: 'invalidInput',
							handleValidation: this.handleInputValidation
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
						className={this.state.errors.firstName ? 'invalidInput' : null}
						validation={{
							minLen: 2,
							maxLen: 20,
							format: /^[a-z -]+$/gi,
							invalidClass: 'invalidInput',
							handleValidation: this.handleInputValidation
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
						className={this.state.errors.lastName ? 'invalidInput' : null}
						validation={{
							minLen: 2,
							maxLen: 20,
							format: /^[a-z -]+$/gi,
							invalidClass: 'invalidInput',
							handleValidation: this.handleInputValidation
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
						className={this.state.errors.email ? 'invalidInput' : null}
						validation={{
							minLen: 0,
							maxLen: 50,
							format: /^.+@.+\..+$/gi,
							invalidClass: 'invalidInput',
							handleValidation: this.handleInputValidation
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
						className={this.state.errors.password ? 'invalidInput' : null}
						validation={{
							minLen: 6,
							maxLen: 50,
							invalidClass: 'invalidInput',
							handleValidation: this.handleInputValidation
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
