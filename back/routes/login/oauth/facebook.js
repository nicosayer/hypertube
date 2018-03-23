const express = require('express');
const router = express.Router();
const got = require('got');

router.post('/', function(req, res, next) {
	got.get('https://graph.facebook.com/v2.12/oauth/access_token?' +
	'client_id=165360170705100' +
	'&redirect_uri=https://localhost:3000/' +
	'&client_secret=a71aed0923c40b38997d0e556ee3577f' +
	'&code=' + req.body.code)
	.then (apiRes => {
		return got('https://graph.facebook.com/me?' +
		'fields=first_name,last_name,email,picture' +
		'&access_token=' + JSON.parse(apiRes.body).access_token);
	})
	.then(apiRes => {
		res.status(200).json(JSON.parse(apiRes.body));
	})
	.catch(err => res.json(err));

});

module.exports = router;
