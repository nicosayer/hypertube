import React, { Component } from 'react';

import { fetchWrap } from '../../../services/fetchWrap';

import './style.css';

class Movies extends Component {

	constructor(props) {
		super(props)
		this.state = {
			movieInfo: '',
			movieCast: '',
			torrentInfo: '',
			loading: true
		}
	}

	componentDidMount() {
		var endPointInfo, endPointCast, endPointTorrent;
		if (this.props.canal === 'tv') {
			endPointInfo = 'https://api.themoviedb.org/3/tv/' + this.props.match.params.id + '?api_key=fc97ca1225d5b618b7a69f5a20a132d8';
			endPointCast = 'https://api.themoviedb.org/3/tv/' + this.props.match.params.id + '/credits?api_key=fc97ca1225d5b618b7a69f5a20a132d8';
		}
		else {
			endPointInfo = 'https://api.themoviedb.org/3/movie/' + this.props.match.params.id + '?api_key=fc97ca1225d5b618b7a69f5a20a132d8';
			endPointCast = 'https://api.themoviedb.org/3/movie/' + this.props.match.params.id + '/credits?api_key=fc97ca1225d5b618b7a69f5a20a132d8';
		}
		fetchWrap(endPointInfo)
		.then(movieInfo => {
			fetchWrap(endPointCast)
			.then(movieCast => {
				if (movieInfo.imdb_id && this.props.canal !== 'tv') {
					endPointTorrent = 'https://yts.am/api/v2/list_movies.json?quality=720p,1080p&query_term=' + movieInfo.imdb_id;
					fetchWrap(endPointTorrent)
					.then(torrentInfo => {
						this.setState({
							movieInfo,
							movieCast,
							torrentInfo,
							loading: false
						})
					})
					.catch(err => this.setState({loading: false}))
				}
				else {
					this.setState({
						movieInfo,
						movieCast,
						loading: false
					})
				}
			})
			.catch(err => this.setState({loading: false}))
		})
		.catch(err => this.setState({loading: false}))
	}

	selectSeason(seasonId) {
		fetchWrap('https://oneom.tk/search/serial?limit=5&title=test', {headers: {'Accept': 'application/json'}})
		.then(data => {console.log(data)})
		.catch(err => {console.log(err)});
	}

