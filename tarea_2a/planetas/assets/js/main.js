const cameraFar = 3000; // Distancia de visualización de la lente
const canvas = document.getElementById("main");

/* Tamaño de ventana */
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let scene = new THREE.Scene();  // Se crea la escena
/* Esta clase se utiliza para el casting de rayos.
La proyección de rayos se utiliza para la selección del mouse
(calculando sobre qué objetos encuentra el mouse en el espacio 3D). */
let raycaster = new THREE.Raycaster();
let mouse = new THREE.Vector2();  // Vector de pantalla de ratón
let starNames = {}; // Puntero al apodo de estrella mostrado
let displayName; // Nombre para mostrar actual

// Configuración relacionada con la cámara
let camera = new THREE.PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  1,
  cameraFar
);
/* Cree una cámara en perspectiva (los parámetros son: ángulo de visión,
relación de aspecto, plano de recorte cercano Y plano de recorte lejano) */
camera.position.set(-200, 50, 0);
camera.lookAt(new THREE.Vector3(0, 0, 0));
scene.add(camera);

// Renderizador
let renderer = new THREE.WebGLRenderer({
  canvas
});
renderer.shadowMap.enabled = true;  // línea auxiliar
renderer.shadowMapSoft = true;  // Sombras suaves
renderer.setClearColor(0xffffff, 0);
// renderer.setSize(window.innerWidth, window.innerHeight); // Establece el ancho y la altura del renderizado

// Inicia la configuración del sol
let sunMaterialSkin = new THREE.TextureLoader().load("../images/Sol.jpg");

let geometry = new THREE.SphereGeometry(12, 16, 16);
let material = new THREE.MeshBasicMaterial({
  /*color: 0xffff00,
  emissive: 0xdd4422,*/
  map: sunMaterialSkin
});

/* Cree una malla a partir de la estructura y el material creados anteriormente. */
let Sun = new THREE.Mesh(geometry, material);

Sun.name = "Sun";
Sun.castShadow = true;
Sun.receiveShadow = true;
scene.add(Sun);

// Cubierta para el sol
let opSun = new THREE.Mesh(
  new THREE.SphereGeometry(14, 16, 16),
  new THREE.MeshLambertMaterial({
    color: 0xff0000,
    /*emissive: 0xdd4422,*/
    transparent: true,
    opacity: 0.35
  })
);

opSun.name = "Sun";
scene.add(opSun);

// Luz ambiental
let ambient = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambient);
// luz del sol
let sunLight = new THREE.PointLight(0xddddaa, 1.5, 500);
scene.add(sunLight);

let control;
const clock = new THREE.Clock(); // Se utiliza para calcular el intervalo entre dos cuadros de animación

// Se crea un planeta
/***
 * @param distance Distancia del eje x
 * @param color color
 */
function initStar(name, speed, angle, color, distance, volume, ringInfo) {
  let mesh = new THREE.Mesh(
    new THREE.SphereGeometry(volume, 16, 16),
    new THREE.MeshLambertMaterial({
      color
    })
  );
  mesh.position.x = distance; // En el sistema de coordenadas, x es la distancia del planeta al sol en el mismo plano

  // Otros atributos personalizados
  mesh.receiveShadow = true;
  mesh.castShadow = true;
  mesh.name = name;
  // Orbita planetaria
  let track = new THREE.Mesh(
    new THREE.RingGeometry(distance - 0.2, distance + 0.2, 64, 1),
    new THREE.MeshBasicMaterial({
      color: 0x888888,
      side: THREE.DoubleSide
    })
  );

  track.rotation.x = -Math.PI / 2;
  scene.add(track);

  let star = {
    name,
    speed,
    angle,
    distance,
    volume,
    Mesh: mesh
  };

  /* En el caso de los anillos planetarios
  Si hay un cinturón roto */
  if (ringInfo) {
    let ring = new THREE.Mesh(
      new THREE.RingGeometry(ringInfo.innerRedius, ringInfo.outerRadius, 32, 6),
      new THREE.MeshBasicMaterial({
        color: ringInfo.color,
        side: THREE.DoubleSide,
        opacity: 0.7,
        transparent: true
      })
    );

    ring.name = `Ring of ${name}`;
    ring.rotation.x = -Math.PI / 3;
    ring.rotation.y = -Math.PI / 4;
    scene.add(ring);

    star.ring = ring;
  }

  scene.add(mesh);
  return star;
}

