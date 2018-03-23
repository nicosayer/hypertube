var express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');

var mongo = require('../mongo');

module.exports = function(post, isOAuth) {
	var errors = {};
	var db = mongo.getDb();
	const collection = db.collection('users');

	Object.keys(post).filter(function(key, index) {
		if (key === "password") {
			return false;
		}
		return true;
	}).map(function(key, index) {
		if (key !== "oauth") {
			post[key] = post[key].trim();
		}
	});


	post.firstName = post.firstName.toLowerCase().replace(/\s+/g, ' ');
	post.lastName = post.lastName.toLowerCase().replace(/\s+/g, ' ');
	
	if (post.email) {
		post.email = post.email.toLowerCase();
	}

	if (!(post.firstName && post.lastName && post.login && post.email && post.password)) {
		if (errors.fields === undefined)
		errors.fields = [];
		errors.fields.push("Please fill all fields");
	}

	if (post.email && !(/^.+@.+\..+$/.test(post.email))) {
		if (errors.email === undefined)
		errors.email = [];
		errors.email(["Your email is not valid"]);
	}


	if (post.login && !(/^[a-zà-ÿ0-9_]+$/i.test(post.login))) {
		if (errors.login === undefined)
		errors.login = [];
		errors.login.push("Your login should contain only letters, numbers and underscores");
	}

	if (post.firstName && post.firstName.length < 2) {
		if (errors.firstName === undefined)
		errors.firstName = [];
		errors.firstName.push("Your first name should be at least 2 characters long");
	}

	if (post.firstName && post.firstName.length > 20) {
		if (errors.firstName === undefined)
		errors.firstName = [];
		errors.firstName.push("Maximum length for your first name is 20 characters");
	}

	if (post.firstName && !(/^[a-zà-ÿ ]+$/i.test(post.firstName))) {
		if (errors.firstName === undefined)
		errors.firstName = [];
		errors.firstName.push("Your first name should contain only letters and dashes");
	}


	if (post.lastName && post.lastName.length < 2) {
		if (errors.lastName === undefined)
		errors.lastName = [];
		errors.lastName.push("Your last name should be at least 2 characters long");
	}

	if (post.lastName && post.lastName.length > 20) {
		if (errors.lastName === undefined)
		errors.lastName = [];
		errors.lastName.push("Maximum length for your last name is 20 characters");
	}

	if (post.lastName && !(/^[a-zà-ÿ ]+$/i.test(post.lastName))) {
		if (errors.lastName === undefined)
		errors.lastName = [];
		errors.lastName.push("Your last name should contain only letters and dashes");
	}


	if (post.password && post.password.length < 6) {
		if (errors.password === undefined)
		errors.password = [];
		errors.password.push("Your password should be at least 6 characters long");
	}

	if (post.password && post.password.length > 20) {
		if (errors.password === undefined)
		errors.password = [];
		errors.password.push("Maximum length for your password is 20 characters");
	}


	if (post.login && post.login.length < 4) {
		if (errors.login === undefined)
		errors.login = [];
		errors.login.push("Your login should be at least 4 characters long");
	}

	if (post.login && post.login.length > 12) {
		if (errors.login === undefined)
		errors.login = [];
		errors.login.push("Maximum length for your login is 12 characters");
	}

	if (post.email && post.email.length > 50) {
		if (errors.email === undefined)
		errors.email = [];
		errors.email.push("Maximum length for your email is 50 characters");
	}


	collection.findOne({oauth: post.oauth}, function (err, result) {
		if (err) throw err;

		if (result === null) {
			collection.findOne({email: post.email}, function (err, result) {
				if (err) throw err;
				const userResult = result;

				new Promise((resolve, reject) => {
					if (result !== null) {
						if (!isOAuth) {
							if (errors.email === undefined)
							errors.email = [];
							errors.email.push("This email is already taken");
							resolve(req.session._id);
						}
						else {
							collection.update(
								{email: post.email},
								{$set: {oauth: post.oauth}}, function (err, result) {
								if (err) throw err;

								req.session._id = userResult._id;
								return (result);
								resolve(req.session._id);
							});
						}
					}
					else {
						resolve(req.session._id);
					}
				})
				.then(data => {
					if (!isOAuth) {
						collection.findOne({login: {$regex: new RegExp("^" + post.login + "$", "i")}}, function (err, result) {
							if (err) throw err;

							if (result !== null) {
								if (errors.login === undefined)
								errors.login = [];
								errors.login.push("This login is already taken");
							}

							if (Object.keys(errors).length === 0) {
								bcrypt.genSalt(10, function(err, salt) {
									bcrypt.hash(post.password, salt, function(err, hash) {
										post.password = hash;

										collection.insert(post, function (err, result) {
											if (err) throw err;

											req.session._id = result.ops[0]._id;
											return (result.ops[0]);
										});
									});
								});
							}
							else {
								return (errors)
							}
						});
					}
					else if (isOAuth && req.session && !data) {
						collection.insert(post, function (err, result) {
							if (err) throw err;

							req.session._id = result.ops[0]._id;
							return (result.ops[0]);
						});
					}
				})
			});
		}
		else {
			req.session._id = result._id;
			return (result);
		}
	});

		
}










