import React, { Component } from 'react';
import { connect } from 'react-redux'
import Player from '../../../components/Player';

import { fetchWrap } from '../../../services/fetchWrap';

import './style.css';

const language = require('./language.json');

class Movies extends Component {

	constructor(props) {
		super(props)
		this.state = {
			seasonNumber: 0,
			episodeNumber: '',
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
				else if (movieInfo.id){
					fetchWrap('https://api.themoviedb.org/3/tv/' + movieInfo.id + '/external_ids?api_key=fc97ca1225d5b618b7a69f5a20a132d8')
					.then(externalIds => {
						if (externalIds.imdb_id) {
							movieInfo.imdb_id = externalIds.imdb_id;
							fetchWrap('https://tv-v2.api-fetch.website/show/' + movieInfo.imdb_id)
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
				}
			})
			.catch(err => this.setState({loading: false}))
		})
		.catch(err => this.setState({loading: false}))
	}

	selectSeason(seasonNumber) {
		this.setState({
			seasonNumber
		});
	}

	selectEpisode(magnet) {
		this.setState({
			episodeNumber: encodeURIComponent(magnet)
		})
	}

	render() {

		console.log(this.state);

		const actualSeason = this.state.torrentInfo && this.state.torrentInfo.episodes ? this.state.torrentInfo.episodes.filter(episode => episode.season === this.state.seasonNumber).sort((a, b) => a.episode - b.episode) : null;

		const movieLinks =
		this.state.torrentInfo && this.state.torrentInfo.data && this.state.torrentInfo.data.movies && this.state.torrentInfo.data.movies[0] && this.state.torrentInfo.data.movies[0].torrents
		?
		this.state.torrentInfo.data.movies[0].torrents
		.filter(torrent => torrent.seeds >= 0 && torrent.quality !== '3D')
		.map((torrent, key) =>
		<div key={key} className='torrentQualityButton' onClick={() => (this.selectEpisode('magnet:?xt=urn:btih:' + torrent.hash + '&dn=' + torrent.title_long + '&tr=udp%3A%2F%2Ftracker.leechers-paradise.org%3A6969&tr=udp%3A%2F%2Fzer0day.ch%3A1337&tr=udp%3A%2F%2Fopen.demonii.com%3A1337&tr=udp%3A%2F%2Ftracker.coppersurfer.tk%3A6969&tr=udp%3A%2F%2Fexodus.desync.com%3A6969'))}>
			{torrent.quality}
			<br/>
			{torrent.size}
		</div>)
		:
		null;

		const seasonsPictures =
		this.state.movieInfo.seasons
		?
		this.state.movieInfo.seasons
		.filter(season => season.poster_path && season.season_number)
		.map((season, key) =>
		<div key={key} className='movie pointer' onClick={() => this.selectSeason(season.season_number)}>
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
		</div>)
		:
		null;

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
							{this.state.movieInfo.runtime ? Math.trunc(this.state.movieInfo.runtime / 60) + 'h' + this.state.movieInfo.runtime % 60 : this.state.movieInfo.number_of_seasons ? <span>{this.state.movieInfo.number_of_seasons} {language.season[this.props.me.language]}{this.state.movieInfo.number_of_seasons > 1 ? 's' : null}</span> : null}
							{(this.state.movieInfo.runtime || this.state.movieInfo.number_of_seasons) && this.state.movieInfo.vote_average ? <span className='fontGrey'> | </span> : null}
							{this.state.movieInfo.vote_average ? <span>{this.state.movieInfo.vote_average} <i className='fas fa-star'></i></span> : null}
						</div>
						<div className='spaceTopBig'>
							<div className='spaceBottom'><b>{language.overviewLabel[this.props.me.language]}</b></div>
							<div className='movieInfosOverview'>
								{this.state.movieInfo.overview ? this.state.movieInfo.overview : null}
							</div>
						</div>
						<div className='spaceTopBig'>
							<div className='spaceBottom'><b>{language.castLabel[this.props.me.language]}</b></div>
							{ this.state.movieInfo.production_companies[0] && this.state.movieInfo.production_companies[0].logo_path ? <div className='castContainer'><img className='prodImg' alt={this.state.movieInfo.production_companies[0].name} src={'https://image.tmdb.org/t/p/w500' + this.state.movieInfo.production_companies[0].logo_path} /><div>{this.state.movieInfo.production_companies[0].name}</div></div> : null }
							{ this.state.movieCast.crew[0] && this.state.movieCast.crew[0].profile_path ? <div className='castContainer'><img className='castImg' alt={this.state.movieCast.crew[0].name} src={'https://image.tmdb.org/t/p/w500' + this.state.movieCast.crew[0].profile_path} /><div>{this.state.movieCast.crew[0].name}</div></div> : null }
							{ this.state.movieCast.cast[0] && this.state.movieCast.cast[0].profile_path ? <div className='castContainer'><img className='castImg' alt={this.state.movieCast.cast[0].name} src={'https://image.tmdb.org/t/p/w500' + this.state.movieCast.cast[0].profile_path} /><div>{this.state.movieCast.cast[0].name}</div></div> : null }
							{ this.state.movieCast.cast[1] && this.state.movieCast.cast[1].profile_path ? <div className='castContainer'><img className='castImg' alt={this.state.movieCast.cast[1].name} src={'https://image.tmdb.org/t/p/w500' + this.state.movieCast.cast[1].profile_path} /><div>{this.state.movieCast.cast[1].name}</div></div> : null }
							{ this.state.movieCast.cast[2] && this.state.movieCast.cast[2].profile_path ? <div className='castContainer'><img className='castImg' alt={this.state.movieCast.cast[2].name} src={'https://image.tmdb.org/t/p/w500' + this.state.movieCast.cast[2].profile_path} /><div>{this.state.movieCast.cast[2].name}</div></div> : null }
						</div>
						{
							this.props.canal !== 'tv' ?
							<div className='spaceTopBig'>
								<div className='spaceBottom'><b>{language.availableInLabel[this.props.me.language]}</b></div>
								{
									movieLinks ?
									movieLinks
									:
									<div className='fontGrey fontCenter'><div className='spaceBottom fontBig'><i className="fas fa-map-signs"></i></div>{language.movieUnavailable[this.props.me.language]}</div>
								}
							</div>
							:
							null
						}
						<div className='floatClear fontCenter'>
							{
								this.state.seasonNumber ?
								<table className='tvEpisodesTable'>
									<thead>
										<tr>
											<th>
												{
													this.state.seasonNumber > 1 ?
													<div className='pointer' onClick={() => this.selectSeason(this.state.seasonNumber - 1)}><i className="fas fa-angle-double-left"></i></div>
													:
													<span><i className="transparent fas fa-angle-double-left"></i></span>
												}
											</th>
											<th className='fontMedium underline'>
												{language.seasonNumberLabel[this.props.me.language]} {this.state.seasonNumber}
											</th>
											<th>
												{
													this.state.seasonNumber < this.state.movieInfo.number_of_seasons ?
													<div className='pointer' onClick={() => this.selectSeason(this.state.seasonNumber + 1)}><i className="fas fa-angle-double-right"></i></div>
													:
													<span><i className="transparent fas fa-angle-double-right"></i></span>
												}
											</th>
										</tr>
									</thead>
									<tbody>
										{
											actualSeason && actualSeason.length ?
											actualSeason.map((episode, key) =>
											<tr key={key}>
												<td>Ep. <i className="fab fa-slack-hash"></i><i>{episode.episode}</i></td>
												<td><b>{episode.title}</b></td>
												<td>
													{
														Object.keys(episode.torrents).map((torrent, key) => {
															if (torrent !== '0') {
																return <span key={key} className='torrentQualityButton' onClick={() => this.selectEpisode(episode.torrents[torrent].url)}>{torrent}</span>
															}
															return null;
														})
													}
												</td>
											</tr>)
											:
											<tr><td colSpan='3' className='fontGrey'><div className='spaceBottom fontBig'><i className="fas fa-map-signs"></i></div>{language.seasonUnavailable[this.props.me.language]}</td></tr>
										}
									</tbody>
								</table>
								:
								null
							}
							{
								this.props.canal === 'tv' ?
								seasonsPictures.length ?
								seasonsPictures
								:
								<div className='fontGrey fontCenter'><div className='spaceBottom fontBig'><i className="fas fa-map-signs"></i></div>{language.seasonUnavailable[this.props.me.language]}</div>
								:
								null
							}
							{
								this.state.episodeNumber ?
								<Player magnet={this.state.episodeNumber} />
								: null
							}
						</div>
					</div>
				}
			</div>
		);
	}
}

function mapStateToProps(state) {
	const { me } = state.handleMe;
	return ({
		me
	})
}

export default connect(mapStateToProps)(Movies)
