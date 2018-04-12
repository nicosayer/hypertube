const express = require('express');
const router = express.Router();
const fs = require('fs')
var torrentStream = require('torrent-stream');
const parseRange = require('range-parser');
const ffmpeg = require('fluent-ffmpeg');
var mongo = require('../../../mongo');
const m3u8stream = require('m3u8stream');

const ngrok = require('ngrok');
const ngrokConnect = ngrok.connect(3001)

var url;

ngrokConnect.then(data => {
	url = data;
});


var user = {};
var ext;

router.get('/:magnet/:time', function(req, res, next) {

	if (req.session && req.session._id) {

		const id = req.session._id.toString()
		const { magnet } = req.params
		const { time } = req.params

		if (time.slice(time.length - 5, time.length) == 'first') {
			const db = mongo.getDb();
			const collection = db.collection('movies');

			if (magnet.match(/^magnet:\?xt=urn:/i) != null) {
				var engine = torrentStream(magnet, {path: './public/movies'})

				engine.on('ready', function() {

					console.log("readyyyyyyy")

					var size = 0
					var file;

					engine.files.forEach(function(fileTmp, key) {
						if (key === 0)
						{
							const path = fileTmp.path.split('/')
							collection.update({path: path[0]}, {$set: {date: Date.now()}}, {upsert: true})
						}
						if (fileTmp.length > size) {
							size = fileTmp.length
							file = fileTmp;
							ext = file.name.substr(file.name.length - 3);			
						}
					})
					user[id] = file;
					if (ext === 'mp4' || ext === 'webm') {
						res.status(201).json({url: null});
					}
					else if (ext === 'mkv') {

						collection.findOne({path: file.path.split('/')[0]}, function(err, result) {
							console.log(result);
							if (result && result.downloaded) {
								console.log("is downloaded");
								fs.unlinkSync('public/movies/' + file.name);
								
								const m3u8name = file.name.replace(".mkv", ".m3u8");
								res.statusCode = 206;
								m3u8stream(url + '/movies/' + m3u8name + '/' + m3u8name).pipe(res);

							} else {
								console.log("is NOT downloaded")
								download_transcript(user[id], res);
							}
						})
					}
				})
			}
			else {
				res.sendStatus(300)
			}
		}
		else {
			if (ext === 'mp4' || ext === 'webm') {
				download_no_transcript(user[id], req, res);
			}
		}
	}
	else {
		res.sendStatus(300);
	}
})

download_no_transcript = function(file, req, res) {	

	const range = req.headers.range
	var parts;
	
	if (typeof range == 'undefined') {
		parts = [0, file.length-1];
	} else {
		parts = range.replace(/bytes=/, "").split("-");
	}

	const start = parseInt(parts[0], 10) > file.length? 0 : parseInt(parts[0], 10);
	const end = parts[1] ? parseInt(parts[1], 10) : file.length - 1;

	var stream = file.createReadStream({start: start, end: end})

	res.setHeader('Content-Type', 'video/mp4')
	res.setHeader('Accept-Ranges', 'bytes');
	res.setHeader('Content-Length', 1 + end - start);
	res.setHeader('Content-Range', `bytes ${start}-${end}/${file.length}`);
	res.statusCode = 206;
	stream.pipe(res);

}


download_transcript = function(file, res) {
	var stream = file.createReadStream();
	const db = mongo.getDb();
	const collection = db.collection('movies');
	var first = 1;

	const folderName = file.name.substring(0, file.name.length - 4);
	// const mp4name = file.name.replace(".mkv", ".mp4");
	const m3u8name = file.name.replace(".mkv", ".m3u8");
	const ngrokUrl = url + '/movies/' + m3u8name + '/' + m3u8name;

	ffmpeg(stream, { timeout: 432000 }).addOptions([
	    '-profile:v baseline', // baseline profile (level 3.0) for H264 video codec
	    '-level 3.0', 
	    '-s 640x360',          // 640px width, 360px height output video dimensions
	    '-start_number 0',     // start the first .ts segment at index 0
	    '-hls_time 10',        // 10 second segment duration
	    '-hls_list_size 0',
	    '-hls_playlist_type event',
	    '-f hls'               // HLS format
	])
	.on('start', () => {
		console.log("started transcripting!");

		if (!fs.existsSync('public/movies/' + m3u8name)) {
			fs.mkdirSync('public/movies/' + m3u8name);
		}

		// if (!fs.existsSync('public/movies/' + mp4name)) {
		// 	fs.mkdirSync('public/movies/' + mp4name);
		// }
	})
	.on('error', function(err, err1, err2) {
		console.log(err);
		console.log(err1);
		console.log(err2);
    })
    .on('progress', function(progress) {
    	console.log("Transcripting " + file.name);

    	if (first && fs.existsSync('public/movies/' + m3u8name + '/' + m3u8name)) {
			console.log("m3u8 Created.");
			
			first = 0;
			res.status(201).json({url: ngrokUrl});
		}
    })
	.output('public/movies/' + m3u8name + '/' + m3u8name)
	// .output('public/movies/' + mp4name + '/' + mp4name)
	.on('end', () => {
		console.log('transcripting done!');

		const path = file.path.split('/')
		collection.update({path: path[0]}, {$set: {downloaded: true}}, {upsert: true});
		fs.unlinkSync('public/movies/' + file.name);
	})
	.run()			
}

module.exports = router;

