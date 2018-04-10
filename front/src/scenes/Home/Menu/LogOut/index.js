import React, { Component } from 'react'

class LogOut extends Component {

	constructor(props) {
		super(props)

		this.logout = this.logout.bind(this)
	}

	logout() {
		fetch('/home/logout', {
			method: 'DELETE',
			credentials: 'include'
		})
		.then(() => {
			window.location.href = '/';
		})
	}

	render() {
		return <div className='inline pointer' onClick={this.logout}><i className="fas fa-power-off"></i></div>
	}
}

export default LogOut
