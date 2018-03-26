import React, { Component } from 'react';
import { connect } from 'react-redux'

import { fetchWrap } from '../../services/fetchWrap'

import Logout from './../LogOut';
import Input from '../../components/Input';
import Tooltip from '../../components/Tooltip/';

const errors = require('../../errors.json');

class Home extends Component {

	constructor(props) {
		super(props)
		this.state = {
			firstName: '',
			lastName: '',
			login: '',
			email: '',
			password: '',
			error: {}
		}
		this.handleInputChange = this.handleInputChange.bind(this);
		this.handleSaveSubmit = this.handleSaveSubmit.bind(this);
		this.handleInputChange = this.handleInputChange.bind(this);
		this.handleInputValidation = this.handleInputValidation.bind(this);
	}

	componentDidMount() {
		fetchWrap('/home/getUserInfos', {
			method: 'GET',
			credentials: 'include'
		})
		.then(data => {
			this.setState({...data});
		})
		.catch(data => {
			console.log(data);
		})
	}

	handleSaveSubmit(event) {
		event.preventDefault();
		var error = this.state.error;
		if (!this.state.login) {
			error.login = 'default';
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
			fetchWrap('/changeInfos', {
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
				})
			})
			.then((payload) => {
				console.log(payload)
			})
			.catch(error => {
				this.setState({ error: {
					login:'default',
					email: 'default'
				} })
			})
		}
		else {
			this.setState({ error })
		}
	}

	handlePasswordChangeSubmit(event) {
		event.preventDefault();
		var error = this.state.error;

		if (!this.state.oldPassword) {
			error.password = 'default';
		}
		if (!this.state.newPassword) {
			error.password = 'default';
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
		console.log(this.state.error)
		return (
			<div className='formBox'>
				<span className='lignBottom fontBig block'>Profile</span>
				<form className='fontLeft' onSubmit={this.handleSaveSubmit}>
					<div className='fontGrey block fontSmall'>
						<label for='firstName'>First Name</label>
					</div>
					<Input
						id='firstName'
						type='text'
						name='firstName'
						placeholder="First Name"
						value={this.state.firstName}
						className={this.state.error.hasOwnProperty('firstName') ? 'invalidInput' : null}
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
					{
						this.state.error.hasOwnProperty('firstName') ?
						<Tooltip text={errors.signup.firstName} visible={true} />
						:
						null
					}
					<div className='fontGrey block fontSmall'>
						<label for='lastName'>Last Name</label>
					</div>
					<Input
						id='lastName'
						type='text'
						name='lastName'
						placeholder="Last name"
						value={this.state.lastName}
						className={this.state.error.hasOwnProperty('lastName') ? 'invalidInput' : null}
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
					{
						this.state.error.hasOwnProperty('lastName') ?
						<Tooltip text={errors.signup.lastName} visible={true}/>
						:
						null
					}
					<div className='fontGrey block fontSmall'>
						<label for='login'>Login</label>
					</div>
					<Input
						id='login'
						type='text'
						name='login'
						placeholder='Login'
						value={this.state.login}
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
						<label for='email'>Email</label>
					</div>
					<Input
						id='email'
						type='text'
						name='email'
						placeholder="Email"
						value={this.state.email}
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
						<div className='block fontRight'>
							<div>
								<input className='spaceTop' type='submit' value='Save'/>
							</div>
						</div>
				</form>
				<form className='fontLeft' onSubmit={this.handlePasswordChangeSubmit}>
					<div className='fontGrey block fontSmall'>
						<label for='oldPassword'>Old password</label>
					</div>
				<Input
					id='oldPassword'
					type='password'
					name='oldPassword'
					className={this.state.error.hasOwnProperty('password') ? 'invalidInput' : null}
					validation={{
						minLen: 6,
						maxLen: 50,
						invalidClass: 'invalidInput',
						validateOnChange: true
					}}
					maxLen={50}
					onChange={this.handleInputChange}
					/>
					<div className='fontGrey block fontSmall'>
						<label for='newPassword'>New password</label>
					</div>
				<Input
					id='newPassword'
					type='password'
					name='newPassword'
					className={this.state.error.hasOwnProperty('password') ? 'invalidInput' : null}
					validation={{
						minLen: 6,
						maxLen: 50,
						invalidClass: 'invalidInput',
						validateOnChange: true
					}}
					maxLen={50}
					onChange={this.handleInputChange}
					/>
				{
					this.state.error.hasOwnProperty('password') ?
					<Tooltip text={errors.signup.password[this.state.error.password]} visible={true}/>
					:
					null
				}
				<div className='block fontRight'>
					<div>
						<input className='spaceTop' type='submit' value='Change'/>
					</div>
				</div>
			</form>
				<Logout />
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

export default connect(mapStateToProps)(Home)
