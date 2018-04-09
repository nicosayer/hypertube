const express = require('express');
const router = express.Router();
const fs = require('fs')
var torrentStream = require('torrent-stream');
const parseRange = require('range-parser');
const ffmpeg = require('fluent-ffmpeg');
var mongo = require('../../../mongo');
var child_process = require('child_process')
const pump = require('pump')
const got = require('got');
var zlib = require("zlib");
var request = require('request')
var srt2vtt = require('srt-to-vtt')

var gunzip = zlib.createGunzip();

var user = {}

router.get('/:magnet/:time', function(req, res, next) {

	got('https://rest.opensubtitles.org/search/imdbid-1211837', {
		headers: {
	        'User-Agent': 'TemporaryUserAgent'
	    }
	})
	.then((subs) => {
		//console.log(subs.body)
		subs = subs.body
		//console.log(subs)
		subs = JSON.parse(subs)
		subs = subs.filter(sub => {
			return sub.ISO639 == 'en'
		})
		console.log(subs)
		var buffer = []
		request(subs[0].SubDownloadLink).pipe(gunzip).pipe(srt2vtt()).pipe(fs.createWriteStream('./public/' + subs[0].MovieReleaseName + '.vtt'))
		gunzip.on('data', function(data) {
            // decompression chunk ready, add it to the buffer
            buffer.push(data.toString())

        }).on("end", function() {
            // response and decompression complete, join the buffer and return
            buffer.join("");
            console.log(buffer)

        }).on("error", function(e) {
            callback(e);
        })
	})


	/*var engine = torrentStream('magnet:?xt=urn:btih:3979a828a7fa105af4a9e4af6f33c5b3402a1d94&dn=Moana+2016+1080p+BluRay+x264+DTS-JYK&tr=udp%3A%2F%2Ftracker.leechers-paradise.org%3A6969&tr=udp%3A%2F%2Fzer0day.ch%3A1337&tr=udp%3A%2F%2Fopen.demonii.com%3A1337&tr=udp%3A%2F%2Ftracker.coppersurfer.tk%3A6969&tr=udp%3A%2F%2Fexodus.desync.com%3A6969', {path: './public/movies'})

	engine.on('ready', function() {

		console.log("readyyyyyyy")

		var size = 0
		var file;
		res.sendStatus(201)

		engine.files.forEach(function(fileTmp, key) {
			console.log(fileTmp.name)
			if (fileTmp.name == "Moana 2016 1080p BluRay x264 DTS-JYK.mkv") {
				console.log('here')
				var stream = fileTmp.createReadStream()
				ffmpeg(stream, { timeout: 432000 }).addOptions([
				    '-profile:v baseline', // baseline profile (level 3.0) for H264 video codec
				    '-level 3.0', 
				    '-s 640x360',          // 640px width, 360px height output video dimensions
				    '-start_number 10',     // start the first .ts segment at index 0
				    '-hls_time 20',        // 10 second segment duration
				    '-hls_list_size 50',
				    '-hls_playlist_type event',
				    '-f hls'               // HLS format
				  ])
				.on('error', function(err, er1, er2) {
			        console.log(err, er1, er2);
			    })
				.output('public/output.m3u8')
				.on('end', () => {
					console.log('ya moyen que ca marche enfait')
				})
				.run()
			}
			
			
		})
		//download(file, req, res)
	})*/


	/*if (req.session && req.session._id) {
		const id = req.session._id.toString()
		const { magnet } = req.params
		const { time } = req.params
		
		// console.log(magnet,time)

		if (time.slice(time.length - 5, time.length) == 'first') {
			console.log('ici')
			var db = mongo.getDb();
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
							file = fileTmp				
						}
					})
					user[id] = file
					res.sendStatus(201)
					//download(file, req, res)
				})
			}
			else {
				res.sendStatus(300)
			}
		}
		else {
			console.log('laaaa')
			download(user[id], req, res)
		}
	}
	else {
		res.sendStatus(300)
	}*/
})

download = function(file, req, res) {		
		
	console.log('req.headers.range:'+req.headers.range)
	console.log('file.length:'+file.length)

	console.log(file.name)
	const range = req.headers.range
	var parts;
	if (typeof range == 'undefined')
		parts = [0, file.length-1]
	else
		parts = range.replace(/bytes=/, "").split("-")
	console.log(parts)

	var start = parseInt(parts[0], 10) > file.length? 0 : parseInt(parts[0], 10)
	console.log(start)

	const end = parts[1] ? parseInt(parts[1], 10) : file.length-1
    console.log(start, end)


	var stream = file.createReadStream({start: start, end: end})

	res.setHeader('Content-Type', 'video/webm')
	res.setHeader('Accept-Ranges', 'bytes');
	res.setHeader('Content-Length', 1 + end - start);
	res.setHeader('Content-Range', `bytes ${start}-${end}/${file.length}`);
	res.statusCode = 206;
	stream.pipe(res)

	/*var convert = ffmpeg('./public/test.mp4')
	.videoCodec('libvpx')
	.audioCodec('libvorbis')
	.videoBitrate('512k')
	.format('webm')
	.on('start', (data) => {
		console.log('transcoding...')
		console.log(data)
	})
	.on('error', (err, stdout, stderr) => {
		//if (err.message !== 'Output stream closed') {
			console.log(err.message, err, stderr);
		//}
	})
	.pipe(res)*/



	//pump(convert,res)
}

//var input_file = file.createReadStream();
	// input_file.on('error', function(err) {
	//     console.log(err);
	// });

	// // var output_path = 'tmp/output.mp4';
	// // var output_stream = fs.createWriteStream('tmp/output.mp4');

	//var ffmpeg = child_process.spawn('ffmpeg', ['-i', 'pipe:0', '-f', 'webm', '-movflags', 'frag_keyframe', 'pipe:1']);
	// input_file.pipe(ffmpeg.stdin);
	// ffmpeg.stdout.pipe(res);

	// ffmpeg.stderr.on('data', function (data) {
	//     console.log(data.toString());
	// });

	// ffmpeg.stderr.on('end', function () {
	//     console.log('file has been converted succesfully');
	// });

	// ffmpeg.stderr.on('exit', function () {
	//     console.log('child process exited');
	// });

	// ffmpeg.stderr.on('close', function() {
	//     console.log('...closing time! bye');
	// });



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