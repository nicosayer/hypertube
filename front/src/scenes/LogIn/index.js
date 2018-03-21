import React, { Component } from 'react';
import { Redirect, Link } from 'react-router-dom';
import { connect } from 'react-redux'
import { logMe} from '../../actions/me'
import { fetchWrap } from '../../services/fetchWrap'
import Input from '../../components/input'

class LogIn extends Component {
  constructor(props) {
    super(props)
    this.state = {
      login: '',
      password: '',
      error: {}
    }
  }

  handleFormSubmit(event) {
    event.preventDefault()
    if (Object.keys(this.state.error).length === 0 && this.state.error.constructor === Object) {
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
        if (error)
            this.setState({ error })
      })
    }
    
  }

  handleInputChange = (state, value) => {
    this.setState({
      [state]: value
    })
  }

  handleError = (error) => {
    var tmp;
    if (typeof error === "string")
    {
      tmp = this.state.error
      delete tmp[error]
      this.setState({
        error: tmp
      })
    }
    else
    {
      tmp = Object.assign({}, this.state.error, error)
      this.setState({
        error: tmp
      })
    }
  }

  render() {
    if (this.props.isAuthenticated) {
      return <Redirect to="/" />
    }

    return (
        <div>
          <form onSubmit={this.handleFormSubmit} >
            <Input type="text" name="login" placeholder="Login" required error={this.handleError} validation={[6]} onChange={this.handleInputChange} /><br />
            <Input type="password" name="password" placeholder="Password" required onChange={this.handleInputChange} error={this.handleError} validation={[6,"[0-9]","[a-zA-Z]"]} /><br />
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
