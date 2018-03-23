import React, { Component } from 'react';
import queryString from 'query-string';
import { connect } from 'react-redux'
import { withRouter } from 'react-router';

import { logMe } from '../../../../actions/me'

import { fetchWrap } from '../../../../services/fetchWrap'

class Auth42 extends Component {

	constructor(props) {
		super(props)
		
		this.clicked = this.clicked.bind(this);
	}

	componentDidMount() {
		if (queryString.parse(window.location.search).state === '42OAuth2') {

			fetchWrap('/login/oauth/42/', {
				method: 'POST',
				credentials: 'include',
				headers: {'Content-Type': 'application/json'},
				body: JSON.stringify({
					code: queryString.parse(window.location.search).code
				})
			})
			.then(payload => {
				console.log(payload)
				this.props.dispatch(logMe(payload))
			})
			.catch(() => {})
		}
	}

	componentWillReceiveProps(nextProps) {
		if (!this.props.isAuthenticated && nextProps.isAuthenticated && queryString.parse(window.location.search).state === '42OAuth2'){
			console.log(this.props.history)
			this.props.history.push('/')		
		}
	}

	clicked() {
		const clientId = '1f7d365bde5231d5fe79b9928e2f8f3f0fe25b416a8ce0da242229888d103af3';
		const redirectUri = 'https://localhost:3000/'
		const scope = 'public';
		const state = '42OAuth2';
		const response_type = 'code';
		const url = 'https://api.intra.42.fr/oauth/authorize?client_id=' + clientId + '&redirect_uri=' + redirectUri + '&scope=' + scope + '&state=' + state + '&response_type=' + response_type;

		window.open(url, '_blank', 'toolbar=yes, scrollbars=yes, resizable=yes, top=100, left=500, width=720, height=628');
		
		// window.location.href = 'https://api.intra.42.fr/oauth/authorize?client_id=' + clientId + '&redirect_uri=' + redirectUri + '&scope=' + scope + '&state=' + state + '&response_type=' + response_type;
	
	}

	render() {
		return (
			<span onClick={this.clicked}>Login with 42</span>
		);
	}
}

function mapStateToProps(state) {
	const { isAuthenticated } = state.handleMe
	return ({
		isAuthenticated
	})
}

export default withRouter(connect(mapStateToProps)(Auth42))
