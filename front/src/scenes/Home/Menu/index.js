import React, { Component } from 'react';
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import { Link } from 'react-router-dom';

import Logout from './LogOut';

import './style.css';

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
						<span className='menuType'>
							<Link to='/'><span className={this.props.location.pathname === '/profile' || this.props.location.pathname.substring(0, 3) === '/tv' ? 'fontGrey' : null}>Movies</span></Link>
							<span className='fontGrey spaceLeft spaceRight'>|</span>
							<Link to='/tv'><span className={this.props.location.pathname.substring(0, 3) === '/tv' ? null : 'fontGrey'}>TV Shows</span></Link>
						</span>
					</span>
					<span className='floatRight'>
						<span className='menuProfile'>
							<span className='menuLanguage'>
								en
								<span className='fontGrey spaceLeft spaceRight'>|</span>
								<span className='fontGrey'>fr</span>
							</span>
							<span onClick={this.emptySearch}>
								<Link to='/profile'>
									My profile
								</Link>
							</span>
							<span className='fontGrey spaceLeft spaceRight'>|</span>
							<Logout />
						</span>
					</span>
					<i className='fas fa-search'></i>
					<input className='menuSearch spaceLeft' placeholder='Quick search' type='text' onChange={event => this.search(event)} onKeyDown={event => this.handleKeyDown(event)} ref={this.searchInput} />
				</div>

			</div>
		);
	}
}

export default withRouter(connect()(Menu))
