const express = require('express');
const router = express.Router();
const query = require('yify-search');

router.post('/', function(req, res, next) {
	console.log(req.body);

	if (req.session && req.session._id) {
		console.log(1)
		query('big hero 6', (error, result) => {
			console.log(2);
			res.status(200).json(result);
		});
	}
	else {
		res.sendStatus(300);
	}
});


module.exports = router;
