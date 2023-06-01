/*========================= BASE PARAMETERS FOR SCENE========================= */

// like a PUBLIC STATIC
var CANVAS = document.getElementById("3d_cube");
CANVAS.width = window.innerWidth;
CANVAS.height = window.innerHeight;

var AMORTIZATION = 0.95;
var drag = false;

var old_x;
var old_y;

var dX = 0;
var dY = 0;

var THETA = 0;
var PHI = 0;

/*=========================  ADDITIONAL METHODS FOR SCENE ========================= */
function Scene() { }

Scene.prototype.set_ctx = function (name_ctx) {
	try {
		ctx = CANVAS.getContext(name_ctx, { antialias: true });
	} catch (e) {
		alert("You are not webgl compatible :(");
		return false;
	}
	return ctx;
};

Scene.prototype.get_shader = function (source, type, typeString, GL) {
	var shader = GL.createShader(type);
	GL.shaderSource(shader, source);
	GL.compileShader(shader);
	if (!GL.getShaderParameter(shader, GL.COMPILE_STATUS)) {
		alert("ERROR IN " + typeString + " SHADER : " + GL.getShaderInfoLog(shader));
		return false;
	}
	return shader;
};