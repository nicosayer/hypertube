var express = require('express');
var torrentStream = require('torrent-stream');
var ss = require('socket.io-stream');
var socketStream = ss.createStream();
//var peerflix = require('peerflix')

const TorrentSearchApi = require('torrent-search-api');
 
const torrentSearch = new TorrentSearchApi();
 
torrentSearch.enableProvider('1337x');
//torrentSearch.enableProvider('ThePirateBay');
//torrentSearch.enableProvider('Torrent9');
//torrentSearch.enableProvider('Torrentz2');

exports = module.exports = function(io){
  io.sockets.on('connection', function (socket) {
  var store;
    socket.on('search', function (test) {
    	engine = torrentStream('magnet:?xt=urn:btih:ec9e9afdf55c50e545d1abf64d255bf9e0687c5d&dn=The.Big.Bang.Theory.S08E13.HDTV.x264-LOL.mp4&tr=udp%3A%2F%2Ftracker.leechers-paradise.org%3A6969&tr=udp%3A%2F%2Fzer0day.ch%3A1337&tr=udp%3A%2F%2Fopen.demonii.com%3A1337&tr=udp%3A%2F%2Ftracker.coppersurfer.tk%3A6969&tr=udp%3A%2F%2Fexodus.desync.com%3A6969')
    	engine.on('ready', function() {
			console.log("readyyyyyyy")
			engine.files.forEach(function(file) {
				if (file.name == 'The.Big.Bang.Theory.S08E13.HDTV.x264-LOL.mp4')
				{
					console.log('filename:', file.name);
					ss(socket).emit('test', socketStream, {name: 'test'});
					var stream = file.createReadStream();
					stream.pipe(socketStream)
					stream.on('end', () => {
						socket.emit('end', '');
						console.log("end")
					})
				}
			});
		});
    	
  	});


    console.log('user connected')

  	socket.on('disconnect', () => {
	    console.log('user disconnected')
	  });

  });
}


/*engine.on('ready', function() {
			console.log("readyyyyyyy")
			engine.files.forEach(function(file) {
				if (file.name == 'The.Big.Bang.Theory.S08E13.HDTV.x264-LOL.mp4')
				{
					console.log('filename:', file.name);
					ss(socket).emit('test', socketStream, {name: 'test'});
					var stream = file.createReadStream();
					stream.pipe(socketStream)
					engine.on('download', function (piece){
						console.log(piece)
					})

					engine.on('torrent', function (){
						console.log("torrent")
					})
					stream.on('data', chunk => {
						console.log(chunk)
						//socket.emit('data', chunk);
					})
					stream.on('end', () => {
						socket.emit('end', '');
						console.log("end")
					})
				}
			});
		});*/