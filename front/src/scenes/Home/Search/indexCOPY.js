import React, { Component } from 'react';
import { connect } from 'react-redux';

import Logout from './../LogOut';

import { fetchWrap } from '../../../services/fetchWrap'


class Search extends Component {

	constructor(props) {
		super(props)
		this.state = {
			result: []
		}
	}

	search(e) {
		console.log(e.target.value)
		fetchWrap('https://api.themoviedb.org/3/search/tv?api_key=6cccec2917aab5c242bfff03911e32d6&language=en-US&query='+e.target.value+'&page=1&include_adult=false', {
			
		})
		.then(result => {
			console.log(result)
			this.setState({ result: result.results })
		})
		.catch(error => {
			console.log(error)
		})
	}

	render() {

		const displayResult = this.state.result.map(item => <div key={item.id}><img src={item.poster_path?'https://image.tmdb.org/t/p/w500//'+item.poster_path:null} /> {item.title}</div>)

		return(
			<div>
				<br/>
				<input type='text' onChange={(e) => this.search(e)} />
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

export default connect(mapStateToProps)(Search)
