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
						   "images/21_Pedro.JPG", "images/22_Sam.JPG", "images/23_Oryan.JPG",
						   "images/24_Gladys.JPG", "images/25_Andy.JPG", "images/26_Jason.JPG",
						   "images/27_Moon.JPG", "images/28_Julia.JPG"];						   

	var finishedLoadingPics = false;
	var inTheZone, pastChange;

	var currentCamPos;

	var eyerayCaster, lookDummy;
	var changeBoxA, changeBoxB;
	var toBackStatus = false, toBackStatusPast = false;
//

// WEB_AUDIO_API!
	var context, usingWebAudio = true, bufferLoader, convolver, mixer;
	var source, buffer, audioBuffer, gainNode, convolverGain;
	var soundLoaded = false;
	var masterGain, sampleGain;

	var sound_sweet = {};
	var sweetSource;
	var vecZ = new THREE.Vector3(0,0,1);
	var vecY = new THREE.Vector3(0,-1,0);
	var sswM, sswX, sswY, sswZ;
	var camM, camMX, camMY, camMZ;	

	var _iOSEnabled = false;

	try {
		window.AudioContext = window.AudioContext || window.webkitAudioContext;
		context = new AudioContext();
		console.log(context);
	}
	catch(e){
		alert('Web Audio API is not supported in this browser');
	}

	//
	var sample = new SoundsSample(context);

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
	///////////////////////////////////////////////////////////////
	renderer = new THREE.WebGLRenderer({
		antialias: true,
		alpha: true
	});
	renderer.setClearColor(0x001320, 1);
	renderer.autoClear = false;
	renderer.setSize(window.innerWidth, window.innerHeight);
	// 
	renderElement = renderer.domElement;
	container = document.getElementById('render_canvas');
	container.appendChild(renderElement);

	if( isMobile ){
		effect = new THREE.StereoEffect(renderer);
		effect.separation = 0.2;
	    effect.targetDistance = 50;
	    effect.setSize(window.innerWidth, window.innerHeight);
	}
    //

	scene = new THREE.Scene();
	// camera = new THREE.PerspectiveCamera(90, 1, 0.001, 700);
	camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 0.1, 10000);
	controls = new THREE.DeviceControls(camera, true);
	scene.add( controls.getObject() );

	var light = new THREE.DirectionalLight( 0xffffff, 1 );
	light.position.set(1,1,1);
	scene.add(light);

	///////////////////////////////////////////////////////////////
	stats = new Stats();
	stats.domElement.style.position = 'absolute';
	stats.domElement.style.bottom = '5px';
	stats.domElement.style.zIndex = 100;
	stats.domElement.children[ 0 ].style.background = "transparent";
	stats.domElement.children[ 0 ].children[1].style.display = "none";
	container.appendChild(stats.domElement);

	///////////////////////////////////////////////////////////////
	var onTouchStart = function ( event ) {
		// console.log("touch!");
		picIndex++;
		ball.material.map = photos[picIndex%photoFileRoutes.length];

		if(samplesAllLoaded && hasSound[picIndex%photoFileRoutes.length]==1){
			if(whichMobile == "iOS_mobile" && !_iOSEnabled) {
				return;
			}
			sample.trigger(picIndex%photoFileRoutes.length, 1);
		}
	}
	
	window.addEventListener('click', fullscreen, false);
	window.addEventListener('resize', resize, false);
	document.addEventListener( 'keydown', myKeyPressed, false );
	document.addEventListener( 'keyup', myKeyReleased, false );

	if(isMobile) {
		document.addEventListener( 'touchstart', onTouchStart, false );
	}

	// enable Web Audio API on iOS, reference:
	// 1) Howler.js
	// 2) http://matt-harrison.com/perfect-web-audio-on-ios-devices-with-the-web-audio-api/
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

            window.removeEventListener('touchend', unlock, false);
          }
        }, 0);
     };

	if( !_iOSEnabled && /iPhone|iPad|iPod/i.test(navigator.userAgent) ) {
      // setup a touch start listener to attempt an unlock in
      window.addEventListener('touchend', unlock, false);
	}

	setTimeout(resize, 1);

	// test cubes
	// var geometry = new THREE.SphereGeometry(1);
	// var material = new THREE.MeshLambertMaterial({ color: 0x00ffff });
	// var mesh;
	// for(var i=0; i<50; i+=10){
	// 	for(var j=0; j<50; j+=10){
	// 		mesh = new THREE.Mesh(geometry, material);
	// 		mesh.position.set(i-25,0,j-25);
	// 		scene.add(mesh);
	// 		boxes.push(mesh);
	// 	}
	// }

	// sphere for 360 sphere
	loadModelBall( 'models/360ball_2.js' );

	geometry = new THREE.BoxGeometry(1,20,20);
	material = new THREE.MeshBasicMaterial({color: 0xffff00, transparent: true, opacity: 0});		// transparent: true, opacity: 0
	changeBoxA = new THREE.Mesh(geometry.clone(), material);
	changeBoxA.position.x = 3;
	changeBoxA.name = "changeBoxA";
	scene.add(changeBoxA);

	// geometry = new THREE.BoxGeometry(5,5,5);
	// changeBoxB = new THREE.Mesh(geometry.clone(), material);
	// changeBoxB.position.x = -10;
	// changeBoxB.position.z = 10;
	// changeBoxB.name = "changeBoxB";
	// scene.add(changeBoxB);

	//lookDummy
		// projector = new THREE.Projector();
		eyerayCaster = new THREE.Raycaster();

		geometry = new THREE.SphereGeometry(1);
		material = new THREE.MeshBasicMaterial({color: 0x00ffff, transparent: true, opacity: 0});
		lookDummy = new THREE.Mesh(geometry, material);
		scene.add(lookDummy);

	//
	animate();

	// audio!
	// if(samplesAllLoaded)
	// 	sample.trigger(4, 1);
}


