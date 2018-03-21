import React, { Component } from 'react';
import { Redirect, Link } from 'react-router-dom';
import { connect } from 'react-redux'
import { logMe} from '../../actions/me'
import { fetchWrap } from '../../services/fetchWrap'

class LogIn extends Component {
  constructor(props) {
    super(props)
    this.state = {
      login: '',
      password: ''
    }

    this.handleFormSubmit = this.handleFormSubmit.bind(this)
    this.handleInputChange = this.handleInputChange.bind(this)
  }

  handleFormSubmit(event) {
    event.preventDefault()
    fetchWrap('/login', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        login: this.state.login,
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
    if (this.props.isAuthenticated) {
      return <Redirect to="/" />
    }

    return (
        <div>
          <form onSubmit={this.handleFormSubmit} >
            <input type="text" name="login" placeholder="Login" required value={this.state.login} onChange={this.handleInputChange}/><br />
            <input type="password" name="password" placeholder="Password" required value={this.state.password} onChange={this.handleInputChange}/>
            <button type="submit">Log in</button>
          </form>
          <Link to='/reset'>Forgot your password?</Link>
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
