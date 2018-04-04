import React, { Component } from 'react';
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
		if (event.which === 13 && event.target) {
			this.props.handleSearch(event.target.value);
		}
	}

	emptySearch() {
		this.props.handleSearch('');
		this.searchInput.current.value = '';
	}

	render() {
		return(
			<div className='menuBar'>
				<span className='floatLeft' onClick={this.emptySearch}>
					<Link to='/'>
						<span className='menuLogo'>
							<span className='fontGrey'>Hypertube</span>
							<i className='fas fa-space-shuttle spaceLeft'></i>
						</span>
					</Link>
				</span>
				<span className='floatRight'>
					<span className='menuProfile'>
						<span onClick={this.emptySearch}>
							<Link to='/profile'>
								My profile
							</Link>
						</span>
						<span className='fontGrey spaceLeft spaceRight'>
							|
						</span>
						<Logout />
					</span>
				</span>
				<i className='fas fa-search'></i>
				<input className='menuSearch spaceLeft' placeholder='Quick search' type='text' onKeyDown={event => this.search(event)} ref={this.searchInput} />
			</div>
		);
	}
}

export default Menu
