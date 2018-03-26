const express = require('express');
const router = express.Router();

const mongo = require('../../mongo');
const mongodb = mongo.getMongodb();

router.get('/', function(req, res, next) {

	const { oldPassword, newPassword } = req.body

	var error = []

	if (typeof oldPassword == undefined || typeof newPassword == undefined) {
		error.error = 'default';
	}
	else {

		if (newPassword.length < 6) {
			error.password = 'default'
		}
		if (newPassword.length > 50) {
			error.password = 'default'
		}
		if (!(/[a-zA-Z]/i.test(newPassword))) {
			error.password = 'default'
		}
		if (!(/[0-9]/i.test(newPassword))) {
			error.password = 'default'
		}
	}

	if (!req.session || !req.session._id){
		error.auth = 'default'
	}

	if (error.length == 0) {

		const db = mongo.getDb();
		const collection = db.collection('users');

		collection.findOne({_id: new mongodb.ObjectId(req.session._id)}, function (error, result) {
			if (error) throw error;
			bcrypt.compare(oldPassword, result.password, function(error, result) {
				if (error) throw error;

				if (result !== true) {
					error.password = 'wrong'
					res.status(300).json(error);
				}
				else {
					collection.update(
						{_id: new mongodb.ObjectId(req.session._id)},
						{$set: {password: newPassword}}, function (err, result) {
						if (err) throw err;

						res.status(202)
					});
				}
			});
		})
	}
	else {
		res.status(300).json(error);
	}
});


module.exports = router;