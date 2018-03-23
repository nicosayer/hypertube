const express = require('express');
const router = express.Router();

router.get('/', function(req, res, next) {
	if (req.session && req.session._id) {
		res.sendStatus(200);
	} else {
		res.sendStatus(403);
	}
});

module.exports = router;