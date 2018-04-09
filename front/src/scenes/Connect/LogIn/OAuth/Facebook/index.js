import React, { Component } from 'react';
import queryString from 'query-string';
import { connect } from 'react-redux'
import { withRouter } from 'react-router';

import { logMe } from '../../../../../actions/me'

import { fetchWrap } from '../../../../../services/fetchWrap'

const language = require('./language.json');

class AuthFacebook extends Component {

	constructor(props) {
		super(props)
		if (queryString.parse(window.location.search).state === 'facebookOAuth2') {
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
		if (queryString.parse(window.location.search).state === 'facebookOAuth2') {
			fetchWrap('/connect/login/oauth/facebook/', {
				method: 'POST',
				credentials: 'include',
				headers: {'Content-Type': 'application/json'},
				body: JSON.stringify({
					code: queryString.parse(window.location.search).code
				})
			})
			.then(payload => {
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
			<div className='wFull'>
				{
					this.state.loading ?
					<div className='button wFull spaceTop'><div className='loading'><span><i className="fas fa-spinner"></i></span></div></div>
					:
					<div className='button wFull spaceTop'  onClick={this.clicked}><span><i className="fab fa-facebook spaceRight"></i>{language.buttonText[this.props.language]}</span></div>
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

export default withRouter(connect(mapStateToProps)(AuthFacebook))
