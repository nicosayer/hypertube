import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import InfiniteScroll from 'react-infinite-scroller';

import { fetchWrap } from '../../../services/fetchWrap'

import './style.css';

const genres = require('./genres.json');
const genresList = require('./genresList.json');

class Search extends Component {

	constructor(props) {
		super(props)
		this.state = {
			search: '',
			orderBy: 'popularity.desc',
			release_date_min: 1900,
			release_date_max: 2018,
			ratings_min: 0,
			ratings_max: 10,
			genres: [],
			result: [],
			loading: true,
			scrolling: false,
			page: 1
		}
		this.props.history.push('/')
		this.determineTypeOfSearch = this.determineTypeOfSearch.bind(this);
		this.scrolling = this.scrolling.bind(this);
		this.discover = this.discover.bind(this);
	}

	componentDidMount() {
		this._isMounted = true;
		this.determineTypeOfSearch();
	}

	static getDerivedStateFromProps(nextProps, prevState) {
		if (nextProps.search !== prevState.search) {
			return {
				result: [],
				search: nextProps.search,
				loading: true,
				scrolling: false,
				page: 1
			};
		}
		else {
			return null;
		}
	}

	componentDidUpdate(prevProps, prevState) {
		if (prevState !== this.state && prevProps !== this.props) {
			this.determineTypeOfSearch();
		}
	}

	componentWillUnmount() {
		this._isMounted = false;
	}

	determineTypeOfSearch() {
		if (this.state.loading || this.state.scrolling) {
			if (this.state.search) {
				this.search('https://api.themoviedb.org/3/search/movie?api_key=fc97ca1225d5b618b7a69f5a20a132d8&query=' + this.state.search + '&page=' + this.state.page + '&include_adult=false');
			}
			else {
				this.search('https://api.themoviedb.org/3/discover/movie?api_key=fc97ca1225d5b618b7a69f5a20a132d8&sort_by=' + this.state.orderBy + '&page=' + this.state.page + '&primary_release_date.gte=' + this.state.release_date_min + '&primary_release_date.lte=' + (parseInt(this.state.release_date_max, 10) + 1) + '&vote_average.gte=' + this.state.ratings_min + '&vote_average.lte=' + this.state.ratings_max + '&with_genres=' + this.state.genres.join(','));
			}
		}
	}

	search(endPoint) {
		console.log(endPoint)
		fetchWrap(endPoint)
		.then(data => {
			var result = [];
			if (data.total_results) {
				result = this.state.result.concat(data.results);
			}
			if (this._isMounted) {
				this.setState({
					result,
					loading: false,
					scrolling: false,
					page: this.state.page + 1
				})
			}
		})
		.catch(error => {
			console.log(error);
		})
	}

	discover(name, value) {
		if (name === 'genres') {
			if (value) {
				if (this.state.genres.includes(value)) {
					const genresCopy = this.state.genres;
					genresCopy.splice(genresCopy.indexOf(value), 1);
					value = genresCopy;
				}
				else {
					value = this.state.genres.concat(value);
				}
			}
			else {
				value = [];
			}
		}
		else if (name === 'release_date_min') {
			if (!isNaN(value) || value < 1000) {
				value = '';
			}
			else if (!value) {
				value = 1900;
			}
		}
		else if (name === 'release_date_max') {
			if (isNaN(value) || value < 1000) {
				value = '';
			}
			else if (!value) {
				value = 2018;
			}
		}
		else if (name === 'ratings_min') {
			if (isNaN(value)) {
				value = '';
			}
			else if (!value) {
				value = 0;
			}
		}
		else if (name === 'ratings_max') {
			if (isNaN(value)) {
				value = '';
			}
			else if (!value) {
				value = 10;
			}
		}
		if (value) {
		this.setState({
			search: '',
			result: [],
			page: 1,
			loading: true,
			[name]: value
		}, () => this.determineTypeOfSearch())
	}
}

	scrolling() {
		if (!this.state.scrolling && !this.state.loading) {
			this.setState({
				scrolling: true
			}, () => this.determineTypeOfSearch())
		}
	}

