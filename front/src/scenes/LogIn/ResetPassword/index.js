import React from 'react';
import {NotificationManager} from 'react-notifications';

import { fetchWrap } from '../../../services/fetchWrap'
import Input from '../../../components/input'
import Erreur from '../../../components/erreur'

import 'react-notifications/lib/notifications.css';

class ResetPassword extends React.Component {

	constructor(props) {
		super(props)
		this.state = {
			login: '',
			error: {},
			status: false
		}
	}

	sendMail = event => {
		event.preventDefault();
		var error = {}
		if (this.state.login.length === 0)
		error.login = ["Login field can't be empty"]
		if ((Object.keys(this.state.error).length === 0 && Object.keys(error).length === 0) || this.state.status) {
			fetchWrap('/reset', {
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
			.catch((error) => {
				if (error)
				this.setState({ error })
			});
		}
		else if (Object.keys(this.state.error).length === 0 || this.state.status) {
			this.setState({ error })
		}
	}

	handleInputChange = (state, value) => {
		this.setState({
			[state]: value
		})
	}

	handleError = (error) => {
		var tmp;
		if (typeof error === "string")
		{
			tmp = this.state.error
			delete tmp[error]
		}
		else
		tmp = Object.assign({}, this.state.error, error)
		this.setState({
			error: tmp, status: false
		})
	}

	render() {
		return (
			<div className="connexion">
			<form onSubmit={(e) => this.sendMail(e)} >
			<Input type="text" name="login" placeholder="Login" required error={this.handleError} validation={[6]} onChange={this.handleInputChange} /><br />
			<button type="submit">Reset my password</button>
			</form>
			<Erreur error={this.state.error} />
			</div>
		)
	}
}

export default ResetPassword;
