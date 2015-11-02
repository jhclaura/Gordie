// add PointerLockControls
// http://www.html5rocks.com/en/tutorials/pointerlock/intro/
	var element = document.body;
	var pointerControls, dateTime = Date.now();
	var objects = [];
	var rays = [];
	var blocker, instructions;

	var havePointerLock = 
				'pointerLockElement' in document || 
				'mozPointerLockElement' in document || 
				'webkitPointerLockElement' in document;

	if ( havePointerLock ) {
		// console.log("havePointerLock");
		blocker = document.getElementById('blocker');
		instructions = document.getElementById('instructions');

		var pointerlockchange = function ( event ) {

			if ( document.pointerLockElement === element || document.mozPointerLockElement === element || document.webkitPointerLockElement === element ) {
				console.log("enable pointerControls");

				controls.enabled = true;
				blocker.style.display = 'none';

			} else {

				controls.enabled = false;
				blocker.style.display = '-webkit-box';
				blocker.style.display = '-moz-box';
				blocker.style.display = 'box';

				instructions.style.display = '';
			}

		}

		var pointerlockerror = function(event){
			instructions.style.display = '';
		}

		// Hook pointer lock state change events
		document.addEventListener( 'pointerlockchange', pointerlockchange, false );
		document.addEventListener( 'mozpointerlockchange', pointerlockchange, false );
		document.addEventListener( 'webkitpointerlockchange', pointerlockchange, false );

		document.addEventListener( 'pointerlockerror', pointerlockerror, false );
		document.addEventListener( 'mozpointerlockerror', pointerlockerror, false );
		document.addEventListener( 'webkitpointerlockerror', pointerlockerror, false );


		if(isTouchDevice()) {
			console.log("isTouchDevice");
			// instructions.addEventListener( 'touchend', funToCall, false );
		} else {
			instructions.addEventListener( 'click', funToCall, false );
		}

	} else {
		//instructions.innerHTML = 'Your browser doesn\'t seem to support Pointer Lock API';
	}

	function funToCall(event){

		console.log("click or touch!");
		instructions.style.display = 'none';

		// Ask the browser to lock the pointer
		element.requestPointerLock = element.requestPointerLock || element.mozRequestPointerLock || element.webkitRequestPointerLock;

		controls.enabled = true;

		if ( /Firefox/i.test( navigator.userAgent ) ) {
			var fullscreenchange = function ( event ) {
				if ( document.fullscreenElement === element || document.mozFullscreenElement === element || document.mozFullScreenElement === element ) {
					document.removeEventListener( 'fullscreenchange', fullscreenchange );
					document.removeEventListener( 'mozfullscreenchange', fullscreenchange );
					element.requestPointerLock();
				}
			}
			document.addEventListener( 'fullscreenchange', fullscreenchange, false );
			document.addEventListener( 'mozfullscreenchange', fullscreenchange, false );

			element.requestFullscreen = element.requestFullscreen || element.mozRequestFullscreen || element.mozRequestFullScreen || element.webkitRequestFullscreen;
			element.requestFullscreen();
		} else {
			element.requestPointerLock();
		}
	}


// Three.js
	var camera, scene, renderer;
	var effect, controls;
	var renderElement, container;

	var ball, ballMat;
	var photos=[];
	var boxes=[];
	var time;

	var clock = new THREE.Clock();

	
	var photoFileRoutes = ["images/0_empty.JPG", "images/1_John.JPG", "images/2_Rosalie.JPG",
						   "images/3_Dan.JPG", "images/4_Laura.JPG", "images/5_Marianne.JPG",
						   "images/6_George.JPG", "images/7_Matt.JPG", "images/8_Tom.JPG",
						   "images/9_Midori.JPG", "images/10_Shiffman.JPG", "images/11_John_Matt.JPG",
						   "images/12_Gabriel.JPG", "images/13_Danny.JPG", "images/14_Katherine.JPG",
						   "images/15_Gabe.JPG", "images/16_Nancy.JPG", "images/17_Shawn.JPG",
						   "images/18_Mimi.JPG", "images/19_Lauren.JPG", "images/20_Marlon.JPG",
						   "images/21_Pedro.JPG", "images/22_Sam.JPG", "images/23_Oryan.JPG"];
						   

	/*
	var photoFileRoutes = ["images/1_John.JPG", "images/2_Rosalie.JPG",
						   "images/3_Dan.JPG", "images/4_Laura.JPG", "images/5_Marianne.JPG",
						   "images/6_George.JPG", "images/7_Matt.JPG", "images/8_Tom.JPG",
						   "images/9_Midori.JPG", "images/10_Shiffman.JPG", "images/11_John_Matt.JPG",
						   "images/12_Gabriel.JPG", "images/13_Danny.JPG", "images/14_Katherine.JPG",
						   "images/15_Gabe.JPG", "images/16_Nancy.JPG", "images/17_Shawn.JPG",
						   "images/18_Mimi.JPG", "images/19_Lauren.JPG"];*/
						   

	var finishedLoadingPics = false;
	var inTheZone, pastChange;

	var currentCamPos;
