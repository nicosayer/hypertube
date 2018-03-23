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
			error: {},
			loading: false,
			error: []
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
		if (!this.state.login && !error.includes('login')) {
			error.push('login');
		}
		if (!error.length) {
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
		tmp.splice(tmp.indexOf(name), 1);
		this.setState({ error: tmp });
	}

	render() {
		return (
			<div>
				<div>
					<Link to='/'>Back...</Link>
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
						<Tooltip text={errors.resetPassword.login} visible={this.state.error.includes('login') ? true : false}/>
						<br />
						<input type='submit' value='Reset'/>
					</form>
				</div>
				{this.state.loading && <h1>Chargement...</h1> }
			</div>


		)
	}
}

export default ResetPassword;
