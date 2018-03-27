import React, { Component } from 'react';
import { connect } from 'react-redux'
import { NotificationManager } from 'react-notifications';

import Logout from './../LogOut';
import Input from '../../../components/Input';
import Tooltip from '../../../components/Tooltip/';
import { updateProfileInfos } from '../../../actions/me'

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
		const profilePicUrl = 'http://localhost:3001/pictures/' + this.props.me._id + '.png';
		this.imageExists(profilePicUrl, exists => {
			if(exists) {
				this.picture.src = profilePicUrl;
			}
			else {
				this.picture.src = 'http://localhost:3001/pictures/default.png'
			}
		});
	}

	componentDidMount() {
		this.setState({...this.props.me});
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
				this.setState({
					login: payload.login,
					firstName: payload.firstName,
					lastName: payload.lastName,
					email: payload.email,
				})
				this.props.dispatch(updateProfileInfos(payload));
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
		this.setState({
					oldPassword: "",
					newPassword: ""
				});
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
			.then(() => {
				console.log(1)
				
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
			var error = this.state.error;

			if (picture.size > 10000000) {
				error.picture = 'default';
			}
			if (picture.type !== 'image/png' && picture.type !== 'image/jpeg') {
				error.picture = 'default';
			}
			const url = window.URL || window.webkitURL;
			this.imageExists(url.createObjectURL(picture), exists => {
				if (exists) {
					var formData = new FormData();
					formData.append('picture', picture);
					if (!Object.keys(error).length) {
						fetchWrap('/home/profile/changePicture', {
							method: 'POST',
							credentials: 'include',
							body: formData
						})
						.then((payload) => {
							that.picture.src = 'http://localhost:3001/pictures/' + this.props.me._id + '.png?' + new Date().getTime();
						})
						.catch(error => {
							console.log(error)
						})
					}
					else {
						this.setState({ error })
					}
				}
				else {
					error.picture = 'default';
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

	urlExists(url)
	{
		var http = new XMLHttpRequest();
		http.open('HEAD', url, false);
		http.send();
		return http.status !== 404;
	}

	render() {
		return (
			<div className='formBox profileBox'>
				<span className='lignBottom fontBig block'>Profile</span>
				<div className='fontLeft block'>
					<img
						alt='Profile'
						className='circle profileImg floatLeft'
						ref={img => this.picture = img }
						onError={() => this.picture.src = 'http://localhost:3001/pictures/default.png'}
						/>
					<form encType='multipart/form-data' onChange={this.handlePictureSubmit}>
						<span className='fontGrey fontSmall block'>
							Your Photo
						</span>
						<div className='changePhotoButton'>
							<label htmlFor='upload'><span className='pointer'>Change photo</span></label>
						</div>
						<input id='upload' type='file' name='upload' accept='.png,.jpeg,.jpg'/>
					</form>
				</div>
				<form className='fontLeft lignBottom' onSubmit={this.handleSaveSubmit}>
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
				{
					this.props.me.password ?
					<form className='fontLeft' onSubmit={this.handlePasswordChangeSubmit}>
						<div className='fontGrey block fontSmall'>
							<label htmlFor='oldPassword'>Old password</label>
						</div>
						<Input
							id='oldPassword'
							type='password'
							name='oldPassword'
							value={this.state.oldPassword}
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
							<Tooltip text={errors.profile.oldPassword[this.state.error.oldPassword]} visible={true} />
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
							value={this.state.newPassword}
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
					:
					null
				}
				<Logout />
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