	render() {
		const movies = this.state.result.map((item, key) =>
		<Link key={key} to={'/' + item.id}>
			{
				item.poster_path ?
				<div className='movie'>
					<div className='movieTitle'>
						<div>
							<div className='fontMedium underline'>
								{item.title ? <b>{item.title}</b> : null}
							</div>
							<div>
								{ item.release_date ? <b>({item.release_date.substring(0, 4)})</b> : null }
							</div>
							<div className='spaceTop'>
								{ item.genre_ids ? item.genre_ids.map(id => ' ' + genres[id]): null }
							</div>
							<div className='spaceTop'>
								{ item.vote_average ? <span>{item.vote_average} <i className='fas fa-star'></i></span> : null}
							</div>
						</div>
					</div>
					<img className='movieImg' alt={item.title} src={'https://image.tmdb.org/t/p/w500' + item.poster_path} />
				</div>
				:
				null
			}
		</Link>
	)

	return(
		<div className='main'>
			<InfiniteScroll
				loadMore={this.scrolling}
				hasMore={true}
				useWindow={false}
				>
				<div className='searchMenu'>
					<div className='fontRight spaceRight fontBig fontGrey'><i className="fas fa-bars"></i></div>
					<div className='spaceLeft spaceRight spaceBottom fontLeft spaceTop'>
						Order by
					</div>
					<div className={this.state.orderBy === 'popularity.desc' ? 'searchChoiceActive' : 'searchChoice'} onClick={() => this.discover('orderBy', 'popularity.desc')}>Popularity</div>
					<div className={this.state.orderBy === 'vote_average.desc' ? 'searchChoiceActive' : 'searchChoice'} onClick={() => this.discover('orderBy', 'vote_average.desc')}>Rating</div>
					<div className={this.state.orderBy === 'release_date.desc' ? 'searchChoiceActive' : 'searchChoice'} onClick={() => this.discover('orderBy', 'release_date.desc')}>Release date</div>
					<div className={this.state.orderBy === 'revenue.desc' ? 'searchChoiceActive' : 'searchChoice'} onClick={() => this.discover('orderBy', 'revenue.desc')}>Revenue</div>
					<div className={this.state.orderBy === 'vote_count.desc' ? 'searchChoiceActive' : 'searchChoice'} onClick={() => this.discover('orderBy', 'vote_count.desc')}>Vote count</div>
					<div className='spaceLeft spaceRight spaceBottom fontLeft lignTop'>
						Genre
					</div>
					<div className={!this.state.genres.length ? 'searchChoiceActive' : 'searchChoice'} onClick={() => this.discover('genres')}>All</div>
					{
						genresList.map(elem =>
							<div key={elem.id} className={this.state.genres.includes(elem.id) ? 'searchChoiceActive' : 'searchChoice'} onClick={() => this.discover('genres', elem.id)}>{elem.name}</div>
						)
					}
					<div className='spaceLeft spaceRight spaceBottom fontLeft lignTop'>
						Release year
					</div>
					<input
						name='release_date_min'
						type='text'
						placeholder='1900'
						className='searchRange spaceRight fontCenter'
						onChange={(event) => this.discover('release_date_min', event.target.value)}
						/>
					-
					<input
						name='release_date_max'
						type='text'
						placeholder={(new Date()).getFullYear()}
						className='searchRange spaceLeft fontCenter'
						onChange={(event) => this.discover('release_date_max', event.target.value)}
						/>
					<div className='spaceLeft spaceRight spaceBottom fontLeft lignTop'>
						Rating
					</div>
					<input
						name='ratings_min'
						type='text'
						placeholder='0'
						className='searchRange spaceRight fontCenter'
						onChange={(event) => this.discover('ratings_min', event.target.value)}
						/>
					-
					<input
						name='ratings_max'
						type='text'
						placeholder='10'
						className='searchRange spaceLeft fontCenter'
						onChange={(event) => this.discover('ratings_max', event.target.value)}
						/>
				</div>
				<div className='searchMovies'>
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
			</InfiniteScroll>
		</div>
	);
}
}

export default Search
