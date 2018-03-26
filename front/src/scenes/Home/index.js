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
				this.setState({ error })
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

	render() {
		return (
			<div>
				<h1>Change your profile infos</h1>
				First Name :  
				<Input
					type='text'
					name='firstName'
					placeholder={this.state.firstName}
					className={this.state.error.hasOwnProperty('firstName') ? 'invalidInput' : null}
					validation={{
						minLen: 1,
						maxLen: 20,
						format: /^[a-z ]+$/gi,
						invalidClass: 'invalidInput',
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
				<br />
				Last Name : 
				<Input
					type='text'
					name='lastName'
					placeholder={this.state.lastName}
					className={this.state.error.hasOwnProperty('lastName') ? 'invalidInput' : null}
					validation={{
						minLen: 1,
						maxLen: 20,
						format: /^[a-z ]+$/gi,
						invalidClass: 'invalidInput',
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
				<br />
				Login : {this.state.login}
				<Input
					type='text'
					name='login'
					placeholder='Login'
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
				<br />
				Email : 
				<Input
					type='text'
					name='email'
					placeholder={this.state.email}
					validation={{
						minLen: 0,
						maxLen: 50,
						format: /^.+@.+\..+$/gi,
						invalidClass: 'invalidInput',
						validateOnChange: true
					}}
					maxLen={50}
					trimOnBlur
					onChange={this.handleInputChange}
					/>
				<br />
				<button onSubmit={this.handleSaveSubmit}>Save</button>
				{
					this.state.error.hasOwnProperty('email') ?
					<Tooltip text={errors.signup.email[this.state.error.email]} visible={true} />
					:
					null
				}
				<br />
				<br />
				Password : 
				<Input
					type='password'
					name='oldPassword'
					placeholder='Old Password'
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
						<Tooltip text={errors.signup.password} visible={true}/>
						:
						null
					}
				<Input
					type='password'
					name='newPassword'
					placeholder='New Password'
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
				<br />
				<button onSubmit={this.handlePasswordChangeSubmit}>Change Password</button>
				<br />
				<br />
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
