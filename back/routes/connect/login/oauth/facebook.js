const express = require('express');
const router = express.Router();
const got = require('got');

const signupModule = require("../../../../src/signupModule");

router.post('/', function(req, res, next) {
	if (req.session && req.session._id) {
		res.sendStatus(300);
	}
	else {
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
			console.log(apiRes)
			const infos = JSON.parse(apiRes.body);
			const post = {
				firstName: infos.first_name,
				lastName: infos.last_name,
				oauth: {
					facebook: infos.id
				}
			};

			if (infos.email) {
				post.email = infos.email;
			}

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
