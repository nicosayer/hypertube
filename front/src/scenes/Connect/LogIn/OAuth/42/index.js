import React, { Component } from 'react';
import queryString from 'query-string';
import { connect } from 'react-redux'
import { withRouter } from 'react-router';

import { logMe } from '../../../../../actions/me'

import { fetchWrap } from '../../../../../services/fetchWrap'

const language = require('./language.json');

class Auth42 extends Component {

	constructor(props) {
		super(props)
		if (queryString.parse(window.location.search).state === '42OAuth2') {
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
		if (queryString.parse(window.location.search).state === '42OAuth2') {

			fetchWrap('/connect/login/oauth/42/', {
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
		window.location.href = 'https://api.intra.42.fr/oauth/authorize?client_id=' + clientId + '&redirect_uri=' + redirectUri + '&scope=' + scope + '&state=' + state + '&response_type=' + response_type;
	}

	render() {
		return (
			<div className='wFull'>
				{
					this.state.loading ?
					<div className='button wFull spaceTop'><div className='loading'><span><i className="fas fa-spinner"></i></span></div></div>
					:
					<div className='button wFull spaceTop'  onClick={this.clicked}><span><i className="fas fa-graduation-cap spaceRight"></i>{language.buttonText[this.props.me.language]}</span></div>
				}
			</div>
		);
	}
}

function mapStateToProps(state) {
	const { isAuthenticated, me } = state.handleMe
	return ({
		isAuthenticated,
		me
	})
}

export default withRouter(connect(mapStateToProps)(Auth42))
