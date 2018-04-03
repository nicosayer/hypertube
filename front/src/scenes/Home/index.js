import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import Logout from './LogOut';

import { fetchWrap } from '../../services/fetchWrap'


class Home extends Component {

	constructor(props) {
		super(props)
		this.state = {
			result: []
		}
	}

	search(event) {
		if (event.which === 13 && event.target && event.target.value) {
			fetchWrap('https://yts.am/api/v2/list_movies.json?query_term=' + event.target.value)
			.then(data => {
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
			<Link key={item.id} to={'/' + item.id}>
				<img src={item.large_cover_image ? item.large_cover_image : null} />
			</Link>
		)

		return(
			<div>
				<br/>
				<input type='text' onKeyDown={event => this.search(event)} />
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
