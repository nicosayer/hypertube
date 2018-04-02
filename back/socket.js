const torrentStream = require('torrent-stream');
const ss = require('socket.io-stream');

exports = module.exports = io => {

	io.sockets.on('connect', socket => {

		socket.on('startDownload', magnetLink => {

			const opt = {
				tmp: './public/video',
				path: './public/video/Test'
			}
			var engine = torrentStream(magnetLink, opt);

			engine.on('ready', function() {
				engine.files.forEach(function(file) {
					console.log('filename:', file.name);
					var streamedFile = file.createReadStream();

					const stream = ss.createStream();
					ss(socket).emit('startStreaming', stream);
					streamedFile.pipe(stream);

					// inFile.addListener('data', data => socket.emit('chunk', data));
				});
			});
		});

	});
}
