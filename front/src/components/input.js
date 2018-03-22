import React from 'react';

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
		if (event && event.which === 13) {
			if (this.props.blurOnEnter) {
				event.target.blur();
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
				event.target.value = event.target.value.trim()
			}
			if (this.props.validation && !this.props.validation.validateOnChange) {
				this.validation(name, event.target.value);
			}
			if (this.props.submitOnBlur) {
				this.handleSubmit(name, event.target.value);
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
		if (value) {
			if (this.props.validation.minLen && value.length < this.props.validation.minLen) {
				errors.minLen = true;
			}
			if (this.props.validation.maxLen && value.length > this.props.validation.maxLen) {
				errors.maxLen = true;
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
				this.setState({ valid: false })
			}
			this.props.validation.error(name, errors)
		}
		else if (!this.state.valid) {
			this.setState({ valid: true })
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
				className={!this.state.valid && this.props.validation ? this.props.validation.invalidClass : null}
				/>
		);
	}
}

export default Input;
