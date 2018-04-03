import React, { Component } from 'react';
import { connect } from 'react-redux';

import Logout from './LogOut';

import { fetchWrap } from '../../services/fetchWrap'


class Home extends Component {

	constructor(props) {
		super(props)
		this.state = {
			result: [],
			callTime: 0
		}
	}

	search(event) {
		if (event.target && event.target.value) {
			fetchWrap('https://yts.am/api/v2/list_movies.json?query_term=' + event.target.value)
			.then(data => {
				console.log(data);
				if (data.data && data.data.movie_count) {
					this.setState({ result: data.data.movies })
				}
				else {
					this.setState({ result: [] })
				}
			})
			.catch(error => {
				console.log(error);
			})
		}
	}

	render() {

		const displayResult = this.state.result.map(item =>
			<div key={item.id}>
				<a href='test'>
					<img src={item.large_cover_image ? item.large_cover_image : null} />
				</a>
			</div>
		)

		return(
			<div>
				<br/>
				<input type='text' onChange={event => this.search(event)} />
				{displayResult}
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

export default connect(mapStateToProps)(Home)
