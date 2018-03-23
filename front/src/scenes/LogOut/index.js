import React, { Component } from 'react'

class LogOut extends Component {
	
	constructor(props) {
		super(props)

		this.logout = this.logout.bind(this)
	}

	logout() {
		fetch('/logout', {
			method: 'DELETE',
			credentials: 'include'
		})
		.then(() => {
			window.location.reload()
		})
	}

	render() {
		return <input type="submit" value="Logout" onClick={this.logout} />
	}
}

export default LogOut
