const express = require('express');
const router = express.Router();
const fs = require('fs')
var torrentStream = require('torrent-stream');
const got = require('got');
var zlib = require("zlib");
var request = require('request')
var srt2vtt = require('srt-to-vtt')
var mongo = require('../../../mongo');


router.post('/', function(req, res, next) {

	const { languageVideo } = req.body
	const { languageUser } = req.body
	var { magnet } = req.body
	magnet = decodeURIComponent(magnet)

	const db = mongo.getDb();
	const collection = db.collection('magnets');
	
	collection.findOne({magnet: magnet}, function (err, result) {
		if (result && result.subs.length > 0) {
			var count = 0
			var countfinal = 1
			var arraySub = []
			if (languageVideo != languageUser && languageUser != 'en') {
				countfinal++
			}
			for (var i = 0; i < result.subs.length; i++) {
				if (result.subs[i].language == 'en') {
					count++
					arraySub.push(result.subs[i])
				}
				if (countfinal > 1 && result.subs[i].language == languageUser) {
					count++
					arraySub.push(result.subs[i])
				}
			}
			if (count == countfinal) {
				res.status(201).json({ sub: arraySub })
			}
			else {
				DLStartEndMagnet(req, res)
			}
		}
		else {
			DLStartEndMagnet(req, res)
		}
	})
})

function DLStartEndMagnet(req, res) {
	var timeout = false
	const { languageVideo } = req.body
	const { languageUser } = req.body
	var { magnet } = req.body
	magnet = decodeURIComponent(magnet)

	setTimeout(() => {
		console.log('timeout')
		console.log(timeout)
		if (timeout === false) {
			res.status(300).json({message: 'no subtitles'})
			timeout = true
		}
	}, 115000)
	
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
		var stream = file.createReadStream({start:0, end: 65536*2})
		var stream2 = file.createReadStream({start: file.length - 65536*2, end: file.length - 1})

		stream.on('end', () => {
			console.log('end1')
			count++
			if (count == 2 && timeout === false) {
				timeout = true
				hashAndDL(file, req, res)
			}
		})
		stream2.on('end', () => {
			console.log('end2')
			count++
			if (count == 2 && timeout === false) {
				timeout = true
				hashAndDL(file, req, res)
			}
		})
		stream.on('data', () => {
			console.log('data1')
		})
		stream2.on('data', () => {
			console.log('data2')
		})
	})
}
		
function hashAndDL(file, req, res) {
	const { languageVideo } = req.body
	const { languageUser } = req.body
	const { canal } = req.body
	const { seasonNumber } = req.body
	const { episodeNumber } = req.body
	const { releaseYear } = req.body
	var { magnet } = req.body
	magnet = decodeURIComponent(magnet)

	setTimeout(() => {
		computeHash('./public/movies/' + file.path, file.length)
	    .then(infos => {
	        got('https://rest.opensubtitles.org/search/moviehash-'+infos.moviehash, {
				headers: {
			        'User-Agent': 'TemporaryUserAgent'
			    }
			})
			.then((subs) => {
				var secondLanguage = 'en'

				subs = JSON.parse(subs.body)
				
				var subs = subs.filter(sub => {
					if (canal == 'tv') {
						if (sub.SeriesSeason == seasonNumber && sub.SeriesEpisode == episodeNumber) {
							return true
						}
						else {
							return false
						}
					}
					if (canal == 'movie') {
						if (sub.MovieYear == releaseYear) {
							return true
						}
						else {
							return false
						}
					}
				})
				var subsEnglish = subs.filter(sub => {
					return sub.ISO639 == 'en'
				})
				if (languageVideo != languageUser && languageUser != 'en') {
					var subsOther = subs.filter(sub => {
						return sub.ISO639 == languageUser
					})
				}
				if (subsEnglish.length != 0 || (subsOther !== undefined && subsOther.length != 0)) {
					//console.log(subsEnglish)
					//console.log(subsOther)
					var links = []
					var arraySub = []

					if (subsEnglish.length != 0) {
						links.push(subsEnglish[0].SubDownloadLink)
						arraySub.push({language: 'en', file: subsEnglish[0].MovieReleaseName + '.en.vtt'})
					}
					if (subsOther !== undefined && subsOther.length != 0) {
						links.push(subsOther[0].SubDownloadLink)
						arraySub.push({language: languageUser, file: subsOther[0].MovieReleaseName + '.' + languageUser + '.vtt'})
					}
					console.log(links, arraySub)
					//console.log(subs[0])
					var buffer;
					var streamsub;
					var gunzip;
					var count = 0
					for (var i = 0; i < links.length; i++) {
						buffer = []
						streamsub = request(links[i])
						gunzip = zlib.createGunzip();
						console.log(links[i])
						
						streamsub.pipe(gunzip).pipe(srt2vtt()).pipe(fs.createWriteStream('./public/subtitles/' + arraySub[i].file))
						gunzip.on('data', function(data) {
				            // decompression chunk ready, add it to the buffer
				            buffer.push(data.toString())

				        }).on("end", function() {
				        	console.log('res')
				            // response and decompression complete, join the buffer and return
				            buffer.join("");
				            count++
				            console.log('end srt to vtt: ', count, links.length)
				            if (count == links.length) {
				            	const db = mongo.getDb();
								const collection = db.collection('magnets');
								collection.findOne({magnet: magnet}, function (err, result) {
									if (result) {
										result.subs = arrayUnique(result.subs.concat(arraySub));
										collection.save(result)
									}
									else {
										collection.insert({magnet: magnet, subs: arraySub}, function (err, result) {
										});
									}
								})
				            	res.status(201).json({ sub: arraySub })
				            }
				        }).on("error", function(e) {
				            callback(e);
				        })
			    	}
		    	}
		    	else {
		    		res.status(300).json({message: 'no subtitles'})
		    	}
			})
			.catch((error) => console.log(error))
		})
	}, 2000)
}

