import React from 'react';

class Erreur extends React.Component {

	render() {
		const errors = Object.keys(this.props.errors)
		.map((item, key) => {
			return this.props.errors[item]
			.map((item2, key2) => <li key={key+key2}>{item2}</li>)
		});

		return (
			<ul>
				{errors}
			</ul>
		)
	}
}

export default Erreur;
