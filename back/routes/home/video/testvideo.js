const express = require('express');
const router = express.Router();
const fs = require('fs')
var torrentStream = require('torrent-stream');
const parseRange = require('range-parser');

router.post('/search', function(req, res, next) {
	magnet = req.body.magnet
	console.log(magnet)
	downlad(magnet, res)
	
})

downlad = function(magnet, resSearch) {
	var engine = torrentStream(magnet)
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
		console.log(file.name)
		resSearch.statusCode = 201;
		resSearch.end()
		router.get('/', function(req, res, next) {
			console.log(req.headers.range)
			const ranges = parseRange(file.length, req.headers.range, { combine: true });
			const range = ranges[0];
			console.log(ranges)
			res.setHeader('Content-Type', 'video/mp4')
			if (1 == 1) {
				console.log('la')
				res.setHeader('Accept-Ranges', 'bytes');
				res.setHeader('Content-Length', 1 + range.end - range.start);
        		res.setHeader('Content-Range', `bytes ${range.start}-${range.end}/${file.length}`);
				res.statusCode = 206;
				file.createReadStream(range).pipe(res)
			}
			else {
				console.log('ici')
				res.statusCode = 200;
				res.setHeader('Content-Length', file.length);
				file.createReadStream().pipe(res)
			}
		})
	});
}

/*router.get('/', function(req, res, next) {

	const path = 'public/sample.mp4'
	const stat = fs.statSync(path)
	const fileSize = stat.size
	const range = req.headers.range
	console.log(range)
	if (range) {
		const parts = range.replace(/bytes=/, "").split("-")
		const start = parseInt(parts[0], 10)
		const end = parts[1] 
		  ? parseInt(parts[1], 10)
		  : fileSize-1
		const chunksize = (end-start)+1
		const file = fs.createReadStream(path, {start, end})
		const head = {
		  'Content-Range': `bytes ${start}-${end}/${fileSize}`,
		  'Accept-Ranges': 'bytes',
		  'Content-Length': chunksize,
		  'Content-Type': 'video/mp4',
		}
		res.writeHead(206, head);
		file.pipe(res);
	} 
	else {
		const head = {
		  'Content-Length': fileSize,
		  'Content-Type': 'video/mp4',
		}
		res.writeHead(200, head)
		fs.createReadStream(path).pipe(res)
	}
});*/


module.exports = router;