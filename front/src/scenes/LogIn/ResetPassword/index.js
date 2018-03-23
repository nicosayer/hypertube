import React from 'react';
import { Link } from 'react-router-dom';
import {NotificationManager} from 'react-notifications';

import { fetchWrap } from '../../../services/fetchWrap'
import Input from '../../../components/Input'
import Error from '../../../components/Error'

import 'react-notifications/lib/notifications.css';

class ResetPassword extends React.Component {

	constructor(props) {
		super(props)
		this.state = {
			login: '',
			error: {},
			status: false
		}
		this.handleFormSubmit = this.handleFormSubmit.bind(this);
		this.handleInputChange = this.handleInputChange.bind(this);
	}

	handleFormSubmit(event) {
		event.preventDefault();
		var error = {}
		if (this.state.login.length === 0)
		error.login = ["Login field can't be empty"]
		if (Object.keys(this.state.error).length === 0) {
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
			.then(data => {NotificationManager.success("Email sent!!", 'Reset', 5000, () => {})})
			.catch((error) => {
				console.log(error)
			});
		}
		else {
			this.setState({ error });
		}
	}

	handleInputChange(state, value) {
		this.setState({ [state]: value });
	}

	render() {
		return (
			<div>
				<Link to='/'>Back...</Link>
				<form onSubmit={this.handleFormSubmit} >
					<Input
						type="text"
						name="login"
						placeholder="Login"
						required
						onChange={this.handleInputChange}
						/>
					<br />
					<input type='submit' value="Reset"/>
				</form>
				<Error error={this.state.error} />
			</div>
		)
	}
}

export default ResetPassword;
