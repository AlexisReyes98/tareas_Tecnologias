var espacio;
var sol;
var mercurio;
var venus;
var tierra;
var marte;
var jupiter;
var saturno;
var urano;
var neptuno;

function setup() {
    createCanvas(windowWidth, windowHeight, WEBGL);
    background(255, 0, 0);
    espacio = loadImage("img/espacio.jpeg");
    sol = loadImage("img/sol.jpg");
    mercurio = loadImage("img/mercurio.jpg");
    venus = loadImage("img/venus.jpg");
    tierra = loadImage("img/tierra.jpg");
    marte = loadImage("img/marte.jpg");
    jupiter = loadImage("img/jupiter.jpg");
    saturno = loadImage("img/saturno.jpg");
    urano = loadImage("img/urano.jpg");
    neptuno = loadImage("img/neptuno.jpg");
}

function draw() {
    noStroke();
    background(0);
    texture(espacio);

    rotateX(mouseY / 60 - 1 / 2)
    rotateY(mouseX / 70 + frameCount / 100)

    sphere(2000);

    push()
    texture(sol)
    sphere(100)
    pop()

    push()
    rotateY(frameCount / 20)
    translate(200, 0, 0)
    rotateX(.3)
    texture(mercurio)
    sphere(20)
    rotateX(PI / 2)
    pop()
    
    push()
    rotateY(frameCount / 30)
    translate(300, 0, 0)
    rotateX(.3)
    texture(venus)
    sphere(30)
    rotateX(PI / 2)
    pop()

    push()
    rotateY(frameCount / 40)
    translate(400, 0, 0)
    rotateX(.3)
    texture(tierra)
    sphere(35)
    rotateX(PI / 2)
    pop()

    push()
    rotateY(frameCount / 50)
    translate(500, 0, 0)
    rotateX(.3)
    texture(marte)
    sphere(25)
    rotateX(PI / 2)
    pop()

    push()
    rotateY(frameCount / 60)
    translate(600, 0, 0)
    rotateX(.3)
    texture(jupiter)
    sphere(90)
    rotateX(PI / 2)
    pop()

    push()
    rotateY(frameCount / 70)
    translate(800, 0, 0)
    rotateX(.3)
    texture(saturno)
    sphere(80)
    rotateX(PI / 2)
    scale(1, 1, .1)
    torus(200, 44, 20, 4)
    pop()

    push()
    rotateY(frameCount / 80)
    translate(1200, 0, 0)
    rotateX(.3)
    texture(urano)
    sphere(45)
    rotateX(PI / 2)
    pop()

    push()
    rotateY(frameCount / 90)
    translate(1400, 0, 0)
    rotateX(.3)
    texture(neptuno)
    sphere(40)
    rotateX(PI / 2)
    pop()

    rotateX(PI / 2)
    torus(200, 2, 30)
    torus(300, 2, 30)
    torus(400, 2, 30)
    torus(500, 2, 30)
    torus(600, 2, 30)
    torus(800, 2, 30)
    torus(1200, 2, 30)
    torus(1400, 2, 30)
}
