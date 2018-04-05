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
							this.state.search ?
								[
									<Route key='movie' path='/:id([0-9]+)' component={Movies} />,
									<Route key='search' render={props => <Search {...props} search={this.state.search} />} />
								]
							:
							[
								<Route key='movie' path='/:id([0-9]+)' component={Movies} />,
								<Route exact path='/profile' key='profile' component={Profile} />,
								<Route key='search' render={props => <Search {...props} search={this.state.search} />} />
							]
						}
					</Switch>
				</div>
			</BrowserRouter>
		);
	}
}

export default Home
