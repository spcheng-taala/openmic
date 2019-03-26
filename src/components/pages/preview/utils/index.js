var ffmpeg = require('fluent-ffmpeg')
var Videoshow = require('./videoshow')
// var pkg = require('../package.json')

module.exports = videoshow

function videoshow(images, options) {
  return new Videoshow(images, options)
}

var version = "0.1.11";
videoshow.VERSION = version;
videoshow.ffmpeg = ffmpeg
