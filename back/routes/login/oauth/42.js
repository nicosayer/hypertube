const express = require('express');
const router = express.Router();
const got = require('got');

const signupModule = require("../../../src/signupModule");

router.post('/', function(req, res, next) {
	if (req.session && req.session._id) {
		res.sendStatus(300);
	}
	else {
		got.post('https://api.intra.42.fr/oauth/token', {
			json: true,
			body: {
				grant_type: 'authorization_code',
				client_id: "1f7d365bde5231d5fe79b9928e2f8f3f0fe25b416a8ce0da242229888d103af3",
				client_secret: "02fd8cd072638d0092664e743347ead351545bfa7e20101cb6beb89a903ffa28",
				code: req.body.code,
				redirect_uri: "https://localhost:3000/"
			}
		})
		.then(apiRes => {
			return got('https://api.intra.42.fr/v2/me', {
				methods: 'GET',
				json: true,
				headers: {Authorization: 'Bearer ' + apiRes.body.access_token}
			});
		})
		.then(apiRes => {
			const post = {
				firstName: apiRes.body.first_name,
				lastName: apiRes.body.last_name,
				email: apiRes.body.email,
				profilePic: apiRes.body.image_url,
				oauth: {
					"42": apiRes.body.id
				}
			};
			
			signupModule(req, post, true, (result, error = 0) => {
				if (error) {
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
