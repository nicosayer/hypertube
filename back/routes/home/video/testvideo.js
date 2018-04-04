const express = require('express');
const router = express.Router();
const fs = require('fs')
var torrentStream = require('torrent-stream');
const parseRange = require('range-parser');
var file;
var status = true
num = 100


router.get('/:magnet', function(req, res, next) {

	console.log('ici')
	const { magnet } = req.params
	console.log(magnet)
	var file;

	if (typeof engine === 'undefined') {
		var engine = torrentStream(magnet, {path: './public/movies'})
		engine.on('ready', function() {
			console.log("readyyyyyyy")
			var size = 0
			engine.files.forEach(function(fileTmp) {
				if (fileTmp.length > size) {
					size = fileTmp.length
					file = fileTmp				
				}
			})
			download(file, req, res)
		})
	}
	else
		download(file, req, res)
})

router.post('/search', function(req, res, next) {
	magnet = req.body.magnet
	console.log(magnet)
	downlad(magnet, res)
	
})

download = function(file, req, res) {		
		
	console.log("1"+file.name)
	const range = req.headers.range
	console.log('req.headers.range:'+req.headers.range)
	console.log('file.length:'+file.length)
	const parts = range.replace(/bytes=/, "").split("-")
	console.log(parts)
	var start = parseInt(parts[0], 10) > file.length? 0 : parseInt(parts[0], 10)
	console.log(start)
	const end = parts[1] 
      ? parseInt(parts[1], 10)
      : file.length-1
      console.log(start, end)
	console.log("3"+file.name)
	console.log(parts)

	res.setHeader('Content-Type', 'video/mp4')
	if (1 == 1) {
		console.log('la')
		res.setHeader('Accept-Ranges', 'bytes');
		res.setHeader('Content-Length', 1 + end - start);
		res.setHeader('Content-Range', `bytes ${start}-${end}/${file.length}`);
		res.statusCode = 206;
		console.log("4"+file.name)
		status = false
		file.createReadStream({start, end}).pipe(res)
	}
	else {
		console.log('ici')
		res.setHeader('Accept-Ranges', 'bytes');
		res.setHeader('Content-Length', 1 + range.end - range.start);
		res.setHeader('Content-Range', `bytes ${range.start}-${range.end}/${file.length}`);
		res.statusCode = 206;
		console.log("4"+file.name)
		file.createReadStream(range).pipe(res)
	}
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