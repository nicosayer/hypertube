import React, { Component } from 'react';
import { connect } from 'react-redux'

import { fetchWrap } from '../../services/fetchWrap'

import Logout from './../LogOut'

class Home extends Component {

	constructor(props) {
		super(props)
		this.state = {
			firstName: '',
			lastName: '',
			login: '',
			email: '',
			password: ''
		}
	}

	componentDidMount() {
		fetchWrap('/home/getUserInfos', {
			method: 'GET',
			credentials: 'include'
		})
		.then(data => {
			this.setState({...data});
		})
		.catch(data => {
			console.log(data);
		})
	}

	render() {
		return (
			<div>
				First Name : {this.state.firstName}
				<br />
				Last Name : {this.state.lastName}
				<br />
				Login : {this.state.login}
				<br />
				Email : {this.state.email}
				<br />
				Password : {this.state.password}
				<br />
				<Logout />
			</div>
		)
	}
}

function mapStateToProps(state) {
	const { isAuthenticated } = state.handleMe
	return ({
		isAuthenticated
	})
}

export default connect(mapStateToProps)(Home)
