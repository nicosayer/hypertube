var express = require('express');
const router = express.Router();

router.delete('/', function(req, res, next) {

	if (req.session && req.session._id) {
		req.session.destroy();
		res.sendStatus(202).end();
	} else {
		res.sendStatus(401);
	}
});


module.exports = router;