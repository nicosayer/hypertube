import React, { Component } from 'react';
import queryString from 'query-string';

class AuthFacebook extends Component {

	componentDidMount() {
		if (queryString.parse(window.location.search).state === 'facebookOAuth2') {
			fetch('/oauth/facebook/', {
				method: 'POST',
				headers: {'Content-Type': 'application/json'},
				body: JSON.stringify({
					code: queryString.parse(window.location.search).code
				})
			})
			.then(res => res.json())
			.then(res => console.log(res));
		}
	}

	clicked() {
		const client_id = '165360170705100';
		const redirect_uri = 'https://localhost:3000/'
		const state = 'facebookOAuth2';
		const scope = 'public_profile,email';
		window.location.href = 'https://www.facebook.com/v2.12/dialog/oauth?client_id=' + client_id + '&redirect_uri=' + redirect_uri + '&state=' + state + '&scope=' + scope;
	}

	render() {
		return (
			<span onClick={this.clicked}>Login with Facebook</span>
		);
	}
}

export default AuthFacebook;
