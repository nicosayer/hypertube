const express = require('express');
const router = express.Router();

const mongo = require('../../mongo');
const mongodb = mongo.getMongodb()

router.get('/', function(req, res, next) {

	if (req.session && req.session._id) {

		const db = mongo.getDb();
		const collection = db.collection('users');

		collection.findOne({_id: new mongodb.ObjectId(req.session._id)}, function (error, result) {
			if (error) throw error;
			res.status(200).json(result);
		})
	}
	else {
		res.status(403).json({error: 'User not connected'});
	}
});


module.exports = router;
