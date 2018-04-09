import React, { Component } from 'react';
import queryString from 'query-string';
import { connect } from 'react-redux'
import { withRouter } from 'react-router';

import { logMe } from '../../../../../actions/me'

import { fetchWrap } from '../../../../../services/fetchWrap'

const language = require('./language.json');

class AuthGoogle extends Component {

	constructor(props) {
		super(props)
		if(queryString.parse(window.location.hash).state === 'googleOAuth2') {
			this.state = {
				loading: true
			};
		}
		else {
			this.state = {
				loading: false
			};
		}
		this.clicked = this.clicked.bind(this);
	}

	componentDidMount() {
		if (queryString.parse(window.location.hash).state === 'googleOAuth2') {
			fetchWrap('/connect/login/oauth/google/', {
				method: 'POST',
				credentials: 'include',
				headers: {'Content-Type': 'application/json'},
				body: JSON.stringify({
					access_token: queryString.parse(window.location.hash).access_token
				})
			})
			.then(payload => {
				this.props.dispatch(logMe(payload))
			})
			.catch(() => {})
		}
	}

	componentWillReceiveProps(nextProps) {
		if (!this.props.isAuthenticated && nextProps.isAuthenticated && queryString.parse(window.location.hash).state === 'googleOAuth2') {
			this.props.history.push('/')
		}
	}

	clicked() {
		const client_id = '414902509468-bhe8pbagi4j8hsa0i7ole5s3h52ng7aj.apps.googleusercontent.com';
		const redirect_uri = 'https://localhost:3000'
		const response_type = 'token'
		const scope = 'https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email';
		const state = 'googleOAuth2'
		window.location.href = 'https://accounts.google.com/o/oauth2/v2/auth?client_id=' + client_id + '&redirect_uri=' + redirect_uri + '&response_type=' + response_type + '&scope=' + scope + '&state=' + state;
	}

	render() {
		return (
			<div className='wFull'>
				{
					this.state.loading ?
					<div className='button wFull spaceTop'><div className='loading'><span><i className="fas fa-spinner"></i></span></div></div>
					:
					<div className='button wFull spaceTop'  onClick={this.clicked}><span><i className='fab fa-google spaceRight'></i>{language.buttonText[this.props.language]}</span></div>
				}
			</div>
		);
	}
}

function mapStateToProps(state) {
	const { isAuthenticated, language } = state.handleMe
	return ({
		isAuthenticated,
		language
	})
}

export default withRouter(connect(mapStateToProps)(AuthGoogle))
