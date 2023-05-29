#include <iostream>
#include <cstdio>
#include <cstdlib>
#include <vector>
#include <cmath>
#include <cctype>
#include <GL/glut.h>
#include <GL/glu.h>
#include <GL/gl.h>

#define SLICES  100
#define STACKS  100

#define PI  3.141592

#define WINDOW_WIDTH    700
#define WINDOW_HEIGHT   500

#define CAMERA_NEAR 1
#define CAMERA_FAR  1000

using namespace std;

typedef struct {
    float x, y, z;
} Coordinate;

/////////////////////////////////////////////////////////////////////////////////////
/////////////////////// Parametros de iuminación de la cámara  ///////////////////////
/////////////////////////////////////////////////////////////////////////////////////

float fieldOfVision, aspect;

// Coordenadas da cámara
float cameraX, cameraY, cameraZ;

// Coordenadas da fuente de iluminación
float lightX, lightY, lightZ;

// Distancia de la cámara al centro del objeto observado
float cameraRadius = 600.0f;

// 'theta' controla el ángulo entre el vetor de la cámara (cameraX, cameraY, cameraZ)
// en el plano XZ
float theta = 0.0f;

// 'alpha' controla el ángulo entre la proyección del vetor de la cámara (cameraX, cameraY, cameraZ)
// en el plano XZ
float alpha = 0.0f;

/////////////////////////////////////////////////////////////////////////////////////
///////////////////////  Parametros de control del humanoide  //////////////////////
/////////////////////////////////////////////////////////////////////////////////////

// Posición inicial
float neckJointXAxis = 0.0;
float neckJointYAxis = 0.0;
float neckJointZAxis = 0.0;

// Brazo izquierdo
float leftShoulderJointXAxis = 0.0;
float leftShoulderJointZAxis = 0.0;

float leftElbowJointZAxis = 0.0;

// Brazo derecho
float rightShoulderJointXAxis = 0.0;
float rightShoulderJointZAxis = 0.0;

float rightElbowJointZAxis = 0.0;

// Pierna izquierda
float leftHipJointXAxis = 0.0;
float leftHipJointZAxis = 0.0;

float leftKneeJointXAxis = 0.0;

// Pierna derecha
float rightHipJointXAxis = 0.0;
float rightHipJointZAxis = 0.0;

float rightKneeJointXAxis = 0.0;

float* xRotation, * zRotation, * yRotation;

int previousX;
int previousY;

bool firstClick = true;

// Dibuja un cono truncado centrado en 'centerX, centerY, centerZ)
void drawTruncatedCone(float centerX, float centerY, float centerZ, float upperRadius, float lowerRadius, float length) {
    const int NUM_POINTS = 100;

    float pass = 2 * PI / NUM_POINTS;

    vector<Coordinate> firstCircle;
    vector<Coordinate> secondCircle;

    float dx, dy, dz;

    Coordinate coord;

    for (float angle = 0.0; angle <= 2 * PI; angle += pass) {
        dx = cos(angle) * upperRadius;
        dy = length / 2.0;
        dz = sin(angle) * upperRadius;

        coord.x = centerX + dx;
        coord.y = centerY + dy;
        coord.z = centerZ + dz;

        firstCircle.push_back(coord);

        dx = cos(angle) * lowerRadius;
        dy = -length / 2.0;
        dz = sin(angle) * lowerRadius;

        coord.x = centerX + dx;
        coord.y = centerY + dy;
        coord.z = centerZ + dz;

        secondCircle.push_back(coord);
    }

    int size;

    glBegin(GL_POLYGON);

    size = firstCircle.size();

    // Dibuja la 'tapa' superior del cilindro truncado
    for (int i = 0; i < size; i++) {
        glVertex3f(firstCircle[i].x, firstCircle[i].y, firstCircle[i].z);
    }

    glEnd();

    glBegin(GL_POLYGON);

    size = secondCircle.size();

    // Dibuja la 'tapa' debajo del cilindro truncado
    for (int i = 0; i < size; i++) {
        glVertex3f(secondCircle[i].x, secondCircle[i].y, secondCircle[i].z);
    }

    glEnd();

    // Dibuja la superficie cilíndrica que conecta las dos "tapas"
    glBegin(GL_QUAD_STRIP);

    size = firstCircle.size();

    for (int i = 0; i < size; i++) {
        glNormal3f(0.0, 1.0, 0.0);
        glVertex3f(firstCircle[i].x, firstCircle[i].y, firstCircle[i].z);

        glNormal3f(0.0, -1.0, 0.0);
        glVertex3f(secondCircle[i].x, secondCircle[i].y, secondCircle[i].z);
    }

    glNormal3f(0.0, 1.0, 0.0);
    glVertex3f(firstCircle[0].x, firstCircle[0].y, firstCircle[0].z);

    glNormal3f(0.0, -1.0, 0.0);
    glVertex3f(secondCircle[0].x, secondCircle[0].y, secondCircle[0].z);

    glEnd();
}

