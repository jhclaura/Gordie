// Adapted from
// "Web Audio API Advanced Sound for Games and Interactive Apps"
// By Boris Smus

var samplesAllLoaded = false;
var hasSound = [0,0,0,
                1,1,1,
                0,0,0,
                0,1,0,
                0,0,1,
                0,1,0,
                0,0,1,
                0,1,1];

function SoundsSample(context) {

  var ctx = this;
  var loader = new BufferLoader(context, 
            [ '../audios/9_Midori.mp3', '../audios/9_Midori.mp3', '../audios/9_Midori.mp3',
              '../audios/3_danOo.mp3', '../audios/4_laura.mp3', '../audios/5_Marianne.mp3',
              '../audios/9_Midori.mp3', '../audios/9_Midori.mp3', '../audios/9_Midori.mp3',
              '../audios/9_Midori.mp3', '../audios/10_shiffman.mp3', '../audios/9_Midori.mp3',
              '../audios/9_Midori.mp3', '../audios/9_Midori.mp3', '../audios/14_Katherine.mp3',
              '../audios/9_Midori.mp3', '../audios/16_nancy.mp3', '../audios/9_Midori.mp3',
              '../audios/9_Midori.mp3', '../audios/9_Midori.mp3', '../audios/20_marlon.mp3',
              '../audios/9_Midori.mp3', '../audios/22_sam.mp3', '../audios/23_oryan.mp3',
              '../audios/andy.mp3', '../audios/gladys.mp3', '../audios/jason.mp3'   // #24-
              ], onLoaded);

  function onLoaded(buffers) {
    ctx.buffers = buffers;
    samplesAllLoaded = true;
  };

  loader.load();

  this.isCompressed = false;
}

SoundsSample.prototype.trigger = function(index) {
  if (typeof random == 'undefined') {
    random = 0;
  }
  var time = context.currentTime;

  var source = this.makeSource(this.buffers[index]);
  source[source.start ? 'start' : 'noteOn'](time);
}

SoundsSample.prototype.trigger = function(index, volume) {
  if (typeof random == 'undefined') {
    random = 0;
  }
  var time = context.currentTime;

  var source = this.makeSource(this.buffers[index], volume);
  source[source.start ? 'start' : 'noteOn'](time);
}

SoundsSample.prototype.makeSource = function(buffer) {
  var source = context.createBufferSource();
  var gain = context.createGain();
  gain.gain.value = 1;
  source.buffer = buffer;
  source.connect(gain);

  if (this.isCompressed) {
    var compressor = context.createDynamicsCompressor();
    compressor.threshold.value = 10;
    compressor.ratio.value = 20;
    compressor.reduction.value = -20;
    gain.connect(compressor);
    compressor.connect(context.destination);
  } else {
    gain.connect(context.destination);
  }
  return source;
};

SoundsSample.prototype.makeSource = function(buffer, volume) {
  var source = context.createBufferSource();
  var gain = context.createGain();
  gain.gain.value = volume;
  source.buffer = buffer;
  source.connect(gain);

  if (this.isCompressed) {
    var compressor = context.createDynamicsCompressor();
    compressor.threshold.value = 10;
    compressor.ratio.value = 20;
    compressor.reduction.value = -20;
    gain.connect(compressor);
    compressor.connect(context.destination);
  } else {
    gain.connect(context.destination);
  }
  return source;
};

SoundsSample.prototype.triggerPanner = function(index, location) {
  if (typeof random == 'undefined') {
    random = 0;
  }
  var time = context.currentTime;

  var source = this.makePannerSource(this.buffers[index], location);
  source[source.start ? 'start' : 'noteOn'](time);
}

SoundsSample.prototype.makePannerSource = function(buffer, location) {
  var source = context.createBufferSource();
  var gain = context.createGain();
  gain.gain.value = 20;
  source.buffer = buffer;
  source.connect(gain);

  //Panner
  var panner = context.createPanner();
  gain.connect(panner);
  panner.setPosition(location.x, location.y, location.z);
  panner.connect(context.destination);

  return source;
};

SoundsSample.prototype.toggleCompressor = function() {
  this.isCompressed = !this.isCompressed;
}