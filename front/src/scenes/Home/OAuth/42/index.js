import React, { Component } from 'react';
import queryString from 'query-string';

class Auth42 extends Component {

	componentDidMount() {
		if (queryString.parse(window.location.search).state === '42OAuth2') {
			fetch('/oauth/42/', {
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
		const clientId = '1f7d365bde5231d5fe79b9928e2f8f3f0fe25b416a8ce0da242229888d103af3';
		const redirectUri = 'https://localhost:3000/'
		const scope = 'public';
		const state = '42OAuth2';
		const response_type = 'code';
		window.location.href = 'https://api.intra.42.fr/oauth/authorize?client_id=' + clientId + '&redirect_uri=' + redirectUri + '&scope=' + scope + '&state=' + state + '&response_type=' + response_type;
	}

	render() {
		return (
			<span onClick={this.clicked}>Login with 42</span>
		);
	}
}

export default Auth42;
