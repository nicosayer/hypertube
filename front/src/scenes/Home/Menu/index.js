import React, { Component } from 'react';
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import { Link } from 'react-router-dom';

import Logout from './LogOut';

import { changeLanguage } from '../../../actions/me'

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
								<span className={this.props.language === 'en' ? 'pointer' : 'fontGrey pointer'} onClick={this.props.language !== 'en' ? () => (this.props.dispatch(changeLanguage('en'))) : null}>en</span>
								<span className='fontGrey spaceLeft spaceRight'>|</span>
								<span className={this.props.language === 'fr' ? 'pointer' : 'fontGrey pointer'} onClick={this.props.language !== 'fr' ? () => (this.props.dispatch(changeLanguage('fr'))) : null}>fr</span>
							</span>
							<span onClick={this.emptySearch}>
								<Link to='/profile'>
									{language.profileLink[this.props.language]}
								</Link>
							</span>
							<span className='fontGrey spaceLeft spaceRight'>|</span>
							<Logout />
						</span>
					</span>
					<span className='menuType'>
						<Link to='/'><span className={this.props.location.pathname === '/profile' || this.props.location.pathname.substring(0, 3) === '/tv' ? 'fontGrey' : null}>{language.moviesSectionLink[this.props.language]}</span></Link>
						<span className='fontGrey spaceLeft spaceRight'>|</span>
						<Link to='/tv'><span className={this.props.location.pathname.substring(0, 3) === '/tv' ? null : 'fontGrey'}>{language.tvSectionLink[this.props.language]}</span></Link>
					</span>
					<span className='magnifyingGlassLogo'><i className='fas fa-search'></i></span>
					<input className='menuSearch spaceLeft' placeholder={language.quickSearchLabel[this.props.language]} type='text' onChange={event => this.search(event)} onKeyDown={event => this.handleKeyDown(event)} ref={this.searchInput} />
				</div>

			</div>
		);
	}
}

function mapStateToProps(state) {
	const { language } = state.handleMe;
	return ({
		language
	})
}

export default withRouter(connect(mapStateToProps)(Menu))
