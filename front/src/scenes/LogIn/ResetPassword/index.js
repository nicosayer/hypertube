import React from 'react';
import { Link } from 'react-router-dom';
import {NotificationManager} from 'react-notifications';

import { fetchWrap } from '../../../services/fetchWrap'

import Input from '../../../components/Input'
import Tooltip from '../../../components/Tooltip/';

import 'react-notifications/lib/notifications.css';

const errors = require('../../../errors.json');

class ResetPassword extends React.Component {

	constructor(props) {
		super(props)
		this.state = {
			login: '',
			loading: false,
			error: {}
		}
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
			this.setState({ loading: true })
			fetchWrap('/login/resetPassword', {
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
				NotificationManager.success('Email sent!!', 'Reset', 5000, () => {})
				this.props.history.push('/login')
			})
			.catch((error) => {
				this.setState({
					error,
					loading: false
				})
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
		return (
			<div>
				<div className='formBox'>
					<span className='lignBottom fontBig block'>Reset Password</span>
					<form onSubmit={this.handleFormSubmit} >
						<Input
							type='text'
							name='login'
							placeholder='Login or email'
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
								<Tooltip text={errors.resetPassword.login} visible={true} />
								:
								null
							}
						<br />
						{
							this.state.loading ?
							<h2 className='loading'><i className="fas fa-spinner"></i></h2>
							:
							<div className='block fontRight'>
								<div>
									<input type='submit' value='Send email'/>
								</div>
							</div>
						}
					</form>
					<div className='lignTop block fontSmall'>
						<Link to='/'>Login to your account</Link>
					</div>
				</div>
			</div>
		)
	}
}

export default ResetPassword;