// Dibuja un cilindro de radio 'radius' y altura 'length' en el espacio centrado en (centerX, centerY, centerZ)
void drawCylinder(float centerX, float centerY, float centerZ, float radius, float length) {
    drawTruncatedCone(centerX, centerY, centerZ, radius, radius, length);
}

// Dibujar brazo de cono truncado primitivo
void drawArm(float upperRadius, float lowerRadius, float length) {
    glutSolidSphere(upperRadius * 0.8, SLICES, STACKS);
    drawTruncatedCone(0.0, -length / 2.0, 0.0, upperRadius, lowerRadius, length);
}

// Dibuja el torax
void drawThorax(float shouldersWidth, float thoraxWidth, float thoraxHeight) {
    glPushMatrix();
    glScalef(1.0, 1.0, 0.5);
    drawTruncatedCone(0.0, thoraxHeight / 2.0, 0.0, shouldersWidth / 2.0, thoraxWidth / 2.0, thoraxHeight);
    glPopMatrix();
}

// Dibuja la cintura
void drawWaist(float thoraxWidth, float waistWidth, float waistHeight) {
    glPushMatrix();
    glScalef(1.0, 1.0, 0.7);
    glutSolidSphere(thoraxWidth * 0.5, SLICES, STACKS);
    drawTruncatedCone(0, -waistHeight * 0.3, 0, thoraxWidth / 2.0, waistWidth / 2.0, waistHeight);
    glPopMatrix();
}

// Dibuja las pierna
void drawLeg(float upperRadius, float lowerRadius, float length) {
    // Dibuja las piernas juntas
    glutSolidSphere(upperRadius * 0.8, SLICES, STACKS);

    // Dibuja pierna
    drawTruncatedCone(0, -length / 2.0, 0, upperRadius, lowerRadius, length);
}

// Dibuja la cabeza y el cuello
void drawHead(float headRadius) {
    float neckLength = headRadius * 0.6;
    float neckRadius = headRadius * 0.5;

    float eyeRadius = 3.0;

    // Dibuja el cuello
    glutSolidSphere(neckRadius * 0.8, SLICES, STACKS);

    drawCylinder(0.0, neckLength / 2.0, 0.0, neckRadius, neckLength);

    glPushMatrix();

    glTranslatef(0.0, headRadius + neckLength, 0.0);

    // Dibuja la cabeza
    glPushMatrix();
    // Aplica una pequeña deformación de la esfera para que quede un poco ovalada.
    glScalef(1.05, 1.2, 1.0);
    glutSolidSphere(headRadius, SLICES, STACKS);
    glPopMatrix();

    // Color de ojos específico
    glColor3f(0.0, 0.0, 0.0);

    // Dibuja ojo derecho
    glPushMatrix();
    glTranslatef(-headRadius * 0.5, 0.0, headRadius - eyeRadius);
    glutSolidSphere(eyeRadius, SLICES, STACKS);
    glPopMatrix();

    // Dibuja ojo izquierdo
    glPushMatrix();
    glTranslatef(headRadius * 0.5, 0.0, headRadius - eyeRadius);
    glutSolidSphere(eyeRadius, SLICES, STACKS);
    glPopMatrix();

    glPopMatrix();
}

