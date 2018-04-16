import React, { Component } from 'react';
import { connect } from 'react-redux';
import ReactPlayer from 'react-player';

import { updateProfileInfos } from '../../../../actions/me'

import { fetchWrap } from '../../../../services/fetchWrap'

import './style.css';

class Player extends Component {

	constructor(props) {
		super(props)
		this.state = {
			video: false,
			loading: false,
			time: 0,
			subtitles: [],
			magnet: '',
			movieLanguage: 'en',
			meLanguage: 'en',
			canal: 'movie',
			seasonNumber: 0,
			episodeNumber: 0,
			releaseYear: 1900
		}

		this.myRef = React.createRef();
	}

	static getDerivedStateFromProps(nextProps, prevState) {
		if (nextProps.magnet !== prevState.magnet) {
			return {
				loading: true,
				magnet: nextProps.magnet,
				movieLanguage: nextProps.movieLanguage,
				canal: nextProps.canal,
				movieId: nextProps.movieId,
				seasonNumber: nextProps.seasonNumber,
				episodeNumber: nextProps.episodeNumber,
				releaseYear: nextProps.releaseYear
			};
		}
		else if (nextProps.me.language !== prevState.meLanguage) {
			return {
				meLanguage: nextProps.me.language
			};
		}
		else {
			return null;
		}
	}

	componentDidUpdate(prevProps, prevState) {
		if (prevState.meLanguage !== this.state.meLanguage && this.state.magnet.length > 0) {
			if (this._isMounted) {
				this.setState({
					subtitles: []
				})
			}
			fetchWrap('/sub', {
				method: 'POST',
				credentials: 'include',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					magnet: this.state.magnet,
					languageVideo: this.state.movieLanguage,
					languageUser: this.state.meLanguage,
					canal: this.state.canal,
					seasonNumber: this.state.seasonNumber,
					episodeNumber: this.state.episodeNumber,
					releaseYear: this.state.releaseYear
				})
			})
			.then((data) => {
				if (this._isMounted) {
					this.setState({
						subtitles: data.sub
					})
				}
			})
			.catch(error => console.log(error))
		}
		if (prevState.magnet !== this.state.magnet) {

			var user = this.props.me;
			const actualMovie = {
				canal: this.state.canal,
				movieId: this.state.movieId
			};

			if (user.seenMovies) {
				user.seenMovies.push(actualMovie);
			}
			else {
				user.seenMovies = [actualMovie];
			}
			this.props.dispatch(updateProfileInfos(user));

			const time = Date.now()
			fetchWrap('/video/'+
			this.state.canal + '/' +
			this.state.movieId + '/' +
			this.state.magnet + '/' +
			time +
			'first',
			{credentials: 'include'})
			.then((data) => {
				if (this._isMounted) {
					this.setState({
						video: true,
						loading: false,
						time,
						url: data.url
					})
				}
			})
			.catch(error => console.log(error))
		}
	}

	componentDidMount() {
		this._isMounted = true;
	}

	componentWillUnmount() {
		this._isMounted = false;
	}

	render() {
		const tracks = this.state.subtitles
		.map((item, key) => {
			if (item.language === 'en' && this.state.subtitles.length === 1) {
				return {kind: 'subtitles', src: '/subtitles/' + item.file, srcLang: item.language, default: true }
			}
			else if (item.language !== 'en') {
				return {kind: 'subtitles', src: '/subtitles/' + item.file, srcLang: item.language, default: true }
			}
			else {
				return {kind: 'subtitles', src: '/subtitles/' + item.file, srcLang: item.language}
			}
		})

		return(
			<div className='videoPlayerContainer'>
				{
					this.state.loading
					?
					<div className='loading fontMedium'><span><i className='fas fa-spinner'></i></span></div>
					:
					this.state.video && <ReactPlayer url={
						this.state.url
						?
						this.state.url
						:
						'http://localhost:3001/video/' +
						this.state.canal + '/' +
						this.state.movieId + '/' +
						this.state.magnet + '/' +
						this.state.time
					}
					width='100%'
					height='100%'
					playing
					controls
					onReady={() => console.log('onReady')}
					onStart={() => {
						this.myRef.current.seekTo(0);
						console.log('onStart');
					}}
					ref={this.myRef}
					config={{
						file: {
							tracks: this.state.subtitles.length === 0 ? [] : tracks
						}
					}}/>
				}
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
