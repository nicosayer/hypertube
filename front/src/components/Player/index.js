import React, { Component } from 'react';
import { connect } from 'react-redux';
import ReactPlayer from 'react-player';

import { fetchWrap } from '../../services/fetchWrap'


class Player extends Component {

	constructor(props) {
		super(props)
		this.state = {
			video: false,
			time: 0,
			subtitles: ''
		}
	}

	componentDidMount() {
		const time = Date.now()
		fetchWrap('/sub/' + this.props.magnet, {credentials: 'include'})
		.then((data) => {
			console.log(data)
			this.setState({ subtitles: data.sub }, () => {
				console.log(this.state);
			})
		})
		.catch(error => console.log(error))
		fetchWrap('/video/' + this.props.magnet + '/' + time + 'first', {credentials: 'include'})
		.then((data) => {
			console.log(data)
			this.setState({ video: true, time: time, url: data.url }, () => {
				console.log(this.state);
			})
		})
		.catch(error => console.log(error))
	}

	render() {
		const config = { file: {
						    tracks: [
						      {kind: 'subtitles', src: '/subtitles/' + this.state.subtitles, srcLang: 'en', default: true},
						    ]
						  }}

		console.log(this.state.subtitles)

		return(
			<div  >
				{this.state.video && this.state.subtitles.length !== 0 && <ReactPlayer url={
					this.state.url ?
					this.state.url :
					'http://localhost:3001/video/' + this.props.magnet + '/' + this.state.time
				} 
				width="1280px" 
				height="720px" 
				playing 
				controls 
				config={config}
				/>}
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

export default connect(mapStateToProps)(Player)
