const express = require('express');
const router = express.Router();
const got = require('got');

const signupModule = require("../../../src/signupModule");

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
			const id = apiRes.body.resourceName.substring(7);

			const post = {
				firstName: apiRes.body.names[0].givenName,
				lastName: apiRes.body.names[0].familyName,
				email: apiRes.body.emailAddresses[0].value,
				profilePic: apiRes.body.photos[0].url,
				oauth: {
					google: id
				}
			};
			
			signupModule(req, post, true, (result, error = 0) => {
				if (error) {
					console.log(result);
					res.status(300).json(result);
				} else {
					res.status(201).json(result);
				}
			});
		})
		.catch(err => res.json(err));
	}
});

module.exports = router;
