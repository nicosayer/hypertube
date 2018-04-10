import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux'
import {NotificationManager} from 'react-notifications';

import { changeLanguage } from '../../../../actions/me';
import { fetchWrap } from '../../../../services/fetchWrap'

import Input from '../../../../components/Input'
import Tooltip from '../../../../components/Tooltip/';

import 'react-notifications/lib/notifications.css';

const errors = require('../../../../errors.json');
const language = require('./language.json');

class ResetPassword extends React.Component {

	constructor(props) {
		super(props)
		this.state = {
			login: '',
			loading: false,
			error: {}
		};
		this.handleFormSubmit = this.handleFormSubmit.bind(this);
		this.handleInputChange = this.handleInputChange.bind(this);
		this.handleInputValidation = this.handleInputValidation.bind(this);
	}

	handleFormSubmit(event) {
		if (event) {
			event.preventDefault();
		}
		var error = this.state.error;
		if (!this.state.login) {
			error.login = 'default';
		}
		if (!Object.keys(error).length) {
			this.setState({ loading: true }, () => {
				console.log(this.state.loading)
				fetchWrap('/connect/login/resetPassword', {
					method: 'POST',
					credentials: 'include',
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify({
						login: this.state.login
					})
				})
				.then(data => {
					NotificationManager.success('Email sent')
					this.props.history.push('/login')
				})
				.catch(error => {
					console.log(error)
					this.setState({
						error: error,
						loading: false
					})
				});
			});
		}
		else {
			this.setState({ error });
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
		console.log(this.state.error);
		return (
			<div>
				<div className='formBox'>
					<span className='lignBottom fontBig block'>{language.title[this.props.me.language]}</span>
					<form className='fontLeft' onSubmit={this.handleFormSubmit} >
						<div className='fontGrey block fontSmall'>
							<label htmlFor='login'>{language.loginInputLabel[this.props.me.language]}</label>
						</div>
						<Input
							id='login'
							type='text'
							name='login'
							trimOnBlur
							validation={{
								handleValidation: this.handleInputValidation,
								validateOnChange: true
							}}
							maxLen={50}
							onChange={this.handleInputChange}
							/>
						{
							this.state.error.hasOwnProperty('login') ?
							<Tooltip text={errors.resetPassword.login[this.state.error.login]} visible={true} />
							:
							null
						}
						<br />
						{
							this.state.loading ?
							<div className='fontRight'>
								<div className='inline button'>
									<div className='loading'>
										<span><i className='fas fa-spinner'></i></span>
									</div>
								</div>
							</div>
							:
							<div className='fontRight'>
								<div className='inline'>
									<input type='submit' value={language.submitInput[this.props.me.language]}/>
								</div>
							</div>
						}
					</form>
					<div className='lignTop block fontSmall'>
						<Link to='/'>{language.logInLink[this.props.me.language]}</Link>
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
	const { me } = state.handleMe
	return ({
		me
	})
}

export default connect(mapStateToProps)(ResetPassword)