let Mercury,
  Venus,
  Earth,
  Mars,
  Jupiter,
  Saturn,
  Uranus,
  Neptune,
  stars = [];

// El puntero del mouse apunta a la vista
function onMouseMove(event) {
  // Calcula la posición del ratón en coordenadas de dispositivo normalizadas
  // (-1 a +1) para ambos componentes
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
}

// Agrega y muestra los planetas
function init() {
  stars.forEach((star, index) => {
    nameConstructor(star.name, star.volume);
  });

  // Creación de la Tierra y los otros ocho planetas.
  Earth = initStar("Earth", 0.01, 0, "rgb(0,0,255)", 40, 5);
  stars.push(Earth);
  Mercury = initStar("shuixing", 0.02, 0, "rgb(124,131,203)", 20, 2);
  stars.push(Mercury);
  Venus = initStar("jinxing", 0.012, 0, "rgb(190,138,44)", 30, 4);
  stars.push(Venus);

  Mars = initStar("huoxing", 0.008, 0, "rgb(210,81,16)", 50, 4);
  stars.push(Mars);
  Jupiter = initStar("muxing", 0.006, 0, "rgb(254,208,101)", 70, 9);
  stars.push(Jupiter);

  Uranus = initStar("tianwangxing", 0.003, 0, "rgb(49,168,218)", 120, 4);
  stars.push(Uranus);

  Neptune = initStar("haiwangxing", 0.002, 0, "rgb(84,125,204)", 150, 3);
  stars.push(Neptune);

  // Saturno y sus anillos
  Saturn = initStar("tuxing", 0.005, 0, "rgb(210,140,39)", 100, 7, {
    color: "rgb(136,75,30)",
    innerRedius: 9,
    outerRadius: 11
  });
  stars.push(Saturn);
  window.addEventListener("mousemove", onMouseMove, false);

  // Control de la camara
  control = new THREE.FirstPersonControls(camera, canvas);
  control.movementSpeed = 100;  // Velocidad de la cámara
  control.lookSpeed = 0.125; // Velocidad de cambio de ángulo de visión
  control.lookVertical = true; // Ya sea para permitir que el ángulo de visión cambie hacia arriba y hacia abajo
  camera.lookAt(new THREE.Vector3(0, 0, 0));

  renderer.render(scene, camera);
  requestAnimationFrame(move);
}

function move() {
  // Rotación del sol
  Sun.rotation.y += 0.008; // Girar el eje x de la cuadrícula

  // Rtotación de los planetas
  stars.map((star) => revolution(star));

  // Delta es el intervalo entre dos cuadros de animación, que se usa para calcular la velocidad
  control.update(clock.getDelta());

  // Limita la cámara de x,y,z a más o menos 400
  camera.position.x = THREE.Math.clamp(camera.position.x, -400, 400);
  camera.position.y = THREE.Math.clamp(camera.position.y, -400, 400);
  camera.position.z = THREE.Math.clamp(camera.position.z, -400, 400);

  // El mouse que apunta a un planeta muestra su nombre
  raycaster.setFromCamera(mouse, camera);
  renderer.render(scene, camera);
  requestAnimationFrame(move);
}
init();

window.onresize = function() {
  // Se signa la función a window.onresize
  camera.aspect = window.innerWidth / window.innerHeight; // Establecer la relación de aspecto de la cámara
  camera.updateProjectionMatrix();  // Recalcular la matriz de proyección
  renderer.setSize(window.innerWidth, window.innerHeight);  // Establece el ancho y la altura del renderizado
};

// Rotación de los planetas
function revolution(star) {
  star.angle += star.speed;
  star.angle > Math.PI * star.distance &&
    (star.angle -= Math.PI * star.distance);
  star.Mesh.position.set(
    star.distance * Math.sin(star.angle),
    0,
    star.distance * Math.cos(star.angle)
  );
}
