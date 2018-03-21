import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import Datepicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css';
import { NotificationManager} from 'react-notifications';
import 'react-notifications/lib/notifications.css';
import { fetchWrap } from '../../services/fetchWrap'
import Input from '../../components/input'

class SignIn extends Component {
  constructor(props) {
    super(props)
    this.state = {
      username: '',
      password: '',
      password2: '',
      firstname: '',
      lastname: '',
      email: '',
      isSignedIn: false,
      startDate: null,
      error: ""
    }

    this.handleFormSubmit = this.handleFormSubmit.bind(this)
    this.handleInputChange = this.handleInputChange.bind(this) 
    this.handleChange = this.handleChange.bind(this)    
  }

  handleFormSubmit(e) {
    alert(this.state.username)
    e.preventDefault();
    if (Object.keys(this.state.error).length === 0 && this.state.error.constructor === Object)
    {
      fetchWrap('api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'same-origin',
        body: JSON.stringify({
          login: this.state.username,
          first_name: this.state.firstname,
          last_name: this.state.lastname,
          email: this.state.email,
          password: this.state.password
        })
      })
      .then(() => {
        NotificationManager.success("Vous avez bien été inscrit sur le site, maintenant il faut streamer!!", 'Inscription!', 5000, () => {});
        this.setState({
          isSignedIn: true
        })
      })
      .catch(error => {
        NotificationManager.error("L'inscription n'a pas marche", 'Erreur!', 5000, () => {});
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
      return <Redirect to="/" />
    }
    console.log(this.state.error)
    return (
      <div>
      <form className="inscription" onSubmit={this.handleFormSubmit}>
        <Input type="text" name="username" placeholder="Pseudo" required error={this.handleError} validation={[6]} onChange={this.handleInputChange} /><br />
        <Input type="text" name="firstname" placeholder="Prénom" required onChange={this.handleInputChange} error={this.handleError} validation={[2]} /><br />
        <Input type="text" name="lastname" placeholder="Nom" required onChange={this.handleInputChange} error={this.handleError} validation={[2]} /><br />
        <Input type="email" name="email" placeholder="Email" required onChange={this.handleInputChange} error={this.handleError} validation={[6,'^.+@.+\\..+$']} forbiddenChars={[' ']} /><br />
        <Input type="password" name="password" placeholder="Mot de passe" required onChange={this.handleInputChange} error={this.handleError} validation={[6,"[0-9]","[a-zA-Z]"]} /><br />
        <Input type="password" name="password2" placeholder="Confirmation mot de passe" required onChange={this.handleInputChange} error={this.handleError} validation={[6,"[0-9]","[a-zA-Z]", "^"+this.state.password+"$"]} />
        <Datepicker 
          selected={this.state.startDate}
          onChange={this.handleChange}
          showYearDropdown
          placeholderText="Date de naissance" />
        <button type="submit">S'inscrire</button>
      </form>
      </div>
    )
  }
}

export default SignIn
