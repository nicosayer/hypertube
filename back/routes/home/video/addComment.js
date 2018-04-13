const express = require('express');
const router = express.Router();

const mongo = require('../../../mongo');
const mongodb = mongo.getMongodb();

router.post('/', function(req, res, next) {

	if (req && req.session && req.session._id && req.body) {
		const collection = mongo.getDb().collection('comments');
		console.log(req.body.comment);
		collection.insert({
			userId: req.session._id,
			comment: req.body.comment,
			canal: req.body.canal,
			movieId: req.body.movieId,
			date: new Date()
		});
		res.sendStatus(200);
	}
	else {
		res.sendStatus(300);
	}
});

module.exports = router;
