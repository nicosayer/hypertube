const express = require('express');
const router = express.Router();

var mongo = require('../mongo');
const mongodb = mongo.getMongodb();

router.get('/', function(req, res, next) {
	if (req.session && req.session._id) {
		var db = mongo.getDb();
		const collection = db.collection('users');

		collection.findOne({_id: new mongodb.ObjectId(req.session._id)}, function (error, result) {
			if (error) throw error;
			res.status(200).json(result);
		})
	}
	else {
		res.sendStatus(300);
	}
});

module.exports = router;
