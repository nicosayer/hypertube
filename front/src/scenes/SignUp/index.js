import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { NotificationManager, NotificationContainer} from 'react-notifications';
import 'react-notifications/lib/notifications.css';
import { fetchWrap } from '../../services/fetchWrap'
import Input from '../../components/input'

class SignIn extends Component {
  constructor(props) {
    super(props)
    this.state = {
      login: '',
      password: '',
      password2: '',
      firstname: '',
      lastname: '',
      email: '',
      isSignedIn: false,
      error: {}
    }

    this.handleFormSubmit = this.handleFormSubmit.bind(this)
    this.handleInputChange = this.handleInputChange.bind(this) 
    this.handleChange = this.handleChange.bind(this)    
  }

  handleFormSubmit(e) {
    e.preventDefault();
    if (Object.keys(this.state.error).length === 0 && this.state.error.constructor === Object)
    {
      fetchWrap('/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          login: this.state.login,
          first_name: this.state.firstname,
          last_name: this.state.lastname,
          email: this.state.email,
          password: this.state.password
        })
      })
      .then(() => {
        NotificationManager.success("Sign up successfull, now let's stream!!", 'Signed Up!', 5000, () => {});
        this.setState({
          isSignedIn: true
        })
      })
      .catch(error => {
        NotificationManager.error("There has been an error in sign up, please try again", 'Error!', 5000, () => {});
      })
    }
  }

  handleChange(date) {
    this.setState({
      startDate: date
    });
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
    if (this.state.isSignedIn) {
      return <Redirect to="/login" />
    }
    return (
      <div>
      <form className="inscription" onSubmit={this.handleFormSubmit}>
        <Input type="text" name="login" placeholder="Pseudo" required error={this.handleError} validation={[6]} onChange={this.handleInputChange} /><br />
        <Input type="text" name="firstname" placeholder="Firstname" required onChange={this.handleInputChange} error={this.handleError} validation={[2]} /><br />
        <Input type="text" name="lastname" placeholder="Lastname" required onChange={this.handleInputChange} error={this.handleError} validation={[2]} /><br />
        <Input type="email" name="email" placeholder="Email" required onChange={this.handleInputChange} error={this.handleError} validation={[6,'^.+@.+\\..+$']} forbiddenChars={[' ']} /><br />
        <Input type="password" name="password" placeholder="Password" required onChange={this.handleInputChange} error={this.handleError} validation={[6,"[0-9]","[a-zA-Z]"]} /><br />
        <button type="submit">Sign Up</button>
      </form>
      <NotificationContainer/>
      </div>
    )
  }
}

export default SignIn
