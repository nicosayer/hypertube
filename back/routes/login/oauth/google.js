const express = require('express');
const router = express.Router();
const got = require('got');

router.post('/', function(req, res, next) {
	if (req.session && req.session._id) {
		res.sendStatus(300);
	}
	else {
		const access_token = req.body.access_token;
		got.get('https://www.googleapis.com/oauth2/v3/tokeninfo?access_token=' + access_token)
		.then(apiRes => {
			if (JSON.parse(apiRes.body).aud === '414902509468-bhe8pbagi4j8hsa0i7ole5s3h52ng7aj.apps.googleusercontent.com') {
				return got('https://people.googleapis.com/v1/people/me/?personFields=names,emailAddresses,photos', {
					methods: 'GET',
					json: true,
					headers: {Authorization: 'Bearer ' + access_token}
				});
			}
		})
		.then(apiRes => {
			res.status(200).json(apiRes.body);
		})
		.catch(err => res.json(err));
	}
});

module.exports = router;
