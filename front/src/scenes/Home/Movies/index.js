import React, { Component } from 'react';
import { connect } from 'react-redux';

import Logout from './../LogOut';

import { fetchWrap } from '../../../services/fetchWrap'

class Movies extends Component {

	constructor(props) {
		super(props)
		this.state = {
			video: false,
			num: 100
		}
	}

	componentDidMount() {
		fetchWrap('https://yts.am/api/v2/movie_details.json?movie_id=' + this.props.match.params.id + '&with_images=true&with_cast=true')
		.then(data => {
			console.log(data);
			fetchWrap('/video/search', {
				method: 'POST',
				credentials: 'include',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					magnet: 'magnet:?xt=urn:btih:' + data.data.movie.torrents[0].hash + '&dn=' + encodeURIComponent(data.data.movie.title_long) + '&tr=udp%3A%2F%2Ftracker.leechers-paradise.org%3A6969&tr=udp%3A%2F%2Fzer0day.ch%3A1337&tr=udp%3A%2F%2Fopen.demonii.com%3A1337&tr=udp%3A%2F%2Ftracker.coppersurfer.tk%3A6969&tr=udp%3A%2F%2Fexodus.desync.com%3A6969'
				})
			})
			.then(num => {
				this.setState({ video: true, num: num.num })
			})
			.catch(error => {
				if (error) {
					this.setState({ error })
				}
			})
		})
		.catch(error => {
			console.log(error);
		})
	}

	render() {


		return(
			<div  >
				<br/>
				{this.state.video && <video id="videoPlayer" controls autoPlay>
				  <source preload='metadata' src={"http://localhost:3001/video/"+this.state.num} type="video/mp4" />
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

export default connect(mapStateToProps)(Movies)
