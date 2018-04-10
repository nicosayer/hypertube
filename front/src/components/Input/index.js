import React from 'react';

import './style.css';

class Input extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			valid: true
		}
		this.handleFocus = this.handleFocus.bind(this);
		this.handleKeyDown = this.handleKeyDown.bind(this);
		this.handleChange = this.handleChange.bind(this);
		this.handleBlur = this.handleBlur.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
	}

	handleFocus(event) {
		if (event) {
		}
	}

	handleKeyDown(event) {
		if (event && event.which === 13) {
			if (this.props.blurOnEnter) {
			}
			if (this.props.submitOnEnter) {
				this.handleSubmit(event.target.name, event.target.value);
			}
		}
	}

	handleChange(event) {
		if (this.props.onChange && event && event.target) {
			const name = event.target.name;
			if (this.props.forbiddenChars) {
				console.log(this.props.forbiddenChars)
				event.target.value = event.target.value.replace(this.props.forbiddenChars, '');
			}
			if (this.props.maxLen) {
				event.target.value = event.target.value.substring(0, this.props.maxLen);
			}
			if (this.props.validation && this.props.validation.validateOnChange) {
				this.validation(name, event.target.value);
			}

			this.props.onChange(name, event.target.value);
			if (this.props.submitOnChange) {
				this.handleSubmit(name, event.target.value);
			}
		}
	}

	handleBlur(event) {
		if (event && event.target) {
			const name = event.target.name;
			if (this.props.trimOnBlur) {
				event.target.value = event.target.value.trim();
			}
			if (this.props.validation) {
				this.validation(name, event.target.value);
			}
			if (this.props.submitOnBlur) {
				this.handleSubmit(name, event.target.value);
			}
			if (this.props.onBlur) {
				this.props.onBlur(name, event.target.value);
			}
		}
	}

	handleSubmit(name, value) {
		if (this.props.onSubmit && name && value) {
			this.props.onSubmit(name, value);
		}
	}

	validation(name, value) {
		var errors = {};

		if (value || !this.props.validation.emptyIsValid) {
			if (this.props.validation.minLen && value.length < this.props.validation.minLen) {
				errors.minLen = this.props.validation.minLen;
			}
			if (this.props.validation.maxLen && value.length > this.props.validation.maxLen) {
				errors.maxLen = this.props.validation.maxLen;
			}
			if (this.props.validation.format) {
				const regex = new RegExp(this.props.validation.format);
				if (!regex.test(value)) {
					errors.format = true;
				}
			}
		}
		if (Object.keys(errors).length) {
			if (this.state.valid) {
				this.setState({ valid: false });
			}
			if (this.props.validation.invalidClass) {
				this.input.classList.add(this.props.validation.invalidClass);
			}
		}
		else if (!this.state.valid) {
			this.setState({ valid: true });
			if (this.props.validation.invalidClass) {
				this.input.classList.remove(this.props.validation.invalidClass);
			}
		}
		if (this.props.validation.handleValidation) {
			this.props.validation.handleValidation(name, errors);
		}
	}

	validateProps() {
		const validProps = ['id', 'type', 'name', 'value', 'placeholder', 'checked', 'disabled', 'className'];
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
				ref={input => { this.input = input; }}
				onFocus={this.handleFocus}
				onKeyDown={this.handleKeyDown}
				onChange={this.handleChange}
				onBlur={this.handleBlur}
				/>
		);
	}
}

export default Input;
