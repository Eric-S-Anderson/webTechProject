//Shared.js Web Audio functions

// Initialize new context
context = new (window.AudioContext || window.webkitAudioContext)();

if (!context.createGain)
  context.createGain = context.createGainNode;
if (!context.createDelay)
  context.createDelay = context.createDelayNode;
if (!context.createScriptProcessor)
  context.createScriptProcessor = context.createJavaScriptNode;

// shim layer with setTimeout fallback
window.requestAnimFrame = (function(){
return  window.requestAnimationFrame       || 
  window.webkitRequestAnimationFrame || 
  window.mozRequestAnimationFrame    || 
  window.oRequestAnimationFrame      || 
  window.msRequestAnimationFrame     || 
  function( callback ){
  window.setTimeout(callback, 1000 / 60);
};
})();

function BufferLoader(context, urlList, callback) {
  this.context = context;
  this.urlList = urlList;
  this.onload = callback;
  this.bufferList = new Array();
  this.loadCount = 0;
}

BufferLoader.prototype.loadBuffer = function(url, index) {
  // Load buffer asynchronously
  var request = new XMLHttpRequest();
  request.open("GET", url, true);
  request.responseType = "arraybuffer";

  var loader = this;

  request.onload = function() {
    // Asynchronously decode the audio file data in request.response
    loader.context.decodeAudioData(
      request.response,
      function(buffer) {
        if (!buffer) {
          alert('error decoding file data: ' + url);
          return;
        }
        loader.bufferList[index] = buffer;
        if (++loader.loadCount == loader.urlList.length)
          loader.onload(loader.bufferList);
      },
      function(error) {
        console.error('decodeAudioData error', error);
      }
    );
  }

  request.onerror = function() {
    alert('BufferLoader: XHR error');
  }

  request.send();
};

BufferLoader.prototype.load = function() {
  for (var i = 0; i < this.urlList.length; ++i)
  this.loadBuffer(this.urlList[i], i);
};  


//Load sounds

function PlaySounds(context,soundsArray) {
  var ctx = this;
  var loader = new BufferLoader(context,soundsArray, onLoad);

      function onLoad(buffers) {
        ctx.buffers = buffers;
        loadGraphics();
      };
      
      loader.load(); //Load sound files

}
      
//Type is the sound to play (index in buffer)
PlaySounds.prototype.startSound = function(type) {

  var source = context.createBufferSource(); //create source
  source.buffer = this.buffers[type]; //sound to play
  source.connect(context.destination); //link source and context
  source[source.start ? 'start' : 'noteOn'](0); //start sound now, (noteOn for old browsers)
  return source;
}

PlaySounds.prototype.stopSound = function(stopSrc) {
    stopSrc[stopSrc.stop ? 'stop' : 'noteOff'](0);//stop sound now (noteOff for old browsers)
}