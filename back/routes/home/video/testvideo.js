const express = require('express');
const router = express.Router();
const fs = require('fs')
var torrentStream = require('torrent-stream');
const parseRange = require('range-parser');
var engine = torrentStream('magnet:?xt=urn:btih:ec9e9afdf55c50e545d1abf64d255bf9e0687c5d&dn=The.Big.Bang.Theory.S08E13.HDTV.x264-LOL.mp4&tr=udp%3A%2F%2Ftracker.leechers-paradise.org%3A6969&tr=udp%3A%2F%2Fzer0day.ch%3A1337&tr=udp%3A%2F%2Fopen.demonii.com%3A1337&tr=udp%3A%2F%2Ftracker.coppersurfer.tk%3A6969&tr=udp%3A%2F%2Fexodus.desync.com%3A6969')
engine.on('ready', function() {
	console.log("readyyyyyyy")
	engine.files.forEach(function(file) {
		if (file.name == 'The.Big.Bang.Theory.S08E13.HDTV.x264-LOL.mp4')
		{
			router.get('/', function(req, res, next) {
				console.log(req.headers.range)
				const ranges = parseRange(file.length, req.headers.range, { combine: true });
				const range = ranges[0];
				console.log(ranges)
				res.setHeader('Content-Type', 'video/mp4')
				if (range.start !== 0)
				{
					console.log('la')
					res.setHeader('Accept-Ranges', 'bytes');
					res.setHeader('Content-Length', 1 + range.end - range.start);
	        		res.setHeader('Content-Range', `bytes ${range.start}-${range.end}/${file.length}`);
					res.statusCode = 206;
					file.createReadStream(range).pipe(res)
				}
				/*else {
					console.log('ici')
					range.start = 0
					range.end = 1024000
					res.setHeader('Accept-Ranges', 'bytes');
					res.setHeader('Content-Length', 1 + 1024000);
	        		res.setHeader('Content-Range', `bytes ${range.start}-${range.end}/${file.length}`);
					res.statusCode = 206;
					file.createReadStream(range).pipe(res)
				}*/
				else {
					console.log('ici')
					//res.setHeader('Accept-Ranges', 'bytes');
					res.statusCode = 200;
					res.setHeader('Content-Length', file.length);
					file.createReadStream().pipe(res)
				}
			})
		}
	});
});

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