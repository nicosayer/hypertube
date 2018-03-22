var express = require('express');
const router = express.Router();

router.delete('/', function(req, res, next) {

	req.session.destroy()
	res.status(202).end()
});


module.exports = router;