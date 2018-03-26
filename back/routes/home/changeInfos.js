const express = require('express');
const router = express.Router();

const mongo = require('../../mongo');
const mongodb = mongo.getMongodb();

router.get('/', function(req, res, next) {

	const { login, firstname, lastname, email } = req.body

	var error = []

	if (typeof login == undefined || typeof firstname == undefined || typeof lastname == undefined || typeof email == undefined) {
		error.error = 'default';
	}
	else {

		email = email.toLowerCase();
		firstname = firstname.toLowerCase();
		lastname = lastname.toLowerCase();

		firstname = firstname.replace(/\s+/g, ' ');
		lastname = lastname.replace(/\s+/g, ' ');


		if (login.length < 4) {
			error.login = 'default';
		}
		if (login.length > 20) {
			error.login = 'default';
		}
		if (!(/^[a-zà-ÿ0-9]+$/i.test(login))) {
			error.login = 'default';
		}

		if (email.length < 4) {
			error.email = 'default';
		}
		if (email.length > 50) {
			error.email = 'default';
		}
		if (!(/^.+@.+\..+$/.test(email))) {
			error.email = 'default';
		}


		if (firstname.length < 1) {
			error.firstname = 'default'
		}
		if (firstname.length > 20) {
			error.firstname = 'default'
		}
		if (!(/^[a-zà-ÿ ]+$/i.test(firstname))) {
			error.firstname = 'default'
		}


		if (lastname.length < 1) {
			error.lastname = 'default'
		}
		if (lastname.length > 20) {
			error.lastname = 'default'
		}
		if (!(/^[a-zà-ÿ ]+$/i.test(lastname))) {
			error.lastname = 'default'
		}


		/*if (change[1].length < 6) {
			error.password = 'default'
		}
		if (change[1].length > 50) {
			error.password = 'default'
		}
		if (!(/[a-zA-Z]/i.test(change[1]))) {
			error.password = 'default'
		}
		if (!(/[0-9]/i.test(change[1]))) {
			error.password = 'default'
		}*/
	}

	if (!req.session || !req.session._id){
		error.auth = 'default'
	}

	if (error.length == 0) {

		const db = mongo.getDb();
		const collection = db.collection('users');

		collection.findOne({email: email, function (error, result) {
			if (error) throw error;
			
			if (result) {
				collection.update(
					{_id: new mongodb.ObjectId(req.session._id)},
					{$set: {login: login, firstname: firstname, lastname: lastname}}, function (err, result) {
					if (err) throw err;

					error.email = 'duplicate'
					res.status(300).json(error);
				});
			}
			else {
				collection.update(
					{_id: new mongodb.ObjectId(req.session._id)},
					{$set: {login: login, firstname: firstname, lastname: lastname, email: email}}, function (err, result) {
					if (err) throw err;

					res.status(202)
				});
			}
		})
	}
	else {
		res.status(300).json(error);
	}
});


module.exports = router;


/*collection.findOne({_id: new mongodb.ObjectId(req.session._id)}, function (error, result) {
				if (error) throw error;
				bcrypt.compare(change[0], result.password, function(error, result) {
					if (error) throw error;

					if (result !== true) {
						error.password = 'wrong'
						res.status(300).json(error);
					}
					else {
						collection.update(
							{_id: new mongodb.ObjectId(req.session._id)},
							{$set: {password: change[1]}}, function (err, result) {
							if (err) throw err;

							res.status(202)
						});
					}
				});
			})*/