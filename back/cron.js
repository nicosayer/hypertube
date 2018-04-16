const express = require('express');
var cron = require('node-cron');
var mongo = require('./mongo');
const fs = require('fs');

exports.initCron = function() {

	cron.schedule('0 0 * * *', function() {
		const db = mongo.getDb();
		const magnetsCollection = db.collection('magnets');
		var one_day = 1000 * 60 * 60 * 24;

		console.log('running a task every minute');

		magnetsCollection.find().forEach(function(myDoc) {

			if (myDoc.date && myDoc.path) {
				var difference_ms = Date.now() - myDoc.date;

				if (Math.round(difference_ms / one_day) >= 30) {
					magnetsCollection.remove({"path": myDoc.path});
					rimraf('public/movies/' + myDoc.path, function(err) {
						if (err) console.log(err);
					});
				}
			}
		});
	});

}