import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import Datepicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css';
import { NotificationManager} from 'react-notifications';
import 'react-notifications/lib/notifications.css';
import { fetchWrap } from '../../services/fetchWrap'
import Input from '../../components/input'
import Erreur from '../../components/erreur'

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
    if (this.state.error.length === 0)
    {
      fetchWrap('api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'same-origin',
        body: JSON.stringify({
          username: this.state.username,
          firstname: this.state.firstname,
          lastname: this.state.lastname,
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
    var test = Object.assign({}, this.state.error, error)
    this.setState({
        error: test
      })
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
        <Input type="text" name="firstname" placeholder="Prénom" required onChange={this.handleInputChange} /><br />
        <Input type="text" name="lastname" placeholder="Nom" required onChange={this.handleInputChange} /><br />
        <Input type="email" name="email" placeholder="Email" required onChange={this.handleInputChange} /><br />
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
