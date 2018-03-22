import React from 'react';
import { Link } from 'react-router-dom';
import {NotificationManager} from 'react-notifications';

import { fetchWrap } from '../../../services/fetchWrap'
import Input from '../../../components/Input'
import Erreur from '../../../components/Erreur'

import 'react-notifications/lib/notifications.css';

class ResetPassword extends React.Component {

	constructor(props) {
		super(props)
		this.state = {
			login: '',
			errors: {},
			status: false
		}
	}

	sendMail = event => {
		event.preventDefault();
		var errors = {}
		if (this.state.login.length === 0)
		errors.login = ["Login field can't be empty"]
		if ((Object.keys(this.state.errors).length === 0 && Object.keys(errors).length === 0) || this.state.status) {
			fetchWrap('/resetPassword', {
				method: 'POST',
				credentials: 'include',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					login: this.state.login
				})
			})
			.then(res => NotificationManager.success("Email sent!!", 'Reset', 5000, () => {}))
			.catch((errors) => {
				if (errors)
				this.setState({ errors })
			});
		}
		else if (Object.keys(this.state.errors).length === 0 || this.state.status) {
			this.setState({ errors })
		}
	}

	handleInputChange = (state, value) => {
		this.setState({
			[state]: value
		})
	}

	handleError = (errors) => {
		var tmp;
		if (typeof errors === "string")
		{
			tmp = this.state.errors
			delete tmp[errors]
		}
		else
		tmp = Object.assign({}, this.state.errors, errors)
		this.setState({
			errors: tmp, status: false
		})
	}

	render() {
		return (
			<div>
				<Link to='/'>Back...</Link>
				<form onSubmit={(e) => this.sendMail(e)} >
					<Input
						type="text"
						name="login"
						placeholder="Login"
						required
						onChange={this.handleInputChange}
						/>
					<br />
					<button type="submit">Reset my password</button>
				</form>
				<Erreur errors={this.state.errors} />
			</div>
		)
	}
}

export default ResetPassword;