void updateLightPosition() {
    // ¿Determinar la relación de aspecto de la matriz de cámaras? usado
    // como la coordenada de la fuente de luz, por defecto? 1.0 pero puede ser
    // cambiado para que la fuente de luz esté más cerca o más lejos
    // del objeto observado
    float proportion = 1.0;

    lightX = cameraX * proportion;
    lightY = cameraY * proportion;
    lightZ = cameraZ * proportion;

    // Especifica a posición de fuente de luz
    GLfloat lightPosition[4] = { lightX, lightY, lightZ, 1.0 };

    // Posiciona la fuente de luz
    glLightfv(GL_LIGHT0, GL_POSITION, lightPosition);

}

// Función usada para especificar el volumen de visualización
void updateCameraPosition() {
    float upX, upY, upZ;

    // Especifica el sistema de coordenadas de proyección
    glMatrixMode(GL_PROJECTION);

    // Inicializa el sistema de coordenadas de proyección
    glLoadIdentity();

    // Especifica la proyección en perspectiva
    gluPerspective(fieldOfVision, aspect, CAMERA_NEAR, CAMERA_FAR);

    // Específica el sistema de coordenadas del modelo
    glMatrixMode(GL_MODELVIEW);

    // Inicializa sistema de coordenadas do modelo
    glLoadIdentity();

    // Calcula las coordenadas de la cámara para que se mueva
    // en una trayectoria esférica
    cameraX = sin(alpha) * cos(theta) * cameraRadius;

    cameraY = sin(theta) * cameraRadius;

    cameraZ = cos(alpha) * cos(theta) * cameraRadius;

    upX = 0.0;
    upY = 1.0;
    upZ = 0.0;

    // Tratamiento para mantener el vector ARRIBA de la cámara según la escena
    if (theta >= PI / 2.0 && theta < 3.0 * PI / 2.0)
        upY = -1.0;
    else
        upY = 1.0;

    // Especifica la posición de la cámara y el objetivo
    gluLookAt(cameraX, cameraY, cameraZ, 0, 0, 0, upX, upY, upZ);

    updateLightPosition();
}

