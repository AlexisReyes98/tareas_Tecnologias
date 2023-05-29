/* Global vars */
var clock;
var frameDelta = 0;
var container, stats;
var renderer, camera, scene;
var mesh;
var group;

var ambientLight, light;
var effectController;
var startingAngle = 0.01;
var min = 0.0;
var max = 1;
var maxCloseAngle = 1.4;
var step = 0.025;

// 2 puntos dados para dibujar la palma de la mano
var handP1 = new THREE.Vector3(-100, -100, 10);
var handP2 = new THREE.Vector3(100, 100, -10);

// 2 puntos dados para dibujar los dedos
var falangeP1 = new THREE.Vector3(10, 30, 10);
var falangeP2 = new THREE.Vector3(-10, 0, -10);

// Objetos Materiales
var textureMaterial = new THREE.MeshPhongMaterial({
	map: THREE.ImageUtils.loadTexture('img/MySuperMetal1.jpg')
});
var textureFingerMaterial = new THREE.MeshPhongMaterial({
	map: THREE.ImageUtils.loadTexture('img/MySuperMetal1.jpg')
});

var finger1Falange = new Array();
var finger2Falange = new Array();
var finger3Falange = new Array();
var finger4Falange = new Array();
var finger5Falange = new Array();

// Mostrar el contador de FPS
FPSStats.showStats();

// Inicialice el renderizador, la cámara y la escena
Setup.init();

// Renderizar los objetos a la escena
drawScene();

// Corre 60 veces por segundo
animate();

/*
*	Renderizar los objetos en la escena
*/
function drawScene() {

	group = new THREE.Object3D();
	group.position.set(0, 0, 0);

	// Dibuja la palma de la mano.
	var handMesh = drawObjects(handP1, handP2, textureMaterial);

	// Dibuja los dedos y colócalos en las posiciones correctas.
	finger1Falange[0] = drawObjects(falangeP1, falangeP2, textureFingerMaterial);
	finger1Falange[1] = drawObjects(falangeP1, falangeP2, textureFingerMaterial);
	finger1Falange[2] = drawObjects(falangeP1, falangeP2, textureFingerMaterial);

	finger1Falange[0].position.x = -90;
	finger1Falange[0].position.y = 100;
	finger1Falange[0].position.z = 0;

	finger1Falange[1].position.x = 0;
	finger1Falange[1].position.y = 30;
	finger1Falange[1].position.z = 0;

	finger1Falange[2].position.x = 0;
	finger1Falange[2].position.y = 30;
	finger1Falange[2].position.z = 0;

	finger2Falange[0] = drawObjects(falangeP1, falangeP2, textureFingerMaterial);
	finger2Falange[1] = drawObjects(falangeP1, falangeP2, textureFingerMaterial);
	finger2Falange[2] = drawObjects(falangeP1, falangeP2, textureFingerMaterial);

	finger2Falange[0].position.x = -30;
	finger2Falange[0].position.y = 100;
	finger2Falange[0].position.z = 0;

	finger2Falange[1].position.x = 0;
	finger2Falange[1].position.y = 30;
	finger2Falange[1].position.z = 0;

	finger2Falange[2].position.x = 0;
	finger2Falange[2].position.y = 30;
	finger2Falange[2].position.z = 0;

	finger3Falange[0] = drawObjects(falangeP1, falangeP2, textureFingerMaterial);
	finger3Falange[1] = drawObjects(falangeP1, falangeP2, textureFingerMaterial);
	finger3Falange[2] = drawObjects(falangeP1, falangeP2, textureFingerMaterial);

	finger3Falange[0].position.x = 30;
	finger3Falange[0].position.y = 100;
	finger3Falange[0].position.z = 0;

	finger3Falange[1].position.x = 0;
	finger3Falange[1].position.y = 30;
	finger3Falange[1].position.z = 0;

	finger3Falange[2].position.x = 0;
	finger3Falange[2].position.y = 30;
	finger3Falange[2].position.z = 0;

	finger4Falange[0] = drawObjects(falangeP1, falangeP2, textureFingerMaterial);
	finger4Falange[1] = drawObjects(falangeP1, falangeP2, textureFingerMaterial);
	finger4Falange[2] = drawObjects(falangeP1, falangeP2, textureFingerMaterial);

	finger4Falange[0].position.x = 90;
	finger4Falange[0].position.y = 100;
	finger4Falange[0].position.z = 0;

	finger4Falange[1].position.x = 0;
	finger4Falange[1].position.y = 30;
	finger4Falange[1].position.z = 0;

	finger4Falange[2].position.x = 0;
	finger4Falange[2].position.y = 30;
	finger4Falange[2].position.z = 0;

	finger5Falange[0] = drawObjects(falangeP1, falangeP2, textureFingerMaterial);
	finger5Falange[1] = drawObjects(falangeP1, falangeP2, textureFingerMaterial);
	finger5Falange[2] = drawObjects(falangeP1, falangeP2, textureFingerMaterial);

	finger5Falange[0].position.x = -90;
	finger5Falange[0].position.y = -20;
	finger5Falange[0].position.z = 0;
	finger5Falange[0].rotation.z = 1;

	finger5Falange[1].position.x = 0;
	finger5Falange[1].position.y = 30;
	finger5Falange[1].position.z = 0;

	finger5Falange[2].position.x = 0;
	finger5Falange[2].position.y = 30;
	finger5Falange[2].position.z = 0;

	// Crea la jerarquía
	group.add(handMesh);

	finger1Falange[1].add(finger1Falange[2]);
	finger1Falange[0].add(finger1Falange[1]);
	group.add(finger1Falange[0]);

	finger2Falange[1].add(finger2Falange[2]);
	finger2Falange[0].add(finger2Falange[1]);
	group.add(finger2Falange[0]);

	finger3Falange[1].add(finger3Falange[2]);
	finger3Falange[0].add(finger3Falange[1]);
	group.add(finger3Falange[0]);

	finger4Falange[1].add(finger4Falange[2]);
	finger4Falange[0].add(finger4Falange[1]);
	group.add(finger4Falange[0]);

	finger5Falange[1].add(finger5Falange[2]);
	finger5Falange[0].add(finger5Falange[1]);
	group.add(finger5Falange[0]);

	// Añade todos los objetos a la escena
	scene.add(group);
}

