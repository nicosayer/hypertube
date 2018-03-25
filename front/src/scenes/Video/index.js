import React, { Component } from 'react';
import { Redirect, Link } from 'react-router-dom';
import { connect } from 'react-redux';
//import ss from 'socket.io-stream'

class Video extends Component {

	constructor(props) {
		super(props)
	}

	componentDidMount = () => {
		
		var video = document.querySelector('video');
	
		this.props.socket.on('stream', (link) => {
			//console.log(link)
			video.src = link
		})
	}

	

	click = (e) => {
		alert(e.target.value)
		this.props.socket.emit('search', e.target.value)
	}

	render() {

		const result = this.state.result.map((item,key))

		return (
			<div  >
			<input type="text" />
			<input type="submit" value="search" onClick={(e) => this.click(e)} />
			<video controls width="80%"></video>
			</div>
		)
	}
}

function mapStateToProps(state) {
	const { isAuthenticated } = state.handleMe
	const { isConnect, socket } = state.connectSocket
	return ({
		isAuthenticated, 
		isConnect, 
		socket
	})
}

export default connect(mapStateToProps)(Video)

/*var video = document.querySelector('video');
if (!window.MediaSource) {
    console.log('No Media Source API available');
    return;
  }
alert(this.props.isConnect)
var sourceBuffer;
var queue = [];
var ms = new MediaSource();
video.src = window.URL.createObjectURL(ms);
ms.addEventListener('sourceopen', () => {
	sourceBuffer = ms.addSourceBuffer('video/mp4; codecs="avc1.4d401f"');
	this.props.socket.emit('credentials', 'magnet:?xt=urn:btih:ec9e9afdf55c50e545d1abf64d255bf9e0687c5d&dn=The.Big.Bang.Theory.S08E13.HDTV.x264-LOL.mp4&tr=udp%3A%2F%2Ftracker.leechers-paradise.org%3A6969&tr=udp%3A%2F%2Fzer0day.ch%3A1337&tr=udp%3A%2F%2Fopen.demonii.com%3A1337&tr=udp%3A%2F%2Ftracker.coppersurfer.tk%3A6969&tr=udp%3A%2F%2Fexodus.desync.com%3A6969')
    video.play();
    sourceBuffer.addEventListener('updatestart', function(e) { console.log('updatestart: ' + ms.readyState); });
	  sourceBuffer.addEventListener('update', function(e) { console.log('update: ' + ms.readyState); });
	  sourceBuffer.addEventListener('updateend', function(e) { console.log('updateend: ' + ms.readyState); });
	  sourceBuffer.addEventListener('error', function(e) { console.log(e); });
	  sourceBuffer.addEventListener('abort', function(e) { console.log('abort: ' + ms.readyState); });
	  sourceBuffer.addEventListener('update', function() { // Note: Have tried 'updateend'
	    if (queue.length > 0 && !sourceBuffer.updating) {
	      sourceBuffer.appendBuffer(queue.shift());
	    }
	  });
});

ss(this.props.socket).on('test', function(stream) {
  stream.on('data', data => {
  	if (typeof data !== 'string') {
	    if (sourceBuffer.updating || queue.length > 0) {
	      queue.push(data);
	    } else {
	    	console.log(data)
	     sourceBuffer.appendBuffer(data);
	    }
	  }

  })
});*/

/*this.props.socket.on('data', (chunk) => {
	//console.log((new Uint8Array(chunk)))
	//arrayBuffer.push(chunk);
	//video.webkitSourceAppend(new Uint8Array(chunk));
})
this.props.socket.on('end', () => {
	console.log('end')
	//var video = new Blob([new Uint8Array(arrayBuffer)], { type: "video/mkv" });
	//video.src = (window.URL || window.webkitURL).createObjectURL(video);
	//video.webkitSourceAppend(new Uint8Array(chunk));
})*/

 /*stream.on('end', () => {
  	console.log('end')
  	var testvideo = new Blob(arrayBuffer, { type: "video/mkv" });
  	console.log(video)
  	//console.log(arrayBuffer)
  	video.src = (window.URL || window.webkitURL).createObjectURL(testvideo);
  })*/