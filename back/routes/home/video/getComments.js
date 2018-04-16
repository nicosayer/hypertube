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
			const collection = mongo.getDb().collection('users');
			var count = 0;
			result.forEach((comment, index ) => {
				count++;
				collection.findOne({ _id: new mongodb.ObjectId(comment.userId) }, (e, r) => {
					count--;
					result[index].user = r;
					if (!count) {
						res.status(200).json(result)
					}
				})
			})
		})
	}
	else {
		res.sendStatus(300);
	}
});

module.exports = router;