/*
*	Dibuja el cubo
*/
function drawObjects(p1, p2, material) {

	/*
		f____g
		/|  /|
		b/_|_/_|h
		|e/ |c/
		|/__|/
		a   d
	*/

	var geometry = new THREE.Geometry();

	geometry.vertices.push(new THREE.Vector3(p2.x, p2.y, p1.z));	// C
	geometry.vertices.push(new THREE.Vector3(p2.x, p2.y, p2.z));	// G
	geometry.vertices.push(new THREE.Vector3(p2.x, p1.y, p1.z));	// D
	geometry.vertices.push(new THREE.Vector3(p2.x, p1.y, p2.z));	// H
	geometry.vertices.push(new THREE.Vector3(p1.x, p2.y, p2.z));	// F
	geometry.vertices.push(new THREE.Vector3(p1.x, p2.y, p1.z));	// B
	geometry.vertices.push(new THREE.Vector3(p1.x, p1.y, p2.z));	// E
	geometry.vertices.push(new THREE.Vector3(p1.x, p1.y, p1.z));	// A

	geometry.faces.push(new THREE.Face3(0, 1, 2));	//left
	geometry.faces.push(new THREE.Face3(1, 2, 3));	//left
	geometry.faces.push(new THREE.Face3(4, 5, 6));	//right
	geometry.faces.push(new THREE.Face3(5, 6, 7));	//right
	geometry.faces.push(new THREE.Face3(1, 0, 5));	//bottom
	geometry.faces.push(new THREE.Face3(1, 4, 5));	//bottom
	geometry.faces.push(new THREE.Face3(2, 7, 6));	//top
	geometry.faces.push(new THREE.Face3(6, 3, 2));	//top
	geometry.faces.push(new THREE.Face3(0, 5, 7));	//front
	geometry.faces.push(new THREE.Face3(7, 2, 0));	//front
	geometry.faces.push(new THREE.Face3(3, 1, 4));	//back
	geometry.faces.push(new THREE.Face3(4, 6, 3));	//back

	for (var i = 0; i < geometry.faces.length; i++) {
		geometry.faceVertexUvs[0].push([
			new THREE.Vector2(1, 0),
			new THREE.Vector2(1, 1),
			new THREE.Vector2(0, 1)
		]);
	};

	geometry.computeCentroids();
	geometry.computeFaceNormals();
	geometry.computeVertexNormals();

	material.side = THREE.DoubleSide;
	mesh = new THREE.Mesh(geometry, material);
	return mesh;
}

/*
*	Anima la escena
*/
function animate() {
	requestAnimationFrame(animate);
	frameDelta += clock.getDelta();

	// Rotación manual controlada por GUI
	if (effectController.spin) {
		group.rotation.y = frameDelta;
	}

	// Rotación de dedos controlada por GUI
	finger1Falange[0].rotation.x = effectController.finger1Phalanges0;
	finger1Falange[1].rotation.x = effectController.finger1Phalanges1;
	finger1Falange[2].rotation.x = effectController.finger1Phalanges2;

	finger2Falange[0].rotation.x = effectController.finger2Phalanges0;
	finger2Falange[1].rotation.x = effectController.finger2Phalanges1;
	finger2Falange[2].rotation.x = effectController.finger2Phalanges2;

	finger3Falange[0].rotation.x = effectController.finger3Phalanges0;
	finger3Falange[1].rotation.x = effectController.finger3Phalanges1;
	finger3Falange[2].rotation.x = effectController.finger3Phalanges2;

	finger4Falange[0].rotation.x = effectController.finger4Phalanges0;
	finger4Falange[1].rotation.x = effectController.finger4Phalanges1;
	finger4Falange[2].rotation.x = effectController.finger4Phalanges2;

	finger5Falange[0].rotation.y = effectController.finger5Phalanges0;
	finger5Falange[1].rotation.x = effectController.finger5Phalanges1;
	finger5Falange[2].rotation.x = effectController.finger5Phalanges2;

	// Luz controlada por GUI
	ambientLight.color.setHSL(effectController.hue, effectController.saturation, effectController.lightness * effectController.ka);
	light.position.set(effectController.lx, effectController.ly, effectController.lz);
	light.position.normalize();
	light.color.setHSL(effectController.lhue, effectController.lsaturation, effectController.llightness);

	// Actualiza el contador de fps
	stats.update();

	// Actualiza la escena
	renderer.render(scene, camera);
}

