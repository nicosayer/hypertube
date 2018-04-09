import React, { Component } from 'react';
import { connect } from 'react-redux';
import ReactPlayer from 'react-player';

import { fetchWrap } from '../../services/fetchWrap'


class Player extends Component {

	constructor(props) {
		super(props)
		this.state = {
			video: false,
			time: 0
		}
	}

	componentDidMount() {
		const time = Date.now()
		
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

		return(
			<div  >
				{this.state.video && <ReactPlayer url={
					this.state.url ?
					this.state.url :
					'http://localhost:3001/video/' + this.props.magnet + '/' + this.state.time
				} width="1280px" height="720px" playing controls />}
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
