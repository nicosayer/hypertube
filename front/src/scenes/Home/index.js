import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import Logout from './LogOut';

import { fetchWrap } from '../../services/fetchWrap'

import './style.css';

class Home extends Component {

	constructor(props) {
		super(props)
		this.state = {
			result: [],
			loading: true
		}
	}

	componentDidMount() {
		this.searchMostPopular();
	}

	searchMostPopular() {
		if (!this.state.loading) {
			this.setState({
				...this.state,
				loading: true
			})
		}
		fetchWrap('https://yts.am/api/v2/list_movies.json?sort_by=download_count&limit=50')
		.then(data => {
			var result = [];
			if (data.data && data.data.movie_count) {
				result = data.data.movies;
			}
			this.setState({
				result,
				loading: false
			})
		})
		.catch(error => {
			console.log(error);
		})
	}

	search(event) {
		if (event.which === 13) {
			if (event.target && event.target.value) {
				if (!this.state.loading) {
					this.setState({
						...this.state,
						loading: true
					})
				}
				fetchWrap('https://yts.am/api/v2/list_movies.json?query_term=' + event.target.value)
				.then(data => {
					console.log(data.data)
					var result = [];
					if (data.data && data.data.movie_count) {
						result = data.data.movies;
					}
					this.setState({
						result,
						loading: false
					})
				})
				.catch(error => {
					console.log(error);
				})
			}
			else {
				this.searchMostPopular();
			}
		}
	}

	render() {

		const movies = this.state.result.map(item =>
			<Link key={item.id} to={'/' + item.id}>
				<div className='movie'>
					<div className='movieTitle'>
						<div>
							<div className='fontMedium underline'>
								{item.title ? <b>{item.title}</b> : null}
							</div>
							<div>
								{ item.year ? <b>({item.year})</b> : null }
							</div>
							<div className='spaceTop'>
								{ item.runtime ? item.runtime + ' min' : null }
							</div>
							<div className='spaceTop'>
								{ item.genres ? item.genres.map(genre => ' ' + genre): null }
							</div>
							<div className='spaceTop'>
								{ item.rating ? <span>{item.rating} <i className='fas fa-star'></i></span> : null}
							</div>
						</div>
					</div>
					<img className='movieImg' src={item.medium_cover_image ? item.medium_cover_image : null} />
				</div>
			</Link>
		)

		return(
			<div>
				<div className='persistentBar'>
					<i className='fas fa-search'></i>
					<input className='searchBar spaceLeft' placeholder='Quick search' type='text' onKeyDown={event => this.search(event)} />
					<div className='inline floatRight spaceRight'>
						<Logout />
					</div>
					<div className='inline floatLeft hypertubeLogo'>
						Hypertube
						<i className='fas fa-space-shuttle spaceLeft'></i>
					</div>
				</div>
				<div className='searchResults'>
					{ this.state.loading ?
						<div className='loading noMovies'><span><i className='fas fa-spinner'></i></span></div>
						:
						movies.length ?
						<div>
							{movies}
						</div>
						:
						<div>
							<div className='noMovies'>
								<i className='fas fa-map-signs'></i>
							</div>
							Sorry but we didn't find anything
						</div>
					}
				</div>
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
