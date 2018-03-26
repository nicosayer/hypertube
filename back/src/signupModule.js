var express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');

var mongo = require('../mongo');

module.exports = function(req, post, isOAuth, callback) {
	var error = [];
	var db = mongo.getDb();
	const collection = db.collection('users');

	Object.keys(post).filter(function(key, index) {
		if (key === 'password') {
			return false;
		}
		return true;
	}).map(function(key, index) {
		if (key !== 'oauth') {
			post[key] = post[key].trim();
		}
	});

	post.firstName = post.firstName.toLowerCase().replace(/\s+/g, ' ');
	post.lastName = post.lastName.toLowerCase().replace(/\s+/g, ' ');

	if (post.email) {
		post.email = post.email.toLowerCase();
	}

	if (!(post.firstName && post.lastName && post.login && post.email && post.password)) {
		error.push('default');
	}

	if (post.login && post.login.length < 4) {
		if (!error.includes('login')) {
			error.push('login');
		}
	}

	if (post.login && post.login.length > 20) {
		if (!error.includes('login')) {
			error.push('login');
		}
	}

	if (post.email && post.email.length > 50) {
		if (!error.includes('email')) {
			error.push('email');
		}
	}

	if (post.email && !(/^.+@.+\..+$/.test(post.email))) {
		if (!error.includes('email')) {
			error.push('email');
		}
	}


	if (post.login && !(/^[a-zà-ÿ0-9]+$/i.test(post.login))) {
		if (!error.includes('login')) {
			error.push('login');
		}
	}

	if (post.firstName && post.firstName.length < 1) {
		if (!error.includes('firstName')) {
			error.push('firstName');
		}
	}

	if (post.firstName && post.firstName.length > 20) {
		if (!error.includes('firstName')) {
			error.push('firstName');
		}
	}

	if (post.firstName && !(/^[a-zà-ÿ ]+$/i.test(post.firstName))) {
		if (!error.includes('firstName')) {
			error.push('firstName');
		}
	}


	if (post.lastName && post.lastName.length < 1) {
		if (!error.includes('lastName')) {
			error.push('lastName');
		}
	}

	if (post.lastName && post.lastName.length > 20) {
		if (!error.includes('lastName')) {
			error.push('lastName');
		}
	}

	if (post.lastName && !(/^[a-zà-ÿ ]+$/i.test(post.lastName))) {
		if (!error.includes('lastName')) {
			error.push('lastName');
		}
	}


	if (post.password && post.password.length < 6) {
		if (!error.includes('password')) {
			error.push('password');
		}
	}

	if (post.password && post.password.length > 50) {
		if (!error.includes('password')) {
			error.push('password');
		}
	}
	

	if (isOAuth) {
		collection.findOne({oauth: post.oauth}, function (err, result) {
			if (err) throw err;

			if (!result) {
				collection.findOne({email: post.email}, function (err, result) {
					if (err) throw err;

					if (result) {
						const userResult = result;
						var objTmp = Object.assign({}, result.oauth, post.oauth);

						collection.update(
							{email: post.email},
							{$set: {oauth: objTmp}}, function (err, result) {
							if (err) throw err;

							req.session._id = userResult._id;
							callback(result);
						});
					}
					else {
						collection.insert(post, function (err, result) {
							if (err) throw err;

							req.session._id = result.ops[0]._id;
							callback(result.ops[0]);
						});
					}
				});
			}
			else {
				req.session._id = result._id;
				callback(result);
			}
		});
	}
	else {
		collection.findOne({email: post.email}, function (err, result) {
			if (err) throw err;

			if (result) {
				if (!error.includes('email')) {
					error.push('email');
				}
			}

			collection.findOne({login: {$regex: new RegExp('^' + post.login + '$', 'i')}}, function (err, result) {
				if (err) throw err;

				if (result !== null) {
					if (!error.includes('login')) {
						error.push('login');
					}
				}

				if (Object.keys(error).length === 0) {
					bcrypt.genSalt(10, function(err, salt) {
						bcrypt.hash(post.password, salt, function(err, hash) {
							post.password = hash;

							collection.insert(post, function (err, result) {
								if (err) throw err;

								req.session._id = result.ops[0]._id;
								callback(result.ops[0]);
							});
						});
					});
				}
				else {
					callback(error, 1);
				}
			});
		});
	}
}