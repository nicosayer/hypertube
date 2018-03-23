const express = require('express');
const nodemailer = require('nodemailer');
const randomstring = require("randomstring");
const bcrypt = require('bcrypt');
const router = express.Router();
var mongo = require('../../mongo');
const transporter = require('../../src/mailer');


router.post('/', function(req, res, next) {

	const post = req.body;
	var db = mongo.getDb();
	const collection = db.collection('users');

	if (!post.login) {
		res.json({error: "Login is missing"});
	}
	else {
		collection.findOne(
		{ $or:
			[
				{email: {$regex: new RegExp("^" + post.login + "$", "i")}},
				{login: {$regex: new RegExp("^" + post.login + "$", "i")}}
			]
		}, function (err, result) {
			if (err) throw err
			const mongoResult = result

			if (result === null) {
				res.status(400).json({error: "No user found"});
			}
			else {
				const newPassword = randomstring.generate(7) + Math.floor(Math.random() * Math.floor(500));
				
				let mailOptions = {
					from: '"Jean Marc Morandini" <ericnicogor@gmail.com>',
					to: mongoResult.email,
					subject: 'Hypertube - Nouveau mot de passe',
					text: 'Voici ton nouveau mot de passe : ' + newPassword,
					html: '<b>Voici ton nouveau mot de passe : </b>' + newPassword
				};

				transporter.sendMail(mailOptions, (error, info) => {
					if (error) throw error;

					bcrypt.genSalt(10, function(err, salt) {
						bcrypt.hash(newPassword, salt, function(err, hash) {
							collection.update(
								{ $or: [ {email: post.login}, {login: post.login} ] },
								{ $set: {password: hash}}, function (err, result) {
								if (err) throw err;
								res.sendStatus(202);
							});
						});
					});
				});
			}
		});
	}
});


module.exports = router;