import React from 'react';

import './style.css'

class Tooltip extends React.Component {

	render() {
		return (
				<span className={this.props.visible ? 'tooltiptext' : 'hideToolTip'}>
					{ this.props.text ? this.props.text : null }
				</span>
		);
	}
}

export default Tooltip;
