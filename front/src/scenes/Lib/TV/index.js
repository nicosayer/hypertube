import React, { Component } from 'react';
import { connect } from 'react-redux';

import Logout from '../../Home/LogOut';

import { fetchWrap } from '../../../services/fetchWrap'


class Search extends Component {

	constructor(props) {
		super(props)
		this.state = {
			result: {}
		}
	}

	componentDidMount(e) {
		fetchWrap('https://api.themoviedb.org/3/tv/'+this.props.match.params.id+'?api_key=6cccec2917aab5c242bfff03911e32d6&language=en-US', {
			
		})
		.then(result => {
			console.log(result)
			this.setState({ result })
		})
		.catch(error => {
			console.log(error)
		})
	}

	render() {

		var seasons = !this.state.result.seasons?null:this.state.result.seasons.map(
			(item, key) => <div key={key}><img src={item.poster_path?'https://image.tmdb.org/t/p/w500//'+item.poster_path:null} />{item.name}</div>
		)



		return(
			<div>
				<br/>
				<img src={this.state.result.poster_path?'https://image.tmdb.org/t/p/w500//'+this.state.result.poster_path:null} />
				{seasons}
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