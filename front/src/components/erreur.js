import React from 'react';

class Erreur extends React.Component {


  render() {
    console.log(this.props.error)
    const error = Object.keys(this.props.error)
      .map((item, key) => {
      	alert(item.valueOf())
      	item
      		.map((item2, key2) => <li key={key+key2}>{item2}</li>)
  	});

    return (
      <ul >
        {error}
      </ul>
    )
  }
}

export default Erreur;