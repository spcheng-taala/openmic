var union = require('lodash.merge')
var render = require('./render')
var options = require('./options')

module.exports = Videoshow

var images = [];
var params = {};

function Videoshow(images, params) {
  params = params || {}
  this.audioParams = { fade: true }
  this.videoParams = videoParams()
  images = mapImages(images)
}

Videoshow.prototype.size = function (size) {
  params.size = size
  return this
}

Videoshow.prototype.aspect = function (aspect) {
  params.aspect = aspect
  return this
}

Videoshow.prototype.loop = function (seconds) {
  params.loop = seconds
  return this
}

Videoshow.prototype.image = function (image) {
  images.push(mapImages(images))
  return this
}

Videoshow.prototype.audio = function (path, params) {
  this.audioFile = path
  union(this.audioParams, params)
  return this
}

Videoshow.prototype.logo = function (path, params) {
  params.logo = path
  params.logoParams = params
  return this
}

Videoshow.prototype.subtitles = function (path) {
  this.subtitlesPath = path
  return this
}

Videoshow.prototype.filter = function (filter) {
  this.videoParams.videoFilters.push(filter)
  return this
}

Videoshow.prototype.complexFilter = function (filter) {
  this.videoParams.complexFilter.push(filter)
  return this
}

Videoshow.prototype.audioFilter = function (filter) {
  this.videoParams.audioFilters.push(filter)
  return this
}

Videoshow.prototype.input = function (input) {
  this.videoParams.inputs.push(input)
  return this
}

Videoshow.prototype.flag =
Videoshow.prototype.option = function (option) {
  this.videoParams.outputOptions.push(option)
  return this
}

Videoshow.prototype.flags =
Videoshow.prototype.options = function (options) {
  options.forEach(this.option.bind(this))
  return this
}

Videoshow.prototype.save =
Videoshow.prototype.render = function (output) {
  this.output = output
  return render(this)
}

function videoParams() {
  return {
    inputs: [],
    videoFilters: [],
    audioFilters: [],
    complexFilter: [],
    outputOptions: []
  }
}

function mapImages(obj) {
  if (typeof obj === 'string') {
    return { path: obj }
  }

  if (Array.isArray(obj)) {
    return obj.map(mapImages)
  }

  if (obj && typeof obj === 'object') {
    return obj
  }

  throw new TypeError('image must be a string or an array')
}
