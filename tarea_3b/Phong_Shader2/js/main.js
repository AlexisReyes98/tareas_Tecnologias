/*========================= MAIN FILE ========================= */

Scene.prototype.run = function () {
	var e_h = new Events_Handler();
	e_h.init(CANVAS);

	var GL = this.set_ctx('webgl');

	/*========================= SHADERS ========================= */
	var shader_vertex = this.get_shader(
		phong_shader_vertex_src,
		GL.VERTEX_SHADER, 'VERTEX', GL);

	var shader_fragment = this.get_shader(
		phong_shader_fragment_src,
		GL.FRAGMENT_SHADER, 'FRAGMENT', GL);

	var SHADER_PROGRAM = GL.createProgram();
	GL.attachShader(SHADER_PROGRAM, shader_vertex);
	GL.attachShader(SHADER_PROGRAM, shader_fragment);
	GL.linkProgram(SHADER_PROGRAM);

	var _Pmatrix = GL.getUniformLocation(SHADER_PROGRAM, 'Pmatrix');
	var _Vmatrix = GL.getUniformLocation(SHADER_PROGRAM, 'Vmatrix');
	var _Mmatrix = GL.getUniformLocation(SHADER_PROGRAM, 'Mmatrix');

	var _position = GL.getAttribLocation(SHADER_PROGRAM, 'position');
	var _normal = GL.getAttribLocation(SHADER_PROGRAM, 'normal');

	GL.enableVertexAttribArray(_position);
	GL.enableVertexAttribArray(_normal);
	GL.useProgram(SHADER_PROGRAM);

	/*========================= THE CUBE ========================= */
	var cube = new Cube();
	var CUBE_VERTEX = GL.createBuffer();

	GL.bindBuffer(GL.ARRAY_BUFFER, CUBE_VERTEX);
	GL.bufferData(GL.ARRAY_BUFFER,
		new Float32Array(cube.vertexes),
		GL.STATIC_DRAW);

	var CUBE_FACES = GL.createBuffer();
	GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, CUBE_FACES);
	GL.bufferData(GL.ELEMENT_ARRAY_BUFFER,
		new Uint16Array(cube.faces),
		GL.STATIC_DRAW);

	/*========================= MATRIX ========================= */
	var mtx_lib = new Matrix_Lib();

	var PROJMATRIX = mtx_lib.get_projection(40, CANVAS.width / CANVAS.height, 1, 100);
	var MOVEMATRIX = mtx_lib.get_I4();
	var VIEWMATRIX = mtx_lib.get_I4();

	mtx_lib.translateZ(VIEWMATRIX, -6);

	/*========================= DRAWING ========================= */
	GL.enable(GL.DEPTH_TEST);
	GL.depthFunc(GL.LEQUAL);
	GL.clearColor(0.0, 0.0, 0.0, 0.0);
	GL.clearDepth(1.0);

	var animate = function (time) {
		if (!drag) {
			dX *= AMORTIZATION, dY *= AMORTIZATION;
			THETA += dX, PHI += dY;
		}
		mtx_lib.set_I4(MOVEMATRIX);
		mtx_lib.rotateY(MOVEMATRIX, THETA);
		mtx_lib.rotateX(MOVEMATRIX, PHI);
		time_old = time;

		GL.viewport(0.0, 0.0, CANVAS.width, CANVAS.height);
		GL.clear(GL.COLOR_BUFFER_BIT | GL.DEPTH_BUFFER_BIT);

		GL.uniformMatrix4fv(_Pmatrix, false, PROJMATRIX); // 2-d arg transponse or not
		GL.uniformMatrix4fv(_Vmatrix, false, VIEWMATRIX);
		GL.uniformMatrix4fv(_Mmatrix, false, MOVEMATRIX);

		GL.bindBuffer(GL.ARRAY_BUFFER, CUBE_VERTEX);
		GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 4 * (3 + 3), 0);
		GL.vertexAttribPointer(_normal, 3, GL.FLOAT, false, 4 * (3 + 3), 3 * 4);

		GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, CUBE_FACES);
		GL.drawElements(GL.TRIANGLES, 6 * 2 * 3, GL.UNSIGNED_SHORT, 0);

		GL.flush();

		window.requestAnimationFrame(animate);
	};
	animate(0);
};

/*========================= MAIN FUNC ========================= */

function main() {
	var scene = new Scene();
	scene.run();
	return 0;
};