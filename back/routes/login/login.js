var express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');

var mongo = require('../../mongo');

router.post('/', function(req, res, next) {
	const post = req.body;
	var db = mongo.getDb();
	const collection = db.collection('users');

	if (!post.login || !post.password) {
		res.json({fields: "Some informations are missing"});
	}
	else {
		post.login = post.login.trim();

		collection.findOne({ $or: [ {email: post.login}, {login: post.login} ] }, function (err, result) {
			if (err) throw err;

			if (result !== null) {
				res.json({login: "No user was found with that username"});
			}
			else {
				console.log('result');
				// const userInfo = result[0];

				// bcrypt.compare(post.password, userInfo.password, function(error, result) {
				// 	if (error) throw error;
				// 	if (result !== true) {
				// 		res.json({errors:"The password is incorrect"});
				// 	}
				// 	else {
				// 		req.session.login = userInfo.login;
				// 		res.status(202).json({login: userInfo.login});
				// 	}
				// });
			}
		});
	}
});

module.exports = router;