//

// WEB_AUDIO_API!
	var context, usingWebAudio = true, bufferLoader, convolver, mixer;
	var source, buffer, audioBuffer, gainNode, convolverGain;
	var soundLoaded = false;
	var masterGain;

	var sound_sweet = {};
	var sweetSource;

	var _iOSEnabled = false;

	// v1
	try {
		window.AudioContext = window.AudioContext || window.webkitAudioContext;
		context = new AudioContext();
		console.log(context);
	}
	catch(e){
		alert('Web Audio API is not supported in this browser');
	}

	//
	// var sample = new SoundsSample(context);

///////////////////////////////////////////////////////////////

init();
animate();

///////////////////////////////////////////////////////////////

function init() {

	// WEB_AUDIO_API
	bufferLoader = new BufferLoader(
    	context, ['../audios/Gordie_sweet.mp3'], 	// #0
    			  finishedLoading
    	);
    bufferLoader.load();

	time = Date.now();

	// THREE.JS
	renderer = new THREE.WebGLRenderer({
		antialias: true,
		alpha: true
	});
	renderer.setClearColor(0x001320, 1);
	// renderer.setPixelRatio( window.devicePixelRatio );	//add
	renderer.autoClear = false;
	renderer.setSize(window.innerWidth, window.innerHeight);
	// 
	renderElement = renderer.domElement;
	container = document.getElementById('render_canvas');
	container.appendChild(renderElement);

	effect = new THREE.StereoEffect(renderer);
	//
	effect.separation = 0.2;
    effect.targetDistance = 50;
    effect.setSize(window.innerWidth, window.innerHeight);
    //

	scene = new THREE.Scene();

	// camera = new THREE.PerspectiveCamera(90, 1, 0.001, 700);
	camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 0.1, 10000);

	// v_Laura
	controls = new THREE.DeviceControls(camera, true);
	scene.add( controls.getObject() );
	window.addEventListener('click', fullscreen, false);

	///////////////////////////////////////////////////////////////
	var light = new THREE.DirectionalLight( 0xffffff, 1 );
	light.position.set(1,1,1);
	scene.add(light);

	//
	stats = new Stats();
	stats.domElement.style.position = 'absolute';
	stats.domElement.style.bottom = '5px';
	stats.domElement.style.zIndex = 100;
	stats.domElement.children[ 0 ].style.background = "transparent";
	stats.domElement.children[ 0 ].children[1].style.display = "none";
	container.appendChild(stats.domElement);

	//
	var onTouchStart = function ( event ) {
		// console.log("touch!");
		picIndex++;
		ball.material.map = photos[picIndex%4];

		// sound_sweet.source.noteOn(context.currentTime);
	}
	
	window.addEventListener('resize', resize, false);
	document.addEventListener( 'keydown', myKeyPressed, false );
	document.addEventListener( 'keyup', myKeyReleased, false );

	if(isMobile) {
		document.addEventListener( 'touchstart', onTouchStart, false );
	}

	var unlock = function() {
		console.log("do unlock");
        // create an empty buffer
        var buffer = context.createBuffer(1, 1, 22050);
        var source = context.createBufferSource();
        source.buffer = buffer;
        source.connect(context.destination);

        // play the empty buffer
        if (typeof source.start === 'undefined') {
          source.noteOn(0);
        } else {
          source.start(0);
        }

        // setup a timeout to check that we are unlocked on the next event loop
        setTimeout(function() {
          if ((source.playbackState === source.PLAYING_STATE || source.playbackState === source.FINISHED_STATE)) {
            // update the unlocked state and prevent this check from happening again
            _iOSEnabled = true;
            // remove the touch start listener
            console.log("unlock succeed!");

   //          if (typeof sound_sweet.source.start === 'undefined') {
			//   sound_sweet.source.noteOn(context.currentTime);
			// } else {
			//   sound_sweet.source.start(context.currentTime);
			//   // console.log("play!");
			// }

            window.removeEventListener('touchend', unlock, false);
          }
        }, 0);
     };

	if( !_iOSEnabled && /iPhone|iPad|iPod/i.test(navigator.userAgent) ) {
      // setup a touch start listener to attempt an unlock in
      window.addEventListener('touchend', unlock, false);
	}

	setTimeout(resize, 1);

	// texture
	loadModelBall( 'models/360ball_2.js' );

	//
	animate();

	// audio!
	if(samplesAllLoaded)
		sample.trigger(4, 1);
}


