/******* Inicio de las bibliotecas *******/
#include <stdio.h>
#include <stdarg.h>
#include <math.h>
#include <GL/glut.h>
/******* Fin de las bibliotecas *******/

/****** Prototipos de funciones ***/
void display();
void specialKeys(int key, int x, int y);

// Variables globales
double rotate_y = 0;
double rotate_x = 0;

// Función main()
int main(int argc, char* argv[]) {
	// Inicializar los parámetros GLUT y de proceso
	glutInit(&argc, argv);
	
	// Solicitar ventana con color real y doble buffer con Z-buffer
	glutInitDisplayMode(GLUT_DOUBLE | GLUT_RGB | GLUT_DEPTH);
	
	// Crear ventana
	glutCreateWindow("Cubo en 3D"); // Titulo del cuadro de ejecución
	
	// Habilitar la prueba de profundidad de Z-buffer
	glEnable(GL_DEPTH_TEST);
	
	// Llammada a funciones
	glutDisplayFunc(display);
	glutSpecialFunc(specialKeys);
	
	// Pasa el control de eventos a GLUT
	glutMainLoop();

	return 0;	// Regresa al sistema operativo
}

/***** Función “display()” *****/
void display() {
	// Borrar pantalla y Z-buffer
	glClear(GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT);
	// Resetear transformaciones
	glLoadIdentity();

	/*****  Rotar cuando el usuario cambie “rotate_x” y “rotate_y” *****/
	glRotatef(rotate_x, 1.0, 0.0, 0.0);
	glRotatef(rotate_y, 0.0, 1.0, 0.0);

	/* Inicio de la ubicación y pigmentación de las caras del cubo */
	// LADO FRONTAL: lado multicolor

	glBegin(GL_POLYGON);

	glColor3f(1.0, 0.0, 0.0); glVertex3f(0.5, -0.5, -0.5); // P1 es rojo
	glColor3f(0.0, 1.0, 0.0); glVertex3f(0.5, 0.5, -0.5); // P2 es verde
	glColor3f(0.0, 0.0, 1.0); glVertex3f(-0.5, 0.5, -0.5); // P3 es azul
	glColor3f(1.0, 0.0, 1.0); glVertex3f(-0.5, -0.5, -0.5); // P4 es morado

	glEnd();

	/* Las funciones glColor3f() es para asignar el color y en cambio las función glVrtyix3f()
	es para asignar vértices, con las dos combinadas podemos generar un mosaico  de colores */

	// LADO TRASERO: 
	glBegin(GL_POLYGON);
	glColor3f(-1.0, 1.0, -1.6); // Color de la cara
	glVertex3f(0.5, -0.5, 0.5);
	glVertex3f(0.5, 0.5, 0.5);
	glVertex3f(-0.5, 0.5, 0.5);
	glVertex3f(-0.5, -0.5, 0.5);

	glEnd();

	// LADO DERECHO:
	glBegin(GL_POLYGON);
	glColor3f(1.0, 0.5, 0.1); // Color de la cara
	glVertex3f(0.5, -0.5, -0.5);
	glVertex3f(0.5, 0.5, -0.5);
	glVertex3f(0.5, 0.5, 0.5);
	glVertex3f(0.5, -0.5, 0.5);
	glEnd();

	// LADO IZQUIERDO: 
	glBegin(GL_POLYGON);
	glColor3f(1.0, -2.8, 1.0); // Color de la cara
	glVertex3f(-0.5, -0.5, 0.5);
	glVertex3f(-0.5, 0.5, 0.5);
	glVertex3f(-0.5, 0.5, -0.5);
	glVertex3f(-0.5, -0.5, -0.5);
	glEnd();

	// LADO SUPERIOR: 
	glBegin(GL_POLYGON);
	glColor3f(1.0, -4.0, -1.0); // Color de la cara
	glVertex3f(0.5, 0.5, 0.5);
	glVertex3f(0.5, 0.5, -0.5);
	glVertex3f(-0.5, 0.5, -0.5);
	glVertex3f(-0.5, 0.5, 0.5);
	glEnd();

	// LADO INFERIOR: 
	glBegin(GL_POLYGON);
	glColor3f(1.0, -3.8, -1.0); // Color de la cara
	glVertex3f(0.5, -0.5, -0.5);
	glVertex3f(0.5, -0.5, 0.5);
	glVertex3f(-0.5, -0.5, 0.5);
	glVertex3f(-0.5, -0.5, -0.5);
	glEnd();

	glFlush();
	glutSwapBuffers(); //NOTA: dan el efecto de doble-buffer.
}	/* Fin de la ubicación y pigmentación de las caras del cubo */

// Función “specialKeys()”
void specialKeys(int key, int x, int y) {
	if (key == GLUT_KEY_RIGHT)	// La flecha derecha: incrementa su rotación en 5 grados
		rotate_y += 5;
	else if (key == GLUT_KEY_LEFT)	// La flecha izquierda: disminuye su rotación en 5 grados
		rotate_y -= 5;
	else if (key == GLUT_KEY_UP)
		rotate_x += 5;
	else if (key == GLUT_KEY_DOWN)
		rotate_x -= 5;

	// Solicitud para actualizar la pantalla
	glutPostRedisplay();
}
