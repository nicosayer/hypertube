const express = require('express');
const router = express.Router();
const fs = require('fs')
var torrentStream = require('torrent-stream');
const got = require('got');
var zlib = require("zlib");
var request = require('request')
var srt2vtt = require('srt-to-vtt')
const OS = require('opensubtitles-api')

const OpenSubtitles = new OS({
	useragent: 'TemporaryUserAgent', 
    ssl: true
});


router.get('/:magnet', function(req, res, next) {


	const { magnet } = req.params
	
	var engine = torrentStream(magnet, {path: './public/movies'})

	engine.on('ready', function() {

		console.log("readyyyyyyy subs")

		var size = 0
		var file;

		engine.files.forEach(function(fileTmp, key) {
			if (fileTmp.length > size) {
				size = fileTmp.length
				file = fileTmp				
			}
		})

		var count = 0
		var stream = file.createReadStream({start:0, end: 65536*3})
		var stream2 = file.createReadStream({start: file.length - 65536*3, end: file.length - 1})
		stream.on('end', () => {
			console.log('end1')
			count++
			console.log(count)
			if (count == 2)
				hashAndDL(file, res)
		})
		stream2.on('end', () => {
			console.log('end2')
			count++
			console.log(count)
			if (count == 2)
				hashAndDL(file, res)
		})
		stream.on('data', () => {
			console.log('data1')
		})
		stream2.on('data', () => {
			console.log('data2')
		})
		
		
	})
})
		
function hashAndDL(file, res) {
	setTimeout(() => {
		OpenSubtitles.hash('./public/movies/' + file.path)
	    .then(infos => {
	        console.log(infos)
	        console.log('https://rest.opensubtitles.org/search/moviehash-'+infos.moviehash)
	        got('https://rest.opensubtitles.org/search/moviehash-'+infos.moviehash, {
				headers: {
			        'User-Agent': 'TemporaryUserAgent'
			    }
			})
			.then((subs) => {
				subs = JSON.parse(subs.body)
				console.log(subs)
				console.log(subs.length)
				subs = subs.filter(sub => {
					return sub.ISO639 == 'en'
				})
				if (subs.length != 0 && subs[0].SubDownloadLink) {
					//console.log(subs)
					console.log(subs[0])
					var buffer = []
					console.log(subs[0].SubDownloadLink)
					var streamsub = request(subs[0].SubDownloadLink)
					var gunzip = zlib.createGunzip();
					streamsub.pipe(gunzip).pipe(srt2vtt()).pipe(fs.createWriteStream('./public/subtitles/' + subs[0].MovieReleaseName + '.vtt'))
					gunzip.on('data', function(data) {
			            // decompression chunk ready, add it to the buffer
			            buffer.push(data.toString())

			        }).on("end", function() {
			        	console.log('res')
			            // response and decompression complete, join the buffer and return
			            buffer.join("");
			            res.status(201).json({ sub: subs[0].MovieReleaseName + '.vtt' })

			        }).on("error", function(e) {
			            callback(e);
			        })
		    	}
		    	else {
		    		res.status(300).json({message: 'no subtitles'})
		    	}
			})
			.catch((error) => console.log(error))
		})
	}, 1)
}

module.exports = router;