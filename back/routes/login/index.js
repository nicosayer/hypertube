const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const mongo = require('../../mongo');


router.post('/', function(req, res, next) {

	const post = req.body;
	const db = mongo.getDb();
	const collection = db.collection('users');

	if (!post.login || !post.password) {
		res.status(400).json({fields: ["Some informations are missing"]});
	}
	else {
		post.login = post.login.trim();

		collection.findOne(
		{ $or:
			[
				{email: {$regex: new RegExp("^" + post.login + "$", "i")}},
				{login: {$regex: new RegExp("^" + post.login + "$", "i")}}
			]
		}, function (err, result) {
			if (err) throw err
			const mongoResult = result

			if (result === null) {
				res.status(400).json({login: ["No user was found with that username"]});
			}
			else {
				const password = result.password;

				bcrypt.compare(post.password, password, function(error, result) {
					if (error) throw error;

					if (result !== true) {
						res.status(400).json({password: ["The password is incorrect"]});
					}
					else {
						req.session._id = mongoResult._id;
						res.status(202).json(mongoResult);
					}
				});
			}
		});
	}
});


module.exports = router;
