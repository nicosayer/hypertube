import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux'

import Auth42 from './OAuth/42'
import AuthFacebook from './OAuth/Facebook'
import AuthGoogle from './OAuth/Google'

import Input from '../../../components/Input'
import Tooltip from '../../../components/Tooltip/';

import { changeLanguage, logMe } from '../../../actions/me'
import { fetchWrap } from '../../../services/fetchWrap'

const errors = require('../../../errors.json');
const language = require('./language.json');

class LogIn extends Component {

	constructor(props) {
		super(props)
		this.state = {
			login: '',
			password: '',
			error: {}
		}
		this.handleFormSubmit = this.handleFormSubmit.bind(this);
		this.handleInputChange = this.handleInputChange.bind(this);
		this.handleInputValidation = this.handleInputValidation.bind(this);
	}

	handleFormSubmit(event) {
		if (event) {
			event.preventDefault()
		}
		var error = this.state.error;
		if (!this.state.login) {
			error.login = 'default';
		}
		if (!this.state.password) {
			error.password = 'default';
		}
		if (!Object.keys(error).length) {
			fetchWrap('/connect/login', {
				method: 'POST',
				credentials: 'include',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					login: this.state.login,
					password: this.state.password
				})
			})
			.then(payload => {
				this.props.dispatch(logMe(payload));
			})
			.catch(error => {
				if (error) {
					this.setState({ error });
				}
			})
		}
		else {
			this.setState({ error })
		}
	}

	handleInputChange(state, value) {
		this.setState({ [state]: value });
	}

	handleInputValidation(name, error) {
		var tmp = this.state.error;
		delete tmp[name];
		this.setState({ error: tmp });
	}

	render() {

		return (
			<div>
			<div className='formBox'>
				<span className='lignBottom fontBig block'>{language.title[this.props.me.language]}</span>
				<form className='fontLeft' onSubmit={this.handleFormSubmit}>
					<div className='fontGrey block fontSmall'>
						<label htmlFor='login'>{language.loginInputLabel[this.props.me.language]}</label>
					</div>
					<Input
						id='login'
						type='text'
						name='login'
						validation={{
							handleValidation: this.handleInputValidation,
							validateOnChange: true
						}}
						maxLen={50}
						onChange={this.handleInputChange}
						/>
					{
						this.state.error.hasOwnProperty('login') ?
						<Tooltip text={errors.login.login[this.state.error.login]} visible={true} />
						:
						null
					}
						<div className='fontGrey block fontSmall'>
							<label htmlFor='password'>{language.passwordInputLabel[this.props.me.language]}</label>
						</div>
					<Input
						id='password'
						type='password'
						name='password'
						validation={{
							handleValidation: this.handleInputValidation,
							validateOnChange: true
						}}
						maxLen={50}
						onChange={this.handleInputChange}
						/>
					{
						this.state.error.hasOwnProperty('password') ?
						<Tooltip text={errors.login.password[this.state.error.password]} visible={true} />
						:
						null
					}
					<br />
					<div className='block fontXSmall fontCenter'>
						<Link to='/reset'>{language.resetPasswordLink[this.props.me.language]}</Link>
					</div>
					<div className='block fontRight'>
						<div className='inline'>
							<input className='spaceTop' type='submit' value={language.submitInput[this.props.me.language]}/>
						</div>
					</div>
				</form>
				<Auth42 />
				<AuthFacebook />
				<AuthGoogle />
				<div className='lignTop block fontSmall'>
					<Link to='/signup'>{language.signUpLink[this.props.me.language]}</Link>
				</div>
			</div>
			<div className='spaceTop halfTransparent'>
				<span className={this.props.me.language === 'en' ? 'pointer' : 'fontGrey pointer'} onClick={this.props.me.language !== 'en' ? () => (this.props.dispatch(changeLanguage('en'))) : null}>English</span>
				<span className='fontGrey spaceLeft spaceRight'>|</span>
				<span className={this.props.me.language === 'fr' ? 'pointer' : 'fontGrey pointer'} onClick={this.props.me.language !== 'fr' ? () => (this.props.dispatch(changeLanguage('fr'))) : null}>Français</span>
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

export default connect(mapStateToProps)(LogIn)