// Se dibuja el cuerpo humano en 3D
void draw() {
    float headRadius = 22.0;

    float upperArmUpperRadius = 15.0;
    float upperArmLowerRadius = 10.0;
    float upperArmLength = 70.0;

    float lowerArmUpperRadius = 13.0;
    float lowerArmLowerRadius = 9.0;
    float lowerArmLength = 60.0;

    float upperLegUpperRadius = 20.0;
    float upperLegLowerRadius = 16.0;
    float upperLegLength = 60.0;

    float lowerLegUpperRadius = 17.0;
    float lowerLegLowerRadius = 13.0;
    float lowerLegLength = 80.0;

    float shouldersWidth = 85.0;
    float thoraxWidth = 70.0;
    float thoraxHeight = 70.0;

    float waistWidth = thoraxWidth * 0.7;
    float waistHeight = thoraxHeight * 0.9;

    glClear(GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT);

    updateCameraPosition();

    // Define el color del torax
    glColor3f(1.0, 0.0, 0.0);

    // Dibuja el torax
    drawThorax(shouldersWidth, thoraxWidth, thoraxHeight);

    glPushMatrix();

    glTranslatef(0.0, thoraxWidth, 0.0);

    // Establece el color de la cabeza y el cuello
    glColor3f(0.0, 0.0, 1.0);

    // Posicionar y dibujar la cabeza
    glPushMatrix();

    // Grados de libertad de la cabeza
    glRotatef(neckJointXAxis, 1.0, 0.0, 0.0);
    glRotatef(neckJointYAxis, 0.0, 1.0, 0.0);
    glRotatef(neckJointZAxis, 0.0, 0.0, 1.0);

    drawHead(headRadius);

    glPopMatrix();

    // Define los brazos
    glColor3f(0.0f, 1.0, 0.0);

    // Coloca y dibuja el brazo derecho
    glPushMatrix();

    glTranslatef(-shouldersWidth * 0.5, -upperArmUpperRadius, 0.0);

    // Grados de libertad del brazo superior derecho
    glRotatef(rightShoulderJointXAxis, 1.0, 0.0, 0.0);
    glRotatef(rightShoulderJointZAxis, 0.0, 0.0, 1.0);

    drawArm(upperArmUpperRadius, upperArmLowerRadius, upperArmLength);

    glTranslatef(0.0, -(upperArmLength + lowerArmUpperRadius * 0.5), 0.0);

    // Grado de libertad del antebrazo derecho
    glRotatef(rightElbowJointZAxis, 0.0, 0.0, 1.0);

    drawArm(lowerArmUpperRadius, lowerArmLowerRadius, lowerArmLength);

    glPopMatrix();

    // Coloca y dibuja el brazo izquierdo
    glPushMatrix();

    glTranslatef(shouldersWidth * 0.5, -upperArmUpperRadius, 0.0);

    // Grados de libertad del brazo superior izquierdo
    glRotatef(leftShoulderJointXAxis, 1.0, 0.0, 0.0);
    glRotatef(leftShoulderJointZAxis, 0.0, 0.0, 1.0);

    drawArm(upperArmUpperRadius, upperArmLowerRadius, upperArmLength);

    glTranslatef(0.0, -(upperArmLength + lowerArmUpperRadius * 0.5), 0.0);

    // Grado de libertad del antebrazo izquierdo
    glRotatef(leftElbowJointZAxis, 0.0, 0.0, 1.0);

    drawArm(lowerArmUpperRadius, lowerArmLowerRadius, lowerArmLength);

    glPopMatrix();

    glPopMatrix();

    // Define el color de la cintura
    glColor3f(1.0f, 0.0, 1.0);

    // Dibuja la cintura
    drawWaist(waistWidth, thoraxWidth, waistHeight);

    // Define las coordenadas de las piernas
    glColor3f(0.3f, 0.5, 0.5);

    // Colocar y dibujar la pierna derecha
    glPushMatrix();

    glTranslatef(-waistWidth * 0.5, -waistHeight * 0.9, 0.0);

    // Grados de libertad de la parte superior de la pierna izquierda
    glRotatef(rightHipJointXAxis, 1.0, 0.0, 0.0);
    glRotatef(rightHipJointZAxis, 0.0, 0.0, 1.0);

    drawLeg(upperLegUpperRadius, upperLegLowerRadius, upperLegLength);

    glTranslatef(0.0, -(upperLegLength + lowerLegUpperRadius * 0.5), 0.0);

    // Grado de libertad de la parte inferior de la pierna izquierda
    glRotatef(rightKneeJointXAxis, 1.0, 0.0, 0.0);

    drawLeg(lowerLegUpperRadius, lowerLegLowerRadius, lowerLegLength);

    glPopMatrix();

    // Posicionar y dibujar la pierna izquierda
    glPushMatrix();

    glTranslatef(waistWidth * 0.5, -waistHeight * 0.9, 0.0);

    // Grados de libertad de la parte superior de la pierna izquierda
    glRotatef(leftHipJointXAxis, 1.0, 0.0, 0.0);
    glRotatef(leftHipJointZAxis, 0.0, 0.0, 1.0);

    drawLeg(upperLegUpperRadius, upperLegLowerRadius, upperLegLength);

    glTranslatef(0.0, -(upperLegLength + lowerLegUpperRadius * 0.5), 0.0);

    // Grado de libertad de la parte inferior de la pierna izquierda
    glRotatef(leftKneeJointXAxis, 1.0, 0.0, 0.0);

    drawLeg(lowerLegUpperRadius, lowerLegLowerRadius, lowerLegLength);

    glPopMatrix();

    glutSwapBuffers();
}

// Inicializa los parámetros de iluminación
void initializeLighting() {
    GLfloat lightAmbient[4] = { 0.3, 0.3, 0.3, 1.0 };
    GLfloat lightDiffuse[4] = { 0.4, 0.4, 0.4, 1.0 };
    GLfloat lightSpecular[4] = { 0.4, 0.4, 0.4, 1.0 };

    // Capacidad de brillo del material
    GLfloat materialSpecular[4] = { 0.3, 0.3, 0.3, 1.0 };

    GLint materialShininess = 60;

    // ¿Especifica cuál será el color de fondo de la ventana? NEGRO
    glClearColor(0.0f, 0.0f, 0.0f, 1.0f);

    // Permite el uso de la luz ambiental.
    glLightModelfv(GL_LIGHT_MODEL_AMBIENT, lightAmbient);

    // Habilita el modelo
    glShadeModel(GL_SMOOTH);

    // Define la reflectancia del material
    glMaterialfv(GL_FRONT, GL_SPECULAR, materialSpecular);

    // Establece la concentración de brillo
    glMateriali(GL_FRONT, GL_SHININESS, materialShininess);

    // Define los parametros da luz de número 0
    glLightfv(GL_LIGHT0, GL_AMBIENT, lightAmbient);
    glLightfv(GL_LIGHT0, GL_DIFFUSE, lightDiffuse);
    glLightfv(GL_LIGHT0, GL_SPECULAR, lightSpecular);

    // Permite definir el color del material a partir del color actual
    glEnable(GL_COLOR_MATERIAL);

    // Habilita el uso de iluminación
    glEnable(GL_LIGHTING);

    // Habilita a luz de número 0
    glEnable(GL_LIGHT0);

    // Habilita el buffer
    glEnable(GL_DEPTH_TEST);

    // Define el ángulo de apertura de la cámara
    fieldOfVision = 45.0;
}

