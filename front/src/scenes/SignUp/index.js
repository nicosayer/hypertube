import React, { Component } from 'react';
import { Redirect, Link } from 'react-router-dom';
import { connect } from 'react-redux';

import { logMe } from '../../actions/me';

import { fetchWrap } from '../../services/fetchWrap';
import Input from '../../components/Input';
import Tooltip from '../../components/Tooltip/';

const errors = require('../../errors.json');

class SignUp extends Component {

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
		var error = this.state.error;
		if (!this.state.login) {
			error.login = 'default';
		}
		if (!this.state.password) {
			error.password = 'default';
		}
		if (!this.state.firstName) {
			error.firstName = 'default';
		}
		if (!this.state.lastName) {
			error.lastName = 'default';
		}
		if (!this.state.email) {
			error.email = 'default';
		}
		if (!Object.keys(error).length) {
			console.log(1)
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
				this.props.dispatch(logMe(payload))
			})
			.catch(error => {
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
			if (tmp.hasOwnProperty(name)) {
				delete tmp[name];
				this.setState({ error: tmp });
			}
		}
		else if (!tmp.hasOwnProperty(name)) {
			tmp[name] = 'default';
			this.setState({ error: tmp });
		}
	}

	render() {
		if (this.state.isSignedIn) {
			return <Redirect to='/login' />
		}
		return (
			<div className='formBox'>
				<span className='lignBottom fontBig block'>Sign up</span>
				<form className='fontLeft' onSubmit={this.handleFormSubmit}>
					<div className='fontGrey block fontSmall'>
						<label for='login'>Login</label>
					</div>
					<Input
						id='login'
						type='text'
						name='login'
						className={this.state.error.hasOwnProperty('login') ? 'invalidInput' : null}
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
					{
						this.state.error.hasOwnProperty('login') ?
						<Tooltip text={errors.signup.login[this.state.error.login]} visible={true} />
						:
						null
					}
					<div className='fontGrey block fontSmall'>
						<label for='firstName'>First Name</label>
					</div>
					<Input
						id='firstName'
						type='text'
						name='firstName'
						className={this.state.error.hasOwnProperty('firstName') ? 'invalidInput' : null}
						validation={{
							minLen: 2,
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
					{
						this.state.error.hasOwnProperty('firstName') ?
						<Tooltip text={errors.signup.firstName} visible={true} />
						:
						null
					}
					<div className='fontGrey block fontSmall'>
						<label for='lastName' className='block'>Last Name</label>
					</div>
					<Input
						id='lastName'
						type='text'
						name='lastName'
						className={this.state.error.hasOwnProperty('lastName') ? 'invalidInput' : null}
						validation={{
							minLen: 2,
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
					{
						this.state.error.hasOwnProperty('lastName') ?
						<Tooltip text={errors.signup.lastName} visible={true}/>
						:
						null
					}
					<div className='fontGrey block fontSmall'>
						<label for='email'>Email</label>
					</div>
					<Input
						id='email'
						type='text'
						name='email'
						className={this.state.error.hasOwnProperty('email') ? 'invalidInput' : null}
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
					{
						this.state.error.hasOwnProperty('email') ?
						<Tooltip text={errors.signup.email[this.state.error.email]} visible={true} />
						:
						null
					}
					<div className='fontGrey block fontSmall'>
						<label for='password'>Password</label>
					</div>
					<Input
						id='password'
						type='password'
						name='password'
						className={this.state.error.hasOwnProperty('password') ? 'invalidInput' : null}
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
					{
						this.state.error.hasOwnProperty('password') ?
						<Tooltip text={errors.signup.password} visible={true}/>
						:
						null
					}
					<div className='block fontRight'>
						<div>
							<input type='submit' value='Sign up'/>
						</div>
					</div>
				</form>
				<div className='lignTop block fontSmall'>
					<Link to={{pathname: '/'}}>You already have an account ?</Link>
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

export default connect(mapStateToProps)(SignUp)