function computeHash(path, size) {
        // based on node-opensubtitles-api, under MIT - Copyright (c) 2015 ka2er

    return new Promise((resolve, reject) => {
        // get file size, first 64kb, last 64kb and summup everything
        let chunk_size = 65536 //64 * 1024
        let buf_start = new Buffer(chunk_size * 2)
        let buf_end = new Buffer(chunk_size * 2)
        let file_size = 0
        let checksum
        let array_checksum = Array()

        const checksumReady = checksum_part => {
            array_checksum.push(checksum_part)
            if (array_checksum.length === 3) {
                checksum = sumHex64bits(array_checksum[0], array_checksum[1])
                checksum = sumHex64bits(checksum, array_checksum[2])
                checksum = checksum.substr(-16)

                resolve({
                    moviehash: padLeft(checksum, '0', 16),
                    moviebytesize: file_size.toString()
                })
            }
        }

        fs.stat(path, (err, stat) => {
            if (err) return reject(err)

            file_size = size
        console.log('|||||file_size: '+file_size)

            checksumReady(file_size.toString(16))

            fs.open(path, 'r', (err, fd) => {
                if (err) return reject(err)

                fs.read(fd, buf_start, 0, chunk_size * 2, 0, (er1, bytesRead, buf1) => {
                    fs.read(fd, buf_end, 0, chunk_size * 2, file_size - chunk_size, (er2, bytesRead, buf2) => {
                        fs.close(fd, er3 => {
                            if (er1 || er2) return reject(er1 || er2) //er3 is not breaking
                            checksumReady(checksumBuffer(buf1, 16))
                            checksumReady(checksumBuffer(buf2, 16))
                        })
                    })
                })
            })
        })
    })
}

// read 64 bits from buffer starting at offset as LITTLE ENDIAN hex
function read64LE(buffer, offset) {
    const ret_64_be = buffer.toString('hex', offset * 8, ((offset + 1) * 8))
    const array = Array()
    for (let i = 0; i < 8; i++) {
        array.push(ret_64_be.substr(i * 2, 2))
    }
    array.reverse()
    return array.join('')
}

// compute checksum of the buffer splitting by chunk of lengths bits
function checksumBuffer(buf, length) {
    let checksum = 0
    let checksum_hex = 0
    for (let i = 0; i < (buf.length / length); i++) {
        checksum_hex = read64LE(buf, i)
        checksum = sumHex64bits(checksum.toString(), checksum_hex).substr(-16)
    }
    return checksum
}

// calculate hex sum between 2 64bits hex numbers
function sumHex64bits(n1, n2) {
    if (n1.length < 16) n1 = padLeft(n1, '0', 16)
    if (n2.length < 16) n2 = padLeft(n2, '0', 16)

    // 1st 32 bits
    let n1_0 = n1.substr(0, 8)
    let n2_0 = n2.substr(0, 8)
    let i_0 = parseInt(n1_0, 16) + parseInt(n2_0, 16)

    // 2nd 32 bits
    let n1_1 = n1.substr(8, 8)
    let n2_1 = n2.substr(8, 8)
    let i_1 = parseInt(n1_1, 16) + parseInt(n2_1, 16)

    // back to hex
    let h_1 = i_1.toString(16)
    let i_1_over = 0
    if (h_1.length > 8) {
        i_1_over = parseInt(h_1.substr(0, h_1.length - 8), 16)
    } else {
        h_1 = padLeft(h_1, '0', 8)
    }

    let h_0 = (i_1_over + i_0).toString(16)

    return h_0 + h_1.substr(-8)
}

// pad left with c up to length characters
function padLeft(str, c, length) {
    while (str.length < length) {
        str = c.toString() + str
    }
    return str
}

function arrayUnique(array) {
    var a = array.concat();
    for(var i=0; i<a.length; ++i) {
        for(var j=i+1; j<a.length; ++j) {
            if(a[i].language === a[j].language)
                a.splice(j--, 1);
        }
    }

    return a;
}


module.exports = router;