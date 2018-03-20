import React from 'react';
import './index.css'


class Input extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			valid: true
		}

		this.handleKeyDown = this.handleKeyDown.bind(this);
		this.handleChange = this.handleChange.bind(this);
		this.handleBlur = this.handleBlur.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
	}


	handleKeyDown(event) {
		if (event.which === 13) {
			if (this.props.blurOnEnter) {
				event.target.blur();
			}
			if (this.props.submitOnEnter) {
				this.handleSubmit(event.target.name, event.target.value);
			}
		}
	}


	handleChange(event) {
		if (this.props.onChange) {
			if (this.props.forbiddenChars) {
				const regex = new RegExp(this.props.forbiddenChars[0], this.props.forbiddenChars[1]);
				event.target.value = event.target.value.replace(regex, '');
			}
			if (this.props.maxLength) {
				event.target.value = event.target.value.substring(0, this.props.maxLength);
			}
			this.props.onChange(event.target.name, event.target.value);
			if (this.props.submitOnChange) {
				this.handleSubmit(event.target.name, event.target.value);
			}
		}
	}


	handleBlur(event) {
		if (this.props.submitOnBlur) {
			this.handleSubmit(event.target.name, event.target.value);
		}
		if (this.props.validation) {
			var error = []
			for (var i = 1; i < this.props.validation.length; i++) {
				var regex = new RegExp(this.props.validation[i])
				if (event.target.value.match(regex) === null)
				{
					if (i === 1)
						error.push(event.target.name+": Minimum 1 chiffre")
					else if (i === 2)
						error.push(event.target.name+": Minimum 1 lettre")
					else if (i === 3)
						error.push(event.target.name+": Les deux MDP sont differents")
				}
			}
			if ((error.length === 0 && event.target.value.length >= this.props.validation[0]) || event.target.value.length === 0) {
				this.setState({ valid: true })
				var ans = {}
				ans[event.target.name] = []
				this.props.error(ans)
			}
			else {
				if (event.target.value.length < this.props.validation[0])
					error.push(event.target.name+": Minimum "+this.props.validation[0]+" caracteres")
				var ans = {}
				ans[event.target.name] = error
				this.props.error(ans)
				this.setState({ valid: false })
			}
		}
	}


	handleSubmit(name, value) {
		if (this.props.onSubmit  && name) {
			const body = {
				name: name,
				value: value
			};
			this.props.onSubmit("/update/" + name, body);
		}
	}


	validateProps() {
		const validProps = ['id', 'type', 'name', 'value', 'placeholder', 'checked', 'disabled'];
		var finalProps = {};
	
		for (var key in this.props) {
			if (validProps.includes(key)) {
				finalProps[key] = this.props[key] ;
			}
		}
		return (finalProps);
	}


	render() {
		return (
			<input
				{...this.validateProps()}
				onKeyDown={this.handleKeyDown}
				onChange={this.handleChange}
				onBlur={this.handleBlur}
				className={this.state.valid?"":"invalid"}
				/>
		);
	}
}


export default Input;