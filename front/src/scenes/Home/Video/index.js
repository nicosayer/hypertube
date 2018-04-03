import React, { Component } from 'react';
import { connect } from 'react-redux';

import Logout from './../LogOut';

var ss = require('socket.io-stream');

class Video extends Component {

	/*componentWillReceiveProps(nextProps) {
		nextProps.socket.emit('startDownload', 'magnet:?xt=urn:btih:ec9e9afdf55c50e545d1abf64d255bf9e0687c5d&dn=The.Big.Bang.Theory.S08E13.HDTV.x264-LOL.mp4&tr=udp%3A%2F%2Ftracker.leechers-paradise.org%3A6969&tr=udp%3A%2F%2Fzer0day.ch%3A1337&tr=udp%3A%2F%2Fopen.demonii.com%3A1337&tr=udp%3A%2F%2Ftracker.coppersurfer.tk%3A6969&tr=udp%3A%2F%2Fexodus.desync.com%3A6969');
		ss(nextProps.socket).on('startStreaming', (stream) => {

			var mediaSource = new MediaSource();

			var video = document.getElementById('video');
			video.src = window.URL.createObjectURL(mediaSource);
			
			mediaSource.addEventListener('sourceopen', function(event) {
				var sourceBuffer = mediaSource.addSourceBuffer('video/mp4; codecs="avc1.4d401f"');
				sourceBuffer.mode = 'sequence';
				video.play();

				sourceBuffer.addEventListener('updatestart', function(e) { console.log('updatestart: ' + mediaSource.readyState); });
				sourceBuffer.addEventListener('update', function(e) { console.log('update: ' + mediaSource.readyState); });
				sourceBuffer.addEventListener('updateend', function(e) { console.log('updateend: ' + mediaSource.readyState); });
				sourceBuffer.addEventListener('error', function(e) { console.log('error: ' + mediaSource.readyState); });
				sourceBuffer.addEventListener('abort', function(e) { console.log('abort: ' + mediaSource.readyState); });

				stream.on('data', (chunk) => {
					console.log(chunk)
					if (!sourceBuffer.updating) {
						sourceBuffer.appendBuffer(chunk);
					}
				});
			});
		});
	}*/ 

	render() {


		return(
			<div onClick={this.click} >
				<br/>
				<video id="videoPlayer" controls>
				  <source preload='metadata' src="http://localhost:3001/video" type="video/mp4" />
				</video>
				<Logout />
			</div>
		);
	}
}

function mapStateToProps(state) {
	const { isAuthenticated } = state.handleMe;
	const { socket } = state.connectSocket;
	return ({
		isAuthenticated,
		socket
	});
}

export default connect(mapStateToProps)(Video)