/*
*	Crea los controles
*/
function setupGui() {
	effectController = {
		// Rotación de la mano
		spin: false,
		// Rotación de los dedos
		finger1Phalanges0: startingAngle,
		finger1Phalanges1: startingAngle,
		finger1Phalanges2: startingAngle,
		finger2Phalanges0: startingAngle,
		finger2Phalanges1: startingAngle,
		finger2Phalanges2: startingAngle,
		finger3Phalanges0: startingAngle,
		finger3Phalanges1: startingAngle,
		finger3Phalanges2: startingAngle,
		finger4Phalanges0: startingAngle,
		finger4Phalanges1: startingAngle,
		finger4Phalanges2: startingAngle,
		finger5Phalanges0: startingAngle,
		finger5Phalanges1: startingAngle,
		finger5Phalanges2: startingAngle,
		// Control de material
		ka: 0.2,
		// Color de material
		hue: 0.09,
		saturation: 0.46,
		lightness: 0.9,
		// Luces y color
		lhue: 0.04,
		lsaturation: 0.1,
		llightness: 1.0,
		// Luces y dirección
		lx: 0.1,
		ly: 0.1,
		lz: 2.0
	};

	var h;
	var gui = new dat.GUI();

	// Control de la mano
	h = gui.addFolder("Rotación de la mano");
	h.add(effectController, "spin");

	h = gui.addFolder("Control dedo 1");
	h.add(effectController, "finger1Phalanges0", min, maxCloseAngle, step).name("Falange 1");
	h.add(effectController, "finger1Phalanges1", min, maxCloseAngle, step).name("Falange 2");
	h.add(effectController, "finger1Phalanges2", min, maxCloseAngle, step).name("Falange 3");

	h = gui.addFolder("Control dedo 2");
	h.add(effectController, "finger2Phalanges0", min, maxCloseAngle, step).name("Falange 1");
	h.add(effectController, "finger2Phalanges1", min, maxCloseAngle, step).name("Falange 2");
	h.add(effectController, "finger2Phalanges2", min, maxCloseAngle, step).name("Falange 3");

	h = gui.addFolder("Control dedo 3");
	h.add(effectController, "finger3Phalanges0", min, maxCloseAngle, step).name("Falange 1");
	h.add(effectController, "finger3Phalanges1", min, maxCloseAngle, step).name("Falange 2");
	h.add(effectController, "finger3Phalanges2", min, maxCloseAngle, step).name("Falange 3");

	h = gui.addFolder("Control dedo 4");
	h.add(effectController, "finger4Phalanges0", min, maxCloseAngle, step).name("Falange 1");
	h.add(effectController, "finger4Phalanges1", min, maxCloseAngle, step).name("Falange 2");
	h.add(effectController, "finger4Phalanges2", min, maxCloseAngle, step).name("Falange 3");

	h = gui.addFolder("Control dedo 5");
	h.add(effectController, "finger5Phalanges0", min, maxCloseAngle, step).name("Falange 1");
	h.add(effectController, "finger5Phalanges1", min, maxCloseAngle, step).name("Falange 2");
	h.add(effectController, "finger5Phalanges2", min, maxCloseAngle, step).name("Falange 3");

	// Material (control)
	h = gui.addFolder("Control de material");
	h.add(effectController, "ka", min, max, step).name("Control de efecto");

	// Material (color)
	h = gui.addFolder("Color de material");
	h.add(effectController, "hue", min, max, step).name("Matiz");
	h.add(effectController, "saturation", min, max, step).name("Saturación");
	h.add(effectController, "lightness", min, max, step).name("Luminosidad");

	// Luz (punto)
	h = gui.addFolder("Color de la luz");
	h.add(effectController, "lhue", min, max, step).name("Matiz");
	h.add(effectController, "lsaturation", min, max, step).name("Saturación");
	h.add(effectController, "llightness", min, max, step).name("Luminosidad");

	// Luz (direccción)
	h = gui.addFolder("Posición de la luz");
	h.add(effectController, "lx", -3.0, 3.0, step).name("x");
	h.add(effectController, "ly", -5.0, 5.0, step).name("y");
	h.add(effectController, "lz", -1.0, 2.0, step).name("z");
}
