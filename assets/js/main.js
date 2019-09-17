
main();

function main() {
	var canvas = document.querySelector("#glCanvas");
	var gl = canvas.getContext("webgl");
	if(!gl) {
		alert("Unable to initialize WebGL. Your browser or machine may not support it.");
		return false;
	}
	var vertexShaderSource = document.getElementById("vertex-shader").text;
	var fragmentShaderSource = document.getElementById("fragment-shader").text;
	var vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
	var fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
	var program = createProgram(gl, vertexShader, fragmentShader);

    var positionAttributeLocation = gl.getAttribLocation(program, "a_position");
	var resolutionUniformLocation = gl.getUniformLocation(program, "u_resolution");
	var colorUniformLocation = gl.getUniformLocation(program, "u_color");

	var positionBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
	var positions = [
		0 , 0 ,
		100, 100,
		50, 500,
	]
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

	gl.canvas.width = canvas.clientWidth;
	gl.canvas.height= canvas.clientHeight;
	gl.clearColor(0.0, 0.0, 0.0, 0.0);
	gl.clear(gl.COLOR_BUFFER_BIT);
	gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
	gl.useProgram(program);
	gl.enableVertexAttribArray(positionAttributeLocation);
	gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
	var size = 2;
	var type = gl.FLOAT;
	var normalize = false;
	var stride = 0;
	var offset = 0;
	gl.vertexAttribPointer(
	    positionAttributeLocation, size, type, normalize, stride, offset);
	gl.uniform2f(resolutionUniformLocation, gl.canvas.width, gl.canvas.height);
	gl.uniform4f(colorUniformLocation, 0, 0, 0, 1);
	var r = new Rectangle(new Vec2(gl.canvas.width/2, gl.canvas.height/2), 100, 100);
	// draw
	setRectangle(gl,r);
}

