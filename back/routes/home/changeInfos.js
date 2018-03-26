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
		if (firstName.length > 0)
			update.firstName = firstName
		if (lastName.length > 0)
			update.lastName = lastName
		console.log(update)

		collection.findOne({email: email}, function (error, resultEmail) {
			collection.findOne({login: login}, function (error, resultLogin) {
				if (error) throw error;
				
				if (resultEmail && resultEmail._id.toString() != new mongodb.ObjectId(req.session._id).toString() && email.length > 0) {
					errors.email = 'duplicate'
				}
				if (resultLogin && resultLogin._id.toString() != new mongodb.ObjectId(req.session._id).toString() && login.length > 0) {
					errors.login = 'duplicate'
				}
				if (Object.keys(errors).length === 0) {
					if (email.length > 0)
						update.email = email
					if (login.length > 0)
						update.login = login
					collection.findAndModify(
						{_id: new mongodb.ObjectId(req.session._id)}, [],
						{$set: update}, {new: true}, function (err, result) {
						if (err) throw err;
console.log(result)
						res.status(202).json(result.value)
					});
				}
				else {
					if (typeof errors.email == 'undefined' && email.length > 0)
						update.email = email
					if (typeof errors.login == 'undefined' && login.length > 0)
						update.login = login
					collection.findAndModify(
						{_id: new mongodb.ObjectId(req.session._id)}, [],
						{$set: update}, {new: true}, function (err, result) {
						if (err) throw err;

						res.status(300).json({errors: errors, user: result.value})
					});
				}
			})
		})
	}
	else {
		collection.findOne({_id: new mongodb.ObjectId(req.session._id)}, function (error, result) {
			if (error) throw error;
			res.status(300).json({errors: errors, user: result});
		});
	}
});


module.exports = router;

