import React from 'react';
import { fetchWrap } from '../../services/fetchWrap'
import {NotificationManager} from 'react-notifications';
import 'react-notifications/lib/notifications.css';
import Input from '../../components/input'

class Reset extends React.Component {
  
  constructor(props) {
    super(props)
    this.state = {
      login: '',
      error: {}
    }
  }

  sendMail = event => {
    event.preventDefault();
    if (Object.keys(this.state.error).length === 0 && this.state.error.constructor === Object){
      fetchWrap('/reset', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          login: this.state.login
        })
      })
      .then(res => NotificationManager.success("Email sent!!", 'Reset', 5000, () => {}))
        .catch((error) => {
           if (error)
            this.setState({ error })
        });
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
    return (
      <div className="connexion">
        <form onSubmit={(e) => this.sendMail(e)} >
          <Input type="text" name="login" placeholder="Login" required error={this.handleError} validation={[6]} onChange={this.handleInputChange} /><br />
          <button type="submit">Reset my password</button>
        </form>
      </div>
    )
  }
}

export default Reset;