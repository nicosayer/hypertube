const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const mongo = require('../../mongo');


router.post('/', function(req, res, next) {
	if (req.session && req.session._id) {
		res.sendStatus(300);
	}
	else {
		const post = req.body;
		const db = mongo.getDb();
		const collection = db.collection('users');

		if (!post.login || !post.password) {
			res.status(300).json(['default']);
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
						res.status(300).json(['login']);
					}
					else {
						const password = result.password;

						bcrypt.compare(post.password, password, function(error, result) {
							if (error) throw error;

							if (result !== true) {
								res.status(300).json(['password']);
							}
							else {
								req.session._id = mongoResult._id;
								res.status(202).json(mongoResult);
							}
						});
					}
				}
			);
		}
	}
});


module.exports = router;
