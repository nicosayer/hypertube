const express = require('express');
const router = express.Router();

const mongo = require('../../mongo');
const mongodb = mongo.getMongodb();
const bcrypt = require('bcrypt');

router.post('/', function(req, res, next) {

	const { oldPassword, newPassword } = req.body

	var errors = {}

	if (typeof oldPassword == 'undefined' || typeof newPassword == 'undefined') {
		error.error = 'default';
	}
	else {
		console.log(errors)
		if (newPassword.length < 6) {
			errors.password = 'default'
		}
		if (newPassword.length > 50) {
			errors.password = 'default'
		}
		if (!(/[a-zA-Z]/i.test(newPassword))) {
			errors.password = 'default'
		}
		if (!(/[0-9]/i.test(newPassword))) {
			errors.password = 'default'
		}
		console.log(errors)
	}

	if (!req.session || !req.session._id){
		errors.auth = 'default'
	}

	if (Object.keys(errors).length === 0) {
console.log(errors)
		const db = mongo.getDb();
		const collection = db.collection('users');

		collection.findOne({_id: new mongodb.ObjectId(req.session._id)}, function (error, result) {
			if (error) throw error;
			bcrypt.compare(oldPassword, result.password, function(error, result) {
				if (error) throw error;

				if (result !== true) {
					errors.password = 'wrong'
					console.log(errors)
					res.status(300).json(errors);
				}
				else {
					bcrypt.genSalt(10, function(err, salt) {
						bcrypt.hash(newPassword, salt, function(err, hash) {
							collection.update(
								{_id: new mongodb.ObjectId(req.session._id)},
								{$set: {password: hash}}, function (err, result) {
								if (err) throw err;

								res.status(202)
							});
						});
					});
				}
			});
		})
	}
	else {
		res.status(300).json(errors);
	}
});


module.exports = router;