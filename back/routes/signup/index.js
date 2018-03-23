var express = require('express');
const router = express.Router();
const htmlspecialchars = require('htmlspecialchars');
const bcrypt = require('bcrypt');

var mongo = require('../../mongo');

router.post('/', function(req, res, next) {
	const post = req.body;
	var errors = {};
	var db = mongo.getDb();
	const collection = db.collection('users');

	Object.keys(post).filter(function(key, index) {
		if (key === "password") {
			return false;
		}
		return true;
	}).map(function(key, index) {
		post[key] = post[key].trim();
	});

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

	Object.keys(post).map(function(key, index) {
	   post[key] = htmlspecialchars(post[key]);
	});

	collection.findOne({email: post.email}, function (err, result) {
		if (err) throw err;

		if (result !== null) {
			if (errors.email === undefined)
				errors.email = [];
			errors.email.push("This email is already taken");
		}

		collection.findOne({login: post.login}, function (err, result) {
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
						post.firstName = post.firstName.trim().replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
						post.lastName = post.lastName.trim().replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
						post.firstName = post.firstName.replace(/\s+/g, ' ');
						post.lastName = post.lastName.replace(/\s+/g, ' ');
						collection.insert(post, function (err, result) {
							if (err) throw err;

							req.session._id = result.ops[0]._id;
							res.status(202).json(result.ops[0]);
						});
					});
				});
			} else {
				res.status(400).json(errors)
			}

		});

	});

});

module.exports = router;