// Función de devolución de llamada llamada cuando el tamaño de la ventana
void resizeWindow(GLsizei w, GLsizei h) {
    // Para evitar la división por cero
    if (h == 0) h = 1;

    // Especifica el tamaño de la ventana gráfica.
    glViewport(0, 0, w, h);

    // Calcula el correcto aspecto
    aspect = (GLfloat)w / (GLfloat)h;

    updateCameraPosition();
}

// CDevolución de llamada que maneja eventos clave especiales que no tienen un código ASCII
void specialKeys(int key, int x, int y) {
    switch (key) {
        case GLUT_KEY_LEFT:
            *zRotation -= 3.0f;
            break;

        case GLUT_KEY_RIGHT:
            *zRotation += 3.0f;
            break;

        case GLUT_KEY_UP:
            *xRotation -= 3.0f;
            break;

        case GLUT_KEY_DOWN:
            *xRotation += 3.0f;
            break;

        case GLUT_KEY_PAGE_UP:
            *yRotation -= 3.0f;
            break;

        case GLUT_KEY_PAGE_DOWN:
            *yRotation += 3.0f;
            break;
    }

    glutPostRedisplay();
}

// Devolución de llamada que maneja eventos de teclado para caracteres con código ASCII
void keyPressed(unsigned char key, int x, int y) {
    key = tolower(key);

    if (xRotation != NULL && yRotation != NULL && zRotation != NULL) {
        switch (key) {
            case 'r':
                theta = 0.0;
                alpha = 0.0;
                break;

            case 'a':
                xRotation = &rightShoulderJointXAxis;
                yRotation = &rightShoulderJointZAxis;
                zRotation = &rightShoulderJointZAxis;
                break;

            case 'z':
                xRotation = zRotation = yRotation = &rightElbowJointZAxis;
                break;

            case 's':
                xRotation = &leftShoulderJointXAxis;
                yRotation = &leftShoulderJointZAxis;
                zRotation = &leftShoulderJointZAxis;
                break;

            case 'x':
                xRotation = yRotation = zRotation = &leftElbowJointZAxis;
                break;

            case 'd':
                xRotation = &rightHipJointXAxis;
                yRotation = &rightHipJointZAxis;
                zRotation = &rightHipJointZAxis;
                break;

            case 'c':
                xRotation = yRotation = zRotation = &rightKneeJointXAxis;
                break;

            case 'f':
                xRotation = &leftHipJointXAxis;
                yRotation = &leftHipJointZAxis;
                zRotation = &leftHipJointZAxis;
                break;

            case 'v':
                xRotation = yRotation = zRotation = &leftKneeJointXAxis;
                break;

            case 'w':
                xRotation = &neckJointXAxis;
                yRotation = &neckJointYAxis;
                zRotation = &neckJointZAxis;
                break;

            case '+':
                cameraRadius -= 10.0f;
                break;

            case '-':
                cameraRadius += 10.0f;
                break;
        }

        glutPostRedisplay();
    }
}

