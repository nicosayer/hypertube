import React, { Component } from 'react';
import { connect } from 'react-redux'
import { NotificationManager } from 'react-notifications';

import Input from '../../../components/Input';
import Tooltip from '../../../components/Tooltip/';
import { updateProfileInfos } from '../../../actions/me'

import { fetchWrap } from '../../../services/fetchWrap'

import './style.css'
import 'react-notifications/lib/notifications.css';

const language = require('./language.json');
const errors = require('../../../errors.json');

class Profile extends Component {

	constructor(props) {
		super(props)
		this.state = {
			firstName: '',
			lastName: '',
			login: '',
			email: '',
			oldPassword: '',
			newPassword: '',
			error: {}
		}
		this.handleInputChange = this.handleInputChange.bind(this);
		this.handleSaveSubmit = this.handleSaveSubmit.bind(this);
		this.handlePictureSubmit = this.handlePictureSubmit.bind(this);
		this.handleInputChange = this.handleInputChange.bind(this);
		this.handleInputValidation = this.handleInputValidation.bind(this);
		this.handlePasswordChangeSubmit = this.handlePasswordChangeSubmit.bind(this);
	}

	componentDidMount() {
		this.setState({...this.props.me});
	}

	handleSaveSubmit(event) {
		event.preventDefault();
		const error = this.state.error;
		if (!error.login && !error.email && !error.firstName && !error.lastName) {
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
				this.setState({
					login: payload.login,
					firstName: payload.firstName,
					lastName: payload.lastName,
					email: payload.email,
				})
				this.props.dispatch(updateProfileInfos(payload));
				NotificationManager.success('Informations saved');
			})
			.catch(error => {
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
		this.setState({
			oldPassword: "",
			newPassword: ""
		});
		var error = this.state.error;

		if (!this.state.oldPassword || !this.state.newPassword) {
			error.password = 'default';
		}

		if (!error.oldPassword && !error.newPassword) {
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
			.then(() => {
				console.log(1)
				NotificationManager.success('Password changed');
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

	handlePictureSubmit(event) {
		const that = this;
		const picture = event.target.files[0];
		if (picture) {
			var error = {};

			if (picture.size > 10000000) {
				error.picture = 'size';
			}
			if (picture.type !== 'image/png' && picture.type !== 'image/jpeg') {
				error.picture = 'type';
			}
			const url = window.URL || window.webkitURL;
			this.imageExists(url.createObjectURL(picture), exists => {
				if (exists) {
					var formData = new FormData();
					formData.append('picture', picture);
					if (!error.picture) {
						fetchWrap('/home/profile/changePicture', {
							method: 'POST',
							credentials: 'include',
							body: formData
						})
						.then((payload) => {
							that.picture.src = 'http://localhost:3001/pictures/' + this.props.me._id + '.png?' + new Date().getTime();
							this.setState({ error })
						})
						.catch(error => {
							this.setState({ error })
						})
					}
					else {
						this.setState({ error })
					}
				}
				else {
					error.picture = 'type';
					this.setState({ error })
				}
			})
		}
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

	imageExists(url, callback) {
		var img = new Image();
		img.onload = function() { callback(true); };
		img.onerror = function() { callback(false); };
		img.src = url;
	}

	render() {
		console.log(this.props.me);
		return (
			<div className='main'>
			<div className='profileBox formBox'>
				<span className='lignBottom fontBig block'>{language.title[this.props.me.language]}</span>
				<div className='fontLeft block'>
					<img
						alt='Profile'
						className='circle profileImg floatLeft'
						ref={img => this.picture = img }
						src={'http://localhost:3001/pictures/' + this.props.me._id + '.png'}
						onError={() => this.picture.src = 'http://localhost:3001/pictures/default.png'}
						/>
					<form encType='multipart/form-data' onChange={this.handlePictureSubmit}>
						<span className='fontGrey fontSmall block'>
							{language.photoLabel[this.props.me.language]}
						</span>
						<div className='inline changePhotoButton'>
							<label htmlFor='upload'><span className='pointer'>{language.changePhotoButton[this.props.me.language]}</span></label>
						</div>
						<input id='upload' type='file' name='upload' accept='.png,.jpeg,.jpg'/>
						{
							this.state.error.hasOwnProperty('picture') ?
							<Tooltip text={errors.profile.picture[this.state.error.picture]} visible={true} />
							:
							null
						}
					</form>
				</div>
				<form className='fontLeft lignBottom' onSubmit={this.handleSaveSubmit}>
					<div className='fontGrey block fontSmall floatClear'>
						<label htmlFor='firstName'>{language.firstNameInputLabel[this.props.me.language]}</label>
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
						<label htmlFor='lastName'>{language.lastNameInputLabel[this.props.me.language]}</label>
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
						<label htmlFor='login'>{language.loginInputLabel[this.props.me.language]}</label>
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
						<label htmlFor='email'>{language.emailInputLabel[this.props.me.language]}</label>
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
					<div className='fontRight'>
						<div className='inline'>
							<input className='spaceTop' type='submit' value={language.changeInformationsSubmit[this.props.me.language]}/>
						</div>
					</div>
				</form>
				<form className='fontLeft' onSubmit={this.handlePasswordChangeSubmit}>
					<div className='fontGrey block fontSmall'>
						<label htmlFor='oldPassword'>{language.oldPasswordInputLabel[this.props.me.language]}</label>
					</div>
					<Input
						id='oldPassword'
						type='password'
						name='oldPassword'
						value={this.state.oldPassword}
						validation={{
							invalidClass: 'invalidInput',
							handleValidation: this.handleInputValidation,
						}}
						maxLen={50}
						onChange={this.handleInputChange}
						/>
					{
						this.state.error.hasOwnProperty('oldPassword') ?
						<Tooltip text={errors.profile.oldPassword} visible={true} />
						:
						null
					}
					<div className='fontGrey block fontSmall'>
						<label htmlFor='newPassword'>{language.newPasswordInputLabel[this.props.me.language]}</label>
					</div>
					<Input
						id='newPassword'
						type='password'
						name='newPassword'
						value={this.state.newPassword}
						validation={{
							minLen: 6,
							maxLen: 50,
							format: /^.*[0-9]+.*$/,
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
						<Tooltip text={errors.profile.newPassword} visible={true} />
						:
						null
					}
					<div className='fontRight'>
						<div className='inline'>
							<input className='spaceTop' type='submit' value={language.changePasswordSubmit[this.props.me.language]}/>
						</div>
					</div>
				</form>
			</div>
				</div>
		)
	}
}

function mapStateToProps(state) {
	const { isAuthenticated, me } = state.handleMe
	return ({
		isAuthenticated,
		me
	})
}

export default connect(mapStateToProps)(Profile)
