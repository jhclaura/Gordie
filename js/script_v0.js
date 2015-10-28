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


// adapted from vr.chromeExperience
var camera, scene, renderer;
var effect, controls;
var renderElement, container;

var ball, ballMat;
var photos=[];
var boxes=[];
var time;

var clock = new THREE.Clock();

init();
animate();

function init() {
	time = Date.now();

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

	// v_1
	// camera.position.set(0, 10, 0);
	// scene.add(camera);
	/*
		controls = new THREE.OrbitControls(camera, renderElement);
		controls.rotateUp(Math.PI / 4);
		controls.target.set(
			camera.position.x + 0.1,
			camera.position.y,
			camera.position.z
		);

		controls.noZoom = true;
		controls.noPan = true;

		function setOrientationControls(e) {
			if (!e.alpha) {
				return;
			}

			controls = new THREE.DeviceOrientationControls(camera, true);
			controls.connect();
			controls.update();

			renderElement.addEventListener('click', fullscreen, false);

			window.removeEventListener('deviceorientation', setOrientationControls, true);
		}
		window.addEventListener('deviceorientation', setOrientationControls, true);
	*/

	// v_Laura
	controls = new THREE.DeviceControls(camera, true);
	scene.add( controls.getObject() );
	window.addEventListener('click', fullscreen, false);

	///////////////////////////////////////////////////////////////

	// var light = new THREE.HemisphereLight(0x777777, 0x000000, 1);
	// scene.add(light);

	var light = new THREE.DirectionalLight( 0xffffff, 1 );
	light.position.set(1,1,1);
	scene.add(light);

	var texture = THREE.ImageUtils.loadTexture(
		'textures/patterns/checker.png'
	);

	texture.wrapS = THREE.RepeatWrapping;
	texture.wrapT = THREE.RepeatWrapping;
	texture.repeat = new THREE.Vector2(50, 50);
	texture.anisotropy = renderer.getMaxAnisotropy();

	var material = new THREE.MeshPhongMaterial({
		color: 0xffffff,
		specular: 0xffffff,
		shininess: 20,
		shading: THREE.FlatShading,
		map: texture
	});

	var geometry = new THREE.PlaneGeometry(1000, 1000);

	var mesh = new THREE.Mesh(geometry, material);
	mesh.rotation.x = -Math.PI / 2;
	// scene.add(mesh);

	// test cubes
	geometry = new THREE.SphereGeometry(1);
	material = new THREE.MeshLambertMaterial({ color: 0x00ffff });

	for(var i=0; i<50; i+=10){
		for(var j=0; j<50; j+=10){
			mesh = new THREE.Mesh(geometry, material);
			mesh.position.set(i-25,0,j-25);
			scene.add(mesh);
			boxes.push(mesh);
		}
	}
	

	window.addEventListener('resize', resize, false);
	document.addEventListener( 'keydown', myKeyPressed, false );
	// document.addEventListener( 'keyup', myKeyReleased, false );

	if(isMobile) {
		document.addEventListener( 'touchstart', onTouchStart, false );
		// document.addEventListener( 'touchend', onTouchEnd, false );
	}

	setTimeout(resize, 1);

	// texture
	var pp = THREE.ImageUtils.loadTexture('images/R0010108.JPG');
	photos.push(pp);

	pp = THREE.ImageUtils.loadTexture('images/R0010109.JPG');
	photos.push(pp);

	pp = THREE.ImageUtils.loadTexture('images/R0010111.JPG');
	photos.push(pp);

	pp = THREE.ImageUtils.loadTexture('images/R0010112.JPG');
	photos.push(pp);

	ballMat = new THREE.MeshBasicMaterial({map: photos[0]});

	loadModelBall( 'models/360ball_2.js', ballMat );

	//
	animate();
}

function loadModelBall(model, material) {
	var loader = new THREE.JSONLoader();
	loader.load(model, function(geometry){
		ball = new THREE.Mesh( geometry, material );
		ball.scale.set(10,10,10);
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
			ball.material.map = photos[picIndex%4];
			break;

		case 50: //2 --> p2
			break;

		case 51: //3 --> p3
			break;

		case 52: //4 --> test
			break;
	}
}

function myKeyReleased (event) {

	switch ( event.keyCode ) {

		case 77: //M --> stop moving forward
			controls.setMoveF(false);
			break;

	}
}



var onTouchStart = function ( event ) {
	console.log("touch!");
	picIndex++;
	ball.material.map = photos[picIndex%4];

	for(var i=0; i<roomExploded.length; i++){
		roomExploded[i] = !roomExploded[i];
	}
	for(var i=0; i<windowExploded.length; i++){
		windowExploded[i] = !windowExploded[i];
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

	var conRot = controls.rotation().y%3;

	// once conRot is between -0.5~-1
	// picture: changes
	// audio: 1)changes; 2)fade in out
	if(conRot<-0.5 && conRot>-1 && !currPass){
		currPass = true;
	}else{

	}
	// console.log(conRott);

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