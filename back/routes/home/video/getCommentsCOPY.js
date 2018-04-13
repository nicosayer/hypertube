const express = require('express');
const router = express.Router();

const mongo = require('../../../mongo');
const mongodb = mongo.getMongodb();

router.post('/', function(req, res, next) {

	if (req && req.session && req.session._id && req.body) {
		const post = req.body;
		const collection = mongo.getDb().collection('comments');
		collection.find({
			$and:
			[
				{ canal: post.canal },
				{ movieId: post.movieId }
			]
		})
		.toArray((error, result) => {
			res.status(200).json(result);
		})
	}
	else {
		res.sendStatus(300);
	}
});

module.exports = router;
