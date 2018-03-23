import React, { Component } from 'react';
import queryString from 'query-string';
import { connect } from 'react-redux'

import { logMe } from '../../../../actions/me'

import { fetchWrap } from '../../../../services/fetchWrap'

class AuthGoogle extends Component {

	componentDidMount() {
		if (queryString.parse(window.location.hash).state === 'googleOAuth2') {
			fetchWrap('/login/oauth/google/', {
				method: 'POST',
				headers: {'Content-Type': 'application/json'},
				body: JSON.stringify({
					access_token: queryString.parse(window.location.hash).access_token
				})
			})
			.then(payload => {
				console.log(payload)
				this.props.dispatch(logMe(payload))
			})
			.catch(() => {})
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
			<span onClick={this.clicked}>Login with Google</span>
		);
	}
}

function mapStateToProps(state) {
	const { isAuthenticated } = state.handleMe
	return ({
		isAuthenticated
	})
}

export default connect(mapStateToProps)(AuthGoogle)