function finishedLoading(bufferList){

	bufferStorage = bufferList;

	masterGain = (typeof context.createGain === 'undefined') ? context.createGainNode() : context.createGain();
	masterGain.gain.value = 2;
	masterGain.connect(context.destination);

	console.log("create masterGain");

	sound_sweet.source = context.createBufferSource();
	sound_sweet.source.buffer = bufferList[0];
	sound_sweet.source.loop = true;

	sound_sweet.gainNode = (typeof context.createGain === 'undefined') ? context.createGainNode() : context.createGain();
	sound_sweet.gainNode.gain.value = 1;
	sound_sweet.source.connect(sound_sweet.gainNode);
	sound_sweet.gainNode.connect(masterGain);

	// sound_sweet.source.play();

	if (typeof sound_sweet.source.start === 'undefined') {
      sound_sweet.source.noteGrainOn(context.currentTime);
    } else {
      sound_sweet.source.start(0);
      console.log("play!");
    }

	console.log("finish loading!");
}

function loadModelBall(model) {
	var loader = new THREE.JSONLoader();
	loader.load(model, function(geometry){

		// textures
		for(var i=0; i<photoFileRoutes.length; i++){
			var pp = THREE.ImageUtils.loadTexture( photoFileRoutes[i] );
			photos.push(pp);
		}
		ballMat = new THREE.MeshBasicMaterial({map: photos[0]});
		ball = new THREE.Mesh( geometry, ballMat );
		ball.scale.set(5,5,5);
		scene.add(ball);

		finishedLoadingPics = true;
	}, "js");
}

var picIndex = 0;

function myKeyPressed (event) {

	// console.log(camPos);

	switch ( event.keyCode ) {

		case 49: //1
			console.log("touch!");
			picIndex++;
			ball.material.map = photos[picIndex%photoFileRoutes.length];
			break;
	}
}

function myKeyReleased (event) {

	switch ( event.keyCode ) {

		case 77: //M --> stop moving forward
			break;

	}
}


function resize() {
	var width = container.offsetWidth;
	var height = container.offsetHeight;

	camera.aspect = width / height;
	camera.updateProjectionMatrix();

	renderer.setSize(width, height);
	effect.setSize(width, height);
}


var trigger = false;
var pastChange = false;
var doneIt = false;
var doneItIndex = 0;
var preDisplay = setInterval( preDisplayFunc, 100);

function preDisplayFunc() {
	if(finishedLoadingPics && !doneIt){
		ball.material.map = photos[doneItIndex];
		doneItIndex ++;
		console.log("ahhh");

		if(doneItIndex == photos.length){
			doneIt = true;
			clearInterval(preDisplay);
		}
	}
}

function update(dt) {
	resize();

	camera.updateProjectionMatrix();

	// controls.update(dt);
	controls.update(Date.now() - time);
	currentCamPos = controls.position();

	var conRot = controls.rotation().y%Math.PI;

	// once conRot is in the zone of -0.0 ~ -1.5
	// picture: changes
	// audio: 1)changes; 2)fade in out
	if(ball && conRot<-0.0 && conRot>-1.5){
		if(!inTheZone){
			picIndex++;
			ball.material.map = photos[picIndex%photoFileRoutes.length];
			// console.log("picture: changes");
			inTheZone = true;

			//
			// if(samplesAllLoaded)
			// 	sample.trigger(picIndex,1);
		}
	}else{
		inTheZone = false;
	}
	// console.log(conRott);

	stats.update();

	//
	time = Date.now();
}

function render(dt) {
	effect.render(scene, camera);
}

function animate(t) {
	requestAnimationFrame(animate);

	update(clock.getDelta());	
	render(clock.getDelta());
}
	
function fullscreen() {
	if (container.requestFullscreen) {
		container.requestFullscreen();
	} else if (container.msRequestFullscreen) {
		container.msRequestFullscreen();
	} else if (container.mozRequestFullScreen) {
		container.mozRequestFullScreen();
	} else if (container.webkitRequestFullscreen) {
		container.webkitRequestFullscreen();
	}
}