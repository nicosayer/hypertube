import React, { Component } from 'react';
import { connect } from 'react-redux'
import {NotificationManager} from 'react-notifications';

import Logout from './../LogOut';
import Input from '../../../components/Input';
import Tooltip from '../../../components/Tooltip/';

import { fetchWrap } from '../../../services/fetchWrap'

import './style.css'
import 'react-notifications/lib/notifications.css';

const errors = require('../../../errors.json');

class Profile extends Component {

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
		this.handlePasswordChangeSubmit = this.handlePasswordChangeSubmit.bind(this);
	}

	componentDidMount() {
		fetchWrap('/home/profile/getUserInfos', {
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
		if (!Object.keys(this.state.error).length) {
			fetchWrap('/home/profile/changeInfos', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				credentials: 'include',
				body: JSON.stringify({
					login: this.state.login,
					firstName: this.state.firstName,
					lastName: this.state.lastName,
					email: this.state.email
				})
			})
			.then(payload => {
				console.log(payload)
				this.setState({
					login: payload.login,
					firstName: payload.firstName,
					lastName: payload.lastName,
					email: payload.email,
				})
				NotificationManager.success('Information Saved');
			})
			.catch(error => {
				console.log(error)
				this.setState({
					login: error.user.login,
					firstName: error.user.firstName,
					lastName: error.user.lastName,
					email: error.user.email,
				})
				NotificationManager.warning('Some informations are invalid');
			})
		}
	}

	handlePasswordChangeSubmit(event) {
		event.preventDefault();
		var error = this.state.error;

		if (!this.state.oldPassword || !this.state.newPassword) {
			error.password = 'default';
		}

		if (!Object.keys(error).length) {
			fetchWrap('/home/profile/changePassword', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				credentials: 'include',
				body: JSON.stringify({
					oldPassword: this.state.oldPassword,
					newPassword: this.state.newPassword,
				})
			})
			.then((payload) => {
				console.log(payload)
			})
			.catch(error => {
				console.log(error)
				//this.setState({ error })
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
		return (
			<div className='formBox profileBox'>
				<span className='lignBottom fontBig block'>Profile</span>
				<form className='fontLeft lignBottom' onSubmit={this.handleSaveSubmit}>
						<img alt="Profile" className='circle profileImg floatLeft' src='https://d34jodf30bmh8b.cloudfront.net/pictures/5720/5863/profile-1496846605-b0d01e0807dbaa4d93dfc9288e00405f.jpg' />
					<div>
						<span className='fontGrey fontSmall block'>
							Your Photo
						</span>
						<div className='changePhotoButton'>Change photo</div>
					</div>
					<div className='fontGrey block fontSmall floatClear'>
						<label htmlFor='firstName'>First Name</label>
					</div>
					<Input
						id='firstName'
						type='text'
						name='firstName'
						value={this.state.firstName}
						className='capital'
						validation={{
							minLen: 2,
							maxLen: 20,
							format: /^[a-z ]+$/gi,
							emptyIsValid: true,
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
						<label htmlFor='lastName'>Last Name</label>
					</div>
					<Input
						id='lastName'
						type='text'
						name='lastName'
						value={this.state.lastName}
						className='capital'
						validation={{
							minLen: 2,
							maxLen: 20,
							format: /^[a-z ]+$/gi,
							emptyIsValid: true,
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
						<label htmlFor='login'>Login</label>
					</div>
					<Input
						id='login'
						type='text'
						name='login'
						value={this.state.login}
						validation={{
							minLen: 6,
							maxLen: 20,
							format: /^[a-z0-9]+$/gi,
							emptyIsValid: true,
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
						<label htmlFor='email'>Email</label>
					</div>
					<Input
						id='email'
						type='text'
						name='email'
						value={this.state.email}
						validation={{
							minLen:5,
							maxLen: 50,
							format: /^.+@.+\..+$/gi,
							emptyIsValid: true,
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
							<input className='spaceTop' type='submit' value='Save informations'/>
						</div>
					</div>
				</form>
				<form className='fontLeft' onSubmit={this.handlePasswordChangeSubmit}>
					<div className='fontGrey block fontSmall'>
						<label htmlFor='oldPassword'>Old password</label>
					</div>
					<Input
						id='oldPassword'
						type='password'
						name='oldPassword'
						validation={{
							minLen: 6,
							maxLen: 50,
							emptyIsValid: true,
							invalidClass: 'invalidInput',
							handleValidation: this.handleInputValidation,
							validateOnChange: true
						}}
						maxLen={50}
						onChange={this.handleInputChange}
						/>
					{
						this.state.error.hasOwnProperty('oldPassword') ?
						<Tooltip text={errors.signup.password} visible={true} />
						:
						null
					}
					<div className='fontGrey block fontSmall'>
						<label htmlFor='newPassword'>New password</label>
					</div>
					<Input
						id='newPassword'
						type='password'
						name='newPassword'
						validation={{
							minLen: 6,
							maxLen: 50,
							emptyIsValid: true,
							invalidClass: 'invalidInput',
							handleValidation: this.handleInputValidation,
							validateOnChange: true
						}}
						maxLen={50}
						onChange={this.handleInputChange}
						/>
					{
						this.state.error.hasOwnProperty('newPassword') ?
						<Tooltip text={errors.signup.password} visible={true} />
						:
						null
					}
					<div className='block fontRight'>
						<div>
							<input className='spaceTop' type='submit' value='Change my password'/>
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

export default connect(mapStateToProps)(Profile)
