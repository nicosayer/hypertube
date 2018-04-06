import React, { Component } from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom'

import Menu from './Menu';
import Profile from './Profile'
import Search from './Search';
import Movies from './Movies'

import './style.css';

class Home extends Component {

	constructor(props) {
		super(props)
		this.state = {
			search: ''
		}
		this.handleSearch = this.handleSearch.bind(this);
	}

	handleSearch(search) {
		this.setState({ search });
	}

	render() {
		return(
			<BrowserRouter>
				<div>
					<Menu handleSearch={this.handleSearch} />
					<Switch>
						{
							[
								<Route key='tv' path='/:id([0-9]+)' render={props => <Movies {...props} search={this.state.search} canal='movie' />} />,
								<Route key='movie' path='/tv/:id([0-9]+)' render={props => <Movies {...props} search={this.state.search} canal='tv' />} />,
								<Route key='profile' exact path='/profile'  component={Profile} />,
								<Route key='searchTv' path='/tv' render={props => <Search {...props} search={this.state.search} canal='tv' />} />,
								<Route key='searchMovie' render={props => <Search {...props} search={this.state.search} canal='movie' />} />
							]
						}
					</Switch>
				</div>
			</BrowserRouter>
		);
	}
}

export default Home
