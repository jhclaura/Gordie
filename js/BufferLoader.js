//
//source
//http://www.html5rocks.com/en/tutorials/webaudio/intro/
//

function BufferLoader(context, urlList, callback) {
  this.context = context;
  this.urlList = urlList;
  this.onload = callback;
  this.bufferList = [];
  this.loadCount = 0;
}

BufferLoader.prototype.loadBuffer = function(url, index) {
  // Load buffer asynchronously
  var request = new XMLHttpRequest();
  request.open("GET", url, true);
  request.responseType = "arraybuffer";

  var loader = this;

  request.onload = function() {
    
    /*
    //v2
    var buffer;
    try {
      buffer = loader.context.createBuffer(request.response, false);
    } catch(e) {
      alert('error decoding file data: ' + url);
    }

    try {
      loader.bufferList[index] = buffer;
      if (++loader.loadCount == loader.urlList.length)
        loader.onload(loader.bufferList);
    } catch(e) {
      alert('BufferLoader: callback problem');
    }
    */


    //v1
    // Asynchronously decode the audio file data in request.response
    loader.context.decodeAudioData( request.response, function(buffer) {
        if (!buffer) {
          alert('error decoding file data: ' + url);
          return;
        }

        loader.bufferList[index] = buffer;

        // console.log('yeaa');

        if (++loader.loadCount == loader.urlList.length)
          loader.onload(loader.bufferList);
      },
      function(error) {
        console.error('decodeAudioData error', error);
      }
    );
  };

  request.onerror = function() {
    alert('BufferLoader: XHR error');
  }
  request.send();
}

BufferLoader.prototype.load = function() {
  for(var i=0; i<this.urlList.length; ++i)
    this.loadBuffer(this.urlList[i], i);
}
