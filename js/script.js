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
	var inTheZone, pastChange;

	var currentCamPos;
//

// WEB_AUDIO_API!
	var context, bufferLoader, convolver, mixer;
	var source, buffer, audioBuffer, gainNode, convolverGain;
	var mediaStreamSource;
	var samples = 1024;
	var soundLoaded = false;
	var mainVolume;

	var sound_sweet = {};

	//
	window.AudioContext = (window.AudioContext || window.webkitAudioContext || null);
	if(!AudioContext){
		throw new Error("AudioContext not supported!");
	}
	context = new AudioContext();

	//
	var sample = new SoundsSample(context);
	var sweetSource;

	//
	var vecZ = new THREE.Vector3(0,0,1);
	var vecY = new THREE.Vector3(0,-1,0);
	var sswM, sswX, sswY, sswZ;
	var camM, camMX, camMY, camMZ;	

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
	//
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

	// test spheres
	var geometry = new THREE.SphereGeometry(1);
	var material = new THREE.MeshLambertMaterial({ color: 0x00ffff });
	var mesh;
	for(var i=0; i<50; i+=10){
		for(var j=0; j<50; j+=10){
			mesh = new THREE.Mesh(geometry, material);
			mesh.position.set(i-25,0,j-25);
			scene.add(mesh);
			boxes.push(mesh);
		}
	}

	//
	var onTouchStart = function ( event ) {
		// console.log("touch!");
		picIndex++;
		ball.material.map = photos[picIndex%4];
	}
	
	window.addEventListener('resize', resize, false);
	document.addEventListener( 'keydown', myKeyPressed, false );
	document.addEventListener( 'keyup', myKeyReleased, false );

	if(isMobile) {
		document.addEventListener( 'touchstart', onTouchStart, false );
		// document.addEventListener( 'touchend', onTouchEnd, false );
	}

	setTimeout(resize, 1);

	// texture
	for(var i=0; i<photoFileRoutes.length; i++){
		var pp = THREE.ImageUtils.loadTexture( photoFileRoutes[i] );
		photos.push(pp);
	}

	ballMat = new THREE.MeshBasicMaterial({map: photos[0]});

	loadModelBall( 'models/360ball_2.js', ballMat );

	//
	animate();

	// audio!
	if(samplesAllLoaded)
		sample.trigger(0, 1);
}

function finishedLoading(bufferList){

	bufferStorage = bufferList;

	mixer = context.createGain();
	mainVolume = context.createGain();
	mainVolume.connect(context.destination);
	//

	sound_sweet.source = context.createBufferSource();
	sound_sweet.source.buffer = bufferList[0];
	sound_sweet.source.loop = true;
	sound_sweet.gainNode = context.createGain();
	sound_sweet.gainNode.gain.value = 1;
	sound_sweet.source.connect(sound_sweet.gainNode);

	sound_sweet.panner = context.createPanner();
	sound_sweet.gainNode.connect(sound_sweet.panner);
	sound_sweet.panner.connect(mainVolume);

	// start to PLAY!
	// sound_empty.source.start(context.currentTime);
	sound_sweet.source.start(context.currentTime);

	//
	// Sweet source
	geometry = new THREE.SphereGeometry(2);
	material = new THREE.MeshBasicMaterial({ color: 0xffff00 });
	sweetSource = new THREE.Mesh(geometry, material);
	sweetSource.position.set(0,0,5);
	scene.add(sweetSource);

	sswM = sweetSource.matrixWorld;
	sswX = sswM.elements[12];
	sswY = sswM.elements[13];
	sswZ = sswM.elements[14];
	sswM.elements[12] = sswM.elements[13] = sswM.elements[14] = 0;

	vecZ.applyProjection(sswM);
	vecZ.normalize();

	sound_sweet.panner.setOrientation(vecZ.x, vecZ.y, vecZ.z);

	sswM.elements[12] = sswX;
	sswM.elements[13] = sswY;
	sswM.elements[14] = sswZ;
}

function loadModelBall(model, material) {
	var loader = new THREE.JSONLoader();
	loader.load(model, function(geometry){
		ball = new THREE.Mesh( geometry, material );
		ball.scale.set(5,5,5);
		scene.add(ball);
	}, "js");
}

var picIndex = 0;

function myKeyPressed (event) {

	// console.log(camPos);

	switch ( event.keyCode ) {

		case 49: //1 --> p1
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

function update(dt) {
	resize();

	camera.updateProjectionMatrix();

	// controls.update(dt);
	controls.update(Date.now() - time);
	currentCamPos = controls.position();

	var conRot = controls.rotation().y%Math.PI;
	// console.log(conRot);

	// once conRot is in the zone of -0.0 ~ -1.5
	// picture: changes
	// audio: 1)changes; 2)fade in out
	if(conRot<-0.0 && conRot>-1.5){
		if(!inTheZone){
			picIndex++;
			ball.material.map = photos[picIndex%photoFileRoutes.length];
			console.log("picture: changes");
			inTheZone = true;
		}
	}else{
		inTheZone = false;
	}
	// console.log(conRott);

	// SOUND
	context.listener.setPosition( currentCamPos.x, currentCamPos.y, currentCamPos.z );
	if(sound_sweet.panner) {
		sound_sweet.panner.setPosition( sweetSource.position.x, sweetSource.position.y, sweetSource.position.z );

		// orientation
		camM = controls.getObject().matrix;

		camMX = camM.elements[12];
		camMY = camM.elements[13];
		camMZ = camM.elements[14];
		camM.elements[12] = camM.elements[13] = camM.elements[14] = 0;

		// Multiply the orientation vector by the world matrix of the camera.
		var vec = new THREE.Vector3(0,0,1);
		vec.applyProjection(camM);
		vec.normalize();

		// Multiply the up vector by the world matrix.
		var up = new THREE.Vector3(0,-1,0);
		up.applyProjection(camM);
		up.normalize();

		// Set the orientation and the up-vector for the listener.
		context.listener.setOrientation(vec.x, vec.y, vec.z, up.x, up.y, up.z);

		camM.elements[12] = camMX;
		camM.elements[13] = camMY;
		camM.elements[14] = camMZ;
	}

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