var express = require('express');
const router = express.Router();

router.delete('/', function(req, res, next) {

	if (req.session && req.session._id) {
		req.session.destroy();
		res.status(202).end();
	}
	else {
		res.sendStatus(300);
	}
});


module.exports = router;
