var express = require('express');
const router = express.Router();

router.delete('/', function(req, res, next) {

	res.status(202).end()
});


module.exports = router;