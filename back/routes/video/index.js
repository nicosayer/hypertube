
/*engine.on('download', function (piece){
	console.log(piece)
})

engine.on('torrent', function (){
	console.log("torrent")
})*/


var express = require('express');
var torrentStream = require('torrent-stream');
var ss = require('socket.io-stream');
var socketStream = ss.createStream();
var peerflix = require('peerflix')

exports = module.exports = function(io){
  io.sockets.on('connection', function (socket) {
  	
    socket.on('credentials', function (magnet) {
    	console.log(magnet)
    	var engine = peerflix(magnet)
		console.log("test")
		engine.server.on('listening', function() {
		    var myLink = 'http://localhost:' + engine.server.address().port + '/';
		    socket.emit('yooo', myLink)
		});
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
    	
  	});

    console.log('user connected')

  	socket.on('disconnect', () => {
	    console.log('user disconnected')
	  });

  });
}