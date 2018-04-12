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
			subtitles: [{language: 'en', file: 'subDef.vtt'}],
			magnet: '',
			movieLanguage: 'en'
		}
	}

	static getDerivedStateFromProps(nextProps, prevState) {
		if (nextProps.magnet !== prevState.magnet) {
			console.log('update', nextProps)
			return {
				magnet: nextProps.magnet,
				movieLanguage: nextProps.movieLanguage,
				subtitles: [{language: 'en', file: 'subDef.vtt'}],
				video: false
			};
		}
		else {
			return null;
		}
	}

	componentDidUpdate(prevProps, prevState) {
		if (prevState.magnet !== this.state.magnet) {
			const time = Date.now()

			/*fetchWrap('/sub', {
				method: 'POST',
				credentials: 'include',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					magnet: this.state.magnet,
					languageVideo: this.state.movieLanguage,
					languageUser: this.props.me.language
				})
			})
			.then((data) => {
				console.log('subs',data)
				this.setState({ subtitles: data.sub }, () => {
					console.log(this.state);
				})
			})
			.catch(error => console.log(error))*/
			fetchWrap('/video/' + this.state.magnet + '/' + time + 'first', {credentials: 'include'})
			.then((data) => {
				console.log(data)
				this.setState({ video: true, time: time, url: data.url }, () => {
					console.log(this.state);
				})
			})
			.catch(error => console.log(error))
		}
	}

	render() {
		const tracks = this.state.subtitles
			.map((item, key) => ({kind: 'subtitles', src: '/subtitles/' + item.file, srcLang: item.language, default: true}))


		console.log('la',this.state)

		return(
			<div  >
				{this.state.video && <ReactPlayer url={
					this.state.url ?
					this.state.url :
					'http://localhost:3001/video/' + this.state.magnet + '/' + this.state.time
				} 
				width="1280px" 
				height="720px" 
				playing 
				controls 
				config={{ file: {
						    tracks: tracks
							}
						}}
				/>}
			</div>
		);
	}
}

function mapStateToProps(state) {
	const { isAuthenticated, me } = state.handleMe;
	return ({
		isAuthenticated,
		me
	});
}

export default connect(mapStateToProps)(Player)
