import React, { Component } from 'react';

import { fetchWrap } from '../../../services/fetchWrap';

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
		fetchWrap('https://yts.am/api/v2/movie_details.json?movie_id=' + this.props.match.params.id + '&with_images=true&with_cast=true')
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
		})
	}

	render() {

		return(
			<div className='main'>
				<br/>
				{
					this.state.video &&
					<video controls autoPlay>
						<source preload='metadata' src={'http://localhost:3001/video/'+this.state.magnet+'/'+this.state.time} type="video/mp4" />
					</video>
				}
			</div>
		);
	}
}

export default Movies
