import React, { Component } from 'react';
import queryString from 'query-string';
import { connect } from 'react-redux'
import { withRouter } from 'react-router';

import { logMe } from '../../../../actions/me'

import { fetchWrap } from '../../../../services/fetchWrap'

class AuthFacebook extends Component {

	constructor(props) {
		super(props)
		
		this.clicked = this.clicked.bind(this);
	}

	componentDidMount() {
		if (queryString.parse(window.location.search).state === 'facebookOAuth2') {
			fetchWrap('/login/oauth/facebook/', {
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
		if (!this.props.isAuthenticated && nextProps.isAuthenticated && queryString.parse(window.location.search).state === 'facebookOAuth2'){
			this.props.history.push('/')		
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

function mapStateToProps(state) {
	const { isAuthenticated } = state.handleMe
	return ({
		isAuthenticated
	})
}

export default withRouter(connect(mapStateToProps)(AuthFacebook))
