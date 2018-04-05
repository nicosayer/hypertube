import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import { fetchWrap } from '../../../services/fetchWrap'

import './style.css';

class Search extends Component {

	constructor(props) {
		super(props)
		this.state = {
			search: '',
			result: [],
			loading: true
		}
		this.props.history.push('/')
	}

	componentDidMount() {
		this._isMounted = true;
		this.determineTypeOfSearch();
	}

	static getDerivedStateFromProps(nextProps, prevState) {
		if (nextProps.search !== prevState.search) {
			return {
				search: nextProps.search,
				loading: true
			};
		}
		else {
			return null;
		}
	}

	componentDidUpdate(prevProps, prevState) {
		this.determineTypeOfSearch();
	}

	determineTypeOfSearch() {
		if (this.state.loading) {
			if (this.state.search) {
				this.search('https://yts.am/api/v2/list_movies.json?query_term=' + this.state.search);
			}
			else {
				this.search('https://yts.am/api/v2/list_movies.json?sort_by=download_count&limit=50');
			}
		}
	}

	componentWillUnmount() {
		this._isMounted = false;
	}

	search(endPoint) {
		fetchWrap(endPoint)
		.then(data => {
			var result = [];
			if (data.data && data.data.movie_count) {
				result = data.data.movies;
			}
			if (this._isMounted) {
				this.setState({
					...this.state,
					result,
					loading: false
				})
			}
		})
		.catch(error => {
			console.log(error);
		})
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
					<img className='movieImg' alt={item.title} src={item.medium_cover_image ? item.medium_cover_image : null} />
				</div>
			</Link>
		)

		return(
			<div className='main'>
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
		);
	}
}

export default Search
