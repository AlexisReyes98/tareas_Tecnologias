async function webGLStart() {

    const canvas = document.getElementById("canvasGL");
    if (!canvas) {
        console.log('failed');
        return;
    }
    canvas.width = 800;//screen.width;
    canvas.height = 600;//screen.height;

    let gl;
    try {

        gl = canvas.getContext("webgl", { antialias: true });
        gl.canvas = canvas;

    } catch (e) {
        alert("You are not webgl compatible :(");
        return false;
    }


    let gui = myGUI();
    console.log(gui.source_directionX);

    let MouseContr = new MouseController(gl);

    // ------------------------------------------------------------------------------//
    let shaderProgram = await createPromiseShaderProgram(gl, 'resource/vertex_shader_toon.glsl', 'resource/fragment_shader_toon.glsl');

    let u_Pmatrix = gl.getUniformLocation(shaderProgram, 'u_Pmatrix');
    let u_Mmatrix = gl.getUniformLocation(shaderProgram, 'u_Mmatrix');
    let u_Vmatrix = gl.getUniformLocation(shaderProgram, 'u_Vmatrix');
    let u_Nmatrix = gl.getUniformLocation(shaderProgram, 'u_Nmatrix');
    let u_source_direction = gl.getUniformLocation(shaderProgram, 'u_source_direction');
    let u_outline = gl.getUniformLocation(shaderProgram, 'u_outline');

    let a_Position = gl.getAttribLocation(shaderProgram, 'a_Position');
    let a_normal = gl.getAttribLocation(shaderProgram, 'a_normal');

    gl.useProgram(shaderProgram);

    //--------------------------- create MODEL ------------------------------------//
    loadJSON(gl, 'resource/model.json');
    // ------------------------ LOAD BUFFER MODEL -----------------------------------//
    let ModelMain = loadBuffer(gl, gl.model.meshes[0]);

    // -------------------------- create MATRIX -------------------------------------//
    let PROJMATRIX = glMatrix.mat4.create();
    glMatrix.mat4.identity(PROJMATRIX);
    let fovy = 40 * Math.PI / 180;
    glMatrix.mat4.perspective(PROJMATRIX, fovy, canvas.width / canvas.height, 1, 50);

    //-----------------------------//
    let MODELMATRIX = glMatrix.mat4.create();
    let VIEWMATRIX = glMatrix.mat4.create();
    let NORMALMATRIX = glMatrix.mat4.create();
    let NORMALMATRIX_HELPER = glMatrix.mat4.create();
    let MODELMATRIX_OUTLINE = glMatrix.mat4.create();
    //---- NORMAL -----//
    let shaderProgram_Normal = loadNormalShaders(gl);
    //---- AXIS -------//
    let shaderProgram_axis = loadAxisShaders(gl);

    //-- RENDER ------------------------------------------------------------------------------//
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);
    gl.clearDepth(1.0);

    let AMORTIZATION = 0.9;
    let Render;
    ModelMain.this_objPick = false;
    let y = 0.0;
    Render = function (time) {

        //-- VIEWMATRIX ------------------------------------------------------------------------//
        glMatrix.mat4.identity(VIEWMATRIX);
        glMatrix.mat4.lookAt(VIEWMATRIX, [-7.0, 5.0, 10.0], [0.0, 0.0, 0.0], [0.0, 1.0, 0.0]);
        //-- MODELMATRIX  ----------------------------------------------------------------------//
        glMatrix.mat4.identity(MODELMATRIX);
        glMatrix.mat4.identity(MODELMATRIX_OUTLINE);
        //-- translate MODELMATRIX--------------------------------------------------------------//
        y += 0.02;
        glMatrix.mat4.rotateY(MODELMATRIX, MODELMATRIX, y);
        // glMatrix.mat4.rotateX(MODELMATRIX, MODELMATRIX, y*0.5);
        //-- NORMALMATRIX_REAL ------------------------------------------------------------------//
        glMatrix.mat4.invert(NORMALMATRIX, MODELMATRIX);
        glMatrix.mat4.transpose(NORMALMATRIX, NORMALMATRIX);

        //-- MAIN RENDER ------------------------------------------------------------------------//
        gl.viewport(0.0, 0.0, canvas.width, canvas.height);
        gl.clearColor(0.5, 0.5, 0.5, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        //---------------------------------------------------------------------------------------//
        gl.useProgram(shaderProgram);
        gl.enableVertexAttribArray(a_Position);
        gl.enableVertexAttribArray(a_normal);

        gl.uniformMatrix4fv(u_Pmatrix, false, PROJMATRIX);
        // gl.uniformMatrix4fv(u_Mmatrix, false, MODELMATRIX);
        gl.uniformMatrix4fv(u_Vmatrix, false, VIEWMATRIX);
        gl.uniformMatrix4fv(u_Nmatrix, false, NORMALMATRIX);

        let source_direction = glMatrix.vec3.create();
        glMatrix.vec3.set(source_direction, gui.source_directionX, gui.source_directionY, gui.source_directionZ);

        gl.uniform3fv(u_source_direction, source_direction);

        gl.bindBuffer(gl.ARRAY_BUFFER, ModelMain.TRIANGLE_VERTEX);
        gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 4 * (3), 0);

        gl.bindBuffer(gl.ARRAY_BUFFER, ModelMain.TRIANGLE_NORMAL);
        gl.vertexAttribPointer(a_normal, 3, gl.FLOAT, false, 4 * (3), 0);

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ModelMain.TRIANGLE_FACES);

        // draw outline
        gl.enable(gl.CULL_FACE);
        gl.cullFace(gl.FRONT);
        glMatrix.mat4.scale(MODELMATRIX_OUTLINE, MODELMATRIX, [1.025, 1.025, 1.025]);
        gl.uniformMatrix4fv(u_Mmatrix, false, MODELMATRIX_OUTLINE);
        gl.uniform1f(u_outline, 0.0);
        gl.drawElements(gl.TRIANGLES, ModelMain.ModelIndiceslength, gl.UNSIGNED_SHORT, 0);
        gl.flush();

        // draw FRONT_Face
        gl.enable(gl.CULL_FACE);
        gl.cullFace(gl.BACK);
        gl.uniformMatrix4fv(u_Mmatrix, false, MODELMATRIX);
        gl.uniform1f(u_outline, 1.0);
        gl.drawElements(gl.TRIANGLES, ModelMain.ModelIndiceslength, gl.UNSIGNED_SHORT, 0);

        gl.flush();

        gl.disableVertexAttribArray(a_Position);
        gl.disableVertexAttribArray(a_normal);

        //-- NORMAL HELPER -----------------------------------------------------------------------//
        if (gui.normal) {
            VertexNormalHelper(gl, shaderProgram_Normal, PROJMATRIX, VIEWMATRIX, MODELMATRIX, NORMALMATRIX_HELPER);
        };
        //-- AXIS --------------------------------------------------------------------------------//
        if (gui.axis) {
            loadAxisHelper(gl, shaderProgram_axis, PROJMATRIX, VIEWMATRIX, MODELMATRIX);
        };

        window.requestAnimationFrame(Render);
    };
    Render(0);
}