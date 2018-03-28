const express = require('express');
const formidable = require('formidable');
const router = express.Router();

const mongo = require('../../../mongo');
const mongodb = mongo.getMongodb();

router.post('/', function(req, res, next) {

	if (req.session && req.session._id) {

		var form = new formidable.IncomingForm();
		form.uploadDir = './public/pictures';
		form.keepExtensions = true;
		form.maxFileSize = 10000000;
		form.on('fileBegin', function(name, file) {
			file.path = form.uploadDir + '/' + req.session._id + '.png';
		});
		form.parse(req, function(err, fields, files) {
			res.sendStatus(200);
		});
	}
	else {
		res.sendStatus(300);
	}
});


module.exports = router;
