import React, { Component } from 'react';
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import { Link } from 'react-router-dom';

import Logout from './LogOut';

import { changeLanguage } from '../../../actions/me'

import { fetchWrap } from '../../../services/fetchWrap';

import './style.css';

const language = require('./language.json');

class Menu extends Component {

	constructor(props) {
		super(props)
		this.emptySearch = this.emptySearch.bind(this);
		this.searchInput = React.createRef();
	}

	search(event) {
		if (this.props.location.pathname.substring(0, 3) === '/tv') {
			this.props.history.push('/tv');
		}
		else {
			this.props.history.push('/');
		}
		if (event.target) {
			this.props.handleSearch(event.target.value);
		}
	}

	handleKeyDown(event) {
		if (event.which && event.which === 13) {
			this.search(event);
		}
	}

	emptySearch() {
		this.props.handleSearch('');
		this.searchInput.current.value = '';
	}

	selectLanguage(language) {
		fetchWrap('/home/changeLanguage', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			credentials: 'include',
			body: JSON.stringify({
				language
			})
		})
		.then(torrentInfo => this.props.dispatch(changeLanguage(language)))
		.catch(err => console.log(err))
	}

	render() {

		return(
			<div>
				<div className='menuBar'>
					<span className='floatLeft' onClick={this.emptySearch}>
						<Link to={this.props.location.pathname.substring(0, 3) === '/tv' ? '/tv' : '/'}>
							<span className='menuLogo'>
								<span className='fontGrey'>Hypertube</span>
								<i className='fas fa-space-shuttle spaceLeft'></i>
							</span>
						</Link>
					</span>
					<span className='floatRight'>
						<span className='menuProfile'>
							<span className='menuLanguage'>
								<span className={this.props.me.language === 'en' ? 'pointer' : 'fontGrey pointer'} onClick={this.props.me.language !== 'en' ? () => (this.selectLanguage('en')) : null}>en</span>
								<span className='fontGrey spaceLeft spaceRight'>|</span>
								<span className={this.props.me.language === 'fr' ? 'pointer' : 'fontGrey pointer'} onClick={this.props.me.language !== 'fr' ? () => (this.selectLanguage('fr')) : null}>fr</span>
							</span>
							<span onClick={this.emptySearch}>
								<Link to='/profile'>
									{language.profileLink[this.props.me.language]}
								</Link>
							</span>
							<span className='fontGrey spaceLeft spaceRight'>|</span>
							<Logout />
						</span>
					</span>
					<span className='menuType'>
						<Link to='/'>
							<span
								className={this.props.location.pathname === '/profile' || this.props.location.pathname.substring(0, 3) === '/tv' ? 'fontGrey' : null}
								onClick={this.props.location.pathname === '/profile' || this.props.location.pathname.substring(0, 3) === '/tv' ? null : () => (this.emptySearch())}>
								{language.moviesSectionLink[this.props.me.language]}
							</span>
						</Link>
						<span className='fontGrey spaceLeft spaceRight'>|</span>
						<Link to='/tv'>
							<span
								className={this.props.location.pathname.substring(0, 3) === '/tv' ? null : 'fontGrey'}
								onClick={this.props.location.pathname.substring(0, 3) === '/tv' ? () => (this.emptySearch()) : null}>
								{language.tvSectionLink[this.props.me.language]}
							</span>
						</Link>
					</span>
					<span className='magnifyingGlassLogo'>
						<i className='fas fa-search'></i>
					</span>
					<input
						className='menuSearch spaceLeft'
						placeholder={language.quickSearchLabel[this.props.me.language]}
						type='text' onChange={event => this.search(event)}
						onKeyDown={event => this.handleKeyDown(event)}
						ref={this.searchInput} />
				</div>

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

export default withRouter(connect(mapStateToProps)(Menu))