	render() {
		console.log(this.state)
		return(
			<div className='main'>
				{
					this.state.loading ?
					<div className='loading noMovies'><span><i className='fas fa-spinner'></i></span></div>
					:
					<div className='movieInfos'>
						<img className='floatLeft spaceRightBig movieInfosImg spaceBottomBig' alt={this.state.movieInfo.title ? this.state.movieInfo.title : this.state.movieInfo.name ? this.state.movieInfo.name : null} src={'https://image.tmdb.org/t/p/w500' + this.state.movieInfo.poster_path} />
						<div className='fontBig inline'><b>{this.state.movieInfo.title ? this.state.movieInfo.title : this.state.movieInfo.name ? this.state.movieInfo.name : null}</b></div>
						<div className='inline spaceLeft'>{this.state.movieInfo.release_date ? '(' + this.state.movieInfo.release_date.substring(0, 4) + ')' : this.state.movieInfo.first_air_date ? '(' + this.state.movieInfo.first_air_date.substring(0, 4) + ')' : null}</div>
						<div className='fontMedium'><i>{this.state.movieInfo.tagline ? this.state.movieInfo.tagline : null}</i></div>
						<div className='spaceTop'>
							{this.state.movieInfo.runtime ? Math.trunc(this.state.movieInfo.runtime / 60) + 'h' + this.state.movieInfo.runtime % 60 : this.state.movieInfo.number_of_seasons ? <span>{this.state.movieInfo.number_of_seasons} season{this.state.movieInfo.number_of_seasons > 1 ? 's' : null}</span> : null}
							{(this.state.movieInfo.runtime || this.state.movieInfo.number_of_seasons) && this.state.movieInfo.vote_average ? <span className='fontGrey'> | </span> : null}
							{this.state.movieInfo.vote_average ? <span>{this.state.movieInfo.vote_average} <i className='fas fa-star'></i></span> : null}
						</div>
						<div className='spaceTopBig'>
							<div className='spaceBottom'><b>Overview :</b></div>
							<div className='movieInfosOverview'>
								{this.state.movieInfo.overview ? this.state.movieInfo.overview : null}
							</div>
						</div>
						<div className='spaceTopBig'>
							<div className='spaceBottom'><b>Cast & crew :</b></div>
							{ this.state.movieInfo.production_companies[0] && this.state.movieInfo.production_companies[0].logo_path ? <div className='castContainer'><img className='prodImg' alt={this.state.movieInfo.production_companies[0].name} src={'https://image.tmdb.org/t/p/w500' + this.state.movieInfo.production_companies[0].logo_path} /><div>{this.state.movieInfo.production_companies[0].name}</div></div> : null }
							{ this.state.movieCast.crew[0] && this.state.movieCast.crew[0].profile_path ? <div className='castContainer'><img className='castImg' alt={this.state.movieCast.crew[0].name} src={'https://image.tmdb.org/t/p/w500' + this.state.movieCast.crew[0].profile_path} /><div>{this.state.movieCast.crew[0].name}</div></div> : null }
							{ this.state.movieCast.cast[0] && this.state.movieCast.cast[0].profile_path ? <div className='castContainer'><img className='castImg' alt={this.state.movieCast.cast[0].name} src={'https://image.tmdb.org/t/p/w500' + this.state.movieCast.cast[0].profile_path} /><div>{this.state.movieCast.cast[0].name}</div></div> : null }
							{ this.state.movieCast.cast[1] && this.state.movieCast.cast[1].profile_path ? <div className='castContainer'><img className='castImg' alt={this.state.movieCast.cast[1].name} src={'https://image.tmdb.org/t/p/w500' + this.state.movieCast.cast[1].profile_path} /><div>{this.state.movieCast.cast[1].name}</div></div> : null }
							{ this.state.movieCast.cast[2] && this.state.movieCast.cast[2].profile_path ? <div className='castContainer'><img className='castImg' alt={this.state.movieCast.cast[2].name} src={'https://image.tmdb.org/t/p/w500' + this.state.movieCast.cast[2].profile_path} /><div>{this.state.movieCast.cast[2].name}</div></div> : null }
						</div>
						{
							this.props.canal !== 'tv' ?
							<div className='spaceTopBig'>
								<div className='spaceBottom'><b>Available in :</b></div>
								{
									this.state.torrentInfo.data && this.state.torrentInfo.data.movies && this.state.torrentInfo.data.movies[0] && this.state.torrentInfo.data.movies[0].torrents ?
									this.state.torrentInfo.data.movies[0].torrents.map((torrent, key) => {
										if (torrent.seeds >= 0 && torrent.quality !== '3D') {
											if (torrent.quality === '720p') {
												return <div key={key} className='torrentQualityButton'>{torrent.quality}<br/>{torrent.size}</div>
											}
											else {
												return <div key={key} className='torrentQualityButton'>{torrent.quality}<br/>{torrent.size}</div>
											}
										}
										return null;
									})
									:
									null
								}
							</div>
							:
							null
						}
						<div className='floatClear'>
							{
								this.props.canal === 'tv' ?
								this.state.movieInfo.seasons.map((season, key) =>
								{
									if (season.poster_path) {
										return <div key={key} className='movie pointer' onClick={() => this.selectSeason(season.id)}>
											<div className='movieTitle'>
												<div>
													<div className='fontMedium underline'>
														{season.name ? <b>{season.name}</b> : null}
													</div>
													<div>
														{ season.air_date ? <b>({season.air_date.substring(0, 4)})</b> : null }
													</div>
													<div className='spaceTop'>
														{ season.episode_count ? season.episode_count + ' episodes' : null }
													</div>
												</div>
											</div>
											<img className='movieImg' alt={season.title} src={'https://image.tmdb.org/t/p/w500' + season.poster_path} />
										</div>
									}
									return null;
								}
							)
							:
							null
						}
					</div>
				</div>
			}
		</div>
	);
}
}

export default Movies
