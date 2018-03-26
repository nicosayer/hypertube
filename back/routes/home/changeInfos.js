const express = require('express');
const router = express.Router();

const mongo = require('../../mongo');
const mongodb = mongo.getMongodb();

router.post('/', function(req, res, next) {
	console.log(req.body)
	var { login, firstName, lastName, email } = req.body

	var errors = {}

	if (typeof login === 'undefined' || typeof firstName === 'undefined' || typeof lastName === 'undefined' || typeof email === 'undefined') {
		errors.error = 'default';
	}
	else {
		console.log(email)
		console.log(firstName)
		console.log(lastName)
		console.log(errors)

		email = email.toLowerCase();
		firstName = firstName.toLowerCase();
		lastName = lastName.toLowerCase();

		firstName = firstName.replace(/\s+/g, ' ');
		lastName = lastName.replace(/\s+/g, ' ');

		console.log(errors)

		if (login.length> 0 && login.length < 6) {
			errors.login = 'default';
		}
		if (login.length > 20) {
			errors.login = 'default';
		}
		if (!(/^[a-zà-ÿ0-9]+$/i.test(login))) {
			errors.login = 'default';
		}
console.log(errors)

		if (email.length> 0 && email.length < 4) {
			errors.email = 'default';
		}
		if (email.length > 50) {
			errors.email = 'default';
		}
		if (!(/^.+@.+\..+$/.test(email))) {
			errors.email = 'default';
		}
console.log(errors)

		if (firstName.length> 0 && firstName.length < 1) {
			errors.firstName = 'default'
		}
		if (firstName.length > 20) {
			errors.firstName = 'default'
		}
		if (!(/^[a-zà-ÿ ]+$/i.test(firstName))) {
			errors.firstName = 'default'
		}

console.log(errors)
		if (lastName.length> 0 && lastName.length < 1) {
			errors.lastName = 'default'
		}
		if (lastName.length > 20) {
			errors.lastName = 'default'
		}
		if (!(/^[a-zà-ÿ ]+$/i.test(lastName))) {
			errors.lastName = 'default'
		}
		console.log(errors)
	}

	if (!req.session || !req.session._id){
		errors.auth = 'default'
	}

	if (Object.keys(errors).length === 0) {

		const db = mongo.getDb();
		const collection = db.collection('users');

		var update = {}
		if (login.length > 0)
			update.login = login
		if (firstName.length > 0)
			update.firstName = firstName
		if (lastName.length > 0)
			update.lastName = lastName
		console.log(update)

		collection.findOne({email: email}, function (error, result) {
			if (error) throw error;
			
			if ((result && result._id.toString() != new mongodb.ObjectId(req.session._id).toString()) && email.length > 0) {
				collection.update(
					{_id: new mongodb.ObjectId(req.session._id)},
					{$set: update}, function (err, result) {
					if (err) throw err;

					errors.email = 'duplicate'
					res.status(300).json(errors);
				});
			}
			else {
				if (email.length > 0)
					update.email = email
				collection.update(
					{_id: new mongodb.ObjectId(req.session._id)},
					{$set: update}, function (err, result) {
					if (err) throw err;

					res.status(202)
				});
			}
		})
	}
	else {
		res.status(300).json(errors);
	}
});


module.exports = router;

