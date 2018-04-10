const express = require('express');
const router = express.Router();

const mongo = require('../../mongo');
const mongodb = mongo.getMongodb();

router.post('/', function(req, res, next) {

	if (req.session && req.session._id && req.body && req.body.language) {
		console.log(req.body.language)
		const collection = mongo.getDb().collection('users');
		collection.update(
			{_id: new mongodb.ObjectId(req.session._id)}, { $set: { language: req.body.language } }, function (err, result) {
				if (err) throw err;
				res.sendStatus(200);
			}
		);
	}
	else {
		res.sendStatus(300);
	}
});

module.exports = router;
