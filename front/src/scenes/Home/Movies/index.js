import React, { Component } from 'react';
import { connect } from 'react-redux';

import Logout from './../LogOut';

import { fetchWrap } from '../../../services/fetchWrap'

class Movies extends Component {

	constructor(props) {
		super(props)
		this.state = {
			video: false
		}
	}

	componentDidMount() {
		fetchWrap('/video/search', {
			method: 'POST',
			credentials: 'include',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				magnet: this.props.location.state.magnet
			})
		})
		.then(payload => {
			this.setState({ video: true })
		})
		.catch(error => {
			if (error) {
				this.setState({ error })
			}
		})
	}

	render() {


		return(
			<div  >
				<br/>
				{this.state.video && <video id="videoPlayer" controls>
				  <source autoplay preload='metadata' src="http://localhost:3001/video" type="video/mp4" />
				</video>}
				<Logout />
			</div>
		);
	}
}

function mapStateToProps(state) {
	const { isAuthenticated } = state.handleMe;
	return ({
		isAuthenticated
	});
}

export default connect(mapStateToProps)(Video)
