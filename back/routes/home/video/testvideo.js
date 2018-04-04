const express = require('express');
const router = express.Router();
const fs = require('fs')
var torrentStream = require('torrent-stream');
const parseRange = require('range-parser');

var user = {}

router.get('/:magnet/:time', function(req, res, next) {

	if (req.session && req.session._id) {
		const id = req.session._id.toString()
		const { magnet } = req.params
		const parts = req.headers.range.replace(/bytes=/, "").split("-")
		
		console.log('ici')
		console.log(magnet)

		if (parseInt(parts[0], 10) === 0) {
			if (magnet.match(/^magnet:\?xt=urn:/i) != null) {
				console.log('avant engine')
				var engine = torrentStream(magnet, {path: './public/movies'})
				console.log('apres engine')

				engine.on('ready', function() {

					console.log("readyyyyyyy")

					var size = 0
					var file;

					engine.files.forEach(function(fileTmp) {
						if (fileTmp.length > size) {
							size = fileTmp.length
							file = fileTmp				
						}
					})
					user[id] = file
					download(file, req, res)
				})
			}
			else {
				res.sendStatus(300)
			}
		}
		else {
			download(user[id], req, res)
		}
	}
	else {
		res.sendStatus(300)
	}
})

download = function(file, req, res) {		
		
	console.log('req.headers.range:'+req.headers.range)
	console.log('file.length:'+file.length)

	const range = req.headers.range
	const parts = range.replace(/bytes=/, "").split("-")
	console.log(parts)

	var start = parseInt(parts[0], 10) > file.length? 0 : parseInt(parts[0], 10)
	console.log(start)

	const end = parts[1] ? parseInt(parts[1], 10) : file.length-1
    console.log(start, end)

	res.setHeader('Content-Type', 'video/mp4')
	res.setHeader('Accept-Ranges', 'bytes');
	res.setHeader('Content-Length', 1 + end - start);
	res.setHeader('Content-Range', `bytes ${start}-${end}/${file.length}`);
	res.statusCode = 206;
	file.createReadStream({start, end}).pipe(res)
}


// else {
// 	console.log('ici')
// 	res.setHeader('Accept-Ranges', 'bytes');
// 	res.setHeader('Content-Length', 1 + range.end - range.start);
// 	res.setHeader('Content-Range', `bytes ${range.start}-${range.end}/${file.length}`);
// 	res.statusCode = 206;
// 	console.log("4"+file.name)
// 	file.createReadStream(range).pipe(res)
// }



module.exports = router;