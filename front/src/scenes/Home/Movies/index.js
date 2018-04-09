import React, { Component } from 'react';
import { connect } from 'react-redux';
import videojs from 'video.js'

import 'video.js/dist/video-js.css'

import Logout from '../Menu/LogOut';

import { fetchWrap } from '../../../services/fetchWrap'

import ReactPlayer from 'react-player'

class Movies extends Component {

	constructor(props) {
		super(props)
		this.state = {
			video: false,
			magnet: '',
			time: 0
		}
	}

	componentDidMount() {
		// var vid = document.querySelector( 'video')
		// console.log(vid)
		// var player = videojs(vid, {autoplay: true, controls: true});
		// player.on('timeupdate', (data) => {
		// 	player.seekable();
			//alert(Math.floor(seekable && seekable.length ? seekable.end(0) - seekable.start(0) : 0))
		// })
		/*fetchWrap('https://yts.am/api/v2/movie_details.json?movie_id=' + this.props.match.params.id + '&with_images=true&with_cast=true')
		.then(data => {
			console.log(data);
			const time = Date.now()
			const magnet = 'magnet:' + encodeURIComponent('?') + 'xt=urn:btih:' + data.data.movie.torrents[0].hash + '&dn=' + encodeURIComponent(data.data.movie.title_long) + '&tr=udp%3A%2F%2Ftracker.leechers-paradise.org%3A6969&tr=udp%3A%2F%2Fzer0day.ch%3A1337&tr=udp%3A%2F%2Fopen.demonii.com%3A1337&tr=udp%3A%2F%2Ftracker.coppersurfer.tk%3A6969&tr=udp%3A%2F%2Fexodus.desync.com%3A6969'
			fetchWrap('/video/'+magnet+'/'+time+'first', {credentials: 'include'})
			.then(() => {
				this.setState({ video: true, time: time, magnet: magnet })
			})
			.catch(error => console.log(error))
			
		})
		.catch(error => {
			console.log(error);
		})*/
	}

	render() {

		// const
		// 	sources = [
		// 		{src: 'https://a7fdb298.ngrok.io/output.m3u8', type: 'application/x-mpegURL'}
		// 	],
		// 	config = {},
		// 	tracks = {}
		// ;

		return(
			<div  >
				<br/>
				<ReactPlayer url='https://c222b17f.ngrok.io/output.m3u8' width="1280px" height="720px" playing controls />
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
