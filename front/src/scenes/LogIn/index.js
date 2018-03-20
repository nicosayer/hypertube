import React, { Component } from 'react';
import { Redirect, Link } from 'react-router-dom';
import { connect } from 'react-redux'
import { logMe} from '../../actions/me'
import { fetchWrap } from '../../services/fetchWrap'

class LogIn extends Component {
  constructor(props) {
    super(props)
    this.state = {
      username: '',
      password: ''
    }

    this.handleFormSubmit = this.handleFormSubmit.bind(this)
    this.handleInputChange = this.handleInputChange.bind(this)
  }

  handleFormSubmit(event) {
    event.preventDefault()
    fetchWrap('api/auth', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: this.state.username,
        password: this.state.password
      })
    })
    .then(payload => {
        this.props.dispatch(logMe(payload))
    })
    .catch(error => {
      alert("error")
    })
    
  }

  handleInputChange(event) {
    this.setState({
      [event.target.name]: event.target.value
    })
  }

  render() {
    const { from } = this.props.location.state || { from: { pathname: "/" } }
    if (this.props.isAuthenticated) {
      return <Redirect to={from} />
    }

    return (
        <div className="connexion">
          <form onSubmit={this.handleFormSubmit} >
            <input type="text" name="username" placeholder="Pseudo" required value={this.state.username} onChange={this.handleInputChange}/><br />
            <input type="password" name="password" placeholder="Mot de passe" required value={this.state.password} onChange={this.handleInputChange}/>
            <button type="submit">Se connecter</button>
          </form>
          <Link to='/reset'>MDP oublié</Link>
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

export default connect(mapStateToProps)(LogIn)
