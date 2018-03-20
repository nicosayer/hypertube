import React from 'react';

class Erreur extends React.Component {


  render() {
    
    const error = this.props.error
      .map((item, key) => <li key={key}>{item}</li>);

    return (
      <ul >
        {error}
      </ul>
    )
  }
}

export default Erreur;