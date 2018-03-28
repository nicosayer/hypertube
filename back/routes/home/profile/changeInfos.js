const express = require('express');
const router = express.Router();

const mongo = require('../../../mongo');
const mongodb = mongo.getMongodb();

router.post('/', function(req, res, next) {
	var { login, firstName, lastName, email } = req.body;

	console.log(req.body);
	var errors = {}

	if (login === undefined || firstName === undefined || lastName === undefined || email === undefined) {
		errors.error = 'default';
	}
	else if (!req.session || !req.session._id) {
		errors.error = 'auth';
	}
	else {

		email = email.toLowerCase();
		firstName = firstName.toLowerCase();
		lastName = lastName.toLowerCase();

		firstName = firstName.replace(/\s+/g, ' ');
		lastName = lastName.replace(/\s+/g, ' ');

		firstName = firstName.trim();
		lastName = lastName.trim();

		if (login.length > 0 && login.length < 6) {
			errors.login = 'default';
		}
		if (login.length > 20) {
			errors.login = 'default';
		}
		if (login.length > 0 && !(/^[a-zà-ÿ0-9]+$/i.test(login))) {
			errors.login = 'default';
		}

		if (email.length> 0 && email.length < 4) {
			errors.email = 'default';
		}
		if (email.length > 50) {
			errors.email = 'default';
		}
		if (email.length > 0 && !(/^.+@.+\..+$/.test(email))) {
			errors.email = 'default';
		}

		if (firstName.length> 0 && firstName.length < 1) {
			errors.firstName = 'default'
		}
		if (firstName.length > 20) {
			errors.firstName = 'default'
		}
		if (firstName.length > 0 && !(/^[a-zà-ÿ ]+$/i.test(firstName))) {
			errors.firstName = 'default'
		}

		if (lastName.length> 0 && lastName.length < 1) {
			errors.lastName = 'default'
		}
		if (lastName.length > 20) {
			errors.lastName = 'default'
		}
		if (lastName.length > 0 && !(/^[a-zà-ÿ ]+$/i.test(lastName))) {
			errors.lastName = 'default'
		}
	}

	if (!('error' in errors)) {
		const db = mongo.getDb();
		const collection = db.collection('users');

		var update = {}
		if (firstName.length > 0 && !('firstName' in errors))
		update.firstName = firstName
		if (lastName.length > 0 && !('lastName' in errors))
		update.lastName = lastName

		collection.findOne({email: email}, function (error, resultEmail) {
			collection.findOne({login: login}, function (error, resultLogin) {

				if (error) throw error;

				if (resultEmail && resultEmail._id.toString() != new mongodb.ObjectId(req.session._id).toString() && email.length > 0) {
					errors.email = 'duplicate'
				}
				if (resultLogin && resultLogin._id.toString() != new mongodb.ObjectId(req.session._id).toString() && login.length > 0) {
					errors.login = 'duplicate'
				}
				if (email.length > 0 && !('email' in errors))
				update.email = email
				if (login.length > 0 && !('login' in errors))
				update.login = login
				if (Object.keys(update).length === 0) {
					res.sendStatus(202)
				}
				else if (Object.keys(errors).length === 0) {
					collection.findAndModify(
						{_id: new mongodb.ObjectId(req.session._id)}, [],
						{$set: update}, {new: true}, function (err, result) {
							if (err) throw err;
							const user = {
								_id: result.value._id,
								firstName: result.value.firstName ? result.value.firstName : '',
								lastName: result.value.lastName ? result.value.lastName : '',
								login: result.value.login ? result.value.login : '',
								email: result.value.email ? result.value.email : ''
							}
							res.status(202).json(user)
						});
					}
					else {
						collection.findAndModify(
							{_id: new mongodb.ObjectId(req.session._id)}, [],
							{$set: update}, {new: true}, function (err, result) {
								if (err) throw err;
								const user = {
									_id: result.value._id,
									firstName: result.value.firstName ? result.value.firstName : '',
									lastName: result.value.lastName ? result.value.lastName : '',
									login: result.value.login ? result.value.login : '',
									email: result.value.email ? result.value.email : ''
								}
								res.status(300).json({errors: errors, user})
							});
						}
					})
				})
			}
			else {
				res.sendStatus(300)
			}

		});


		module.exports = router;
