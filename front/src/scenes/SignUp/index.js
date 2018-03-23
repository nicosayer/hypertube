import React, { Component } from 'react';
import { Redirect, Link } from 'react-router-dom';
import { connect } from 'react-redux'
import { NotificationManager, NotificationContainer} from 'react-notifications';

import { logMe } from '../../actions/me'
import { fetchWrap } from '../../services/fetchWrap'
import Input from '../../components/Input'
import Error from '../../components/Error'

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
			error: {}
		}
		this.handleInputValidation = this.handleInputValidation.bind(this);
		this.handleFormSubmit = this.handleFormSubmit.bind(this);
		this.handleFormSubmit = this.handleFormSubmit.bind(this);
		this.handleInputChange = this.handleInputChange.bind(this);
	}

	handleFormSubmit(event) {
		event.preventDefault();
		var error = {}
		if (!this.state.login) {
			error.login = ['Login field can\'t be empty']
		}
		if (!this.state.password) {
			error.password = ['Password field can\'t be empty']
		}
		if (!this.state.firstName) {
			error.firstName = ['Firstname field can\'t be empty']
		}
		if (!this.state.lastName) {
			error.lastName = ['Lastname field can\'t be empty']
		}
		if (!this.state.email) {
			error.email = ['Email field can\'t be empty']
		}
		if ((Object.keys(this.state.error).length === 0 && Object.keys(error).length === 0)) {
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
			.then((payload) => {
				console.log(payload)
				NotificationManager.success('Sign up successfull, now let\'s stream!!', 'Signed Up!', 5000, () => {});
				this.props.dispatch(logMe(payload))
			})
			.catch(error => {
				if (error)
				this.setState({ error })
			})
		}
		else {
			error = Object.assign(error, this.state.error);
			this.setState({ error })
		}
	}

	handleInputChange(state, value) {
		this.setState({
			[state]: value
		})
	}

	handleInputValidation(name, error) {
		var tmp = [];
		for (var err in error) {
			switch(err) {
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
		error = this.state.error;
		if (tmp[0]) {
			error[name] = tmp;
		}
		else {
			delete error[name];
		}
		this.setState({error});
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
						className={this.state.error.login ? 'invalidInput' : null}
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
						className={this.state.error.firstName ? 'invalidInput' : null}
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
						className={this.state.error.lastName ? 'invalidInput' : null}
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
						className={this.state.error.email ? 'invalidInput' : null}
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
						className={this.state.error.password ? 'invalidInput' : null}
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
				<Error error={this.state.error} />
				<NotificationContainer/>
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

export default connect(mapStateToProps)(SignIn)
