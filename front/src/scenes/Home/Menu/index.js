import React, { Component } from 'react';
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import { Link } from 'react-router-dom';

import Logout from './LogOut';

import { changeLanguage, changeSearch } from '../../../actions/me'

import { fetchWrap } from '../../../services/fetchWrap';

import './style.css';

const language = require('./language.json');

class Menu extends Component {

	constructor(props) {
		super(props)
		this.searchInput = React.createRef();
	}

	search(event) {
		if (this.props.location.pathname.substring(0, 3) === '/tv') {
			this.props.history.push('/tv');
		}
		else {
			this.props.history.push('/');
		}
		if (event && event.target) {
			this.props.dispatch(changeSearch(event.target.value));
		}
	}

	handleKeyDown(event) {
		if (event && event.which && event.which === 13) {
			this.search(event);
		}
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
								<span className='separator'></span>
								<span className={this.props.me.language === 'fr' ? 'pointer' : 'fontGrey pointer'} onClick={this.props.me.language !== 'fr' ? () => (this.selectLanguage('fr')) : null}>fr</span>
							</span>
							<span className='menuLanguageAlt'>
								<span className='pointer fontGrey' onClick={this.props.me.language !== 'en' ? () => (this.selectLanguage('en')) : () => (this.selectLanguage('fr'))}><i className='fas fa-language'></i></span>
								<span className='separator'></span>
							</span>
							<Link to='/profile'>
								<span onClick={this.emptySearch} className='profileSectionLink'>
									{language.profileLink[this.props.me.language]}
								</span>
							</Link>
							<span className='separator'></span>
							<Logout />
						</span>
					</span>
					<div className=''>
						<span className='menuType'>
							<Link to='/'>
								<span
									className={
										this.props.location.pathname === '/profile' || this.props.location.pathname.substring(0, 3) === '/tv'
										?
										'fontGrey moviesSectionLink'
										:
										'moviesSectionLink'
									}
									onClick={
										this.props.location.pathname !== '/profile' && this.props.location.pathname.substring(0, 3) !== '/tv'
										?
										/^\/[0-9]+\/*$/.test(this.props.location.pathname)
										?
										null
										:
										() => this.props.dispatch(changeSearch())
										:
										() => this.props.dispatch(changeSearch(this.props.search))
									}>
									{language.moviesSectionLink[this.props.me.language]}
								</span>
							</Link>
							<span className='separator'></span>
							<Link to='/tv'>
								<span
									className={
										this.props.location.pathname.substring(0, 3) === '/tv'
										?
										'tvSectionLink'
										:
										'tvSectionLink fontGrey'
									}
									onClick={
										this.props.location.pathname.substring(0, 3) === '/tv'
										?
										this.props.location.pathname.substring(0, 4) === '/tv/'
										?
										null
										:
										() => this.props.dispatch(changeSearch())
										:
										() => this.props.dispatch(changeSearch(this.props.search))
									}>
									{language.tvSectionLink[this.props.me.language]}
								</span>
							</Link>
						</span>
						<span className='magnifyingGlassLogo'>
							<i className='fas fa-search'></i>
						</span>
						<input
							value={
								this.props.search
								?
								this.props.search
								:
								''
							}
							className='menuSearch spaceLeft'
							placeholder={language.quickSearchLabel[this.props.me.language]}
							type='text' onChange={event => this.search(event)}
							onKeyDown={event => this.handleKeyDown(event)}
							ref={this.searchInput} />
					</div>
				</div>

			</div>
		);
	}
}

function mapStateToProps(state) {
	const { me, searchSettings } = state.handleMe;
	return ({
		me,
		search: searchSettings.search
	})
}

export default withRouter(connect(mapStateToProps)(Menu))