function finishedLoading(bufferList){

	bufferStorage = bufferList;

	masterGain = (typeof context.createGain === 'undefined') ? context.createGainNode() : context.createGain();
	masterGain.gain.value = 1;
	masterGain.connect(context.destination);

	console.log("create masterGain");

	sampleGain = (typeof context.createGain === 'undefined') ? context.createGainNode() : context.createGain();
	sampleGain.gain.value = 1;
	sampleGain.connect(context.destination);

	sound_sweet.source = context.createBufferSource();
	sound_sweet.source.buffer = bufferList[0];
	sound_sweet.source.loop = true;

	sound_sweet.gainNode = (typeof context.createGain === 'undefined') ? context.createGainNode() : context.createGain();
	sound_sweet.gainNode.gain.value = 1;
	sound_sweet.source.connect(sound_sweet.gainNode);

	sound_sweet.gainNode.connect(masterGain);


	// sound_sweet.panner = context.createPanner();
	// sound_sweet.gainNode.connect(sound_sweet.panner);
	// sound_sweet.panner.connect(masterGain);

	// // Sweet source
	// 	geometry = new THREE.SphereGeometry(2);
	// 	material = new THREE.MeshBasicMaterial({ color: 0xffff00, transparent: true, opacity: 0 });
	// 	sweetSource = new THREE.Mesh(geometry, material);
	// 	sweetSource.scale.set(0.1,0.1,0.1);
	// 	sweetSource.position.set(0,0,-2);
	// 	sweetSource.name = "sweetSource";
	// 	scene.add(sweetSource);

	// 	var vecc = new THREE.Vector3(0,0,1);

	// 	sswM = sweetSource.matrixWorld;
	// 	sswX = sswM.elements[12];
	// 	sswY = sswM.elements[13];
	// 	sswZ = sswM.elements[14];
	// 	sswM.elements[12] = sswM.elements[13] = sswM.elements[14] = 0;

	// 	vecc.applyProjection(sswM);
	// 	vecc.normalize();

	// 	sound_sweet.panner.setOrientation(vecc.x, vecc.y, vecc.z);

	// 	sswM.elements[12] = sswX;
	// 	sswM.elements[13] = sswY;
	// 	sswM.elements[14] = sswZ;

	//
	if (typeof sound_sweet.source.start === 'undefined') {
      sound_sweet.source.noteOn(context.currentTime);
    } else {
      sound_sweet.source.start(context.currentTime);
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
		ball.rotation.y -= 0.3;
		ball.name = "ball";
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

			if(samplesAllLoaded && hasSound[picIndex%photoFileRoutes.length]==1){
				if(whichMobile == "iOS_mobile" && !_iOSEnabled) {
					return;
				}
				sample.trigger(picIndex%photoFileRoutes.length, 1);
			}
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

	if(isMobile)
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

	//
	// context.listener.setPosition( currentCamPos.x, currentCamPos.y, currentCamPos.z );	
	// if(sound_sweet.panner) {
	// 	sound_sweet.panner.setPosition( sweetSource.position.x, sweetSource.position.y, sweetSource.position.z );
	// 	// orientation
	// 	camM = controls.getObject().matrix;

	// 	camMX = camM.elements[12];
	// 	camMY = camM.elements[13];
	// 	camMZ = camM.elements[14];
	// 	camM.elements[12] = camM.elements[13] = camM.elements[14] = 0;

	// 	// Multiply the orientation vector by the world matrix of the camera.
	// 	var vec = new THREE.Vector3(0,0,1);
	// 	vec.applyProjection(camM);
	// 	vec.normalize();

	// 	// Multiply the up vector by the world matrix.
	// 	var up = new THREE.Vector3(0,-1,0);
	// 	up.applyProjection(camM);
	// 	up.normalize();

	// 	// Set the orientation and the up-vector for the listener.
	// 	context.listener.setOrientation(vec.x, vec.y, vec.z, up.x, up.y, up.z);

	// 	camM.elements[12] = camMX;
	// 	camM.elements[13] = camMY;
	// 	camM.elements[14] = camMZ;
	// }

	//EYE_RAY!
		var directionCam = controls.getDirection().clone();
		eyerayCaster.set( controls.getObject().position.clone(), directionCam );
		var eyeIntersects = eyerayCaster.intersectObjects( scene.children, true );
		//console.log(intersects);

		if ( eyeIntersects.length > 0 ) {
			// console.log('hit');
			// console.log(eyeIntersects[ 0 ].object);

			// 
			if(eyeIntersects[ 0 ].object.name == "changeBoxA"){
				toBackStatus = true;
				toBackStatusPast = true;

				if( sound_sweet.gainNode ) {
					if( sound_sweet.gainNode.gain.value<1 ){
						sound_sweet.gainNode.gain.value += 0.05;
					}
					if( sampleGain.gain.value>0.2 ){
						sampleGain.gain.value -= 0.05;
					}
				}
			}
			else if(eyeIntersects[ 0 ].object.name == "sweetSource" || eyeIntersects[ 0 ].object.name == "ball") {
				toBackStatus = false;

				if(toBackStatusPast){
					picIndex++;
					ball.material.map = photos[picIndex%photoFileRoutes.length];

					if(samplesAllLoaded && hasSound[picIndex%photoFileRoutes.length]==1){
						if(whichMobile == "iOS_mobile" && !_iOSEnabled) {
							return;
						}
						sample.trigger(picIndex%photoFileRoutes.length, 1);
					}
					console.log("change!");
					toBackStatusPast = false;
				}

				// decrease the sweet bg sound
				if( sound_sweet.gainNode ) {
					if( sound_sweet.gainNode.gain.value>0.3 ){
						sound_sweet.gainNode.gain.value -= 0.05;
					}
					if( sampleGain.gain.value<1 ){
						sampleGain.gain.value += 0.05;
					}
				}
			}
			// if(eyeIntersects[ 0 ].object.name == "changeBoxA"){
			// 	if(!changeFromA){
			// 		picIndex++;
			// 		ball.material.map = photos[picIndex%photoFileRoutes.length];

			// 		if(samplesAllLoaded && hasSound[picIndex]==1){
			// 			if(whichMobile == "iOS_mobile" && !_iOSEnabled) {
			// 				return;
			// 			}
			// 			sample.trigger(picIndex, 1);
			// 		}
			// 		changeFromA = true;
			// 	}
			// }
			

			// if(intersects[ 0 ].object.parent != scene)
				lookDummy.position.copy(eyeIntersects[ 0 ].object.position);
		}

	//
	stats.update();
	time = Date.now();
}

function render(dt) {
	if(isMobile)
		effect.render(scene, camera);
	else
		renderer.render( scene, camera );
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