var express = require('express');
var mongo = require('mongo');
var db = mongo.getDb();

router.post('/', function(req, res, next) {
	const post = req.body;
	var errors = {};

	Object.keys(post).filter(function(key, index) {
		if (key === "password") {
			return false;
		}
		return true;
	}).map(function(key, index) {
		post[key] = post[key].trim();
	});


	if (post.email && !(/^.+@.+\..+$/.test(post.email))) {
		errors.email(["Your email is not valid"]);
	}



	if (post.login && !(/^[a-z0-9_]+$/i.test(post.login))) {
		errors.("Your login should contain only letters, numbers and underscores");
	}
	if (post.first_name && post.first_name.length < 2) {
		errorsArray.push("Your first name should be at least 2 characters long");
	}
	if (post.first_name && post.first_name.length > 20) {
		errorsArray.push("Maximum length for your first name is 20 characters");
	}



	if (post.last_name && post.last_name.length < 2) {
		errorsArray.push("Your last name should be at least 2 characters long");
	}
	if (post.last_name && post.last_name.length > 20) {
		errorsArray.push("Maximum length for your last name is 20 characters");
	}



	if (post.password && post.password.length < 6) {
		errors.password(["Your password should be at least 6 characters long"]);
	}
	if (post.password && post.password.length > 20) {
		errors.password.push("Maximum length for your password is 20 characters");
	}



	if (post.login && post.login.length < 4) {
		errorsArray.push("Your login should be at least 4 characters long");
	}
	if (post.login && post.login.length > 12) {
		errorsArray.push("Maximum length for your login is 12 characters");
	}


	if (post.email && post.email.length > 50) {
		errorsArray.push("Maximum length for your email is 50 characters");
	}


	Object.keys(post).map(function(key, index) {
	   post[key] = htmlspecialchars(post[key]);
	});


	db.query('SELECT * FROM users WHERE email = ?', post.email, function (error, results, fields) {

		if (error) throw error;

		if (results.length != 0) {
			errorsArray.push("This email is already taken");
		}

		db.query('SELECT * FROM users WHERE login = ?', post.login, function (error, results, fields) {

			if (error) throw error;

			if (results.length) {
				errorsArray.push("This login is already taken");
			}

			if (errorsArray.length == 0) {

				bcrypt.genSalt(10, function(err, salt) {
					bcrypt.hash(post.password, salt, function(err, hash) {
						post.password = hash;
						post.first_name = post.first_name.trim().replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
						post.last_name = post.last_name.trim().replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
						db.query('INSERT INTO users SET ?', post, function (error, results, fields) {
							if (error) throw error;
							req.session.login = post.login;
							res.sendStatus(201);
						});
					});
				});
			} else {
				res.json(errors);
			}

		});

	});

});