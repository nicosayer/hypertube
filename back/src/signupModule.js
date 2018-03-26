var express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');

var mongo = require('../mongo');

module.exports = function(req, post, isOAuth, callback) {
	var error = {};
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
		error.default = 'default';
	}

	if (post.login && post.login.length < 4) {
		error.login = 'default';
	}

	if (post.login && post.login.length > 20) {
		error.login = 'default';
	}

	if (post.email && post.email.length > 50) {
		error.email = 'default';
	}

	if (post.email && !(/^.+@.+\..+$/.test(post.email))) {
		error.email = 'default';
	}


	if (post.login && !(/^[a-zà-ÿ0-9]+$/i.test(post.login))) {
		error.login = 'default';
	}

	if (post.firstName && post.firstName.length < 1) {
		error.firstName = 'default';

	}

	if (post.firstName && post.firstName.length > 20) {
		error.firstName = 'default';

	}

	if (post.firstName && !(/^[a-zà-ÿ ]+$/i.test(post.firstName))) {
		error.firstName = 'default';
	}


	if (post.lastName && post.lastName.length < 1) {
		error.lastName = 'default';
	}

	if (post.lastName && post.lastName.length > 20) {
		error.lastName = 'default';
	}

	if (post.lastName && !(/^[a-zà-ÿ ]+$/i.test(post.lastName))) {
		error.lastName = 'default';
	}


	if (post.password && post.password.length < 6) {
		error.password = 'default';
	}

	if (post.password && post.password.length > 50) {
		error.password = 'default';
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

						collection.update({email: post.email}, {$set: {oauth: objTmp}}, function (err, result) {
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
				error.email = 'alreadyTaken';
			}

			collection.findOne({login: {$regex: new RegExp('^' + post.login + '$', 'i')}}, function (err, result) {
				if (err) throw err;

				if (result !== null) {
					error.login = 'alreadyTaken';
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
