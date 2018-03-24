import React, { Component } from 'react';
import { Redirect, Link } from 'react-router-dom';
import { connect } from 'react-redux';

import { logMe } from '../../actions/me';

import { fetchWrap } from '../../services/fetchWrap';
import Input from '../../components/Input';
import Tooltip from '../../components/Tooltip/';

const errors = require('../../errors.json');

class SignIn extends Component {

	constructor(props) {
		super(props)
		this.state = {
			login: '',
			password: '',
			firstName: '',
			lastName: '',
			email: '',
			error: []
		}
		this.handleInputValidation = this.handleInputValidation.bind(this);
		this.handleFormSubmit = this.handleFormSubmit.bind(this);
		this.handleFormSubmit = this.handleFormSubmit.bind(this);
		this.handleInputChange = this.handleInputChange.bind(this);
	}

	handleFormSubmit(event) {
		event.preventDefault();
		var error = this.state.error;
		if (!this.state.login && !error.includes('login')) {
			error.push('login');
		}
		if (!this.state.password && !error.includes('password')) {
			error.push('password');
		}
		if (!this.state.firstName && !error.includes('firstName')) {
			error.push('firstName');
		}
		if (!this.state.lastName && !error.includes('lastName')) {
			error.push('lastName');
		}
		if (!this.state.email && !error.includes('email')) {
			error.push('email');
		}
		if (!error.length) {
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
		this.setState({
			[state]: value
		})
	}

	handleInputValidation(name, error) {
		var tmp = this.state.error;
		if (!Object.keys(error).length) {
			tmp.splice(tmp.indexOf(name), 1);
			this.setState({ error: tmp });
		}
		else if (!tmp.includes(name)) {
			tmp.push(name);
			this.setState({ error: tmp });
		}
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
						className={this.state.error.includes('login') ? 'invalidInput' : null}
						validation={{
							minLen: 6,
							maxLen: 20,
							format: /^[a-z0-9]+$/gi,
							invalidClass: 'invalidInput',
							handleValidation: this.handleInputValidation,
							validateOnChange: true
						}}
						trimOnBlur
						maxLen={20}
						onChange={this.handleInputChange}
						/>
					<Tooltip text={errors.signup.login} visible={this.state.error.includes('login') ? true : false}/>
					<br />
					<Input
						type='text'
						name='firstName'
						placeholder='First name'
						className={this.state.error.includes('firstName') ? 'invalidInput' : null}
						validation={{
							minLen: 1,
							maxLen: 20,
							format: /^[a-z ]+$/gi,
							invalidClass: 'invalidInput',
							handleValidation: this.handleInputValidation,
							validateOnChange: true
						}}
						maxLen={20}
						trimOnBlur
						onChange={this.handleInputChange}
						/>
					<Tooltip text={errors.signup.firstName} visible={this.state.error.includes('firstName') ? true : false}/>
					<br />
						<Input
							type='text'
							name='lastName'
							placeholder='Last name'
							className={this.state.error.includes('lastName') ? 'invalidInput' : null}
							validation={{
								minLen: 1,
								maxLen: 20,
								format: /^[a-z ]+$/gi,
								invalidClass: 'invalidInput',
								handleValidation: this.handleInputValidation,
								validateOnChange: true
							}}
							maxLen={20}
							trimOnBlur
							onChange={this.handleInputChange}
							/>
						<Tooltip text={errors.signup.lastName} visible={this.state.error.includes('lastName') ? true : false}/>
					<br />
					<Input
						type='text'
						name='email'
						placeholder='Email'
						className={this.state.error.includes('email') ? 'invalidInput' : null}
						validation={{
							minLen: 0,
							maxLen: 50,
							format: /^.+@.+\..+$/gi,
							invalidClass: 'invalidInput',
							handleValidation: this.handleInputValidation,
							validateOnChange: true
						}}
						maxLen={50}
						trimOnBlur
						onChange={this.handleInputChange}
						/>
					<Tooltip text={errors.signup.email} visible={this.state.error.includes('email') ? true : false}/>
					<br />
					<Input
						type='password'
						name='password'
						placeholder='Password'
						className={this.state.error.includes('password') ? 'invalidInput' : null}
						validation={{
							minLen: 6,
							maxLen: 50,
							invalidClass: 'invalidInput',
							handleValidation: this.handleInputValidation,
							validateOnChange: true
						}}
						maxLen={50}
						onChange={this.handleInputChange}
						/>
					<Tooltip text={errors.signup.password} visible={this.state.error.includes('password') ? true : false}/>
					<br />
					<input type='submit' value='Signup'/>
				</form>
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
