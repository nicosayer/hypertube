import React, { Component } from 'react';
import queryString from 'query-string';

class AuthGoogle extends Component {

	componentDidMount() {
		if (queryString.parse(window.location.hash).state === 'googleOAuth2') {
			fetch('/oauth/google/', {
				method: 'POST',
				headers: {'Content-Type': 'application/json'},
				body: JSON.stringify({
					access_token: queryString.parse(window.location.hash).access_token
				})
			})
			.then(res => res.json())
			.then(res => console.log(res));
		}
	}

	clicked() {
		const client_id = '414902509468-bhe8pbagi4j8hsa0i7ole5s3h52ng7aj.apps.googleusercontent.com';
		const redirect_uri = 'https://localhost:3000'
		const response_type = 'token'
		const scope = 'https://www.googleapis.com/auth/userinfo.profile';
		const state = 'googleOAuth2'
		window.location.href = 'https://accounts.google.com/o/oauth2/v2/auth?client_id=' + client_id + '&redirect_uri=' + redirect_uri + '&response_type=' + response_type + '&scope=' + scope + '&state=' + state;
	}

	render() {
		return (
			<span onClick={this.clicked}>Login with Google</span>
		);
	}
}

export default AuthGoogle;