// Devolución de llamada que maneja los eventos del mouse cuando el mouse está presionado
void mousePressed(int x, int y) {
    if (firstClick) {
        previousX = x;
        previousY = y;

        firstClick = false;
    }
    else {
        // Incrementa y decrementa los ángulos de rotación de la cámara
        // en base a la variación de las coordenadas x e y del mouse
        if (x > previousX)
            alpha -= 0.05;
        else if (x < previousX)
            alpha += 0.05;

        if (y > previousY)
            theta += 0.05;
        else if (y < previousY)
            theta -= 0.05;

        // Mantiene valores de ángulo de cámara entre 0,0 y 2*PI
        if (theta > 2 * PI)
            theta = theta - 2 * PI;
        else if (theta < 0.0)
            theta = 2 * PI - theta;

        if (alpha > 2 * PI)
            alpha = alpha - 2 * PI;
        else if (alpha < 0.0)
            alpha = 2 * PI - alpha;

        firstClick = true;

        glutPostRedisplay();
    }
}

void printInstructions() {
    cout << "+------------------------------------------------------------------+" << endl;
    cout << "+                           INSTRUCCIONES                          +" << endl;
    cout << "+------------------------------------------------------------------+" << endl;
    cout << "|                                                                  |" << endl;
    cout << "| - Para mover la camara simplemente haga clic con el boton        |" << endl;
    cout << "|   izquierdo del mouse sobre el caracter y arrastre en la         |" << endl;
    cout << "|   dirección deseada                                              |" << endl;
    cout << "|                                                                  |" << endl;
    cout << "| - Para mover las extremidades del personaje                      |" << endl;
    cout << "|   (piernas, brazos, etc.) simplemente seleccione la parte        |" << endl;
    cout << "|   deseada y luego use las flechas                                |" << endl;
    cout << "|   del teclado (arriba, abajo, izquierda y derecha) para moverlo  |" << endl;
    cout << "|                                                                  |" << endl;
    cout << "| - Teclas para seleccionar las extremidades del personaje:        |" << endl;
    cout << "|                                                                  |" << endl;
    cout << "|     W : Cabeza                                                   |" << endl;
    cout << "|     A : Brazo derecho                                            |" << endl;
    cout << "|     Z : Antebrazo derecho                                        |" << endl;
    cout << "|     S : Brazo izquierdo                                          |" << endl;
    cout << "|     X : Antebrazo izquierdo                                      |" << endl;
    cout << "|     D : Pierna derecha                                           |" << endl;
    cout << "|     C : Pantorrilla derecha                                      |" << endl;
    cout << "|     F : Pierna izquierda                                         |" << endl;
    cout << "|     V : Pantorrilla izquierda                                    |" << endl;
    cout << "|                                                                  |" << endl;
    cout << "| - Movimiento de la escena:                                       |" << endl;
    cout << "|                                                                  |" << endl;
    cout << "|     R : Reiniciar camara                                         |" << endl;
    cout << "|     + : Aumentar zoom                                            |" << endl;
    cout << "|     - : Disminuir zoom                                           |" << endl;
    cout << "|                                                                  |" << endl;
    cout << "+------------------------------------------------------------------+" << endl;
}

// Programa Principal
int main(int argc, char* argv[]) {

    glutInit(&argc, argv);

    // Por defecto la articulación superior del brazo derecho
    xRotation = &rightShoulderJointXAxis;
    yRotation = &rightShoulderJointZAxis;
    zRotation = &rightShoulderJointZAxis;

    // Dimenciones
    int screenWidth = glutGet(GLUT_SCREEN_WIDTH);
    int screenHeight = glutGet(GLUT_SCREEN_HEIGHT);

    // Coordenadas para posicionar la ventana en el centro de la pantalla
    int x = (screenWidth - WINDOW_WIDTH) / 2;
    int y = (screenHeight - WINDOW_HEIGHT) / 2;

    glutInitDisplayMode(GLUT_DOUBLE | GLUT_RGB | GLUT_DEPTH);
    glutInitWindowSize(WINDOW_WIDTH, WINDOW_HEIGHT);
    glutInitWindowPosition(x, y);
    // Nombre de la ventana
    glutCreateWindow("Humanoide 3D");

    glutDisplayFunc(draw);
    glutSpecialFunc(specialKeys);
    glutKeyboardFunc(keyPressed);
    glutMotionFunc(mousePressed);

    glutReshapeFunc(resizeWindow);

    initializeLighting();

    printInstructions();

    glutMainLoop();

    return EXIT_SUCCESS;
}
