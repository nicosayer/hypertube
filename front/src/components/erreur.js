import React from 'react';

class Erreur extends React.Component {


  render() {
    console.log(this.props.error)
    const error = Object.keys(this.props.error)
      .map((item, key) => {
      	return this.props.error[item]
      		.map((item2, key2) => <li key={key+key2}>{item2}</li>)
  	});
    console.log(error)

    return (
      <ul >
        {error}
      </ul>
    )
  }
}

export default Erreur;