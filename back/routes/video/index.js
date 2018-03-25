var express = require('express');
//var torrentStream = require('torrent-stream');
//var ss = require('socket.io-stream');
//var socketStream = ss.createStream();
var peerflix = require('peerflix')

const TorrentSearchApi = require('torrent-search-api');
 
const torrentSearch = new TorrentSearchApi();
 
torrentSearch.enableProvider('1337x');
torrentSearch.enableProvider('ThePirateBay');
torrentSearch.enableProvider('Torrent9');
torrentSearch.enableProvider('Torrentz2');

exports = module.exports = function(io){
  io.sockets.on('connection', function (socket) {
  var store;
    socket.on('search', function (search) {
    	torrentSearch.search(search, 'All', 10)
	     .then(torrents => {
	     	store = torrent
	     	socket.emit('searchResult', torrents)
	     	console.log(torrents)
	     })
	     .catch(err => {
	         console.log(err);
	     });
    	
		
    	
  	});

  	socket.on('torrent', function (num) {
    	torrentSearch.getMagnet(store[num])
	    .then(magnet => {
	    	var engine = peerflix(magnet)

			engine.server.on('listening', function() {
				engine.on('ready', function() {
		    		console.log('readyyyyy')
		    	})
			    var myLink = 'http://localhost:' + engine.server.address().port + '/';
				console.log(myLink)
			    socket.emit('stream', myLink)
			});
	    })
	    .catch(err => {
	        console.log(err);
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